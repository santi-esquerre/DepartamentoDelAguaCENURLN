function loadLatestNews() {
  fetch("/ultimasnovedades?limit=3")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateBlogHTML(data);
    });
}

function generateBlogHTML(posts) {
  const imgRegex = /<img\s+[^>]*src="([^"]*)"/i;
  const container = document.createElement("div");
  container.className = "container";

  for (let i = 0; i < posts.length; i += 3) {
    const row = document.createElement("div");
    row.className = "row";

    for (let j = i; j < i + 3 && j < posts.length; j++) {
      const post = posts[j];

      const col = document.createElement("div");
      col.className = "col-md-4";

      const article = document.createElement("article");
      article.className = "article-card";
      article.style.cursor = "pointer";

      const img = document.createElement("img");
      img.src = post.contenido.match(imgRegex)
        ? post.contenido.match(imgRegex)[1]
        : "img/logo_LRHyR.png";
      img.alt = post.titulo;
      img.className = "article-image";

      const articleContent = document.createElement("div");
      articleContent.className = "article-content";

      const h3 = document.createElement("h3");
      h3.textContent = post.titulo;

      const a = document.createElement("a");
      a.href = "/noticia.html";
      a.className = "read-more";
      a.textContent = "Leer más...";
      a.addEventListener("click", () => {
        localStorage.setItem("postID", post.id);
      });

      // Añadir elementos al DOM
      articleContent.appendChild(h3);
      articleContent.appendChild(a);
      article.appendChild(img);
      article.appendChild(articleContent);
      col.appendChild(article);
      row.appendChild(col);
    }

    container.appendChild(row);
  }

  document.querySelector("#article-container").appendChild(container);
}

document.getElementById("newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get("email");
  fetch("/suscribirse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.sqlMessage || "¡Gracias por suscribirte!");
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", loadLatestNews);

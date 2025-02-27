let postID = getQueryParam("id");
if (postID) {
  localStorage.setItem("postID", postID);
} else {
  postID = localStorage.getItem("postID");
}

function loadPost() {
  fetch(`/novedades/${postID}`)
    .then((res) => res.json())
    .then((data) => {
      const post = data[0];
      const article_container = document.getElementById("article-container");

      article_container.innerHTML = post.contenido;

      fetch(`/persona/${post.persona_id}`)
        .then((res) => res.json())
        .then((data) => {
          const autor = data;
          article_container.innerHTML += `<p><b>Escrito por:</b> <a id="author_name" href="#">${
            autor.Nombre
          }</a> el día ${formatDateToSpanish(post.fecha_creacion)}</p>`;
          const author_name = document.getElementById("author_name");
          author_name.addEventListener("click", () => {
            localStorage.setItem("idPersona", autor.ID);
            window.location.href = "persona.html";
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", loadPost);

function formatDateToSpanish(dateString) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${dayName} ${day} de ${monthName} de ${year} a las ${hours}:${minutes}`;
}

// Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const authToken = localStorage.getItem("token");
let editorInstance;

// Inicializar CKEditor con el nuevo adaptador de carga
ClassicEditor.create(document.querySelector("#postContent"), {
  extraPlugins: [MyCustomUploadAdapterPlugin]
})
  .then((editor) => {
    editorInstance = editor;
  })
  .catch((error) => {
    console.error(error);
  });

// Plugin de CKEditor para la carga de archivos con la API actualizada
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

// Clase para gestionar la carga de archivos
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);

          fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: authToken
            },
            body: formData
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.error) {
                return reject(result.error);
              }
              resolve({
                default: result.url // La API debe devolver la URL del archivo
              });
            })
            .catch((error) => {
              reject("Error al subir el archivo");
              console.error("Error al subir el archivo:", error);
            });
        })
    );
  }

  abort() {
    // Lógica para cancelar la carga (opcional)
  }
}

// Función para abrir el modal en modo de creación
function openCreateModal() {
  document.getElementById("postModalLabel").innerText = "Nuevo Post";
  document.getElementById("postForm").reset();
  editorInstance.setData("");
  document.getElementById("postId").value = "";
  loadAuthors();
}

// Cargar lista de autores
async function loadAuthors() {
  const response = await fetch("/api/persona", {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    }
  });
  const authors = await response.json();

  const authorSelect = document.getElementById("postAuthor");
  authorSelect.innerHTML = "";
  authors.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.ID;
    option.textContent = author.Nombre;
    authorSelect.appendChild(option);
  });
}

// Guardar el post (creación o edición)
async function savePost() {
  const title = document.getElementById("postTitle").value;
  let content = editorInstance.getData();
  const personaId = document.getElementById("postAuthor").value;
  const id = document.getElementById("postId").value;

  content = await replaceOembedWithIframe(content);

  const url = id ? `/api/novedades/${id}` : "/api/novedades";
  const method = id ? "PUT" : "POST";
  const body = { title, content, persona_id: personaId };

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    loadPosts();
    document.querySelector("#postModal .btn-close").click();
  }
}

// Cargar posts en la tabla
async function loadPosts() {
  const response = await fetch("/api/novedades", {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    }
  });
  const posts = await response.json();

  const postTable = document.getElementById("postTable");
  postTable.innerHTML = "";
  posts.forEach((post) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${post.id}</td>
          <td>${post.titulo}</td>
          <td>${new Date(post.fecha_creacion).toLocaleDateString()}</td>
          <td>${post.autor_nombre || "Desconocido"}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editPost('${
              post.id
            }')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletePost('${
              post.id
            }')">Eliminar</button>
          </td>
        `;
    postTable.appendChild(row);
  });
}

// Editar un post existente
async function editPost(id) {
  const response = await fetch(`/api/novedades/${id}`, {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    }
  });
  const post = await response.json();

  document.getElementById("postTitle").value = post.titulo;
  editorInstance.setData(post.contenido || "");
  document.getElementById("postId").value = post.id;
  await loadAuthors();
  document.getElementById("postAuthor").value = post.persona_id;

  new bootstrap.Modal(document.getElementById("postModal")).show();
}

// Eliminar un post
async function deletePost(id) {
  if (confirm("¿Seguro que deseas eliminar este post?")) {
    await fetch(`/api/novedades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json"
      }
    });
    loadPosts();
  }
}

async function replaceOembedWithIframe(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const oembedElements = doc.querySelectorAll("oembed");

  for (let oembed of oembedElements) {
    const url = oembed.getAttribute("url");

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      try {
        // 🛠️ 2️⃣ Llamar a la API de YouTube oEmbed para obtener el <iframe>
        const response = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            url
          )}&format=json`
        );

        if (response.ok) {
          const data = await response.json();
          const iframe = document.createElement("div");
          iframe.innerHTML = data.html;
          oembed.replaceWith(iframe.firstChild); // Reemplazar el <oembed> con el <iframe>
        }
      } catch (error) {
        console.error("Error obteniendo oEmbed:", error);
      }
    }
  }

  return doc.body.innerHTML; // Retornar el contenido modificado
}

// Cargar los posts al iniciar
loadPosts();

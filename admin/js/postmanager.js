const authToken = localStorage.getItem("token");
let editorInstance;

// Inicializar CKEditor con el adaptador de carga
ClassicEditor.create(document.querySelector("#postContent"), {
  extraPlugins: [MyCustomUploadAdapterPlugin], // Agrega el plugin de carga personalizado
})
  .then((editor) => {
    editorInstance = editor;
  })
  .catch((error) => {
    console.error(error);
  });

// Plugin para el adaptador de carga
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

// Función para abrir el modal en modo de creación de post
function openCreateModal() {
  document.getElementById("postModalLabel").innerText = "Nuevo Post";
  document.getElementById("postForm").reset();
  editorInstance.setData("");
  document.getElementById("postId").value = "";
  loadAuthors(); // Cargar autores al abrir el modal
}

// Función para cargar autores en el select
async function loadAuthors() {
  const response = await fetch("/api/persona", {
    method: "GET", // o el método adecuado para tu solicitud (POST, PUT, etc.)
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  });
  const authors = await response.json();

  const authorSelect = document.getElementById("postAuthor");
  authorSelect.innerHTML = "";
  authors.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.ID;
    option.textContent = author.Nombre; // Asume que los autores tienen un campo `name`
    authorSelect.appendChild(option);
  });
}

// Función para guardar el post (creación o edición)
async function savePost() {
  const title = document.getElementById("postTitle").value;
  const content = editorInstance.getData();
  const personaId = document.getElementById("postAuthor").value;
  const id = document.getElementById("postId").value;

  const url = id ? `/api/novedades/${id}` : "/api/novedades";
  const method = id ? "PUT" : "POST";
  const body = {
    title: title,
    content: content,
    persona_id: personaId,
  };
  console.log(body);

  const response = await fetch(url, {
    method: method,
    headers: { Authorization: authToken, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    console.log(response);
    loadPosts();
    document.querySelector("#postModal .btn-close").click();
  }
}

// Cargar posts en la tabla
async function loadPosts() {
  const response = await fetch("/api/novedades", {
    method: "GET", // o el método adecuado para tu solicitud (POST, PUT, etc.)
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  });
  const posts = await response.json();

  const postTable = document.getElementById("postTable");
  postTable.innerHTML = "";
  console.log(posts);
  posts.forEach((post) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${post.id}</td>
          <td>${post.titulo}</td>
          <td>${new Date(post.fecha_creacion).toLocaleDateString()}</td>
          <td>${
            post.autor_nombre || "Desconocido"
          }</td> <!-- Mostrar el nombre del autor -->
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

// Editar post
async function editPost(id) {
  const response = await fetch(`/api/novedades/${id}`, {
    method: "GET", // o el método adecuado para tu solicitud (POST, PUT, etc.)
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  });
  const post = await response.json();

  document.getElementById("postTitle").value = post.titulo;
  editorInstance.setData(post.contenido || "");
  document.getElementById("postId").value = post.id;
  await loadAuthors(); // Cargar autores y seleccionar el autor actual

  // Seleccionar el autor del post
  document.getElementById("postAuthor").value = post.persona_id;

  new bootstrap.Modal(document.getElementById("postModal")).show();
}

// Eliminar post
async function deletePost(id) {
  if (confirm("¿Seguro que deseas eliminar este post?")) {
    await fetch(`/api/novedades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authToken, // Incluye el token en el encabezado
        "Content-Type": "application/json",
      },
    });
    loadPosts();
  }
}

// Cargar los posts al cargar la página
loadPosts();

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("upload", file);

          fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: authToken, // Incluye el token en el encabezado
            },
            body: data,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.error) {
                return reject(result.error.message);
              }
              resolve({
                default: result.url, // Asegúrate de que el backend devuelva la URL del archivo subido
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

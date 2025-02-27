const token = localStorage.getItem("token");
const editor = new JSONEditor(document.getElementById("jsoneditor"), {
  mode: "tree",
  modes: ["code", "tree"]
});
const jsonSelector = document.getElementById("jsonSelector");

// Cargar lista de archivos JSON
fetch("/api/list-json", { headers: { Authorization: token } })
  .then((res) => res.json())
  .then((files) => {
    files.forEach((file) => {
      const option = document.createElement("option");
      option.value = file;
      option.textContent = file;
      jsonSelector.appendChild(option);
    });
    loadJsonFile(files[0]);
  });

jsonSelector.addEventListener("change", () => loadJsonFile(jsonSelector.value));

function loadJsonFile(filename) {
  fetch(`/api/get-json/${filename}`, {
    headers: { Authorization: token }
  })
    .then((res) => res.json())
    .then((data) => editor.set(data))
    .catch((err) => alert("Error al cargar el JSON: " + err));
}

document.getElementById("save-json").addEventListener("click", () => {
  fetch(`/api/save-json/${jsonSelector.value}`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(editor.get())
  })
    .then((res) => res.json())
    .then((data) => alert(data.message));
});

// Gestión de Archivos
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) return alert("Selecciona un archivo");
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: token },
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadFiles();
    });
}

let currentPage = 1;
const filesPerPage = 10;

function loadFiles(page = 1) {
  fetch(`/api/list-uploads?page=${page}&limit=${filesPerPage}`, {
    headers: { Authorization: token }
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Archivos recibidos:", data);

      if (!Array.isArray(data.files)) {
        console.error("El servidor no devolvió un array válido");
        return;
      }

      currentPage = data.currentPage;

      const fileList = document.getElementById("fileList");
      fileList.innerHTML = "";

      data.files.forEach((fileObj) => {
        if (!fileObj.filename || !fileObj.url) {
          console.error("Archivo inválido:", fileObj);
          return;
        }

        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        const isImage = fileObj.filename.match(/\.(jpg|jpeg|png|gif)$/i);
        const preview = isImage
          ? `<img src="${fileObj.url}" class="img-thumbnail me-2" style="width: 50px; height: 50px;">`
          : "";

        li.innerHTML = `
          <div class="d-flex align-items-center justify-content-between w-100">
            <div class="d-flex align-items-center">
              ${preview}
              <a href="${fileObj.url}" target="_blank">${fileObj.filename}</a>
            </div>
            <div>
              <button class="btn btn-secondary btn-sm me-2" onclick="copyFilePath('/uploads/${fileObj.filename}')">
          📋 Copiar Ruta
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteFile('${fileObj.filename}')">Eliminar</button>
            </div>
          </div>
        `;

        fileList.appendChild(li);
      });

      updatePagination(data.totalPages);
    })
    .catch((err) => console.error("Error cargando archivos:", err));
}

function updatePagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm ${
      i === currentPage ? "btn-primary" : "btn-outline-primary"
    }`;
    btn.textContent = i;
    btn.onclick = () => loadFiles(i);
    pagination.appendChild(btn);
  }
}

document.addEventListener("DOMContentLoaded", () => loadFiles());

function deleteFile(filename) {
  if (!confirm("¿Eliminar este archivo?")) return;
  fetch(`/api/delete-upload/${filename}`, {
    method: "DELETE",
    headers: { Authorization: token }
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadFiles();
    });
}

function copyFilePath(filePath) {
  navigator.clipboard
    .writeText(filePath)
    .then(() => {
      alert("Ruta copiada: " + filePath);
    })
    .catch((err) => {
      console.error("Error al copiar la ruta: ", err);
    });
}

loadFiles();

const token = localStorage.getItem("token");
let editor;

fetch("/api/list-json", { headers: { Authorization: token } })
  .then((res) => res.json())
  .then((files) => {
    files.forEach((file) => {
      if (file.endsWith(".json") && !file.includes("schema")) {
        const option = document.createElement("option");
        option.value = file;
        option.textContent = file;
        jsonSelector.appendChild(option);
      }
    });
    loadJsonAndSchema(files[0]);
  });

jsonSelector.addEventListener("change", () => {
  loadJsonAndSchema(jsonSelector.value);
});

function loadJsonAndSchema(filename) {
  const schemaFile = filename.replace(".json", ".schema.json");

  Promise.all([
    fetch(`/api/get-json/${schemaFile}`, {
      headers: { Authorization: token }
    }).then((res) => res.json()),
    fetch(`/api/get-json/${filename}`, {
      headers: { Authorization: token }
    }).then((res) => res.json())
  ]).then(([schema, jsonData]) => {
    if (editor) editor.destroy();

    editor = new JSONEditor(document.getElementById("editor_holder"), {
      schema: schema,
      startval: jsonData,
      theme: "bootstrap5",
      iconlib: "fontawesome4",
      show_errors: "interaction",
      disable_edit_json: true,
      disable_properties: true,
      // compact: true,
      object_layout: "normal", // estilo árbol
      array_controls_top: true, // botones de agregar arriba de los arrays
      no_additional_properties: false // permitir agregar propiedades adicionales
    });
  });
}

document.getElementById("save-json").addEventListener("click", () => {
  const json = editor.getValue();
  fetch(`/api/save-json/${jsonSelector.value}`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(json)
  })
    .then((res) => res.json())
    .then((data) => alert(data.message));
});

// Configuración global para markdown
JSONEditor.defaults.editors.string.options = {
  ...JSONEditor.defaults.editors.string.options,
  wysiwyg: true,
  format: "markdown",
  simplemde: {
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "link",
      "quote",
      "|",
      "preview",
      "guide"
    ],
    spellChecker: false
  }
};

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

// Cargar backups disponibles
async function loadBackups() {
  const response = await fetch("/api/list-backups", {
    headers: { Authorization: token }
  });
  const backups = await response.json();
  const backupList = document.getElementById("backupList");
  backupList.innerHTML = "";

  backups.forEach((backup) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${backup}</span>
      <button class="btn btn-danger btn-sm" onclick="restoreBackup('${backup}')">Restaurar</button>
    `;
    backupList.appendChild(li);
  });
}

// Restaurar un backup seleccionado
async function restoreBackup(backupFilename) {
  if (!confirm(`¿Seguro que deseas restaurar el backup ${backupFilename}?`))
    return;

  const response = await fetch(`/api/restore-backup/${backupFilename}`, {
    method: "POST",
    headers: { Authorization: token }
  });

  const result = await response.json();
  alert(result.message);
  if (response.ok) {
    location.reload(); // Recargar para reflejar los cambios
  }
}

// Cargar backups cuando se abre el modal
document
  .getElementById("backupModal")
  .addEventListener("show.bs.modal", loadBackups);

loadFiles();

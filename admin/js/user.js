const userID = localStorage.getItem("userID");
let user = {};
const authToken = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  if (!userID) window.location.href = "/";

  //#region Fetch user data

  fetch(`/api/persona/${userID}`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      user = data;
      loadUserInfo(user);
    });

  //#endregion

  //#region Fetch user diffusion
  fetch("/api/describe/difusióncientífica", {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#inv-table #table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });
  fetch(`/api/persona/${userID}/difusioncientifica`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tablebody = document.querySelector("#inv-table #table-body");
      data.forEach((diffusion) => {
        const row = document.createElement("tr");
        let i = 1;
        row.innerHTML = `<td>
                  <span class="custom-checkbox">
                    <input
                      type="checkbox"
                      id="checkbox${i}"
                      name="options[]"
                      value="${diffusion.ID}"
                    />
                    <label for="checkbox${i}"></label>
                  </span>
                </td>
                <td>${diffusion.Título}</td>
                <td>${formatDate(diffusion.FechaPublicación)}</td>
                <td>${diffusion.Descripción}</td>
                <td>${diffusion.Tipo}</td>
                <td>
                  <a
                    href="${diffusion.Link}"
                    >Link</a
                  >
                </td>
                <td>${diffusion.ID}</td>
                <td>
                  <a href="#editModal" class="edit" data-toggle="modal" onclick='loadDiffusionToEdit(${JSON.stringify(
                    diffusion
                  )});'
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Edit"
                      >&#xE254;</i
                    ></a
                  >
                  <a
                    href="#deleteModal"
                    class="delete"
                    data-toggle="modal"
                    onclick="setRecordToDelete('difusióncientífica', '${
                      diffusion.ID
                    }');"
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Delete"
                      >&#xE872;</i
                    ></a
                  >
                </td>`;
        i++;
        tablebody.appendChild(row);
      });

      tablebody
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
              AddRecordToDeleteList("difusióncientífica", e.target.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
        });

      const diffTable = document.getElementById("inv-table");
      diffTable.querySelector("#selectAll").addEventListener("change", (e) => {
        tablebody
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.checked = e.target.checked;
            if (e.target.checked) {
              AddRecordToDeleteList("difusióncientífica", checkbox.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
      });
    });
  //#endregion

  //#region Fetch user projects
  fetch("/api/describe/proyecto", {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#project-table #table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });

  fetch(`/api/persona/${userID}/proyecto`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tablebody = document.querySelector("#project-table #table-body");
      data.forEach((project) => {
        const row = document.createElement("tr");
        let i = 1;
        row.innerHTML = `<td>
                  <span class="custom-checkbox">
                    <input
                      type="checkbox"
                      id="checkbox${i}"
                      name="options[]"
                      value="${project.ID}"
                    />
                    <label for="checkbox${i}"></label>
                  </span>
                </td>
                <td>${project.Título}</td>
                <td>${formatDate(project.FechaInicio)}</td>
                <td>${formatDate(project.FechaFin)}</td>
                <td>${project.Resumen}</td>
                <td>${project.Recursos}</td>
                <td>${project.ID}</td>
                 <td>
                  <a href="#editModal" class="edit" data-toggle="modal" onclick='loadProjectToEdit(${JSON.stringify(
                    project
                  )});'
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Edit"
                      >&#xE254;</i
                    ></a
                  >
                  <a
                    href="#deleteModal"
                    class="delete"
                    data-toggle="modal"
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Delete"
                      onclick="setRecordToDelete('proyecto', '${project.ID}');"
                      >&#xE872;</i
                    ></a
                  >
                </td>`;
        i++;
        tablebody.appendChild(row);
      });

      tablebody
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
              AddRecordToDeleteList("proyecto", e.target.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
        });

      const projTable = document.getElementById("project-table");
      projTable.querySelector("#selectAll").addEventListener("change", (e) => {
        tablebody
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.checked = e.target.checked;
            if (e.target.checked) {
              AddRecordToDeleteList("proyecto", checkbox.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
      });
    });
  //#endregion

  //#region Fetch actividades de extensión
  fetch("/api/describe/extensión", {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#ext-table #table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });

  fetch(`/api/persona/${userID}/extension`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tablebody = document.querySelector("#ext-table #table-body");
      data.forEach((extension) => {
        const row = document.createElement("tr");
        let i = 1;
        row.innerHTML = `<td>
                  <span class="custom-checkbox">
                    <input
                      type="checkbox"
                      id="checkbox${i}"
                      name="options[]"
                      value="${extension.ID}"
                    />
                    <label for="checkbox${i}"></label>
                  </span>
                </td>
                <td>${extension.Nombre}</td>
                <td>${extension.Descripción}</td>

                <td>${extension.ID}</td>
                <td>
                  <a href="#editModal" class="edit" data-toggle="modal" onclick='loadExtensionToEdit(${JSON.stringify(
                    extension
                  )});'
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Edit"
                      >&#xE254;</i
                    ></a
                  >
                  <a
                    href="#deleteModal"
                    class="delete"
                    data-toggle="modal"
                    onclick="setRecordToDelete('extensión', '${extension.ID}');"
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Delete"
                      >&#xE872;</i
                    ></a
                  >
                </td>`;
        i++;
        tablebody.appendChild(row);
      });

      tablebody
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
              AddRecordToDeleteList("extensión", e.target.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
        });

      const extTable = document.getElementById("ext-table");
      extTable.querySelector("#selectAll").addEventListener("change", (e) => {
        tablebody
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.checked = e.target.checked;
            if (e.target.checked) {
              AddRecordToDeleteList("extensión", checkbox.value);
            } else {
              RemoveRecordFromDeleteList(e.target.value);
            }
          });
      });
    });

  //#endregion

  //#region Fetch servicios prestados
  fetch("/api/describe/servicio", {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#service-table #table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });
  //#endregion

  //#region Fetch Unidades curriculares dictadas
  fetch("/api/describe/unidadcurricular", {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#unit-table #table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });
  //#endregion
});

//FORM SUBMIT EVENTS:

document.getElementById("addForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  let table, body;
  table = eliminarTildes(data.TableFlag);


  if (data.recordType === "new") {
    data.ID = window.generateUUID();
    fetch(`/api/${table}`, {
      method: "POST",
      headers: {
        Authorization: authToken, // Incluye el token en el encabezado
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    data.existingRecordID = data.ID;
  }

  switch (table) {
    case "difusioncientifica":
      body = {
        difusión_id: data.existingRecordID,
        persona_id: userID,
      };
      break;
    case "proyecto":
      body = {
        proyecto_id: data.existingRecordID,
        persona_id: userID,
      };
      break;
    case "extension":
      body = {
        extensión_id: data.existingRecordID,
        persona_id: userID,
      };
      break;
    case "servicio":
      body = {
        servicio_id: data.existingRecordID,
        persona_id: userID,
      };
      break;
    case "unidadcurricular":
      body = {
        unidadcurricular_id: data.existingRecordID,
        persona_id: userID,
      };
      break;
    default:
      alert("Table not found");
  }

  body = JSON.stringify(body);

  fetch(`/api/persona/${userID}/${table}`, {
    method: "POST",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  
    window.location.reload();

});

document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const IDs = data.IDsToDelete.split(",").filter(Boolean);

  if (IDs.length === 0) {
    alert("No se ha seleccionado ningún registro para eliminar");
    return;
  }

  IDs.forEach((ID) => {
    fetch(`/api/delete/${data.SelectedTable}/${ID}`, {
      method: "DELETE",
      headers: {
        Authorization: authToken, // Incluye el token en el encabezado
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  });

  window.location.reload();
});

document.getElementById("editForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  let table = eliminarTildes(data.TableFlag);

  fetch(`/api/${table}/${data.RegID}`, {
    method: "PUT",
    headers: {
      Authorization: authToken, // Incluye el token en el encabez
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  window.location.reload();
});

//LOAD PAGE CONTENT FUNCTIONS:

function loadUserInfo(persona) {
  const imgFoto = document.getElementById("profile-photo");
  const h1nombre = document.getElementById("nombre");
  const h3titulo = document.getElementById("titulo");
  const pedad = document.getElementById("edad");
  const pdescripcion = document.getElementById("descripcion");

  imgFoto.src = `data:image/png;base64,${persona.Foto}`;
  h1nombre.textContent = persona.Nombre;
  h3titulo.textContent = persona.Título;
  pedad.textContent = persona.FechaNacimiento
    ? `Edad: ${calcularEdad(persona.FechaNacimiento)} años`
    : "";
  pdescripcion.textContent = persona.Descripción;
}

function loadDiffusionToAdd() {
  const formbody = document.querySelector("#addForm .modal-body");

  formbody.innerHTML = `
                <div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="difusióncientífica"
                  />
                  <label>Título</label>
                  <input
                    id="AddTitleInput"
                    type="text"
                    name="Título"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Publicación</label>
                  <input
                    id="AddPublishDateInput"
                    type="date"
                    name="FechaPublicación"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>Tipo</label>
                  <input
                    id="AddTypeInput"
                    type="text"
                    name="Tipo"
                    class="form-control"
                  />
                </div>

                <div class="form-group">
                  <label>Link</label>
                  <input 
                    id="AddLinkInput" 
                    type="url" 
                    name="Link"
                    class="form-control" 
                  />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    id="AddDescriptionInput"
                    class="form-control"
                    name="Descripción"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Tipo de Registro</label>
                  <div>
                    <label class="radio-inline">
                      <input
                        type="radio"
                        name="recordType"
                        value="new"
                        checked
                      />
                      Nuevo
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="recordType" value="existing" />
                      Existente
                    </label>
                  </div>
                </div>
                <div
                  class="form-group"
                  id="existingRecordSelect"
                  style="display: none"
                >
                  <label>Seleccionar Registro</label>
                  <select id="existingRecordDropdown" name="existingRecordID" class="form-control" placeholder>
                    <option value="-1">Seleccione un registro</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
              `;

  const recordTypeRadios = formbody.querySelectorAll(
    'input[name="recordType"]'
  );

  const existingRecordSelect = formbody.querySelector("#existingRecordSelect");
  const inputsAndTextareas = formbody.querySelectorAll(
    "input:not([type='radio']):not([type='hidden']), textarea"
  );

  recordTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "existing") {
        inputsAndTextareas.forEach((input) => (input.disabled = true));
        existingRecordSelect.style.display = "block";
      } else {
        inputsAndTextareas.forEach((input) => (input.disabled = false));
        existingRecordSelect.style.display = "none";
      }
    });
  });

  fetch(`/api/difusióncientífica`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const select = formbody.querySelector("#existingRecordDropdown");
      data.forEach((diffusion) => {
        const option = document.createElement("option");
        option.value = diffusion.ID;
        option.textContent = diffusion.Título;
        select.appendChild(option);
      });
    });
}

function loadDiffusionToEdit(diffusion) {
  const formbody = document.querySelector("#editForm .modal-body");
  // const diffusion = JSON.parse(diffusionJSON);
  console.log(diffusion);

  formbody.innerHTML = `
                <div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="difusióncientífica"
                  />
                  <input
                    id="RegID"
                    type="hidden"
                    name="RegID"
                    value="${diffusion.ID}"
                  />
                  <label>Título</label>
                  <input
                    id="AddTitleInput"
                    type="text"
                    name="Título"
                    class="form-control"
                    value="${diffusion.Título}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Publicación</label>
                  <input
                    id="AddPublishDateInput"
                    type="date"
                    name="FechaPublicación"
                    class="form-control"
                    value="${
                      new Date(diffusion.FechaPublicación)
                        .toISOString()
                        .split("T")[0]
                    }"
                  />
                </div>
                <div class="form-group">
                  <label>Tipo</label>
                  <input
                    id="AddTypeInput"
                    type="text"
                    name="Tipo"
                    class="form-control"
                    value="${diffusion.Tipo}"
                  />
                </div>

                <div class="form-group">
                  <label>Link</label>
                  <input 
                    id="AddLinkInput" 
                    type="url" 
                    name="Link"
                    class="form-control" 
                    value="${diffusion.Link}"
                  />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    id="AddDescriptionInput"
                    class="form-control"
                    name="Descripción"
                  >${diffusion.Descripción}</textarea>
                </div>
              `;
}

function loadProjectToAdd() {
  const formbody = document.querySelector("#addForm .modal-body");

  formbody.innerHTML = `
                <div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="proyecto"
                  />
                  <label>Título</label>
                  <input
                    id="AddTitleInput"
                    type="text"
                    name="Título"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    id="AddStartDateInput"
                    type="date"
                    name="FechaInicio"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    id="AddEndDateInput"
                    type="date"
                    name="FechaFin"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>Resumen</label>
                  <textarea
                    id="AddResumeInput"
                    class="form-control"
                    name="Resumen"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Recursos</label>
                  <input
                    id="AddResourcesInput"
                    type="text"
                    name="Recursos"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>Tipo de Registro</label>
                  <div>
                    <label class="radio-inline">
                      <input
                        type="radio"
                        name="recordType"
                        value="new"
                        checked
                      />
                      Nuevo
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="recordType" value="existing" />
                      Existente
                    </label>
                  </div>
                </div>
                <div
                  class="form-group"
                  id="existingRecordSelect"
                  style="display: none"
                >
                  <label>Seleccionar Registro</label>
                  <select id="existingRecordDropdown" name="existingRecordID" class="form-control" placeholder>
                    <option value="-1">Seleccione un registro</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
              `;

  const recordTypeRadios = formbody.querySelectorAll(
    'input[name="recordType"]'
  );

  const existingRecordSelect = formbody.querySelector("#existingRecordSelect");
  const inputsAndTextareas = formbody.querySelectorAll(
    "input:not([type='radio']):not([type='hidden']), textarea"
  );

  recordTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "existing") {
        inputsAndTextareas.forEach((input) => (input.disabled = true));
        existingRecordSelect.style.display = "block";
      } else {
        inputsAndTextareas.forEach((input) => (input.disabled = false));
        existingRecordSelect.style.display = "none";
      }
    });
  });

  fetch(`/api/proyecto`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const select = formbody.querySelector("#existingRecordDropdown");
      data.forEach((diffusion) => {
        const option = document.createElement("option");
        option.value = diffusion.ID;
        option.textContent = diffusion.Título;
        select.appendChild(option);
      });
    });
}

function loadProjectToEdit(project) {
  const formbody = document.querySelector("#editForm .modal-body");
  console.log(project);

  formbody.innerHTML = `
                <div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="proyecto"
                  />
                  <input
                    id="RegID"
                    type="hidden"
                    name="RegID"
                    value="${project.ID}"
                  />
                  <label>Título</label>
                  <input
                    id="AddTitleInput"
                    type="text"
                    name="Título"
                    class="form-control"
                    value="${project.Título}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    id="AddStartDateInput"
                    type="date"
                    name="FechaInicio"
                    class="form-control"
                    value="${
                      new Date(project.FechaInicio).toISOString().split("T")[0]
                    }"
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    id="AddEndDateInput"
                    type="date"
                    name="FechaFin"
                    class="form-control"
                    value="${
                      new Date(project.FechaFin).toISOString().split("T")[0]
                    }"
                  />
                </div>
                <div class="form-group">
                  <label>Resumen</label>
                  <textarea
                    id="AddResumeInput"
                    class="form-control"
                    name="Resumen"
                  >${project.Resumen}</textarea>
                </div>
                <div class="form-group">
                  <label>Recursos</label>
                  <input
                    id="AddResourcesInput"
                    type="text"
                    name="Recursos"
                    class="form-control"
                    value="${project.Recursos}"
                  />
                </div>
              `;
}

function loadExtensionToAdd() {
  const formbody = document.querySelector("#addForm .modal-body");

  formbody.innerHTML = `
                <div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="extensión"
                  />
                  <label>Nombre</label>
                  <input
                    id="AddNameInput"
                    type="text"
                    name="Nombre"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    id="AddDescriptionInput"
                    class="form-control"
                    name="Descripción"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Tipo de Registro</label>
                  <div>
                    <label class="radio-inline">
                      <input
                        type="radio"
                        name="recordType"
                        value="new"
                        checked
                      />
                      Nuevo
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="recordType" value="existing" />
                      Existente
                    </label>
                  </div>
                </div>
                <div
                  class="form-group"
                  id="existingRecordSelect"
                  style="display: none"
                >
                  <label>Seleccionar Registro</label>
                  <select id="existingRecordDropdown" name="existingRecordID" class="form-control" placeholder>
                    <option value="-1">Seleccione un registro</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
              `;

  const recordTypeRadios = formbody.querySelectorAll(
    'input[name="recordType"]'
  );

  const existingRecordSelect = formbody.querySelector("#existingRecordSelect");
  const inputsAndTextareas = formbody.querySelectorAll(
    "input:not([type='radio']):not([type='hidden']), textarea"
  );

  recordTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "existing") {
        inputsAndTextareas.forEach((input) => (input.disabled = true));
        existingRecordSelect.style.display = "block";
      } else {
        inputsAndTextareas.forEach((input) => (input.disabled = false));
        existingRecordSelect.style.display = "none";
      }
    });
  });

  fetch(`/api/extensión`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const select = formbody.querySelector("#existingRecordDropdown");
      data.forEach((diffusion) => {
        const option = document.createElement("option");
        option.value = diffusion.ID;
        option.textContent = diffusion.Título;
        select.appendChild(option);
      });
    });
}

function loadExtensionToEdit(extension) {
  const formbody = document.querySelector("#editForm .modal-body");
  console.log(extension);

  formbody.innerHTML = `<div class="form-group">
                  <input
                    id="TableFlag"
                    type="hidden"
                    name="TableFlag"
                    value="extensión"
                  />
                  <input
                    id="RegID"
                    type="hidden"
                    name="RegID"
                    value="${extension.ID}"
                  />
                  <label>Nombre</label>
                  <input
                    id="AddNameInput"
                    type="text"
                    name="Nombre"
                    class="form-control"
                    value="${extension.Nombre}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    id="AddDescriptionInput"
                    class="form-control"
                    name="Descripción"
                  >${extension.Descripción}</textarea>
                </div>`;
}
//DELETION FUNCTIONS:

function setRecordToDelete(table, ID) {
  const deleteForm = document.getElementById("deleteForm");
  deleteForm.querySelector("#SelectedTable").value = table;
  deleteForm.querySelector("#IDsToDelete").value = ID;
}

function AddRecordToDeleteList(table, ID) {
  const deleteForm = document.getElementById("deleteForm");
  const SelectedTableInput = deleteForm.querySelector("#SelectedTable");
  const IDsToDeleteInput = deleteForm.querySelector("#IDsToDelete");

  if (SelectedTableInput.value != table) {
    SelectedTableInput.value = table;
    IDsToDeleteInput.value = ID;
  } else {
    IDsToDeleteInput.value += `,${ID}`;
  }
}

function RemoveRecordFromDeleteList(ID) {
  const deleteForm = document.getElementById("deleteForm");
  const IDsToDeleteInput = deleteForm.querySelector("#IDsToDelete");

  const IDs = IDsToDeleteInput.value.split(",").filter(Boolean);
  const newIDs = IDs.filter((id) => id !== ID);
  IDsToDeleteInput.value = newIDs.join(",");
}

//UTILITY FUNCTIONS:

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function eliminarTildes(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

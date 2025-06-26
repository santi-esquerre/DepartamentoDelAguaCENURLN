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
  fetch("/api/describe/difusioncientifica", {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((fields) => {
      const th = document.querySelector("#inv-table #table-head tr");
      th.innerHTML += fields.map((f) => `<th>${f}</th>`).join("");
    })
    .catch(console.error);

  fetch(`/api/persona/${userID}/difusioncientifica`, {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#inv-table #table-body");
      let i = 1;
      data.forEach((diff) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>
          <span class="custom-checkbox">
            <input
              type="checkbox"
              id="checkbox${i}"
              name="options[]"
              value="${diff.id}"
            />
            <label for="checkbox${i}"></label>
          </span>
        </td>
        <td>${diff.id}</td>
        <td>${diff.titulo}</td>
        <td>${diff.journal || ""}</td>
        <td>${diff.anio || ""}</td>
        <td>${diff.doi || ""}</td>
        <td><a href="${diff.url_pdf || "#"}">PDF</a></td>
        <td>${diff.resumen}</td>
        <td>${diff.cita_formateada || ""}</td>
        <td>${diff.estado}</td>
        <td>${diff.autores_externos}</td>
        <td>${diff.creado_en}</td>
        <td>${diff.actualizado_en}</td>
        <td>
          <a
            href="#editModal"
            class="edit"
            data-toggle="modal"
            onclick='loadDiffusionToEdit(${JSON.stringify(diff)});'
          >
            <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
          </a>
          <a
            href="#deleteModal"
            class="delete"
            data-toggle="modal"
            onclick="setRecordToDelete('difusioncientifica', '${diff.id}');"
          >
            <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
          </a>
        </td>`;
        i++;
        tbody.appendChild(row);
      });

      tbody.querySelectorAll('input[type="checkbox"]').forEach((cb) =>
        cb.addEventListener("change", (e) => {
          if (e.target.checked)
            AddRecordToDeleteList("difusioncientifica", e.target.value);
          else RemoveRecordFromDeleteList(e.target.value);
        })
      );

      document
        .getElementById("inv-table")
        .querySelector("#selectAll")
        .addEventListener("change", (e) => {
          tbody.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.checked = e.target.checked;
            if (e.target.checked)
              AddRecordToDeleteList("difusioncientifica", cb.value);
            else RemoveRecordFromDeleteList(cb.value);
          });
        });
    })
    .catch(console.error);
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

  console.log(data);

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
  console.log(body);

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
  // const pedad = document.getElementById("edad");
  const pdescripcion = document.getElementById("descripcion");

  imgFoto.src = `data:image/png;base64,${persona.Foto}`;
  h1nombre.textContent = persona.Nombre;
  h3titulo.textContent = persona.Título;
  // pedad.textContent = persona.FechaNacimiento
  // ? `Edad: ${calcularEdad(persona.FechaNacimiento)} años`
  // : "";
  pdescripcion.textContent = persona.Descripción;
}

function loadDiffusionToAdd() {
  const formbody = document.querySelector("#addForm .modal-body");
  formbody.innerHTML = `
    <div class="form-group">
      <input type="hidden" name="TableFlag" value="difusióncientífica" />
      <label>Título</label>
      <input type="text" name="titulo" class="form-control" required />
    </div>
    <div class="form-group">
      <label>Journal</label>
      <input type="text" name="journal" class="form-control" />
    </div>
    <div class="form-group">
      <label>Año</label>
      <input type="number" name="anio" class="form-control" />
    </div>
    <div class="form-group">
      <label>DOI</label>
      <input type="text" name="doi" class="form-control" />
    </div>
    <div class="form-group">
      <label>URL PDF</label>
      <input type="url" name="url_pdf" class="form-control" />
    </div>
    <div class="form-group">
      <label>Resumen</label>
      <textarea name="resumen" class="form-control"></textarea>
    </div>
    <div class="form-group">
      <label>Cita Formateada</label>
      <textarea name="cita_formateada" class="form-control"></textarea>
    </div>
    <div class="form-group">
      <label>Estado</label>
      <select name="estado" class="form-control">
        <option value="borrador">borrador</option>
        <option value="en_revision">en_revision</option>
        <option value="aceptada">aceptada</option>
        <option value="publicada">publicada</option>
      </select>
    </div>
    <div class="form-group">
      <label>Autores Externos (JSON)</label>
      <textarea name="autores_externos" class="form-control" placeholder='[{"nombre":"...","afiliacion":"..."}]'></textarea>
    </div>
    <div class="form-group">
      <label>Tipo de Registro</label>
      <div>
        <label class="radio-inline">
          <input type="radio" name="recordType" value="new" checked /> Nuevo
        </label>
        <label class="radio-inline">
          <input type="radio" name="recordType" value="existing" /> Existente
        </label>
      </div>
    </div>
    <div id="existingRecordSelect" class="form-group" style="display:none">
      <label>Seleccionar Registro</label>
      <select id="existingRecordDropdown" name="existingRecordID" class="form-control">
        <option value="">Seleccione un registro</option>
      </select>
    </div>
  `;
  const radios = formbody.querySelectorAll('input[name="recordType"]');
  const inputs = formbody.querySelectorAll(
    "input:not([type=radio]):not([type=hidden]), textarea, select"
  );
  const selector = formbody.querySelector("#existingRecordSelect");
  radios.forEach((r) => {
    r.addEventListener("change", () => {
      const disable = r.value === "existing";
      inputs.forEach((el) => {
        if (el.name !== "existingRecordID") el.disabled = disable;
      });
      selector.style.display = disable ? "block" : "none";
    });
  });
  fetch("/api/difusioncientifica", {
    method: "GET",
    headers: { Authorization: authToken, "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((list) => {
      const sel = formbody.querySelector("#existingRecordDropdown");
      list.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.titulo;
        sel.appendChild(opt);
      });
    })
    .catch(console.error);
}

function loadDiffusionToEdit(diffusion) {
  const formbody = document.querySelector("#editForm .modal-body");
  formbody.innerHTML = `
    <input type="hidden" name="TableFlag" value="difusioncientifica" />
    <input type="hidden" name="RegID" value="${diffusion.id}" />
    <div class="form-group">
      <label>Título</label>
      <input type="text" name="titulo" class="form-control" value="${
        diffusion.titulo
      }" required />
    </div>
    <div class="form-group">
      <label>Journal</label>
      <input type="text" name="journal" class="form-control" value="${
        diffusion.journal || ""
      }" />
    </div>
    <div class="form-group">
      <label>Año</label>
      <input type="number" name="anio" class="form-control" value="${
        diffusion.anio || ""
      }" />
    </div>
    <div class="form-group">
      <label>DOI</label>
      <input type="text" name="doi" class="form-control" value="${
        diffusion.doi || ""
      }" />
    </div>
    <div class="form-group">
      <label>URL PDF</label>
      <input type="url" name="url_pdf" class="form-control" value="${
        diffusion.url_pdf || ""
      }" />
    </div>
    <div class="form-group">
      <label>Resumen</label>
      <textarea name="resumen" class="form-control">${
        diffusion.resumen
      }</textarea>
    </div>
    <div class="form-group">
      <label>Cita Formateada</label>
      <textarea name="cita_formateada" class="form-control">${
        diffusion.cita_formateada || ""
      }</textarea>
    </div>
    <div class="form-group">
      <label>Estado</label>
      <select name="estado" class="form-control">
        <option value="borrador"${
          diffusion.estado === "borrador" ? " selected" : ""
        }>borrador</option>
        <option value="en_revision"${
          diffusion.estado === "en_revision" ? " selected" : ""
        }>en_revision</option>
        <option value="aceptada"${
          diffusion.estado === "aceptada" ? " selected" : ""
        }>aceptada</option>
        <option value="publicada"${
          diffusion.estado === "publicada" ? " selected" : ""
        }>publicada</option>
      </select>
    </div>
    <div class="form-group">
      <label>Autores Externos (JSON)</label>
      <textarea name="autores_externos" class="form-control">${
        JSON.stringify(diffusion.autores_externos) || ""
      }</textarea>
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

// function calcularEdad(fechaNacimiento) {
//   const hoy = new Date();
//   const nacimiento = new Date(fechaNacimiento);
//   let edad = hoy.getFullYear() - nacimiento.getFullYear();
//   const mes = hoy.getMonth() - nacimiento.getMonth();
//   if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
//     edad--;
//   }
//   return edad;
// }

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

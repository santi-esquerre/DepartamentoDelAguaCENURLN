const authToken = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/describe/persona", {
    method: "GET", // o el método adecuado para tu solicitud (POST, PUT, etc.)
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablehead = document.querySelector("#table-head tr");
      tablehead.innerHTML += data
        .map((header) => `<th>${header}</th>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching headers:", error);
    });

  fetch("/api/persona", {
    method: "GET", // o el método adecuado para tu solicitud (POST, PUT, etc.)
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tablebody = document.getElementById("table-body");

      data.forEach((user) => {
        const row = document.createElement("tr");
        let i = 1;
        row.innerHTML = `<td>
                  <span class="custom-checkbox">
                    <input
                      type="checkbox"
                      id="checkbox${i}"
                      name="options[]"
                      value="${user.ID}"
                    />
                    <label for="checkbox${i}"></label>
                  </span>
                </td>
                <td>${user.Nombre}</td>
                <td>${formatDate(user.FechaNacimiento)}</td>
                <td>${user.Título}</td>
                <td><img class = "img-fluid img-thumbnail" src="data:image/jpeg;base64,${
                  user.Foto
                }" alt="${user.Nombre}"></td>
                <td>
                  <a
                    href="${user.CV}"
                    >Curriculum</a
                  >
                </td>
                <td>${user.Descripción}</td>
                <td>${user.ID}</td>
                <td>
                  <a href="#editEmployeeModal" class="edit" data-toggle="modal" onclick="loadDataToEdit('${
                    user.ID
                  }');"
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Edit"
                      >&#xE254;</i
                    ></a
                  >
                  <a
                    href="#deleteEmployeeModal"
                    class="delete"
                    data-toggle="modal"
                    onclick="selectUser('${user.ID}');"
                    ><i
                      class="material-icons"
                      data-toggle="tooltip"
                      title="Delete"
                      >&#xE872;</i
                    ></a
                  >
                </td>`;
        i++;
        row.addEventListener("dblclick", (e) => {
          e.preventDefault();
          loadUserDashboard(user.ID);
        });
        tablebody.appendChild(row);
      });

      document
        .getElementById("selectAll")
        .addEventListener("change", function () {
          // Si el checkbox principal está marcado, marcar todos los demás checkboxes
          const isChecked = this.checked;
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          checkboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
});

function deleteSelectedUsers() {
  let selectedUsersIDs = [];

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) {
      selectedUsersIDs.push(checkbox.value);
    }
  });

  console.log(selectedUsersIDs);

  if (selectedUsersIDs.length === 0) {
    alert("Por favor, selecciona al menos un usuario para eliminar.");
    return;
  } else {
    selectedUsersIDs.forEach((userID) => {
      fetch(`/api/persona/${userID}`, {
        method: "DELETE",
        headers: {
          Authorization: authToken, // Incluye el token en el encabezado
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log(
            `El usuario con ID ${userID} ha sido eliminado correctamente.`
          );
          // location.reload();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    });
  }
}

function selectUser(userID) {
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  document.querySelector(
    `input[type="checkbox"][value="${userID}"]`
  ).checked = true;
}

document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío predeterminado del formulario

    let formData = {
      nombre: document.getElementById("AddNameInput").value,
      fechaNacimiento: document.getElementById("AddBirthDateInput").value,
      titulo: document.getElementById("AddTitleInput").value,
      foto: null,
      cv: document.getElementById("AddCVInput").value,
      descripcion: document.getElementById("AddDescriptionInput").value,
    };

    // Leer el archivo de la foto
    const fotoInput = document.getElementById("AddPhotoInput");

    // Convertir la foto a base64
    const reader = new FileReader();
    reader.onloadend = function () {
      comprimirImagen(reader.result, 800, 800, 0.7)
        .then((fotoComprimida) => {
          // Agregar el base64 de la foto al FormData
          formData.foto = fotoComprimida;
          // Enviar los datos al servidor
          addUser(formData);
        })
        .catch((error) => {
          console.error("Error al comprimir la imagen:", error);
        });
    };
    if (fotoInput.files.length > 0)
      reader.readAsDataURL(fotoInput.files[0]); // Leer la foto como base64
    else addUser(formData);
  });

function comprimirImagen(
  base64,
  maxWidth = 800,
  maxHeight = 800,
  calidad = 0.7
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Obtener el tamaño original de la imagen
      let width = img.width;
      let height = img.height;

      // Calcular el nuevo tamaño manteniendo la proporción
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // Ajustar el tamaño del canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Obtener la imagen comprimida en formato base64
      const fotoComprimidaBase64 = canvas.toDataURL("image/jpeg", calidad);

      // Resolver la promesa con la imagen comprimida
      resolve(fotoComprimidaBase64);
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen."));
    };
  });
}

function loadDataToEdit(userID) {
  selectUser(userID);
  fetch(`/api/persona/${userID}`, {
    method: "GET",
    headers: {
      Authorization: authToken, // Incluye el token en el encabezado
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("EditNameInput").value = data.Nombre;
      document.getElementById("EditBirthDateInput").value =
        data.FechaNacimiento;
      document.getElementById("EditTitleInput").value = data.Título;
      document.getElementById("EditCVInput").value = data.CV;
      document.getElementById("EditDescriptionInput").value = data.Descripción;
      document.getElementById("EditUserIDInput").value = data.ID;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
}

document
  .getElementById("editEmployeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío predeterminado del formulario

    let formData = {
      Nombre: document.getElementById("EditNameInput").value,
      FechaNacimiento: document.getElementById("EditBirthDateInput").value,
      Título: document.getElementById("EditTitleInput").value,
      Foto: null,
      CV: document.getElementById("EditCVInput").value,
      Descripción: document.getElementById("EditDescriptionInput").value,
    };

    // Leer el archivo de la foto
    const fotoInput = document.getElementById("EditPhotoInput");

    // Convertir la foto a base64
    const reader = new FileReader();
    reader.onloadend = function () {
      comprimirImagen(reader.result, 800, 800, 0.7)
        .then((fotoComprimida) => {
          // Agregar el base64 de la foto al FormData
          formData.Foto = fotoComprimida.split(",")[1];

          sendDataToEdit(
            document.querySelector("#EditUserIDInput").value,
            formData
          );
        })
        .catch((error) => {
          console.error("Error al comprimir la imagen:", error);
        });
    };
    if (fotoInput.files.length > 0)
      reader.readAsDataURL(fotoInput.files[0]); // Leer la foto como base64
    else
      sendDataToEdit(
        document.querySelector("#EditUserIDInput").value,
        formData
      );
    console.log(JSON.stringify(obtenerValoresTruthy(formData)));
  });

function obtenerValoresTruthy(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value)
  );
}

function sendDataToEdit(userID, formdata) {
  // Enviar los datos al servidor
  fetch(`/api/persona/${userID}`, {
    method: "PUT",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obtenerValoresTruthy(formdata)),
  })
    .then((response) => {
      console.log("Response status:", response.status);
      return response.json().then((data) => {
        if (response.ok) {
          return data;
        } else {
          throw new Error(data.message || "Error en la respuesta del servidor");
        }
      });
    })
    .then((data) => {
      console.log("Éxito:", data);
      alert("Datos enviados correctamente!");
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al enviar los datos.");
    });
}

function addUser(userData) {
  console.log(JSON.stringify(obtenerValoresTruthy(userData)));
  fetch("/api/persona", {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obtenerValoresTruthy(userData)),
  })
    .then((response) => {
      console.log("Response status:", response.status);
      return response.json().then((data) => {
        if (response.ok) {
          return data;
        } else {
          throw new Error(data.message || "Error en la respuesta del servidor");
        }
      });
    })
    .then((data) => {
      console.log("Éxito:", data);
      alert("Datos enviados correctamente!");
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al enviar los datos.");
    });
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function loadUserDashboard(userID) {
  localStorage.setItem("userID", userID);
  window.location.href = "/admin/user-dashboard.html";
}

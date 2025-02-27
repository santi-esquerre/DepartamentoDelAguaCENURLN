function mostrarDatos() {
  //Realizar la solicitud al servidor
  fetch("/personal")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const contenedor = document.getElementById("contenedor");

      let contenido = "";

      data.forEach((persona) => {
        contenido += `
        <div class="list-group-item list-group-item-action cursor-active persona" id="${persona.ID}">
  <div class="row align-items-center">
    <!-- Imagen -->
    <div class="col-auto">
      <div class="square-container">
        <img src="data:image/png;base64,${persona.Foto}" alt="${persona.Nombre}" class="img-fluid img-thumbnail" />
      </div>
    </div>
    <!-- Información -->
    <div class="col">
      <div class="d-flex w-100 justify-content-between">
        <div class="mb-1">
          <h4>${persona.Nombre}</h4>
          <p>${persona.Descripción}</p>
        </div>
        <small class="text-muted">${persona.Título}</small>
      </div>
    </div>
  </div>
</div>
        `;
      });

      contenedor.innerHTML = contenido;

      document.querySelectorAll(".persona").forEach((elemento) => {
        elemento.style.cursor = "pointer";
        elemento.addEventListener("click", () => {
          cargarPersona(elemento.id);
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function cargarPersona(id) {
  localStorage.setItem("idPersona", id);
  window.location.href = "/persona.html";
}

document.addEventListener("DOMContentLoaded", mostrarDatos);

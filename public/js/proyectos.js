function mostrarDatos() {
  //Realizar la solicitud al servidor
  fetch("/proyectos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const contenedor = document.getElementById("contenedor");

      let contenido = "";

      data.forEach((proyecto) => {
        contenido += `
        <div class="list-group-item list-group-item-action cursor-active proyecto" id="${
          proyecto.ID
        }"
        }>
              <div class="row">
                <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                    <div class="mb-1">
                      <h4>${proyecto.ProyectoTítulo}</h4>
                      <h6>${proyecto.Autores}</h6>
                      <p>${proyecto.Resumen}</p>
                      <p>${proyecto.Recursos}</p>
                    </div>
                    <small class="text-muted">${formatDate(
                      proyecto.FechaInicio
                    )} - ${formatDate(proyecto.FechaFin)}</small>
                  </div>
                </div>
              </div>
            </div>
      `;
      });

      contenedor.innerHTML = contenido;

      document.querySelectorAll(".proyecto").forEach((elemento) => {
        elemento.style.cursor = "pointer";
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", mostrarDatos);

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

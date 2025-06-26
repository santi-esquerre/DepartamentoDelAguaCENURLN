function mostrarDatos() {
  fetch("/difusiones")
    .then((response) => {
      if (!response.ok)
        throw new Error("Error en la solicitud: " + response.statusText);
      return response.json();
    })
    .then((data) => {
      const contenedor = document.getElementById("contenedor");
      contenedor.innerHTML = data
        .map(
          (diff) => `
        <div
          class="list-group-item list-group-item-action difusion"
          id="${diff.id}"
          ${
            diff.url_pdf
              ? `onclick="window.open('${diff.url_pdf}','_blank')"`
              : ""
          }
        >
          <div class="row">
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <div class="mb-1">
                  <h4>${diff.DifusionTitulo}</h4>
                  <!-- <h6>${diff.Autores}</h6> -->
                  <p">${diff.cita_formateada}</p>
                  <p>${diff.resumen != "Sin resumen" ? diff.resumen : ""}</p>
                </div>
                <small class="text-muted">${diff.anio || ""}</small>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("");
      document
        .querySelectorAll(".difusion")
        .forEach(
          (el) =>
            (el.style.cursor = el.getAttribute("onclick")
              ? "pointer"
              : "default")
        );
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", mostrarDatos);

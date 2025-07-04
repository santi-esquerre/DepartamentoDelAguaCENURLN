function cargarPersona() {
  const id = getQueryParam("id") || localStorage.getItem("idPersona");
  localStorage.setItem("idPersona", id);

  fetch(`/persona/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const persona = data;
      const imgFoto = document.getElementById("profile-photo");
      const h1nombre = document.getElementById("nombre");
      const h3titulo = document.getElementById("titulo");
      // const pedad = document.getElementById("edad");
      const pdescripcion = document.getElementById("descripcion");
      const aCV = document.getElementById("cv");

      imgFoto.src = `data:image/png;base64,${persona.Foto}`;
      h1nombre.textContent = persona.Nombre;
      h3titulo.textContent = persona.Título;
      // pedad.textContent = persona.FechaNacimiento
      // ? `Edad: ${calcularEdad(persona.FechaNacimiento)} años`
      // : "";
      pdescripcion.textContent = persona.Descripción;
      aCV.href = persona.CV || "#";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  fetch(`/persona/${id}/difusioncientifica`)
    .then((res) => {
      if (!res.ok) throw new Error("Error en la solicitud: " + res.statusText);
      return res.json();
    })
    .then((data) => {
      if (!data.length) return;
      document.getElementById("main").innerHTML += `
        <div class="m-5">
          <h2 class="section-title">Investigaciones y Proyectos</h2>
          <ul class="list-group" id="difusiones"></ul>
        </div>
      `;
      const ul = document.getElementById("difusiones");
      data.forEach((diff) => {
        ul.innerHTML += `
          <li
            class="list-group-item list-group-item-action cursor-active"
            style="cursor: pointer;"
            onclick="window.open('${diff.url_pdf || ""}', '_blank')"
          >
            <h5>${diff.titulo}</h5>
            <h6>${diff.estado || ""}</h6>
            <p>${diff.resumen}</p>
            <small class="text-muted">${diff.cita_formateada || ""}</small>
            <small class="text-muted d-block">${diff.anio || ""}</small>
          </li>
        `;
      });
    })
    .catch((error) => console.error("Error:", error));

  fetch(`/persona/${id}/proyecto`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.length == 0) return;
      const difusiones = data;
      const ulDifusiones = document.getElementById("difusiones");
      if (ulDifusiones.querySelector(".text-danger"))
        ulDifusiones.querySelector(".text-danger").remove();
      difusiones.forEach((proyecto) => {
        ulDifusiones.innerHTML += `<li class="list-group-item list-group-item-action cursor-active" onclick="window.location.href = '${
          proyecto.Recursos || ""
        }'">
    <h5>${proyecto.Título}</h5>
    <p>${proyecto.Resumen}</p>
    <small class="text-muted">${formatDate(proyecto.FechaInicio) || ""} - ${
          formatDate(proyecto.FechaFin) || "Actualidad"
        }</small>
</li>
`;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
document.addEventListener("DOMContentLoaded", cargarPersona);

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

// Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

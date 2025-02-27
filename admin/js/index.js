document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".nav-link"); // Selecciona todos los enlaces de navegación
  const contentFrame = document.getElementById("content-frame");

  // Recuperar la última vista guardada o usar una por defecto
  const lastPage = localStorage.getItem("lastPage") || "personal-manager.html";
  contentFrame.src = lastPage;

  // Marcar como activa la opción correspondiente al cargar la página
  links.forEach((link) => {
    if (link.getAttribute("data-page") === lastPage) {
      link.classList.add("active");
    }
  });

  // Manejar clics en los enlaces de navegación
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Evita la recarga de la página

      const page = this.getAttribute("data-page"); // Obtener la ruta del enlace
      if (page) {
        contentFrame.src = page; // Cargar la página en el iframe
        localStorage.setItem("lastPage", page); // Guardar la página en localStorage

        // Eliminar clase "active" de todos los enlaces y asignarla solo al seleccionado
        links.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });
});

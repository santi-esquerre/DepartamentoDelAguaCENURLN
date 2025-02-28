document.addEventListener("DOMContentLoaded", function () {
  // Fetch the HTML content from navbar.html
  fetch("rsc/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;
      const nav = tempDiv.querySelector("#nav");
      document.getElementById("nav").replaceWith(nav);

      loadActiveNavItem();

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          setActiveNavItem(link.id);
        });
      });
    })
    .catch((error) => console.error("Error fetching the navbar:", error));

  fetch("rsc/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((error) => console.error("Error fetching the footer:", error));

  const navLinks = document.querySelectorAll("#nav-items .nav-link");
});

function setActiveNavItem(id) {
  localStorage.setItem("activeNavItem", id);

  // Obtener todos los elementos de tipo <a> con la clase nav-link dentro del contenedor con id "nav-items"
  const navLinks = document.querySelectorAll("#nav-items .nav-link");

  // Remover la clase 'active' de todos los elementos
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Agregar la clase 'active' al elemento <a> con el id proporcionado
  const activeLink = document.getElementById(id);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Función para cargar el enlace activo desde localStorage
function loadActiveNavItem() {
  // Obtener el id del enlace activo guardado en localStorage
  const savedActiveNavItem = localStorage.getItem("activeNavItem");

  // Si existe un id guardado, establecer ese enlace como activo
  if (savedActiveNavItem) {
    setActiveNavItem(savedActiveNavItem);
  }
}

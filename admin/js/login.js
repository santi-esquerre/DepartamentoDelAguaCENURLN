document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const user = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
      })
      .then((data) => {
        document.getElementById("responseMessage").textContent =
          "Inicio de sesión exitoso";
        document.getElementById("responseMessage").style.color = "green";

        localStorage.setItem("token", data.token); // Almacena el token en localStorage
        window.location.href = "/admin/index.html"; // Redirige al usuario
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("responseMessage").textContent = error.message;
        document.getElementById("responseMessage").style.color = "#e74c3c";
      });
  });

// auth.js

// Función para verificar el token y redirigir al login si es inválido
export function verifyToken() {
  const token = localStorage.getItem("token");

  // Si no hay token, redirige al login
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  // Verificar el token enviando una solicitud al backend
  return fetch("/api/verify-token", {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Token inválido o expirado");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error de verificación de token:", error);
      localStorage.removeItem("token"); // Elimina el token inválido
      window.location.href = "./login.html"; // Redirige al login
    });
}

require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const { marked } = require("marked");

const loginRoutes = require("./routes/loginRoutes");
const jsonRoutes = require("./routes/jsonRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const otherRoutes = require("./routes/otherRoutes");
const publicRoutes = require("./routes/publicRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const verifyToken = require("./middlewares/authMiddleware");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos para la página pública y el panel de administración
app.use(express.static(path.join(__dirname, "public"))); // Archivos públicos
app.use("/admin", express.static(path.join(__dirname, "admin"))); // Archivos de administración
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Archivos subidos

// Aplicar el middleware verifyToken a todas las rutas de la API excepto login
app.use("/api", (req, res, next) => {
  if (req.path === "/login") return next(); // Permite acceso a la ruta de login
  verifyToken(req, res, next); // Aplica el middleware a las demás rutas
});

app.use("/api", loginRoutes); // La ruta de /login no necesita token
// Rutas protegidas
app.use("/api", uploadRoutes);
app.use("/api", jsonRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", otherRoutes);

// Rutas públicas
app.use("/", publicRoutes); // Rutas públicas sin protección

// Cargar el certificado y la clave
const options = {
  key: fs.readFileSync("./certs/key.pem"), // Ruta a la clave privada
  cert: fs.readFileSync("./certs/cert.pem"), // Ruta al certificado
};

app.get("/", (req, res) => {
  res.send("¡Servidor HTTPS activo!");
});

https.createServer(options, app).listen(8443, () => {
  console.log("Servidor HTTPS corriendo en https://localhost:8443");
});

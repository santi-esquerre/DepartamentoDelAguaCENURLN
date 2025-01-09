// controllers/uploadController.js
const multer = require("multer");
const path = require("path");

// Configuración de multer para almacenar archivos en la carpeta "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
  },
});

const upload = multer({ storage });

// Controlador para manejar la carga de archivos
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  // Devuelve la URL del archivo subido
  res.status(200).json({
    url: `/uploads/${req.file.filename}`, // URL para acceder al archivo subido
  });
};

module.exports = {
  upload,
  uploadFile,
};

// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../controllers/uploadController");

// Ruta para manejar la carga de archivos
router.post("/upload", upload.single("upload"), uploadFile);

module.exports = router;

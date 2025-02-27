// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  upload,
  uploadFile,
  listUploadedFiles,
  deleteUploadedFile,
} = require("../controllers/uploadController");

// 📤 Subir un archivo (protegido con JWT)
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// 📂 Listar archivos subidos
router.get("/list-uploads", verifyToken, listUploadedFiles);

// 🗑 Eliminar un archivo
router.delete("/delete-upload/:filename", verifyToken, deleteUploadedFile);

module.exports = router;

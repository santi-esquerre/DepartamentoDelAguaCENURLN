// routes/jsonRoutes.jsc
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  listJsonFiles,
  getJsonFile,
  saveJsonFile,
  listBackups,
  restoreBackup
} = require("../controllers/jsonController");

// 📂 Listar JSONs disponibles
router.get("/list-json", verifyToken, listJsonFiles);

// 📖 Obtener contenido de un JSON específico
router.get("/get-json/:filename", verifyToken, getJsonFile);

// 💾 Guardar cambios en un JSON
router.post("/save-json/:filename", verifyToken, saveJsonFile);

// Listar backups disponibles
router.get("/list-backups", verifyToken, listBackups);

// Restaurar un backup
router.post("/restore-backup/:filename", verifyToken, restoreBackup);

module.exports = router;

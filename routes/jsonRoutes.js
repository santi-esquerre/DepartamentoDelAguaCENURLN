// routes/jsonRoutes.jsc
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  listJsonFiles,
  getJsonFile,
  saveJsonFile,
} = require("../controllers/jsonController");

// 📂 Listar JSONs disponibles
router.get("/list-json", verifyToken, listJsonFiles);

// 📖 Obtener contenido de un JSON específico
router.get("/get-json/:filename", verifyToken, getJsonFile);

// 💾 Guardar cambios en un JSON
router.post("/save-json/:filename", verifyToken, saveJsonFile);

module.exports = router;

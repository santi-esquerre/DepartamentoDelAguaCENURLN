const express = require("express");
const router = express.Router();
const authController = require("../controllers/loginController"); // Asegúrate de que la ruta es correcta
const verifyToken = require("../middlewares/authMiddleware");

router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token válido" });
});
router.post("/login", authController.authQuery);

module.exports = router;

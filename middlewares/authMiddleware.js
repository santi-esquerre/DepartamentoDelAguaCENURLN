require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // Usa una variable de entorno para mayor seguridad

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token inválido o expirado." });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;

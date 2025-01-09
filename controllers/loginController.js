require("dotenv").config();
const Models = require("../models/loginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY; // Cambia esto a una clave segura

exports.authQuery = (req, res) => {
  Models.auth(req.body.user, (err, results) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = JSON.parse(JSON.stringify(results[0]));
    bcrypt
      .compare(req.body.password, user.password_hash)
      .then((match) => {
        if (match) {
          // Genera el token JWT
          const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
            expiresIn: "2h",
          });
          res.status(200).json({ message: "Usuario autenticado", token });
        } else {
          res.status(401).json({ message: "Contraseña incorrecta" });
        }
      })
      .catch((error) => {
        console.error("Error en la comparación de contraseña:", error);
        res.status(500).send("Error en el servidor");
      });
  });
};

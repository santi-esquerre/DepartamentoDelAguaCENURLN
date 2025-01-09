// routes.js
const express = require("express");
const router = express.Router();
const PostController = require("../controllers/postController"); // Asegúrate de que la ruta sea correcta

// Ruta para crear un nuevo post
router.post("/novedades", PostController.createPost);

// Ruta para obtener todos los novedades
router.get("/novedades", PostController.getAllPosts);

// Ruta para obtener un post específico por ID
router.get("/novedades/:id", PostController.getPostById);

// Ruta para actualizar un post específico
router.put("/novedades/:id", PostController.updatePost);

// Ruta para eliminar un post específico
router.delete("/novedades/:id", PostController.deletePost);

module.exports = router;

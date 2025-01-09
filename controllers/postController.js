// PostController.js
const Post = require("../models/postModels"); // Asegúrate de que la ruta al modelo sea correcta
const { sendNewPostNotification } = require("../services/notificationService");
const { BACKgetAll } = require("../models/otherModels");

exports.createPost = (req, res) => {
  const { title, content, persona_id } = req.body; // Asumiendo que persona_id se pasa en el cuerpo de la solicitud

  Post.create(title, content, persona_id, async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al crear el post",
        error: err,
      });
    }

    const subscribers = await BACKgetAll("suscriptor"); // Asegúrate de que la función getAll esté disponible en el modelo

    try {
      // Llamar al servicio de notificaciones con el ID del autor y los datos del post creado
      await sendNewPostNotification(subscribers, persona_id, {
        titulo: title,
        contenido: content,
        fecha_creación: new Date().toISOString(), // Asegúrate de que la fecha sea correcta
        id: result.id, // Si el resultado devuelve el ID del post recién creado
      });

      // Enviar la respuesta de éxito al cliente
      return res.status(201).json({
        message: "Post creado y notificaciones enviadas",
        post: result,
      });
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
      // Retornar éxito en la creación del post, pero informar del fallo en las notificaciones
      return res.status(201).json({
        message: "Post creado, pero ocurrió un error al enviar notificaciones",
        post: result,
        notificationError: error.message,
      });
    }
  });
};

// Obtener todos los posts
exports.getAllPosts = (req, res) => {
  Post.getAll((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener los posts", error: err });
    }
    res.json(results);
  });
};

// Obtener un post por ID
exports.getPostById = (req, res) => {
  const id = req.params.id;
  Post.getById(id, (err, post) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener el post", error: err });
    }
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res.json(post);
  });
};

// Actualizar un post
exports.updatePost = (req, res) => {
  const id = req.params.id;
  const { title, content, persona_id } = req.body; // personaId también puede pasarse en el cuerpo de la solicitud
  Post.update(id, title, content, persona_id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar el post", error: err });
    }
    if (!result) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res.json(result);
  });
};

// Eliminar un post
exports.deletePost = (req, res) => {
  const id = req.params.id;
  Post.delete(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al eliminar el post", error: err });
    }
    if (!result) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res.json(result);
  });
};

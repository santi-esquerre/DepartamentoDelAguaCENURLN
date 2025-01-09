// PostModel.js
const db = require("../config/db"); // Archivo de configuración de base de datos

const Post = {
  // Crear un nuevo post
  create: (title, content, personaId, callback) => {
    const sql =
      "INSERT INTO novedades (id, titulo, contenido, fecha_creacion, persona_id) VALUES (UUID(), ?, ?, NOW(), ?)";
    db.query(sql, [title, content, personaId], (err, result) => {
      if (err) {
        callback(err);
      }
      // Consultar el registro recién insertado
      const selectSql =
        "SELECT id FROM novedades WHERE persona_id = ? ORDER BY fecha_creacion DESC LIMIT 1"; // Asumiendo que tienes un campo created_at para ordenar
      db.query(selectSql, [personaId], (err, rows) => {
        if (err) {
          callback(err);
        }
        // Devolver el ID del post creado
        callback(null, { message: "Post creado", id: rows[0].id });
      });
    });
  },

  // Obtener todos los posts
  getAll: (callback) => {
    const sql =
      "SELECT novedades.id, novedades.titulo, novedades.contenido, novedades.fecha_creacion, persona.nombre AS autor_nombre FROM novedades LEFT JOIN persona ON novedades.persona_id = persona.id;";
    db.query(sql, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  },

  // Obtener un post por ID
  getById: (id, callback) => {
    const sql = "SELECT * FROM novedades WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        callback(err);
      } else if (results.length === 0) {
        callback(null, null); // Post no encontrado
      } else {
        callback(null, results[0]);
      }
    });
  },

  // Actualizar un post por ID
  update: (id, title, content, personaId, callback) => {
    const sql =
      "UPDATE novedades SET titulo = ?, contenido = ?, persona_id = ? WHERE id = ?";
    db.query(sql, [title, content, personaId, id], (err, result) => {
      if (err) {
        callback(err);
      } else if (result.affectedRows === 0) {
        callback(null, null); // Post no encontrado
      } else {
        callback(null, { message: "Post actualizado" });
      }
    });
  },

  // Eliminar un post por ID
  delete: (id, callback) => {
    const sql = "DELETE FROM novedades WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        callback(err);
      } else if (result.affectedRows === 0) {
        callback(null, null); // Post no encontrado
      } else {
        callback(null, { message: "Post eliminado" });
      }
    });
  },
};

module.exports = Post;

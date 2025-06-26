const db = require("../config/db");

const User = {
  getAll: (callback) => {
    db.query("SELECT * FROM persona", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM persona WHERE ID = ?", [id], callback);
  },

  BACKgetById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM persona WHERE ID = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },

  create: (data, callback) => {
    const { Nombre, FechaNacimiento, Título, Foto, CV, Descripción } = data;
    db.query(
      `INSERT INTO persona (Nombre, FechaNacimiento, Título, Foto, CV, Descripción, ID)
       VALUES (?, ?, ?, ?, ?, ?, UUID())`,
      [Nombre, FechaNacimiento, Título, Foto, CV, Descripción],
      callback
    );
  },

  update: (id, data, callback) => {
    const { Nombre, FechaNacimiento, Título, Foto, CV, Descripción } = data;
    db.query(
      `UPDATE persona
         SET Nombre = ?, FechaNacimiento = ?, Título = ?, Foto = ?, CV = ?, Descripción = ?
       WHERE ID = ?`,
      [Nombre, FechaNacimiento, Título, Foto, CV, Descripción, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM persona WHERE ID = ?", [id], callback);
  },

  getDiffusionByUserId: (id, callback) => {
    db.query(
      `SELECT d.*
         FROM difusioncientifica d
         INNER JOIN difusioncientifica_persona dp
           ON d.id = dp.difusioncientifica_id
        WHERE dp.persona_id = ?`,
      [id],
      callback
    );
  },

  relateUserWithDiffusion: (personaId, difusionId, callback) => {
    db.query(
      `INSERT INTO difusioncientifica_persona
         (persona_id, difusioncientifica_id)
       VALUES (?, ?)`,
      [personaId, difusionId],
      callback
    );
  },
  getProjectsByUserId: (id, callback) => {
    db.query(
      "SELECT p.* FROM proyecto p INNER JOIN persona_proyecto pp ON p.id = pp.proyecto_id WHERE pp.persona_id = ?",
      [id],
      callback
    );
  },
  getExtensionByUserId: (id, callback) => {
    db.query(
      "SELECT e.* FROM extensión e INNER JOIN persona_extensión pe ON e.id = pe.extensión_id WHERE pe.persona_id = ?",
      [id],
      callback
    );
  },
  relateUserWithProject: (data, callback) => {
    db.query(
      "INSERT INTO persona_proyecto (persona_id, proyecto_id) VALUES (?, ?)",
      data,
      callback
    );
  },
  relateUserWithExtension: (data, callback) => {
    db.query(
      "INSERT INTO persona_extensión (persona_id, extensión_id) VALUES (?, ?)",
      data,
      callback
    );
  },
};

module.exports = User;

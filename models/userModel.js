const db = require("../config/db");

const User = {
  getAll: (callback) => {
    db.query("SELECT * FROM persona", callback);
  },
  getById: (id, callback) => {
    db.query("SELECT * FROM persona WHERE id = ?", [id], callback);
  },
  BACKgetById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM persona WHERE id = ?", [id], (err, result) => {
        if (err) {
          return reject(err); // Rechaza la Promesa en caso de error
        }
        resolve(result[0]); // Resuelve la Promesa con el primer resultado
      });
    });
  },

  create: (data, callback) => {
    db.query(
      "INSERT INTO persona (Nombre, FechaNacimiento, Título, Foto, CV, Descripción, ID) VALUES (?, ?, ?, ?, ?, ?, UUID())",
      data,
      callback
    );
  },
  update: (id, data, callback) => {
    db.query("UPDATE persona SET ? WHERE id = ?", [data, id], callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM persona WHERE id = ?", [id], callback);
  },
  getDifussionByUserId: (id, callback) => {
    db.query(
      "SELECT d.* FROM difusióncientífica d INNER JOIN persona_difusión pd ON d.id = pd.difusión_id WHERE pd.persona_id = ?",
      [id],
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
  relateUserWithDiffusion: (data, callback) => {
    db.query(
      "INSERT INTO persona_difusión (persona_id, difusión_id) VALUES (?, ?)",
      data,
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

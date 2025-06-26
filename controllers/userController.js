const User = require("../models/userModel");

exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    results = results.map((result) => {
      if (result.Foto) result.Foto = result.Foto.toString();
      return result;
    });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results && results[0]) {
      if (results[0].Foto) results[0].Foto = results[0].Foto.toString();
      res.json(results[0]);
    } else res.status(404).send("User not found");
  });
};

exports.createUser = (req, res) => {
  const { nombre, fechaNacimiento, titulo, foto, cv, descripcion } = req.body;
  const userData = {
    Nombre: nombre || "Sin nombre",
    FechaNacimiento: fechaNacimiento || null,
    Título: titulo || "Sin título",
    Foto: foto ? foto.split(",")[1] : null,
    CV: cv || "",
    Descripción: descripcion || "",
  };
  User.create(userData, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.updateUser = (req, res) => {
  const { nombre, fechaNacimiento, titulo, foto, cv, descripcion } = req.body;
  const userData = {
    Nombre: nombre || "Sin nombre",
    FechaNacimiento: fechaNacimiento || null,
    Título: titulo || "Sin título",
    Foto: foto ? foto.split(",")[1] : null,
    CV: cv || "",
    Descripción: descripcion || "",
  };
  User.update(req.params.id, userData, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.getUserDiffusion = (req, res) => {
  User.getDiffusionByUserId(req.params.id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.relateUserWithDiffusion = (req, res) => {
  const { persona_id, difusión_id } = req.body;
  User.relateUserWithDiffusion(persona_id, difusión_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getUserProjects = (req, res) => {
  User.getProjectsByUserId(req.params.id, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

exports.getUserExtension = (req, res) => {
  User.getExtensionByUserId(req.params.id, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

exports.relateUserWithProject = (req, res) => {
  const data = [req.body.persona_id, req.body.proyecto_id];
  User.relateUserWithProject(data, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

exports.relateUserWithExtension = (req, res) => {
  const data = [req.body.persona_id, req.body.extensión_id];
  User.relateUserWithExtension(data, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

const User = require("../models/userModel");

exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) res.status(500).send(err);
    results = results.map((result) => {
      if (result.Foto) result.Foto = result.Foto.toString();
      return result;
    });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, result) => {
    if (err) res.status(500).send(err);
    if (result) {
      if (result[0].Foto) result[0].Foto = result[0].Foto.toString();
      res.json(result[0]);
    } else res.status(404).send("User not found");
  });
};

exports.createUser = (req, res) => {
  const { nombre, fechaNacimiento, titulo, cv, descripcion } = req.body;
  const foto = req.body.foto ? req.body.foto.split(",")[1] : null; // Obtener solo la parte base64

  User.create(
    [nombre, fechaNacimiento, titulo, foto, cv, descripcion],
    (err, result) => {
      if (err) res.status(500).send(err);
      res.json(result);
    }
  );
};

exports.updateUser = (req, res) => {
  User.update(req.params.id, req.body, (err, result) => {
    if (err) res.status(500).send(err);
    res.json(result);
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) res.status(500).send(err);
    res.json(result);
  });
};

// exports.describeTable = (req, res) => {
//   User.describeTable(req.params.table, (err, results) => {
//     if (err) res.status(500).send(err);
//     results = results.map((result) => result.Field);
//     res.json(results);
//   });
// };

exports.getUserDiffusion = (req, res) => {
  User.getDifussionByUserId(req.params.id, (err, results) => {
    if (err) res.status(500).send;
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

exports.relateUserWithDiffusion = (req, res) => {
  const data = [req.body.persona_id, req.body.difusión_id];
  User.relateUserWithDiffusion(data, (err, results) => {
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

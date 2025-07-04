const Models = require("../models/otherModels");

exports.getAll = (req, res) => {
  Models.getAll(req.params.table, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.describeTable = (req, res) => {
  Models.describeTable(req.params.table, (err, results) => {
    if (err) return res.status(500).send(err);
    results = results.map((result) => result.Field);
    res.json(results);
  });
};

exports.createNewDiffusion = (req, res) => {
  const diffusion = {
    ID: req.body.ID || "",
    titulo: req.body.titulo || "Sin título",
    journal: req.body.journal || "Sin journal",
    anio: req.body.anio || new Date().getFullYear(),
    doi: req.body.doi || "",
    url_pdf: req.body.url_pdf || "",
    resumen: req.body.resumen || "Sin resumen",
    cita_formateada: req.body.cita_formateada || "",
    estado: req.body.estado || "pendiente",
    autores_externos: req.body.autores_externos || [],
  };
  Models.createNewDiffusion(diffusion, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createNewProject = (req, res) => {
  const project = [
    req.body.Título || "Sin título",
    req.body.FechaInicio || new Date(),
    req.body.FechaFin || new Date(),
    req.body.Resumen || "Sin resumen",
    req.body.Recursos || "Sin recursos",
  ];
  const uuid = req.body.ID;
  Models.createNewProject(project, uuid, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.createNewExtension = (req, res) => {
  const extension = [
    req.body.Nombre || "Sin nombre",
    req.body.Descripción || "Sin descripción",
  ];
  const uuid = req.body.ID;
  Models.createNewExtension(extension, uuid, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.deleteRegister = (req, res) => {
  Models.deleteRegister(req.params.table, req.params.id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.updateDiffusion = (req, res) => {
  const diffusion = {
    titulo: req.body.titulo || "Sin título",
    journal: req.body.journal || "Sin journal",
    anio: req.body.anio || new Date().getFullYear(),
    doi: req.body.doi || "",
    url_pdf: req.body.url_pdf || "",
    resumen: req.body.resumen || "Sin resumen",
    cita_formateada: req.body.cita_formateada || "",
    estado: req.body.estado,
    autores_externos: req.body.autores_externos || [],
  };
  const id = req.params.id;
  Models.updateDiffusion(diffusion, id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.updateProject = (req, res) => {
  const project = [
    req.body.Título || "Sin título",
    req.body.FechaInicio || new Date(),
    req.body.FechaFin || new Date(),
    req.body.Resumen || "Sin resumen",
    req.body.Recursos || "Sin recursos",
  ];
  const id = req.params.id;
  Models.updateProject(project, id, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

exports.updateExtension = (req, res) => {
  const extension = [
    req.body.Nombre || "Sin nombre",
    req.body.Descripción || "Sin descripción",
  ];
  const id = req.params.id;
  Models.updateExtension(extension, id, (err, results) => {
    if (err) res.status(500).send;
    res.json(results);
  });
};

exports.getRegisterByID = (req, res) => {
  Models.getRegisterByID(req.params.table, req.params.id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getRecentPosts = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  Models.getRecentPosts(limit, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.createNewSubscriber = (req, res) => {
  const { email } = req.body;
  Models.createNewSubscriber(email, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send("¡Gracias por suscribirte!");
  });
};

exports.getDifusiones = (req, res) => {
  Models.getDifusiones((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getProyectos = (req, res) => {
  Models.getProyectos((err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.getMaterias = (req, res) => {
  Models.getMaterias((err, results) => {
    if (err) res.status(500).send(err);
    const materias = results.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      creditos: row.creditos,
      estado: row.estado,
      semestre: row.semestre,
      previasCurso: row.previasCurso
        ? row.previasCurso.split(",").map(Number)
        : [],
      previasExamen: row.previasExamen
        ? row.previasExamen.split(",").map(Number)
        : [],
    }));
    res.json(materias);
  });
};

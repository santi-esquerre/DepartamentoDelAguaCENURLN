const db = require("../config/db");

const OtherModels = {
  getAll: (table, callback) => {
    db.query(`SELECT * FROM \`${table}\``, callback);
  },
  BACKgetAll: (table) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM \`${table}\``, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  describeTable: (table, callback) => {
    db.query(`DESCRIBE \`${table}\``, callback);
  },
  createNewDiffusion: (diffusion, callback) => {
    const {
      ID,
      titulo,
      journal,
      anio,
      doi,
      url_pdf,
      resumen,
      cita_formateada,
      estado,
      autores_externos,
    } = diffusion;
    db.query(
      `INSERT INTO difusioncientifica
        (id, titulo, journal, anio, doi, url_pdf, resumen, cita_formateada, estado, autores_externos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID,
        titulo,
        journal,
        anio,
        doi,
        url_pdf,
        resumen,
        cita_formateada,
        estado,
        JSON.stringify(autores_externos),
      ],
      callback
    );
  },
  createNewProject: (project, uuid, callback) => {
    db.query(
      "INSERT INTO proyecto (`Título`, `FechaInicio`, `FechaFin`, `Resumen`, `Recursos`, `ID`) values (?, ?)",
      [project, uuid],
      callback
    );
  },
  createNewExtension: (extension, uuid, callback) => {
    db.query(
      "INSERT INTO extensión (`Nombre`, `Descripción`, `ID`) values (?, ?)",
      [extension, uuid],
      callback
    );
  },
  updateDiffusion: (diffusion, id, callback) => {
    const {
      titulo,
      journal,
      anio,
      doi,
      url_pdf,
      resumen,
      cita_formateada,
      estado,
      autores_externos,
    } = diffusion;
    db.query(
      `UPDATE difusioncientifica
        SET titulo = ?, journal = ?, anio = ?, doi = ?, url_pdf = ?, resumen = ?, cita_formateada = ?, estado = ?, autores_externos = ?
       WHERE id = ?`,
      [
        titulo,
        journal,
        anio,
        doi,
        url_pdf,
        resumen,
        cita_formateada,
        estado,
        JSON.stringify(autores_externos),
        id,
      ],
      callback
    );
  },
  updateProject: (project, id, callback) => {
    db.query(
      "UPDATE proyecto SET `Título` = ?, `FechaInicio` = ?, `FechaFin` = ?, `Resumen` = ?, `Recursos` = ? WHERE ID = ?",
      [...project, id],
      callback
    );
  },
  updateExtension: (extension, id, callback) => {
    db.query(
      "UPDATE extensión SET `Nombre` = ?, `Descripción` = ? WHERE ID = ?",
      [...extension, id],
      callback
    );
  },
  deleteRegister: (table, id, callback) => {
    db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id], callback);
  },
  getRegisterByID: (table, id, callback) => {
    db.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id], callback);
  },
  getRecentPosts: (limit, callback) => {
    db.query(
      "SELECT * FROM novedades ORDER BY `fecha_creacion` DESC LIMIT ?",
      [limit],
      callback
    );
  },
  createNewSubscriber: (email, callback) => {
    db.query("INSERT INTO suscriptor (`Email`) values (?)", [email], callback);
  },
  getDifusiones: (callback) => {
    db.query(
      `
      SELECT 
        d.id,
        d.titulo AS DifusionTitulo,
        d.journal,
        d.anio,
        d.doi,
        d.url_pdf,
        d.resumen,
        d.cita_formateada,
        d.estado,
        GROUP_CONCAT(p.Nombre SEPARATOR ', ') AS Autores,
        GROUP_CONCAT(p.ID SEPARATOR ', ') AS PersonasIDs
      FROM difusioncientifica d
      LEFT JOIN difusioncientifica_persona dp ON d.id = dp.difusioncientifica_id
      LEFT JOIN persona p ON dp.persona_id = p.ID
      GROUP BY 
        d.id, d.titulo, d.journal, d.anio, d.doi, d.url_pdf, d.resumen, d.cita_formateada, d.estado
      ORDER BY d.anio DESC;
      `,
      callback
    );
  },
  getProyectos: (callback) => {
    db.query(
      `
    SELECT 
    p.Título AS ProyectoTítulo,
    p.FechaInicio,
    p.FechaFin,
    p.Resumen,
    p.Recursos,
    GROUP_CONCAT(pe.Nombre SEPARATOR ', ') AS Autores,
    GROUP_CONCAT(pe.ID SEPARATOR ', ') AS PersonasIDs
    FROM 
        departamentodelagua.proyecto p
    LEFT JOIN 
        departamentodelagua.persona_proyecto pp ON p.ID = pp.proyecto_ID
    LEFT JOIN 
        departamentodelagua.persona pe ON pp.persona_ID = pe.ID
    GROUP BY 
        p.ID, p.Título, p.FechaInicio, p.FechaFin, p.Resumen, p.Recursos
    ORDER BY 
        p.FechaInicio DESC;
    `,
      callback
    );
  },
  getMaterias: (callback) => {
    db.query(
      `
      SELECT 
          u.id, 
          u.nombre, 
          u.creditos, 
          u.semestre,
          CASE 
              WHEN COUNT(r.tipo_requisito) = 0 THEN 'habilitada'
              ELSE 'no-habilitada'
          END AS estado,
          GROUP_CONCAT(CASE WHEN r.tipo_requisito = 'curso' THEN r.requisito_id END) AS previasCurso,
          GROUP_CONCAT(CASE WHEN r.tipo_requisito = 'examen' THEN r.requisito_id END) AS previasExamen
      FROM 
          unidadcurricular u
      LEFT JOIN 
          requisito_materia r 
      ON 
          u.id = r.materia_id
      GROUP BY 
          u.id, u.nombre, u.creditos, u.semestre;
    `,
      callback
    );
  },
};

module.exports = OtherModels;

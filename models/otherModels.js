const db = require("../config/db");

const OtherModels = {
  getAll: (table, callback) => {
    db.query(`SELECT * FROM ${table}`, callback);
  },
  BACKgetAll: (table) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table}`, (err, result) => {
        if (err) {
          return reject(err); // Rechaza la Promesa en caso de error
        }
        resolve(result); // Resuelve la Promesa con el resultado
      });
    });
  },
  describeTable: (table, callback) => {
    db.query(`DESCRIBE ${table}`, callback);
  },
  createNewDiffusion: (diffusion, uuid, callback) => {
    db.query(
      "INSERT INTO difusióncientífica (`Título`, `FechaPublicación`, `Descripción`, `Tipo`, `Link`, `ID`) values (?, ?)",
      [diffusion, uuid],
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
    db.query(
      "UPDATE difusióncientífica SET `Título` = ?, `FechaPublicación` = ?, `Descripción` = ?, `Tipo` = ?, `Link` = ? WHERE ID = ?",
      [...diffusion, id],
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
    db.query(`DELETE FROM ${table} WHERE ID = ?`, [id], callback);
  },
  getRegisterByID: (table, id, callback) => {
    db.query(`SELECT * FROM ${table} WHERE ID = ?`, [id], callback);
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
    d.Título AS DifusiónTítulo,
    d.FechaPublicación,
    d.Descripción,
    d.Tipo,
    d.Link,
    GROUP_CONCAT(p.Nombre SEPARATOR ', ') AS Autores,
    GROUP_CONCAT(p.ID SEPARATOR ', ') AS PersonasIDs
    FROM 
        departamentodelagua.difusióncientífica d
    LEFT JOIN 
        departamentodelagua.persona_difusión pd ON d.ID = pd.difusión_ID
    LEFT JOIN 
        departamentodelagua.persona p ON pd.persona_ID = p.ID
    GROUP BY 
        d.ID, d.Título, d.FechaPublicación, d.Descripción, d.Tipo, d.Link
    ORDER BY 
        d.FechaPublicación DESC;
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
};

module.exports = OtherModels;

// controllers/jsonController.js
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");

// 📂 Listar todos los archivos JSON en `/data/`
const listJsonFiles = (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Error al leer la carpeta de JSONs" });

    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    res.json(jsonFiles);
  });
};

// 📖 Obtener contenido de un JSON específico
const getJsonFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(dataDir, filename);

  if (!filename.endsWith(".json"))
    return res.status(400).json({ error: "Archivo no permitido" });

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Error al leer el archivo JSON" });
    res.json(JSON.parse(data));
  });
};

// 💾 Guardar cambios en un JSON
const saveJsonFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(dataDir, filename);

  if (!filename.endsWith(".json"))
    return res.status(400).json({ error: "Archivo no permitido" });

  const updatedJSON = JSON.stringify(req.body, null, 2);

  fs.writeFile(filePath, updatedJSON, "utf8", (err) => {
    if (err) return res.status(500).json({ error: "Error al guardar el JSON" });
    res.json({ message: "JSON guardado correctamente" });
  });
};

module.exports = {
  listJsonFiles,
  getJsonFile,
  saveJsonFile,
};

// controllers/uploadController.js
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.random().toString(36).substring(7) +
        path.extname(file.originalname)
    ),
});

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo de archivo no permitido"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 📤 Subir un archivo
const uploadFile = (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No se subió ningún archivo" });

  res.status(200).json({
    message: "Archivo subido con éxito",
    url: `/uploads/${req.file.filename}`,
  });
};

// 📂 Listar archivos subidos
const listUploadedFiles = (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Valores por defecto

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error leyendo archivos:", err);
      return res
        .status(500)
        .json({ error: "Error al leer la carpeta de archivos" });
    }

    // Obtener detalles de cada archivo
    const fileList = files.map((file) => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);

      return {
        filename: file,
        url: `/uploads/${file}`,
        uploadedAt: stats.birthtimeMs, // Fecha de creación en milisegundos
      };
    });

    // Ordenar archivos por fecha (más recientes primero)
    fileList.sort((a, b) => b.uploadedAt - a.uploadedAt);

    // Paginar los resultados
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFiles = fileList.slice(startIndex, endIndex);

    res.json({
      totalFiles: fileList.length,
      totalPages: Math.ceil(fileList.length / limit),
      currentPage: parseInt(page),
      files: paginatedFiles,
    });
  });
};

// 🗑 Eliminar un archivo
const deleteUploadedFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "Archivo no encontrado" });

  fs.unlink(filePath, (err) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar el archivo" });
    res.json({ message: "Archivo eliminado correctamente" });
  });
};

module.exports = {
  upload,
  uploadFile,
  listUploadedFiles,
  deleteUploadedFile,
};

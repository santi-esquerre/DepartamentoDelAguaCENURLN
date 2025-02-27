const fs = require("fs");
const path = require("path");

// Directorios
const dataDir = path.join(__dirname, "../data");
const backupDir = path.join(__dirname, "../data_backups");

// Asegurar que la carpeta de backups exista
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Obtener fecha y hora en formato YYYYMMDD_HHmmss
const getTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(
    2,
    "0"
  )}${String(now.getMinutes()).padStart(2, "0")}${String(
    now.getSeconds()
  ).padStart(2, "0")}`;
};

// Función para hacer backup de los JSON
const backupJsonFiles = () => {
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      console.error("Error al leer la carpeta de datos:", err);
      return;
    }

    files.forEach((file) => {
      if (path.extname(file) === ".json") {
        const srcPath = path.join(dataDir, file);
        const destPath = path.join(
          backupDir,
          `${path.basename(file, ".json")}_${getTimestamp()}.json`
        );

        fs.copyFile(srcPath, destPath, (err) => {
          if (err) {
            console.error(`Error al copiar ${file}:`, err);
          } else {
            console.log(`Backup exitoso: ${destPath}`);
          }
        });
      }
    });
  });
};

// Ejecutar la función
backupJsonFiles();

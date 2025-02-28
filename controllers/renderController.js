const fs = require("fs");
const path = require("path");
const marked = require("marked");

/**
 * Función para cargar y renderizar la página de la lrhyr con datos del JSON.
 */
const renderLicenciatura = (req, res) => {
  const jsonPath = path.join(__dirname, "../data/licenciaturarhyr.json");

  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el JSON:", err);
      return res.status(500).send("Error al cargar el contenido.");
    }

    let contenido = JSON.parse(data);

    // Convertir los campos con Markdown a HTML
    contenido.seccion_principal.descripcion = marked.parse(
      contenido.seccion_principal.descripcion
    );
    contenido.info_general.descripcion = marked.parse(
      contenido.info_general.descripcion
    );

    contenido.estructura.datos.forEach((dato) => {
      dato.valor = marked.parse(dato.valor);
    });

    contenido.secciones.forEach((seccion) => {
      seccion.contenido = marked.parse(seccion.contenido);
      if (seccion.enlaces) {
        seccion.enlaces = seccion.enlaces.map((enlace) => ({
          url: enlace.url,
          texto: marked.parse(enlace.texto)
        }));
      }
    });

    contenido.malla.descripcion = marked.parse(contenido.malla.descripcion);

    res.render("licenciaturarhyr", contenido);
  });
};

/**
 * Renderiza la página de inicio con contenido dinámico del JSON.
 */
const renderIndex = (req, res) => {
  const jsonPath = path.join(__dirname, "../data/index.json");

  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el JSON:", err);
      return res.status(500).send("Error al cargar el contenido.");
    }

    let contenido = JSON.parse(data);

    // Aplicar Markdown a cada slide del carrusel
    contenido.carrusel.forEach((slide) => {
      slide.titulo = marked.parseInline(slide.titulo);
      slide.descripcion = marked.parse(slide.descripcion);
      slide.boton_texto = marked.parseInline(slide.boton_texto);
    });

    res.render("index", contenido);
  });
};

const renderAboutPage = (req, res) => {
  const jsonPath = path.join(__dirname, "../data/sobre_nosotros.json");
  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      return res.status(500).send("Error al cargar la página.");
    }

    try {
      const aboutData = JSON.parse(data);

      // Convertir contenido de Markdown a HTML
      aboutData.contenido = aboutData.contenido.map((seccion) => {
        return marked.parse(seccion);
      });

      res.render("sobre_nosotros", aboutData);
    } catch (parseError) {
      console.error("Error al parsear el JSON:", parseError);
      return res.status(500).send("Error al procesar los datos.");
    }
  });
};

// Función para cargar y procesar los datos del JSON
const renderLabAguaPage = (req, res) => {
  // Ruta del JSON de datos
  const dataFilePath = path.join(
    __dirname,
    "../data/laboratoriodeaguaysuelos.json"
  );

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      return res.status(500).send("Error al cargar los datos del laboratorio.");
    }

    try {
      let jsonData = JSON.parse(data);

      // Aplicar Markdown a cada sección de contenido
      jsonData.titulo = marked.parse(jsonData.titulo || "");
      jsonData.subtitulo = marked.parse(jsonData.subtitulo || "");

      jsonData.contenido = jsonData.contenido.map((seccion) =>
        marked.parse(seccion || "")
      );

      jsonData.secciones = jsonData.secciones.map((seccion) => ({
        id: seccion.id,
        titulo: marked.parse(seccion.titulo || ""),
        contenido: marked.parse(seccion.contenido || ""),
        enlaces: seccion.enlaces
          ? seccion.enlaces.map((enlace) => ({
              texto: marked.parseInline(enlace.texto || ""),
              url: enlace.url
            }))
          : null
      }));

      // Renderizar la plantilla con los datos procesados
      res.render("laboratorio_de_agua_y_suelos", jsonData);
    } catch (parseError) {
      console.error("Error al parsear el JSON:", parseError);
      res.status(500).send("Error al procesar los datos.");
    }
  });
};

module.exports = {
  renderLicenciatura,
  renderIndex,
  renderAboutPage,
  renderLabAguaPage
};

const { SitemapStream, streamToPromise } = require("sitemap");

const generateSitemap = async (req, res) => {
  try {
    const sitemap = new SitemapStream({
      hostname: "https://agua.unorte.edu.uy"
    });

    // Agrega las URLs principales del sitio
    const urls = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/personal.html", changefreq: "monthly", priority: 0.7 },
      { url: "/noticias.html", changefreq: "daily", priority: 0.9 },
      { url: "/proyectos.html", changefreq: "weekly", priority: 0.7 },
      { url: "/investigacion.html", changefreq: "weekly", priority: 0.7 },
      { url: "/contacto", changefreq: "monthly", priority: 0.8 },
      { url: "/licenciaturarhyr", changefreq: "weekly", priority: 0.9 },
      { url: "/laboratorioaguaysuelos", changefreq: "weekly", priority: 0.7 },
      { url: "/nosotros", changefreq: "monthly", priority: 0.7 }
    ];

    urls.forEach((page) => {
      sitemap.write(page);
    });

    sitemap.end();
    const xml = await streamToPromise(sitemap).then((data) => data.toString());

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generando sitemap:", error);
    res.status(500).send("Error al generar el sitemap");
  }
};

module.exports = { generateSitemap };

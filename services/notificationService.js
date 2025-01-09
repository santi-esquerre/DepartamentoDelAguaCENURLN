const brevo = require("@getbrevo/brevo");
const User = require("../models/userModel"); // Modelo para obtener información del autor
require("dotenv").config();

const sendNewPostNotification = async (subscribers, authorId, post) => {
  try {
    // Obtener la información completa del autor a partir de su ID
    const author = await User.BACKgetById(authorId);
    if (!author) throw new Error("Autor no encontrado");
    author.Foto = author.Foto.toString();
    console.log("Autor:", author);

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Plantilla de correo electrónico
    const output = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Publicación en el Blog</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 2px solid #4CAF50;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #4CAF50;
            }
            .content {
                padding: 20px 0;
            }
            .content p {
                line-height: 1.6;
            }
            .author-info {
                display: flex;
                align-items: center;
                margin-top: 20px;
                padding: 10px 0;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
            }
            .author-info img {
                border-radius: 50%;
                width: 60px;
                height: 60px;
                margin-right: 15px;
            }
            .author-info div {
                font-size: 14px;
                color: #555;
            }
            .post-content {
                margin-top: 20px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 20px;
                border-top: 1px solid #ddd;
                padding-top: 10px;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                color: #fff;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Nueva Publicación en el Blog</h1>
                <p><strong>Departamento del Agua y Ciencias Afines</strong></p>
                <p><em>CENUR Litoral Norte, Universidad de la República</em></p>
            </div>

            <div class="content">
                <p><strong>Estimado suscriptor,</strong></p>
                <p>Tenemos una nueva publicación en nuestro blog. ¡Esperamos que te resulte interesante!</p>

                <div class="author-info">
                    <img src="cid:authorImage" alt="Foto del Autor">
                    <div>
                        <p><strong>Autor:</strong> ${author.Nombre}</p>
                        <p><strong>Fecha de Publicación:</strong> ${formatDateToSpanish(
                          post.fecha_creación
                        )}</p>
                    </div>
                </div>

                <div class="post-content">
                    <h2>${post.titulo}</h2>
                    <div>
                        ${post.contenido}
                    </div>
                </div>

                <a href="https://agua.unorte.edu.uy/noticia" onclick="localStorage.setItem('postID', ${
                  post.id
                })" class="button">Leer más</a>
            </div>

            <div class="footer">
                <p><strong>Información de Contacto</strong></p>
                <p>CENUR Litoral Norte, Universidad de la República</p>
                <p>Sede Salto, Gral Rivera 1350, Salto, Uruguay, C.P.: 50000</p>
                <p>Tel.: (+598) 47322154 int. 3105</p>
                <p>Fax: (+598) 47322154</p>
            </div>
        </div>
    </body>
    </html>
    `;

    sendSmtpEmail.sender = {
      email: process.env.EMAIL_SENDER,
      name: "Blog Departamento del Agua",
    };
    sendSmtpEmail.to = subscribers.map((subscriber) => ({
      email: subscriber.email,
    }));
    sendSmtpEmail.subject = `Nueva publicación: ${post.titulo}`;
    sendSmtpEmail.htmlContent = output;
    sendSmtpEmail.attachment = [
      {
        name: "author.png", // Nombre del archivo en el adjunto
        content: author.Foto, // Convertir el string Base64 a Buffer
        cid: "authorImage", // Content-ID referenciado en el `src` del `<img>`
      },
    ];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Notificaciones enviadas con éxito:", response);
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
    throw error;
  }
};

module.exports = { sendNewPostNotification };

function formatDateToSpanish(dateString) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${dayName} ${day} de ${monthName} de ${year} a las ${hours}:${minutes}`;
}

const brevo = require("@getbrevo/brevo");
const otherControllers = require("./otherControllers");
require("dotenv").config();
const { sendNewPostNotification } = require("../services/notificationService");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Configuración del mensaje de correo
    const output = `
      <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Contacto</title>
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
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .contact-info {
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
        }
        .contact-info p {
            margin: 2px 0;
        }
        .highlight {
            color: #4CAF50;
            font-weight: bold;
        }
        .btn {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            color: #fff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Formulario de Contacto</h1>
            <p><strong>Departamento del Agua y Ciencias Afines</strong></p>
            <p><em>CENUR Litoral Norte, Universidad de la República</em></p>
        </div>
        
        <div class="content">
            <p><span class="highlight">Estimado(a) Administrador(a),</span></p>
            <p>Ha recibido un nuevo mensaje a través del formulario de contacto de su página web. A continuación se presentan los detalles:</p>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Asunto:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Mensaje:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message}</td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">Por favor, revise los detalles y responda a este mensaje cuando le sea posible.</p>
        </div>
        
        <div class="footer">
            <p><strong>Información de Contacto</strong></p>
            <div class="contact-info">
                <p>CENUR Litoral Norte, Universidad de la República</p>
                <p>Sede Salto, Gral Rivera 1350, Salto, Uruguay, C.P.: 50000</p>
                <p>Tel.: (+598) 47322154 int. 3105</p>
                <p>Fax: (+598) 47322154</p>
            </div>
        </div>
    </div>
</body>
</html>

    `;

    sendSmtpEmail.sender = {
      email: process.env.EMAIL_SENDER,
      name: "Contacto Web - Departamento del Agua",
    };
    sendSmtpEmail.to = [{ email: process.env.EMAIL_RECEIVER }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = output;
    sendSmtpEmail.replyTo = { email: email, name: name };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(response);
    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.sendNewPostNotification = async (req, res) => {
  try {
    const subscribers = await otherControllers.getAll("suscriptor");
    const { author, post } = req.body;

    await sendNewPostNotification(subscribers, author, post);

    return res
      .status(200)
      .json({ message: "Notificaciones enviadas con éxito" });
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

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

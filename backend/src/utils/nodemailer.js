// Importa nodemailer o cualquier otra biblioteca de envío de correos que estés usando
import nodemailer from 'nodemailer';

// Define la función sendEmailChangePassword
export const sendEmailChangePassword = (email, resetLink) => {
    // Configura el transportador de correo (ajusta estos valores según tu proveedor de correo)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tuCorreo@gmail.com',
            pass: 'tuContraseña'
        }
    });

    // Define las opciones del correo
    const mailOptions = {
        from: 'tuCorreo@gmail.com',
        to: email,
        subject: 'Restablecimiento de contraseña',
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email enviado: ' + info.response);
    });
};

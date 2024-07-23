// Importa nodemailer o cualquier otra biblioteca de envío de correos que estés usando
import nodemailer from 'nodemailer';


/*inicio RCUPERACIÓN DE CONTRASEÑA */

// Define la función sendEmailChangePassword
export const sendEmailChangePassword = (email, resetLink) => {
    // Configura el transportador de correo (ajusta estos valores según tu proveedor de correo)
    //Transporter: Configura y autentica el servicio de correo para enviar emails.
    const transporter = nodemailer.createTransport({
       //Especifica el servicio de correo que usarás para enviar los correos (por ejemplo, Gmail, Yahoo, etc.).
        service: 'gmail',
        auth: {
            //Proporciona las credenciales necesarias para autenticarte con el servicio de correo (correo electrónico y contraseña).          
            //Puede ser un correo personal o profesional que tengas configurado para estos fines. Un correo de administrador si estás gestionando una aplicación donde solo los administradores pueden enviar correos.usar cualquier proveedor de servicios de correo (Gmail, Outlook, etc.) y asegurarte de que está configurado para permitir el envío de correos desde aplicaciones. Para Gmail, por ejemplo, necesitarías habilitar "Less secure app access"
            user: varenv.email_user,
            pass: varenv.email_pass
        }
    });

    // Define las opciones del correo
    const mailOptions = {
        // El correo electrónico desde el cual se enviarán los correos.
        from: varenv.email_user,
        // El correo electrónico del destinatario.
        to: email,
        //El asunto del correo.
        subject: 'Restablecimiento de contraseña',
        //El cuerpo del correo en texto plano.
        text: `Para restablecer tu contraseña en Gerhard, haz clic en el siguiente enlace: ${resetLink}`
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.errors("Error al enviar correo")
        } else {
            console.log('Email enviado correctamente: ' + info.response);
        }
    });
};
/*fin RCUPERACIÓN DE CONTRASEÑA */




/*inicio  ENVIO DE CORREO POR INACTIVIDAD DE USUARIO */

// Función para enviar un correo notificando la eliminación del usuario
export const sendEmailForDeletion = async (email) => {
    // Define las opciones del correo
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Cuenta eliminada por inactividad',
        text: 'Tu cuenta ha sido eliminada debido a inactividad. Si crees que esto es un error, por favor contacta al soporte.'
    };

    // Envía el correo electrónico
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado correctamente');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};

/*fin ENVIO DE CORREO POR INACTIVIDAD DE USUARIO */
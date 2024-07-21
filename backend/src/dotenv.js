import dotenv from 'dotenv'

dotenv.config();

const varenv = {
    mongo_url: process.env.MONGO_BD_URL,
    cookies_secret: process.env.COOKIES_SECRET,
    session_secret: process.env.SESSION_SECRET,
    jwt_secret: process.env.JWT_SECRET,
    // salt: parseInt(process.env.SALT, 12),
    // Convertir el valor a un número entero en base 10
    //Aquí, parseInt(process.env.SALT, 10) convierte la cadena '12' en el número entero 12.
    salt: parseInt(process.env.SALT, 10),
    secret_Key: process.env.SECRET_KEY

}

export default varenv;


import varenv from '../dotenv.js'
import jwt from 'jsonwebtoken'
//genero una funcion que me pide un usuario como parametro
export const generateToken = (user) => {
//para generar un token en jwt tengo 3 pasos
    /*
        1°: Objeto de asociacion del token (Usuario)
        2°: Clave privada del cifrado
        3°: Tiempo de expiracion
    */
   //genero un token el cual recibe como parámetro un usuario, lo encripte con el Secret Key, la contraseña, y dure 12  horas. 
    const token = jwt.sign({ user }, varenv.secret_Key, { expiresIn: '12h' })
    console.log(token) // Aquí se imprime el token
   return token
}

//varenv.jwt_secret
/*
// Ejemplo de uso y prueba
console.log(generateToken({
    "_id": "65fb7dbb4c863f6027e6da4b",
    "first_name": "Maria",
    "last_name": "Martinez",
    "password": "$2b$12$tdojC3W4n5vLWcqV0qJaEuIwAyFZdmAMWjmZwvvxLzaUwm/5idTNG",
    "age": 30,
    "email": "adminCoder@coder.com",
    "rol": "User",
    "__v": 0
}))*/

/*
 //para proteger rutas después del login
 
export function authenticateToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token' });
    }
}*/


//middleware para AUTENTICAL EL ROL

// Middleware para verificar el rol
/*
const authorizeRole = (rol) => {
    return (req, res, next) => {
        const userRol = req.user.rol; // Asume que `req.user` es el usuario autenticado
        if (userRol === rol) {
            return next();
        }
        return res.status(403).json({ error: 'Acceso denegado' });
    }
}
*/


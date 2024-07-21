// Importa el módulo 'passport' que se utiliza para la autenticación de usuarios.
import passport from "passport";
import { userModel } from "../models/user.js";// Utiliza destructuración para importar



// inicio INICIO DE SESION....................

// Función asíncrona para el inicio de sesión de un usuario.
export const login = async (req, res) => {
    try {
        // Verifica si no hay usuario autenticado.
        if (!req.user) {
            // Si no hay usuario autenticado, devuelve un código de estado 401 (Unauthorized) con un mensaje de error.
            return res.status(401).send("Usuario o contraseña no válidos");
        }

        // Establece la información del usuario en la sesión.
        req.session.user = {
            email: req.user.email,
            name: req.user.name
        }

        // Envía una respuesta con un código de estado 200 (OK) indicando que el usuario se ha logueado correctamente.
        res.status(200).send("Usuario logueado correctamente");

    } catch (e) {
        // Si ocurre un error durante el inicio de sesión, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).send("Error al loguear usuario");
    }
}
//fin INICIO DE SESION....................







// inicio CURRENT: verificación de logueo de usuario....................

// Función asíncrona para verificar si el usuario está autenticado utilizando la estrategia JWT.
export const current = async (req, res) => {
    try {
        // Verifica si hay un usuario autenticado.
        if (req.user) {
            console.log(req)
            // Si hay un usuario autenticado, envía una respuesta con un código de estado 200 (OK) indicando que el usuario está logueado.
            res.status(200).send("Usuario logueado");
        } else {
            // Si no hay un usuario autenticado, devuelve un código de estado 401 (Unauthorized) con un mensaje de error.
            res.status(401).send("Usuario no autenticado");
        }
    } catch (e) {
        // Si ocurre un error, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).send("Error al verificar usuario actual");
    }
}

// fin CURRENT: verificación de usuario....................






// inicio REGISTRO....................

// Función asíncrona para registrar un nuevo usuario.
export const register = async (req, res) => {
    try {
        // Verifica si no hay usuario autenticado.
        if (!req.user) {
            //SI NO HAY USUARIO AUTENTICADO, devuelve un código de estado 400 (Bad Request) con un mensaje de error.
            return res.status(400).json("Usuario ya existente en la aplicación");
        }

        // Envía una respuesta con un código de estado 200 (OK) indicando que el usuario se ha creado correctamente.
        res.status(200).json("Usuario creado correctamente");

    } catch (e) {
        // Si ocurre un error durante el registro, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).json("Error al registrar usuario");
    }
}

// fin REGISTRO....................







// inicio LOGOUT (desloguearse: cerrar sesion)....................

//ADEMAS DE DESTRUIR LA SESION PUEDO LLAMAR AL MODULO de userModel (desafio 4ºpractica integradora)

//Función asíncrona para cerrar sesión de un usuario.
export const logout = async (req, res) => {
    console.log(req.session)
    //voy a buscar a 1 usuario
    const user = await userModel.findOne({ email: req.session.user.email })
    //realiza una búsqueda en la base de datos MongoDB utilizando Mongoose para encontrar un documento que coincida con un criterio específico. En este caso, el criterio es el campo `email` que debe coincidir con el valor almacenado en `req.session.user.email`.
    //findOne({email: req.session.user.email})
    //.findById(req.session.user._id)
    user.last_connection = new Date()
    await user.save()

    // Destruye la sesión del usuario.
    req.session.destroy(function (e) {
        if (e) {
            // Si hay un error al destruir la sesión, se imprime en la consola.
            console.log(e)
        } else {
            // Si se destruye la sesión correctamente, redirige al usuario a la página de inicio.
            res.status(200).redirect("/")
        }
    })
}

// fin LOGOUT....................






// inicio RUTA GITHUB....................

// Función asíncrona para manejar la sesión de GitHub.
export const sessionGithub = async (req, res) => {
    // Establece la información del usuario obtenida de GitHub en la sesión.
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    // Redirige al usuario a la página de inicio.
    res.redirect('/')
}

// fin RUTA GITHUB....................







// inicio RUTA JWT....................

// Función asíncrona para probar la autenticación JWT.
export const testJWT = async (req, res) => {
    console.log("Desde testJWT" + req.user)
    // Verifica si el usuario tiene permisos de 'User'.
    if (req.user.rol == 'User')
        // Si el usuario no tiene permisos de 'User', devuelve un código de estado 403 (Forbidden) con un mensaje de error.
        res.status(403).send("Usuario no autorizado");
    else
        // Si el usuario tiene permisos de 'User', devuelve la información del usuario con un código de estado 200 (OK).
        res.status(200).send(req.user);
}
// fin RUTA JWT....................







// inicio RECUPERACION DE CONTRASEÑA PARA INGRESAR....................



// Exporta la función asíncrona changePassword
export const changePassword = async (req, res) => {
    // Extrae el token de los parámetros de la solicitud
    const { token } = req.params
    // Extrae la nueva contraseña del cuerpo de la solicitud
    const { newPassword } = req.body
    try {
        // Verifica y decodifica el token JWT
        const validateToken = jwt.verify(token.substr(6,), "coder")
        // Busca al usuario en la base de datos usando el correo electrónico del token validado
        const user = await userModel.findOne({ email: validateToken.userEmail })
        if (user) { // Si el usuario existe
            // Verifica si la nueva contraseña no es igual a la contraseña actual
            if (!validatePassword(newPassword, user.password)) {
                // Genera un hash de la nueva contraseña
                const hashPassword = createHash(newPassword)
                // Actualiza la contraseña del usuario con el nuevo hash
                user.password = hashPassword
                // Guarda los cambios en la base de datos
                const resultado = await userModel.findByIdAndUpdate(user._id, user)
                // Muestra el resultado de la actualización en la consola
                console.log(resultado)
                // Envía una respuesta exitosa al cliente
                res.status(200).send("Contraseña modificada correctamente")
            } else { // Si la nueva contraseña es igual a la anterior
                // Envía una respuesta indicando que la contraseña no puede ser igual a la anterior
                res.status(400).send("La contraseña no puede ser identica a a la anterior")
            }
        } else { // Si el usuario no se encuentra
            // Envía una respuesta indicando que el usuario no fue encontrado
            res.status(404).send("Usuario no encontrado")
        }
    } catch (e) { // Si ocurre un error
        // Muestra el error en la consola
        console.log(e)
        // Si el error es que el token JWT ha expirado
        if (e?.message == 'jwt expired') {
            // Envía una respuesta indicando que el tiempo para recuperar la contraseña ha expirado
            res.status(400).send("Paso el tiempo maximo para recuperar la contraseña. Se enviara otro mail a tu casilla de correo")
        }
        // Envía una respuesta indicando un error interno del servidor
        res.status(500).send(e)
    }
}

// Exporta la función asíncrona sendEmailPassword
export const sendEmailPassword = async (req, res) => {
    try {
        // Extrae el correo electrónico del cuerpo de la solicitud
        const { email } = req.body
        // Busca al usuario en la base de datos usando el correo electrónico proporcionado
        const user = await userModel.find({ email: email })
        if (user) { // Si el usuario existe
            // Genera un token JWT con el correo electrónico del usuario, que expira en 1 minuto
            const token = jwt.sign({ userEmail: email }, "coder", { expiresIn: '1m' })
            // Crea un enlace para restablecer la contraseña que incluye el token generado
            const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`
            // Envía un correo electrónico al usuario con el enlace para restablecer la contraseña
            sendEmailChangePassword(email, resetLink)
            // Envía una respuesta exitosa al cliente
            res.status(200).send("Email enviado correctamente")
        } else { // Si el usuario no se encuentra
            // Envía una respuesta indicando que el usuario no fue encontrado
            res.status(404).send("Usuario no encontrado")
        }
    } catch (e) { // Si ocurre un error
        // Muestra el error en la consola
        console.log(e)
        // Envía una respuesta indicando un error interno del servidor
        res.status(500).send(e)
    }
}




// fin RECUPERACION DE CONTRASEÑA PARA INGRESAR....................
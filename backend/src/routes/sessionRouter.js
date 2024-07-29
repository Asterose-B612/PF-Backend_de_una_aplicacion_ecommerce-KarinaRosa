import { Router } from "express";
import passport from "passport";
import { login, register, sessionGithub,current, logout, testJWT, sendEmailPassword, changePassword } from "../controllers/sessionController.js";
//sendEmailPassword, changePassword


// Crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.
const sessionRouter = Router();


// inicio REGISTRO....................

//passport.authenticate: Esta función de Passport se utiliza para autenticar solicitudes. Toma el nombre de una estrategia de Passport como primer argumento y opciones adicionales como segundo argumento.
//'register': nombre de la estrategia de autenticación local Passport que definí para el registro de usuarios.
//{ session: false }: Es una opción que indica que no se debe crear ni mantener una sesión para la autenticación de esta solicitud.  Esto es útil en contextos como el registro, donde no necesitas mantener una sesión persistente después de que el usuario se ha registrado. Es común en las solicitudes de API donde se prefieren tokens (como JWT) en lugar de sesiones tradicionales.
//Esto es típico en el registro, ya que el objetivo principal es crear una cuenta y no autenticar al usuario para una sesión persistente.
sessionRouter.post('/register', passport.authenticate('register', { session: false }), register)
// fin REGISTRO....................


// inicio INICIO DE SESION....................

sessionRouter.post('/login',passport.authenticate('login', { session: false }), login)
//
//fin INICIO DE SESION....................



// inicio RUTA GITHUB....................
// Ruta GET para la autenticación de GitHub de mi usuario, que utiliza Passport.js para iniciar la autenticación utilizando la estrategia 'github' configurada previamente.

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {  })
//el scope de mi aplicacion, es la devolucion del email (user:email). Cuando hago referencia a mi usuario, hago referencia a mi email.
//El usuario en Github va a ser mi email

//LA ANTERIOR ME VA A REDIRECCIONAR AUTOMATICAMENTE A LA SIGUIENTE RUTA CUANDO MI USUARIO SE LOGUEA CORRECTAMENTE
// Ruta GET para manejar la devolución de llamada de autenticación de GitHub, utilizada después de que el usuario haya autorizado la aplicación en GitHub.
//nombre de la estrategis ('github')
sessionRouter.get('/githubSession', passport.authenticate('github'),sessionGithub)

// fin RUTA GITHUB....................






// inicio RUTA CURRENT....................
//consulto si el usuario se logueo correctamente o no
//verifico que esta autenticado con jwt

sessionRouter.get('/current', passport.authenticate('jwt'), current)

// fin RUTA CURRENT....................





// inicio LOGOUT (desloguearse: cerrar sesion)....................

//Definición de la ruta GET '/logout' en el enrutador de sesiones.
sessionRouter.get('/logout', logout);

// fin LOGOUT....................



// inicio RUTA JWT....................

//Configuración de la ruta '/testJWT' en el enrutador 'sessionRouter' para probar la autenticación JWT
//session: fale porque no quiero generar una sesion como tal sino solo testear.
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), testJWT)

// fin RUTA JWT....................




// inicio RECUPERACION DE CONTRASEÑA....................

sessionRouter.post('/sendEmailPassword',sendEmailPassword)


// fin RECUPERACION DE CONTRASEÑA....................



sessionRouter.post('/reset-password/:token', changePassword)




export default sessionRouter;

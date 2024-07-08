import { Router } from "express";
import { getUsers, sendDocuments, deleteInactiveUsers } from "../controllers/userController.js";


/*crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.*/
const userRouter = Router()

//  ↓ DEFINIMOS LAS RUTAS DE MI APLICACIÓN
// de momento definiremos 2, primeros acercamientos


//toda funcion q consulta 1 BDD debe ser async
//ruta get para obtener todos los usuarios en la ruta inicial /
userRouter.get('/', getUsers)

// Ruta para eliminar usuarios inactivos
userRouter.delete('/', deleteInactiveUsers);


userRouter.post('/:uid/documents', sendDocuments)


export default userRouter
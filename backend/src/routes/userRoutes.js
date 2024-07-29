import { Router } from "express";
import { getUsers, sendDocuments, deleteInactiveUsers, getUserById, deleteUserById } from "../controllers/userController.js";


/*crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.*/
const userRouter = Router()

//  ↓ DEFINIMOS LAS RUTAS DE MI APLICACIÓN
// de momento definiremos 2, primeros acercamientos


//toda funcion q consulta 1 BDD debe ser async
//ruta get para obtener todos los usuarios en la ruta inicial /
userRouter.get('/', getUsers)

// Ruta para eliminar usuarios inactivos
userRouter.delete('/', deleteInactiveUsers);

// Ruta para administrador: un usuario
userRouter.get('/:uid', getUserById);

// Ruta para administrador: todos  los usuarios
userRouter.delete('/:uid', deleteUserById);

// Ruta para administrador: eliminacion de 1 usuario
//userRouter.delete('/admin/:id',deleteUsersOneAdmin);


userRouter.post('/:uid/documents', sendDocuments)


export default userRouter
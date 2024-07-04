import { userModel } from "../models/user.js";
import { createRandomUser } from "../mockings.js/mockingUsers.js";

export const getUsers = async (req, res) => {
    //en try consulto los usuarios
    try {
        //en userModel tengo todos los metodos para consultar, eliminar,etc  
        //uso metodo find para traer todos los usuarios de mi aplicacion
        const users = await userModel.find()
        res.status(200).send(users)

    } catch (e) {
        res.status(500).send("Error al consultar usuarios", e)
    }//capturo error con catch 

}




// inicio GENERAR PRODUCTOS ALEATORIOS .........................

export const generateRandomUsers = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(createRandomUser());
    }
    return products;
};

// fin GENERAR PRODUCTOS ALEATORIOS .........................





// inicio ENVIO DOCUMENTOS .........................

//funcion que me devuelva 1 o multiples archivos. Del body me va a llegar una array. En vío un array de datos
export const sendDocuments = async (req, res) => {
    //aca vamos a guardar esos datos 
    try {
        //consulto un id de request
        const { uid } = req.params
        //genero un array newDocs
        const newDocs = req.body
        //consulto el modelo. Aca tomamos como válido de que el usuario existe xq tengo que cargar documentacion de un usuario que exista. Porque 1° creo el usuario y luego la documentacion.
        //findByIdAndUpdate lo uso porque es un metodo PUT . actualizo la informacion. Es un metodo post pero se da tambien como metodo put. Es algo raro 
        //metodo each de Mongo DB para hacer el recorrido del array.
        const user = await userModel.findByIdAndUpdate(uid, {

            $push: {
                documents: {
                    $each: newDocs
                }
            }
            //new en true me devuelve que cuando consulto por el usuario, lo que haga sea devolverme el usuario actualizado
        }, { new: true })
        //me devuelve un usuario
        if (!user) {
            //si no existe
            res.status(404).send("User no existe")
            //si existe puedo ir guardando esta informacion en el nuevo array
        } else {
            //envio el usuario actualizado con los ultimos cambios. Los documentos agregados
            res.status(200).send(user)
        }
    } catch (e) {
        res.status(500).send(e)
    }
}
// fin ENVIO DOCUMENTOS .........................
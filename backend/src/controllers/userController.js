//Se Importa el modelo de usuario desde el archivo user.js
import { userModel } from "../models/user.js";
import { createRandomUser } from "../mockings.js/mockingUsers.js";
//envio de correos
import {sendEmailForDeletion} from '../utils/nodemailer.js';

// inicio OBTENER TODOS LOS USUARIOS SOLAMENTE CON EL CAMPO NAME, EMAIL Y ROL  .........................


// Función para obtener todos los usuarios con nombre, correo y tipo de cuenta
// Se define y exporta una función asincrónica llamada getUsers que se utilizará como un controlador de ruta para manejar las solicitudes GET a /api/users.
// Consultamos la base de datos para obtener todos los usuarios,seleccionando solo los campos 'nombre', 'correo' y 'tipoCuenta' con el método find del modelo userModel para consultar todos los documentos (usuarios) en la colección. (En userModel. tengo todos los metodos para consultar, eliminar,etc;)
// Se utiliza el método await porque find es una operación asincrónica.La palabra clave await se usa para esperar a que una promesa se resuelva. En este caso, estamos esperando a que la consulta a la base de datos se complete antes de continuar con el código. Esto es necesario porque find es una operación asincrónica.
//Aquí, userModel es el modelo de Mongoose que representa a los usuarios en tu base de datos. El método find se usa para buscar documentos en la colección de usuarios. El objeto vacío {} indica que no estamos aplicando ningún filtro, por lo que obtenemos todos los documentos (usuarios) en la colección.
//El segundo argumento de find es una cadena que especifica los campos que queremos seleccionar de cada documento. En este caso, 'name email rol' indica que solo queremos esos campos de cada usuario, los cuales  deben coindcidir con los definidos en el modelo de Mongoose (userModel). Si no coinciden, Mongoose no podrá encontrar esos campos en los documentos y no los incluirá en los resultados.
export const getUsers = async (req, res) => {
    //en try consulto los usuarios
    try {
       
        console.log("Entrando en getUsers");
        //CONSULTO LA BASE DE DATOS
        //usando find para obtener todos los documentos de la colección de usuarios. 
        // El segundo parámetro ('name email rol -_id -cart_id') es una proyección que indica qué campos incluir o excluir:name, email, rol: se incluirán en los resultados.-_id, -cart_id: se excluirán de los resultados.
        const users = await userModel.find({}, 'name email rol -_id -cart_id');
        console.log("Usuarios obtenidos de la base de datos:", users); // Verificar los datos obtenidos
        // Si la consulta es exitosa, enviamos los usuarios en la respuesta con un estado 200 (OK)

        // Mapeamos los resultados para eliminar cart_id de cada usuario. No modifica el array original, devuelve uno nuevo. NO ENCOTRÉ OTRA MANERA DE QUITARLO
        //Aunque se ha excluido cart_id en la proyección, esta línea asegura que solo se devuelvan los campos deseados. Es una medida de seguridad adicional y una práctica común para garantizar que solo se devuelvan los datos necesarios.
        const usersWithoutCartId = users.map(user => {
            return {
                name: user.name,
                email: user.email,
                rol: user.rol
            };
        });
        console.log("Usuarios después de mapear (sin cart_id):", usersWithoutCartId); // Verificar los datos después del mapeo
        //Enviar la lista de usuarios con un código de estado 200 (OK).
        res.status(200).send(usersWithoutCartId)
        // Si ocurre un error durante la consulta, enviamos un mensaje de error con un estado 500 (Internal Server Error) y el mensaje de error
    } catch (e) {
        console.log("Error en getUsers:", e.message); // Verificar si hay un error
        res.status(500).send(`Error al consultar usuarios: ${e.message}`);
    }//capturo error con catch 
}

// fin OBTENER TODOS LOS USUARIOS SOLAMENTE CON EL CAMPO NAME, EMAIL Y ROL  .........................






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
        //ACA DOY POR VALIDO QUE EL USUARIO EXISTE, ya que tengo que cargar la documentacion
        const user = await userModel.findByIdAndUpdate(uid, {
            //METODO DE MONGO DB:OUSH
            $push: {
                //pusheo dentro del array de documentos
                documents: {
                    //METODO DE MONGO DB: each voy recorriendo cada uno de estos nuevos documentos y por cada uno lo voy pusheando
                    $each: newDocs
                }
            }
            //como estoy consultando a la base de datos agrego el atributo new
            //new en true→ lo que hace es que cuando consulto por el usuario, me devuelve el usuario actualizado y me lo devuelve debajo en else↓ (res.status(200).send(user))
        }, { new: true })

        if (!user) {
            //si no existe
            res.status(404).send("User no existe")
            //si existe puedo ir guardando esta informacion en el nuevo array
        } else {
            //envio el usuario actualizado con los "ultimos cambios"→ Los documentos agregados
            res.status(200).send(user)
        }
    } catch (e) {
        res.status(500).send(e)
    }
}
// fin ENVIO DOCUMENTOS .........................






// inicio CARGA DE IMAGENES .........................
//Implemento con módulos de multer para cada uno de estos casos. (src/config/multer.js)
export const imageProds = (req, res) => {

    //
}

// fin CARGA DE IMAGENES .........................




// inicio ELIMINAR USUARIOS INACTIVOS .........................

// Función para eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res) => {
    try {
         // Calcula la fecha límite, que es 2 días atrás desde el momento actual
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Encuentra usuarios inactivos
           // Busca usuarios cuya última conexión sea anterior a la fecha límite
        const inactiveUsers = await userModel.find({ last_connection: { $lt: twoDaysAgo } });

        // Elimina usuarios inactivos y envía un correo
            // Itera sobre los usuarios inactivos encontrados
        for (const user of inactiveUsers) {
             // Elimina el usuario de la base de datos por su ID
            await userModel.findByIdAndDelete(user._id);

            // Envía un correo notificando la eliminación
            await sendEmailForDeletion(user.email);
        }
 // Envía una respuesta al cliente con el número de usuarios eliminados
        res.status(200).send(`${inactiveUsers.length} usuarios inactivos eliminados.`);
    } catch (e) {
            // Maneja cualquier error que ocurra durante el proceso
        console.error('Error al eliminar usuarios inactivos:', e.message);
        res.status(500).send(`Error al eliminar usuarios inactivos: ${e.message}`);
    }
};

// fin ELIMINAR USUARIOS INACTIVOS .........................




// inicio ELIMINAR UN USUARIO X SU ID .........................


export const deleteUserById = async (req, res) => {
    try {
        const user = await user.findByIdAndDelete(req.params.uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Enviar correo al usuario eliminado (opcional, requiere configuración de correo)
        // sendEmail(user.email, 'Tu cuenta ha sido eliminada', 'Tu cuenta ha sido eliminada por inactividad.');

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
};

// fin ELIMINAR UN USUARIO X SU ID .........................
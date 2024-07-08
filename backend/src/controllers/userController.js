//Se Importa el modelo de usuario desde el archivo user.js
import { userModel } from "../models/user.js";
import { createRandomUser } from "../mockings.js/mockingUsers.js";






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
     
        const users = await userModel.find({}, 'name email rol -_id -cart_id');
        // Si la consulta es exitosa, enviamos los usuarios en la respuesta con un estado 200 (OK)



        // Mapeamos los resultados para eliminar cart_id de cada usuario. No modifica el array original, devuelve uno nuevo
        const usersWithoutCartId = users.map(user => {
            return {
                name: user.name,
                email: user.email,
                rol: user.rol
            };
        });

        res.status(200).send(usersWithoutCartId)
        // Si ocurre un error durante la consulta, enviamos un mensaje de error con un estado 500 (Internal Server Error) y el mensaje de error
    } catch (e) {
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
        const user = await userModel.findByIdAndUpdate(uid, {

            $push: {
                //pusheo dentro del array de documentos
                documents: {
                    //con el each voy recorriendo cada uno de estos nuevos documentos y por cada uno lo voy pusheando
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

export const imageProds = (req, res) => {

    //
}



// fin CARGA DE IMAGENES .........................








// inicio GENERAR PRODUCTOS ALEATORIOS .........................

export const deleteInactiveUsers = () => {
    console.log("usuario eliminado")

};

// fin GENERAR PRODUCTOS ALEATORIOS .........................
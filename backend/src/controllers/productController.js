//MANEJO DE PRODUCTOS en una base de datos utilizando un ORM  (Object-Relational Mapping) como Mongoose en Node.js.


// Importa el modelo de producto desde el archivo product.js en la carpeta models
import productModel from "../models/product.js";
import { createRandomProduct } from '../mockings.js/mockingProducts.js';
//import { authenticateToken } from '../utils/jwt.js';


// inicio OBTENER PRODUCTOS..............................
export const getProducts = async (req, res) => {
    //console.log(req)
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });

        res.status(200).send(prods)
        console.log(prods)

    } catch (e) {
        res.status(500).send(`Error interno del servidor`, e)
    }
}

/*
export const getProducts = async (limit, page, filter, sort) => {
    console.log (req)

    try {
        // Paso 2: Construye el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
        const query = filter ? (filter === 'true' || filter === 'false' ? { status: filter } : { category: filter }) : {};
        // Paso 3: Construye el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'sort' como dirección de ordenamiento.
        const sortQuery = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
        // Paso 4: Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
        const options = { limit: parseInt(limit), page: parseInt(page), sort: sortQuery };

        // Paso 5: Realiza la consulta a la base de datos utilizando el modelo de producto y los criterios de búsqueda.
        const products = await productModel.paginate(query, options);

        // Paso 5: Calcula si hay páginas previas y siguientes.
        const prevPage = products.prevPage ? parseInt(page) - 1 : null;
        const nextPage = products.nextPage ? parseInt(page) + 1 : null;

        return products

    } catch (error) {
        // Si ocurre un error, devuelve un objeto de error con un código de estado 500.
        return { error: error };
    }
}*/
// inicio OBTENER PRODUCTOS..............................



// inicio OBTENER UN PRODUCTO..............................

export const getProduct = async (req, res) => {
    try {
        const idProducto = req.params.pid //Todo dato que se consulta desde un parametro es un string
        const prod = await productModel.findById(idProducto)
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto no existe")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
}// fin OBTENER PRODUCTO..............................


// inicio CREAR PRODUCTO .........................

// Exporta la función asíncrona "createProduct" que maneja la creación de un nuevo producto.
export const createProduct = async (req, res) => {
    // Imprime en la consola la información del usuario que realiza la solicitud.
    console.log(req.user)
    // Imprime en la consola el rol del usuario.
    console.log(req.user.rol)
    
    try {
        // Verifica si el rol del usuario es "Admin".
        if (req.user && req.user.rol === "admin") {
            // Obtiene los datos del producto del cuerpo de la solicitud.
            const product = req.body
            // Utiliza el modelo de producto para crear un nuevo producto en la base de datos y guarda el mensaje de respuesta.
            const mensaje = await productModel.create(product)
            // Envía una respuesta exitosa con el mensaje de creación del producto.
            res.status(201).send(mensaje)
        } else {
            // Si el usuario no es "Admin", envía una respuesta de no autorizado.
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        // Si ocurre un error, envía una respuesta de error del servidor con el mensaje del error.
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
}

// fin CREAR PRODUCTO .........................


/*


// inicio CREAR PRODUCTO .........................

//export const createProduct define una función llamada createProduct que se exporta como una constante. Esto permite que la función sea importada y utilizada en otros archivos.
export const createProduct = async (req, res) => {
    // Esta línea imprime el objeto req.user en la consola. Se asume que req.user contiene información del usuario que ha hecho la solicitud, como su rol y otros detalles. Esto es útil para depurar.
    console.log(req.user)
    console.log(req.user.rol)
    
    // Manejo de Excepciones
    // Si algo sale mal en el bloque try, el control se transfiere al bloque catch.
    try {
        // verificación de rol de usuario (if (req.user.rol == "Admin")) para permitir solo a los administradores crear productos. Si el usuario no es un administrador, respondería con un estado 403 (Prohibido)
        if (req.user && req.user.rol === "admin") {
            // const product = req.body obtiene el cuerpo de la solicitud. (req.body), que debe contener los datos del producto que se va a crear.
            const { title, description, price, code, stock, category } = req.body
            const thumbnail = req.file;
            // Verificar que todos los campos requeridos estén presentes
            if (!title || !description || !price || !code || !stock || !category) {
                return res.status(400).json({
                    status: "error",
                    message: "Faltan campos obligatorios"
                });
            }
            
            // const newProduct = await productModel.create(product) usa await para esperar la resolución de la promesa devuelta por productModel.create(product). Esta función probablemente guarda el producto en una base de datos y devuelve una respuesta.
            const newProduct = await productModel.create(product)
            
            // Si la creación del producto es exitosa, responde con un estado 201 (Creado) y envía el mensaje de confirmación.
            res.status(201).json({
                status: "success",
                message: "Producto creado con éxito",
                data: newProduct
            });
        } else {
            res.status(403).json({
                status: "error",
                message: "Usuario no autorizado"
            });
        }
    } catch (error) {
        // res.status(500).send(`Error interno del servidor al crear producto: ${error}`): Si ocurre un error, responde con un estado 500 (Error Interno del Servidor) y envía un mensaje detallando el error.
        res.status(500).send(`Error interno del servidor al crear producto: ${error.message}`)
    }
}; // fin CREAR PRODUCTO

*/

// inicio ACTUALIZAR PRODUCTO EXISTENTE..........................................

export const updateProduct = async (req, res) => {
    try {
        if (req.user && req.user.rol === "admin") {
            const idProducto = req.params.pid
            const updateProduct = req.body

            const updatedProduct = await productModel.findByIdAndUpdate(idProducto, updateProduct, { new: true });


         if (!updatedProduct) {
                return res.status(404).json({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }

            res.status(200).json({
                status: "success",
                message: "Producto actualizado con éxito",
                data: updatedProduct,
                rol: req.user.rol
            });
        } else {
            res.status(403).json({
                status: "error",
                message: "Usuario no autorizado"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: `Error interno del servidor al actualizar producto: ${error.message}`
        });
    }
};// fin ACTUALIZAR PRODUCTO EXISTENTE..........................................





// inicio ElIMINAR PRODUCTO EXISTENTE x su id .........................

export const deleteProduct = async (req, res) => {
    try {
        console.log(req.user.rol)
        // Verifica el rol del usuario autenticado
        if (req.user && req.user.rol === "admin") {
            const idProducto = req.params.pid
            const mensaje = await productModel.findByIdAndDelete(idProducto)

            // Verifica si el producto fue encontrado y eliminado
            if (!mensaje) {
                return res.status(404).json({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }
            // Responde con éxito si la eliminación fue exitosa
            res.status(200).json({
                status: "success",
                message: "Producto eliminado con éxito",
                data: mensaje,
                rol: req.user.rol
            });
        } else {
            res.status(403).json({
                status: "error",
                message: "Usuario no autorizado"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: `Error interno del servidor al eliminar producto: ${error.message}`
        });
    }
};// fin ElIMINAR PRODUCTO EXISTENTE x su id .........................



// inicio GENERAR PRODUCTOS ALEATORIOS .........................

export const generateRandomProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(createRandomProduct());
    }
    return products;
};// inicio GENERAR PRODUCTOS ALEATORIOS .........................

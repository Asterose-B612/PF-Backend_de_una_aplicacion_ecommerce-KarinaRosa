// Importa el modelo 'cartModel' desde el archivo '../models/cart.js'
import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";
import crypto from 'crypto';
import { isValidObjectId } from 'mongoose'; 

//*******inicio OBTENER UN CARRITO POR SU ID******************

// Función asíncrona para obtener un carrito por su ID
export const getCart = async (req, res) => {
    try {
        // Obtiene el ID del carrito desde los parámetros de la solicitud
        const cartId = req.params.cid;
        // Busca un carrito en la base de datos por su ID
//agregado extra de validacion desde Mongo Db
        if (!isValidObjectId(cartId)) {
            return res.status(400).send('ID de carrito inválido');
        }

        const cart = await cartModel.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Envía el carrito encontrado como respuesta al cliente con un código de estado 200 (OK)
        res.status(200).send(cart);
    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
}

//*******fin OBTENER UN CARRITO POR SU ID******************





//  inicio CREAR CARRITO VACÍO******************

// Función asíncrona para crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        // Crea un nuevo carrito con un array de productos vacío
        const mensaje = await cartModel.create({ products: [] });
        // Envía un mensaje de confirmación al cliente con un código de estado 201 (Created)
        res.status(201).send(mensaje);
    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`);
    }
}//  fin CREAR CARRITO VACÍO******************



//CODIGO PROFESOR

// inicio INSERTAR PRODUCTO EN CARRITO***********
// Función asíncrona para insertar un producto en un carrito
export const insertProductCart = async (req, res) => {
    try {
        // Verifica si el usuario tiene permisos de 'User'
        if(req.user && (req.user.rol === "User" || req.user.rol === "premiun")) {
            // Obtiene el ID del carrito y el ID del producto desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;


            // Validar cartId y productId
            if (!isValidObjectId(cartId)) {
                return res.status(400).send('ID de carrito inválido');
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send('ID de producto inválido');
            }



            // Obtiene la cantidad del producto desde el cuerpo de la solicitud
            const { quantity } = req.body;
            // Busca el carrito en la base de datos por su ID
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }


            // Encuentra el índice del producto en el carrito
            const indice = cart.products.findIndex(product => product.id_prod == productId);

            //product.id_prod.toString() == productId); El .toString

            // Si el producto ya está en el carrito, actualiza la cantidad
            if (indice !== -1) {
                cart.products[indice].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, lo añade con la cantidad especificada
                cart.products.push({ id_prod: productId, quantity: quantity });
            }
            // Actualiza el carrito en la base de datos con los cambios realizados
            //Actualizar solo el campo products evita sobrescribir campos importantes que podrían ser necesarios para la sesión del usuario, evitando así problemas que podrían llevar a un comportamiento errático o a la eliminación de datos como el token.Impacto en el Token: Si la actualización incorrecta afecta a los datos relacionados con el usuario (como el estado de sesión), podría provocar que el usuario sea desconectado o que el token se vuelva inválido, resultando en un loop de reautenticación.
            console.log('Cart before update:', cart);
            const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });
            console.log('Updated Cart:', updatedCart);

            // Envía un mensaje de confirmación al cliente con un código de estado 200 (OK)
            res.status(200).send(updatedCart);
        } else {
            // Si el usuario no tiene permisos de 'User', envía un mensaje de error al cliente con un código de estado 403 (Forbidden)
            res.status(403).send("Usuario no autorizado");
        }

    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        console.error('Error updating cart:', error);
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error.message}`);
    }
}





/*

//CODIGO KARINA

// inicio INSERTAR PRODUCTO EN CARRITO***********

// Función asíncrona para insertar un producto en un carrito
export const insertProductCart = async (req, res) => {
    try {
        // Verifica si el usuario tiene permisos de 'User'
        if (req.user && req.user.rol === "User"|| req.user && req.user.rol === "premiun" ) {
            // Obtiene el ID del carrito y el ID del producto desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;
            // Obtiene la cantidad del producto desde el cuerpo de la solicitud
            const { quantity } = req.body;
            // Busca el carrito en la base de datos por su ID
            const cart = await cartModel.findById(cartId);

            //findById(cartId);

             // Verifica si el carrito fue encontrado
             if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }

            // Encuentra el índice del producto en el carrito
            const indice = cart.products.findIndex(product => product.id_prod.toString() === productId);
            // Si el producto ya está en el carrito, actualiza la cantidad
            //+= asegura de que se está sumando la cantidad en lugar de sobrescribirla si el producto ya está en el carrito.
            if (indice !== -1) {
                cart.products[indice].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, lo añade con la cantidad especificada
                cart.products.push({ id_prod: productId, quantity: quantity });
            }
 // Guarda los cambios en la base de datos
 //const mensaje = await cart.save();
            // Actualiza el carrito en la base de datos con los cambios realizados
          const updatedCart = await cartModel.findByIdAndUpdate(cart._id, cart, { new: true });
            // Envía un mensaje de confirmación al cliente con un código de estado 200 (OK)
            res.status(200).json(updatedCart);
        } else {
            // Si el usuario no tiene permisos de 'User', envía un mensaje de error al cliente con un código de estado 403 (Forbidden)
            res.status(403).json({ message: "Usuario no autorizado" });
        }

    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).json({ message: `Error interno del servidor al crear producto: ${error.message}` });
    }
}// fin INSERTAR PRODUCTO EN CARRITO***********

*/




// inicio CREAR TICKET DE COMPRA***********

// Función asíncrona para crear un ticket de compra
export const createTicket = async (req, res) => {
    try {
        // Obtiene el ID del carrito desde los parámetros de la solicitud
        const cartId = req.params.cid;
        // Busca el carrito en la base de datos por su ID
        const cart = await cartModel.findById(cartId);
        // Inicializa un array para almacenar los productos sin stock
        const prodSinStock = [];
        // Verifica si el carrito existe
        if (cart) {
            // Itera sobre los productos del carrito usando un bucle for...of para manejar correctamente las promesas
            for (const prod of cart.products) {
                // Busca el producto en la base de datos por su ID
                let producto = await productModel.findById(prod.id_prod);
                // Verifica si hay suficiente stock del producto en el inventario
                if (producto.stock < prod.quantity) {
                    // Si no hay suficiente stock, agrega el producto a la lista de productos sin stock
                    prodSinStock.push(producto);
                }
            }
        }else {
              // Si el carrito no existe, envía un mensaje de error al cliente con un código de estado 404 (Not Found)
              return res.status(404).send("Carrito no existe");
        }

        // Si no hay productos sin stock, finaliza la compra
        if (prodSinStock.length === 0) {
            // Calcula el precio total de los productos en el carrito
            // reduce() recorre el array de productos y acumula el resultado de la multiplicación del precio y la cantidad de cada producto
            /*const totalPrice = cart.products.reduce((a, b) => (a.price * a.quantity) + (b.price * b.quantity), 0);*/
            const totalPrice = cart.products.reduce((total, prod) => {
                return total + (prod.quantity * prod.price);
            }, 0);


            // Genera un nuevo ticket
            const newTicket = await ticketModel.create({
                // code: genera un identificador único para el ticket usando la función randomUUID() de crypto
                code: crypto.randomUUID(),
                // purchaser: almacena el correo electrónico del usuario que realiza la compra, obtenido de req.user.email
                purchaser: req.user.email,
                // amount: asigna el totalPrice calculado anteriormente como el monto total del ticket
                amount: totalPrice,
                // products: incluye el array de productos del carrito en el ticket
                products: cart.products
            });

            // Responde al cliente con el nuevo ticket y un código de estado 200 (OK)
            res.status(200).send(newTicket);
        } else {
            // Si hay productos sin stock, retorna la lista de productos sin stock al cliente
      
  
        // Si el carrito no existe, envía un mensaje de error al cliente con un código de estado 404 (Not Found)
        res.status(400).send({ 
            message: "Algunos productos no tienen suficiente stock", 
            products: prodSinStock 
        })
 }
    } catch (e) {
    // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
    res.status(500).send(`Error interno del servidor al crear ticket: ${e.message}`);
}
}
// fin CREAR TICKET DE COMPRA***********
// Importa la clase Router desde el módulo 'express'
import { Router } from "express";
import passport from "passport";
import { createCart, getCart, insertProductCart, createTicket } from "../controllers/cartController.js";


// Se crea una nueva instancia de Router para manejar las rutas relacionadas con el carrito.
const cartRouter = Router()




// inicio CREAR CARRITO VACÍO******************
//ruta para Postman: api/cart
cartRouter.post('/', createCart)
// fin CREAR CARRITO VACÍO******************



// inicio OBTENER UN CARRITO POR SU ID******************

//ruta para Postman: api/cart/idDelCarrito
cartRouter.get('/:cid', getCart)
// fin OBTENER UN CARRITO POR SU ID******************





// inicio AGREGAR UN PRODUCTO A UN CARRITO ESPECÍFICO***********

/// Se espera el ID del carrito (:cid) y el ID del producto (:pid) como parámetros en la URL. Utiliza el middleware de autenticación JWT para verificar la identidad del usuario. Luego, llama a la función 'insertProductCart' para insertar el producto en el carrito.
cartRouter.post('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), insertProductCart);

// fin AGREGAR UN PRODUCTO A UN CARRITO ESPECÍFICO***********



// inicio REALIZAR LA COMPRA DE UN CARRITO***********

// Se espera el ID del carrito (:cid) como parámetro en la URL. Llama a la función 'createTicket' para crear un ticket de compra basado en el contenido del carrito.
cartRouter.post('/:cid/purchase', createTicket);

// fin REALIZAR LA COMPRA DE UN CARRITO***********





//*****ELIMINAR DEL CARRITO EL PRODUCTO SELECCIONADO, BUSCAR Y ACTUALIZAR CARRITO EN LA BASE DE DATOS****** */

//Postman: http://localhost:8000/api/cart/idCARRITO/products/idPRODUCTO


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
         // Paso 1: Obtener el ID del carrito y del producto desde los parámetros de la solicitud.     
        const { cid, pid } = req.params;
        // Paso 2: Eliminar el producto del carrito en la base de datos.
        const cart = await cartModel.findById(cid);
        console.log("Product IDs in cart:", cart.products.map(p => p.id_prod.toString()));
        console.log("Product ID to remove:", pid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');            
        }

      // Filtrar los productos del carrito, excluyendo el producto con el ID proporcionado.
          cart.products = cart.products.filter(product => product.id_prod.toString() !== pid);
        // Guarda los cambios en el carrito
        await cart.save();
        res.status(200).send("Producto eliminado del carrito correctamente");
    } catch (error) {
        // Manejar errores y enviar respuesta con código 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
});






//*******ACTUALIZAR EL CARRITO CON UN ARREGLO DE PRODUCTOS ****************

//Postman: http://localhost:8000/api/cart/6600bdefb9ce7ff643b57ae0


//LA SIGUIENTE RUTA ESTA DESTINADA PARA HACER PRÁCTICAS, PARA PODER MODIFICAR MI CARRITO HACIENDO PEQUEÑOS TEST SIN TENER QUE ESTAR VIENDO ELEMENTO A ELEMENTO, UNO X UNO. DIRECTAMENTE ENVÍO UN ARRAY DE OBJETOS EN EL BODY A MODIFICAR Y LISTO.
//NO VA A SER USADA EN PRODUCCION, SÍ EN TESTING


//Esta ruta debe aceptar un parámetro en la URL :cid para el ID del carrito y recibir el arreglo de productos en el cuerpo de la solicitud.
cartRouter.put('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito de la URL
        const cartId = req.params.cid;
        // Obtener el arreglo de productos del cuerpo de la solicitud
        const newProducts = req.body.products;
        // Actualizar el carrito con el nuevo arreglo de productos
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: newProducts });
        // Enviar el carrito actualizado como respuesta
        res.status(200).send(updatedCart);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }
})





//***ACTUALIZAR SOLO LA CANTIDAD PASADA POR REQ.BODY DE EJEMPLARES DE UN PRODUCTO EN EL CARRITO***********}

// Postman: http://localhost:8000/api/cart/6600bdefb9ce7ff643b57ae0/products/6600c1fbf3e844d2ffeb122d


cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        // Obtener el ID del carrito de la URL con req.params
        const cartId = req.params.cid;
        // Obtener el ID del producto de la URL con req.params
        const productId = req.params.pid;
        // Obtener la nueva cantidad del cuerpo de la solicitud
        const { quantity } = req.body;
        // Utiliza el método findOneAndUpdate para buscar y actualizar un documento en la colección de carritos
        const updatedCart = await cartModel.findOneAndUpdate(
            // LacCondición de la búsqueda: busca un carrito con el ID proporcionado y que contenga un producto con el ID igual a productId  
            { _id: cartId, "products._id": productId },
            // Objeto de actualización: establece la nueva cantidad del producto en el carrito con el valor proporcionado en quantity.Uso del operador Set en Mongo DB para cambiar el valor de un campo existente o agregar un campo si no existe previamente en el documento.
            //products.$.quantity:especificar el campo que queremos actualizar. products.$.quantity indica que queremos actualizar el campo quantity dentro de un objeto products que coincide con la condición de búsqueda. quantity: Es el nuevo valor que queremos establecer en el campo quantity
            //$set se utiliza aquí para actualizar el campo quantity del producto encontrado en el carrito con el nuevo valor proporcionado en quantity
            { $set: { "products.$.quantity": quantity } },
            // Opciones de configuración:
            // Devuelve el documento actualizado después de la actualización
            { new: true }
        );
        // Verificar si se encontró el carrito y se actualizó correctamente
        if (!updatedCart) {
            return res.status(404).send('Carrito no encontrado o producto no actualizado');
        }

        // Envio el carrito actualizado como respuesta
        res.status(200).send(updatedCart);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }
})







//*****ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO****

// Postman: http://localhost:8000/api/cart/6601074172db673d48801f5b


cartRouter.delete('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito de la URL con req.params
        const cartId = req.params.cid;

        // Actualizar el carrito para eliminar todos los productos
        //findByIdAndUpdate para buscar el carrito por su ID y actualizarlo con un array vacío en el campo products, eliminando así todos los productos del carrito.
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] });

        // Si todo ok, envío el carrito actualizado como respuesta con el código de estado 200 
        res.status(200).send(updatedCart);

    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al eliminar todos los productos del carrito: ${error}`);
    }
});








//********VISUALIZAR UN CARRITO ESPECIFICO*****

// Postman: http://localhost:8000/api/cart/6600d79d11d768c8832c7d51


cartRouter.get('/:cid', async (req, res) => {

    try {
        // Obtiene el ID del carrito de los parámetros de la URL con req,params
        const cartId = req.params.cid;
        // Busca el carrito en la BD por su ID, y utiliza populate para obtener los detalles de los productos asociados al carrito
        const cart = await cartModel.findById(cartId).populate('products.id_prod');
        // Renderiza la vista 'cart.hbs' con los datos del carrito
        res.render('templates/cart', { cart });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al obtener el carrito específico: ${error}`);
    }
});


// Exporta el router cartRouter para su uso en otras partes de la aplicación.
export default cartRouter;



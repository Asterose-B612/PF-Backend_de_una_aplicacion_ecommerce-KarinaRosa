import { Router } from "express";
import passport from "passport";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";


//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter
const productsRouter = Router();




//********METDOS GET: limit, page, sort asc/desc, query (filter)***************

//Pruebas en Postman:http://localhost:8000/api/products?limit=2&page=1&sort=asc&filter=Smartphone

// OBTENER TODOS LOSPRODUCTOS  .............
productsRouter.get('/', getProducts)
// OBTENER UN  PRODUCTO  .............
productsRouter.get('/:pid', getProduct)
// CREAR PRODUCTO .........................
productsRouter.post('/',passport.authenticate('jwt', { session: false }), createProduct)
// inicio ACTUALIZAR PRODUCTO EXISTENTE..........................................
productsRouter.put('/:pid', passport.authenticate('jwt', { session: false }), updateProduct)
// inicio ElIMINAR PRODUCTO EXISTENTE x su id .........................
productsRouter.delete('/:pid', passport.authenticate('jwt', { session: false }), deleteProduct)


export default productsRouter

import multer from 'multer';
import { __dirname } from "../path.js";

//CONFIGURACIONES PARA ALMACENAMIENTOS DE IMAGENES DE ....
//PRODUCTOS
const STORAGEPRODUCTS = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        //Trabajo con una funcion.  Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, `${__dirname}/public/img/products`)
        console.log(__dirname);

        //null no hubo error y ruta donde alojo las imagenes
    },
    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, callback) => {

        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Generar un nombre único
        callback(null, file.fieldname + '-' + uniqueSuffix); // Nombre del archivo

        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
       // cb(null, `${Date.now()}${file.originalname}`);
    }
});

//NOTA: Los productos van a estar con el nombre original y con la fecha


//DOCUMENTS
const STORAGEDOCS = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        //Trabajo con una funcion.  Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, `${__dirname}/public/img/docs`)
        //null no hubo error y ruta donde alojo las imagenes
    },

    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, callback) => {
        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
        callback(null, `${file.originalname}`);
    }
});

//NOTA: //Los productos estaran con el nombre original y con la fecha pero con documentos la fecha no me sirve xq voy a requerir que sea el nombre de un usuario.  ver video 4°practica integradora 01:37:03

//PROFILES
const STORAGEPROFILES = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        //Trabajo con una funcion.  Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, `${__dirname}/public/img/profiles`)
        //null no hubo error y ruta donde alojo las imagenes
    },
    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, cb) => {
        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
        callback(null, `${file.originalname}`);
    }
});

//NOTA: Para los perfiles sucede lo mismo que con documents. Iría con el nombre de usuario.

// Genera un objeto que configura Multer con la opción de almacenamiento definida
export const uploadProducts = multer({ storage: STORAGEPRODUCTS });
export const uploadDocs = multer({ storage: STORAGEDOCS });
export const uploadPerfs = multer({ storage: STORAGEPROFILES });

// Exporta el objeto configurado de Multer para su uso en otros módulos
//export default upload;

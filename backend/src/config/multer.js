import multer from 'multer';
import { __dirname } from "../path.js";



// Configuración para el almacenamiento de imágenes
const STORAGEPRODUCTS = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        //Trabajo con una funcion.  Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, `${__dirname}/public/img/products`)
        //null no hubo error y ruta donde alojo las imagenes
    },

    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, cb) => {
        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
        cb(null, `${Date.now()}${file.originalname}`);
    }
});





// Configuración para el almacenamiento de imágenes
const STORAGEDOCS = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        //Trabajo con una funcion.  Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, `${__dirname}/documents`)
        //null no hubo error y ruta donde alojo las imagenes
    },

    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, cb) => {
        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
        cb(null, `${file.originalname}`);
    }
});






// Configuración para el almacenamiento de imágenes
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
        cb(null, `${file.originalname}`);
    }
});


// Genera un objeto que configura Multer con la opción de almacenamiento definida
export const uploadProducts = multer({ storage: STORAGEPRODUCTS });
export const uploadDocs = multer({ storage: STORAGEDOCS });
export const uploadPerfs = multer({ storage: STORAGEPROFILES });




// Exporta el objeto configurado de Multer para su uso en otros módulos
//export default upload;

//bcryt me va permitir la encriptacion  de la contraseña. Generar un archivo de configuración que lo que haga sea consultar la contraseña ingresada por el usuario 1234, la transforme en esa contraseña encriptada, la guarde en la BDD  y cuando me quiera loguear  consulte la contraseña encriptada y directamente pieda comparar “compare”

import bcrypt from 'bcrypt'
import varenv from '../dotenv.js'



//genero los 2 modulos que necesito:

//1- es EL HASHEO DE LA CONTRASEÑA

//Como parametro me pide el pass
//.hasSync es para hashear  la contraseña del usuario que envio como parametro
//Para encriptar la contraseña necesito un Salt: es la forma de definir el prcoeso de hasheo. Es el costo de procesar los datos. Cunato va a costar encriptar esta contraseña. Por defecto 10. Mientras mas alto el numero mas cuesta procesarlo, mas segura seria esa contraseña porque costaria mas tiempo desencriptarlo. A eso hace referencia el Salt.

/*
export const createHash = (password) => {
    const saltRounds = varenv.salt; // Asegúrarse de que este valor sea un número
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);/*
};*/
//bcrypt.genSaltSync(varenv.salt): Genera un salt con el número de rondas especificado por varenv.salt. En este caso, varenv.salt debería ser un número entero (como 12) que define cuántas rondas de hashing se aplican.
//bcrypt.hashSync(password, salt): Hashea la contraseña usando el salt generado.
 export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varenv.salt))


//pruebo el hasheo
//console.log(createHash("coderhouse"))

//pruebo la validacion
//let passEncript= createHash("coder")
//console.log(passEncript)


//2- es VALIDAD CONTRASEÑA

//En parametros ingreso (contraseña enviada x usuario sin encriptar, contraseña encriptada de la BDD) => comparo la cotraseña que me enviaron con .comprareSync
//bcrypt.compareSync(passwordSend, passwordBdd): Compara una contraseña sin encriptar con una encriptada almacenada para verificar la autenticidad.
export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd)

//paso por parametro la contraseña y la encriptada
//console.log(validatePassword("coderhouse",passEncript))
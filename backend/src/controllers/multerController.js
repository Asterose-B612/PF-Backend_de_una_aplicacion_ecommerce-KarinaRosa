

import productModel from "../models/product.js";

export const insertImg = async (req, res) => {
    try {
        const { file } = req;
        const { productId } = req.body; // Suponiendo que estás enviando el ID del producto en el cuerpo de la solicitud
        //console.log(req)

        if (!file) {
            return res.status(400).send("No se encontró el archivo de imagen");
        }

        if (!productId) {
            return res.status(400).send("No se encontró el ID del producto");
        }

        // Actualiza el producto con la referencia a la imagen
        const updatedProduct = await productModel.findByIdAndUpdate(productId, { thumbnail: file.filename }, { new: true });

        if (!updatedProduct) {
            return res.status(404).send("Producto no encontrado");
        }

        res.status(200).send("Imagen cargada correctamente y producto actualizado");
    } catch (e) {
        console.error(e);
        res.status(500).send("Error al cargar imagen")
    }
};





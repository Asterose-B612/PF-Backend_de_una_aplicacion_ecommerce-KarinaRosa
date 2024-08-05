// Espera a que el contenido del DOM se haya cargado completamente antes de ejecutar el código
document.addEventListener("DOMContentLoaded", async () => {
    // Obtener el cartId desde el Local Storage
    const cartId = localStorage.getItem('cartId');

    // Verificar si se ha encontrado un cartId en el Local Storage
    if (cartId) {
        console.log('Cart ID from local storage:', cartId); // Mostrar el cartId en la consola
        fetchCart(cartId); // Llamar a la función para obtener el carrito usando el cartId
    } else {
        console.error('No cart ID found in local storage'); // Informar si no se encuentra el cartId
    }

    // Función para obtener el carrito desde el backend
    async function fetchCart(cartId) {
        // Antes de realizar la solicitud fetch para obtener el carrito
        console.log('Fetching cart with ID:', cartId); // Mostrar el ID del carrito que se está buscando

        try {
            // Realizar la solicitud GET para obtener el carrito desde el backend
            const response = await fetch(`http://localhost:8000/api/cart/${cartId}`);

            // Verificar si la respuesta es correcta
            if (response.ok) {
                const cart = await response.json(); // Convertir la respuesta a formato JSON
                // Después de recibir la respuesta del carrito
                console.log('Cart response:', cart); // Mostrar el carrito en la consola

                // Mostrar los productos del carrito y actualizar el resumen del carrito
                displayCartItems(cart);
                updateCartSummary(cart);
            } else {
                console.error("Error al obtener el carrito:", response.statusText); // Informar sobre errores de respuesta
            }
        } catch (error) {
            console.error("Fetch error:", error); // Informar sobre errores en la solicitud fetch
        }
    }

    // Función para mostrar los items del carrito en el HTML
    function displayCartItems(cart) {
        const cartItemsContainer = document.getElementById("cart-items"); // Obtener el contenedor de los items del carrito

        cartItemsContainer.innerHTML = ''; // Limpiar el contenido previo del contenedor

        // Iterar sobre los productos del carrito y crear elementos HTML para cada uno
        cart.products.forEach(product => {
            console.log('Product in Cart:', product); // Verificar cada producto en la consola
            console.log(`Producto: ${product.id_prod.title}, Precio: ${product.id_prod.price}, Cantidad: ${product.quantity}`); // Mostrar detalles del producto
            if (!product.id_prod.price) {
                console.log('Precio no definido para el producto:', product); // Verificar si el precio está definido
            }

            // Crear un nuevo elemento para el producto
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item"; // Asignar la clase CSS al nuevo elemento

            // Configurar el contenido HTML del nuevo elemento
            cartItemDiv.innerHTML = `
                <div class="item-details">
                    <h3>${product.id_prod.title}</h3>
                    <p>${product.id_prod.description}</p>
                    <p>Precio: $ ${product.id_prod.price}</p>
                    <p>Cantidad: ${product.quantity}</p>
                    <button class="btn-remove" data-product-id="${product.id_prod._id}">Eliminar</button>
                </div>
            `;
            // Agregar el nuevo elemento al contenedor
            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Agregar eventos a los botones de eliminar
        cartItemsContainer.querySelectorAll('.btn-remove').forEach(button => {
            // Añadir un listener de clic que llama a confirmRemoveProduct con el ID del producto
            button.addEventListener('click', () => confirmRemoveProduct(button.dataset.productId));
        });
    }

    // Función para actualizar el resumen del carrito
    function updateCartSummary(cart) {
        const summaryDetails = document.getElementById("summary-details"); // Obtener el contenedor del resumen

        // Calcular subtotal, envío y total
        console.log('Calculating cart summary with products:', cart.products); // Mostrar los productos para el cálculo del resumen

        // Calcular subtotal basado en los precios y cantidades de los productos
        const subtotal = cart.products.reduce((total, product) => total + product.id_prod.price * product.quantity, 0);
        const shipping = 10; // Costo de envío fijo
        const total = subtotal + shipping; // Calcular el total sumando el subtotal y el envío

        // Mostrar el resumen en el HTML
        console.log('Cart summary - Subtotal:', subtotal, 'Shipping:', shipping, 'Total:', total); // Mostrar el resumen en la consola

        // Configurar el contenido HTML del resumen
        summaryDetails.innerHTML = `
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Envío: $${shipping.toFixed(2)}</p>
            <p>Total: $${total.toFixed(2)}</p>
        `;
    }

    // Función para eliminar un producto del carrito
    async function confirmRemoveProduct(productId) {
        // Antes de eliminar un producto del carrito
        console.log('Antes de eliminarlo, Removing product with ID:', productId); // Mostrar el ID del producto que se va a eliminar

        try {
            // Realizar la solicitud DELETE para eliminar el producto del carrito
            const deleteResponse = await fetch(`http://localhost:8000/api/cart/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', // Tipo de contenido de la solicitud
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Token de autenticación para la solicitud
                },
                credentials: 'include' // Incluir cookies en la solicitud
            });

            // Verificar si la respuesta es correcta
            if (deleteResponse.ok) {
                // Después de la respuesta de eliminación de producto
                console.log('Product removed, fetching updated cart'); // Mostrar mensaje de éxito en la consola
                fetchCart(cartId); // Volver a obtener el carrito actualizado

                // Mostrar mensaje de éxito usando SweetAlert
                Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');

            } else {
                console.error("Error al eliminar el producto:", deleteResponse.statusText); // Informar sobre errores de eliminación
            }
        } catch (error) {
            console.error("Error en la solicitud:", error); // Informar sobre errores en la solicitud fetch
        }
    }

    // Manejar el botón de proceder al checkout
    document.getElementById("btn-proceed").addEventListener('click', async () => {
        // Al manejar el botón de proceder al checkout
        console.log('Proceeding to checkout with cart ID:', cartId); // Mostrar el ID del carrito para el checkout

        try {
            // Realizar la solicitud POST para proceder al checkout
            const response = await fetch(`http://localhost:8000/api/cart/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Tipo de contenido de la solicitud
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Token de autenticación para la solicitud
                },
                body: JSON.stringify({ cartId }), // Cuerpo de la solicitud con el ID del carrito en formato JSON
                credentials: 'include' // Incluir cookies en la solicitud
            });

            // Verificar si la respuesta es correcta
            if (response.ok) {
                const ticket = await response.json(); // Convertir la respuesta a formato JSON
                // Después de recibir la respuesta del checkout
                console.log('Checkout response:', ticket); // Mostrar el ticket en la consola

                // Mostrar mensaje de éxito con el código del ticket
                alert(`Compra realizada con éxito. Código de ticket: ${ticket.code}`);
                // Redirigir a la página de checkout
                window.location.href = '../checkout/checkout.html'; // Cambiar a la URL adecuada para la página de checkout
            } else {
                console.error("Error al proceder al checkout:", response.statusText); // Informar sobre errores al proceder al checkout
            }
        } catch (error) {
            console.error("Error en la solicitud:", error); // Informar sobre errores en la solicitud fetch
        }
    });
});

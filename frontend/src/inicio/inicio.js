document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            //verifica si data.docs es un array, lo que es esencial para evitar errores al renderizar los productos.

            if (Array.isArray(data.docs)) {
                const container = document.getElementById('products-container');
                const imageBaseUrl = 'http://localhost:8000/img/products/';
                container.innerHTML = data.docs.map(product => {
                    const imageUrl = `${imageBaseUrl}${product.thumbnail}`;
                    console.log(`Image URL: ${imageUrl}`);

                    return `
                    <div class="product">
                        <img src="${imageUrl}" alt="${product.title}" />
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrement" data-id="${product._id}">-</button>
                            <span class="quantity" id="quantity-${product._id}">0</span>
                            <button class="quantity-btn" data-action="increment" data-id="${product._id}">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
                    </div>
                `;
                }).join('');

                document.querySelectorAll('.quantity-btn').forEach(button => {
                    button.addEventListener('click', handleQuantityChange);
                });

                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', handleAddToCart);
                });
            } else {
                console.error('Expected data.docs to be an array but got:', data);
                Swal.fire({
                    title: 'Error',
                    text: 'The data format is incorrect.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an issue loading the products. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});

/*
// Función para verificar si una cadena es un ObjectId válido
function isValidObjectId(id) {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id);
}

*/



///////////AGREGAR LA CANTIDAD

function handleQuantityChange(event) {
    const button = event.target;
    const action = button.getAttribute('data-action');
    const productId = button.getAttribute('data-id');
    const quantityElement = document.getElementById(`quantity-${productId}`);   
    let quantity = parseInt(quantityElement.textContent);
    console.log(`Quantity for product ${productId}:`, quantity);

    if (action === 'increment') {
        quantity += 1;
    } else if (action === 'decrement' ) {
        quantity = Math.max(0, quantity - 1);
    }

    console.log(`Updated quantity for product ${productId}:`, quantity);


    quantityElement.textContent = quantity;
}



///////////////////


/////////////////////AGREGAR AL CARRITO


function handleAddToCart(event) {
    // Obtiene el botón que fue clickeado
    const button = event.target;
    // Obtiene el ID del producto desde el atributo 'data-id' del botón
    const productId = button.getAttribute('data-id');
    // Obtiene la cantidad seleccionada para el producto desde el elemento HTML
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).textContent);
    // Obtiene el token de autenticación del almacenamiento local

    console.log(`Read quantity from element:`, quantity);
    console.log(`Quantity for product DESDE ADD TO CART ${productId}:`, quantity);

    const token = localStorage.getItem('token');
    // Obtiene el ID del carrito desde el almacenamiento local
    const cartId = localStorage.getItem('cartId');

    console.log('Cart ID:', cartId);

    // Verifica si el token de autenticación no está presente
    if (!token) {
        // Muestra una alerta usando SweetAlert2 para pedir al usuario que inicie sesión
        Swal.fire({
            title: 'Error',
            text: 'Please log in to add items to the cart.',
            icon: 'error',
            confirmButtonText: 'Log In',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            preConfirm: () => {
                // Redirige al usuario a la página de inicio de sesión
                window.location.href = '../login/login.html';
            }
        });
        return; // Sale de la función si el usuario no está autenticado
    }

    /*
      // Validar los IDs antes de continuar
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        Swal.fire({
            title: 'Error',
            text: 'Invalid Cart ID or Product ID.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    */
    console.log(`Quantity before adding to cart: ${quantity}`);
    // Verifica si la cantidad es mayor a 0 y si el ID del carrito está presente
    if (quantity > 0 && cartId) {
        // Realiza una solicitud POST para agregar el producto al carrito
        fetch(`http://localhost:8000/api/cart/${cartId}/products/${productId}`, {
            method: 'POST', // Método HTTP usado para la solicitud
            headers: {
                'Content-Type': 'application/json', // Tipo de contenido de la solicitud
                'Authorization': `Bearer ${token}` // Token de autenticación para la solicitud
            },
            body: JSON.stringify({ quantity: quantity }), // Cuerpo de la solicitud con la cantidad en formato JSON
            credentials: 'include'
        })
            .then(response => {
                console.log(cartId)
                // Verifica si la respuesta de la red es exitosa
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Lanza un error si la respuesta no es exitosa
                }
                return response.json(); // Convierte la respuesta en JSON
            })
            .then(result => {
                console.log(productId)
                // Verifica si la respuesta del servidor indica éxito
                if (result) {
                    // Reinicia la cantidad del producto a 0 en la interfaz
                    document.getElementById(`quantity-${productId}`).textContent = '0';
                    // Incrementa el contador del carrito con la cantidad agregada
                    incrementCartCount(quantity);

                    // Muestra una alerta de éxito usando SweetAlert2
                    Swal.fire({
                        title: 'Success!',
                        text: `Added ${quantity} items to cart.`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    // Muestra una alerta de error si la respuesta del servidor indica fallo
                    Swal.fire({
                        title: 'Error',
                        text: result.message || 'Unable to add item to cart.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                // Captura errores de la solicitud y muestra una alerta
                console.error('Error adding to cart:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an issue adding the item to the cart. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    } else {
        console.error('Quantity or cart ID invalid:', { quantity, cartId });
        // Muestra una alerta si no se ha seleccionado una cantidad
        Swal.fire({
            title: 'Error',
            text: 'Please select a quantity before adding to cart.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

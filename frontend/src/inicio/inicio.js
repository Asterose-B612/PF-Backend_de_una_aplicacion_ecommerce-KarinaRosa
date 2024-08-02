document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Imprime los datos recibidos

        // Verifica si data.docs es un array
        if (Array.isArray(data.docs)) {
            const container = document.getElementById('products-container');
            
            // Define la ruta base para las imágenes
            const imageBaseUrl = 'http://localhost:8000/img/products/'; // Ruta base a la carpeta de imágenes
            
            container.innerHTML = data.docs.map(product => {
                const imageUrl = `${imageBaseUrl}${product.thumbnail}`;
                console.log(`Image URL: ${imageUrl}`); // Imprime la URL de la imagen

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

            // Event listeners for quantity controls and add-to-cart buttons
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

// Handle quantity change
function handleQuantityChange(event) {
    const button = event.target;
    const action = button.getAttribute('data-action');
    const productId = button.getAttribute('data-id');
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityElement.textContent);

    if (action === 'increment') {
        quantity += 1;
    } else if (action === 'decrement' && quantity > 0) {
        quantity -= 1;
    }

    quantityElement.textContent = quantity;
}

// Handle add to cart.AGREGAR AL CARRITO

function handleAddToCart(event) {
    const button = event.target;
    const productId = button.getAttribute('data-id');
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).textContent);

    if (quantity > 0) {
                // Obtener token del localStorage o estado de autenticación
        // Get the cart from localStorage or initialize it if it doesn't exist
        
        const token = localStorage.getItem('authToken');
        if (!token) {
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
                    // Redirige al usuario a la página de login
                    window.location.href = '../login/login.html';
                }
            });
            return;
        }
        
        //hago la peticion
        fetch('http://localhost:8000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        })
        
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Reset quantity display
                document.getElementById(`quantity-${productId}`).textContent = '0';
                
                Swal.fire({
                    title: 'Success!',
                    text: `Added ${quantity} items to cart.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message || 'Unable to add item to cart.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an issue adding the item to the cart. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Please select a quantity before adding to cart.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}  
        
        
        
        
        
      
   

// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('products-container');
            container.innerHTML = products.map(product => `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}" />
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrement" data-id="${product._id}">-</button>
                        <span class="quantity" id="quantity-${product._id}">0</span>
                        <button class="quantity-btn" data-action="increment" data-id="${product._id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
                </div>
            `).join('');

            // Event listeners for quantity controls and add-to-cart buttons
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', handleQuantityChange);
            });

            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', handleAddToCart);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
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

// Handle add to cart
function handleAddToCart(event) {
    const button = event.target;
    const productId = button.getAttribute('data-id');
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).textContent);

    if (quantity > 0) {
        // Get the cart from localStorage or initialize it if it doesn't exist
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Update the cart with the new quantity
        if (!cart[productId]) {
            cart[productId] = 0;
        }
        cart[productId] += quantity;

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Reset the quantity display
        document.getElementById(`quantity-${productId}`).textContent = '0';
        
        // Use SweetAlert2 for confirmation
        Swal.fire({
            title: 'Success!',
            text: `Added ${quantity} of ${productId} to cart.`,
            icon: 'success',
            confirmButtonText: 'OK'
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

// cart.js


// Ejemplo simple de renderización dinámica de productos en el carrito
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Precio: $${item.price}</p>
                <input type="number" value="${item.quantity}" min="1">
                <button class="btn-remove" data-id="${item.id}">Eliminar</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderCartItems);



// Eliminar producto del carrito
document.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', (event) => {
        const itemId = button.getAttribute('data-id');
        let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        updateCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    });
});


//Proceder al checkout
document.querySelector('.btn-proceed').addEventListener('click', () => {
    // Aquí puedes redirigir al usuario al checkout o realizar otras acciones
    console.log('Procediendo al checkout...');
});
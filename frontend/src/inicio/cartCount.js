// cartCount.js

// Función para actualizar el contador del carrito
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = count;
}

// Función para obtener el conteo del carrito desde el localStorage
function getCartCount() {
    return parseInt(localStorage.getItem('cartCount') || '0', 10);
}

// Función para inicializar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const cartCount = getCartCount();
    updateCartCount(cartCount);
});

// Función para aumentar el contador del carrito y almacenar el nuevo valor
function incrementCartCount() {
    let currentCount = getCartCount();
    currentCount += 1;
    localStorage.setItem('cartCount', currentCount);
    updateCartCount(currentCount);
}

// Exporta la función para que pueda ser usada en otros scripts si es necesario
export { incrementCartCount };

// cartCount.js

// Función para actualizar el contador del carrito
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = count;
}

// Función para obtener el conteo del carrito desde el localStorage
function getCartCount() {
    return parseInt(localStorage.getItem('cartCount') || '0');
}

// Función para inicializar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const cartCount = getCartCount();
    updateCartCount(cartCount);
});

// Función para aumentar el contador del carrito y almacenar el nuevo valor
function incrementCartCount(amount = 1) {
    let currentCount = getCartCount();
    currentCount += amount;
    //Es una buena práctica para persistir datos simples como el conteo del carrito entre sesiones.
    localStorage.setItem('cartCount', currentCount);
    updateCartCount(currentCount);
}


// Si necesitas que la función esté disponible globalmente, adjunta al objeto window
window.incrementCartCount = incrementCartCount;
//incrementCartCount se hace accesible globalmente a través del objeto window. Esto significa que puedes llamar a incrementCartCount() desde cualquier otro script JavaScript que se cargue después de este archivo.
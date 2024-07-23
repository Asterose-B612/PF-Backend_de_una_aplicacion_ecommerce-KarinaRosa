// cart.js

// Eliminar producto del carrito
document.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.cart-item');
        item.remove();
        // Aquí puedes agregar lógica para actualizar el subtotal y total
    });
});

//Proceder al checkout
document.querySelector('.btn-proceed').addEventListener('click', () => {
    // Aquí puedes redirigir al usuario al checkout o realizar otras acciones
    console.log('Procediendo al checkout...');
});

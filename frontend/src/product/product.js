document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const products = await response.json();
      const productsList = document.getElementById('products-list');
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.textContent = `${product.name} - $${product.price}`;
        productsList.appendChild(productDiv);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
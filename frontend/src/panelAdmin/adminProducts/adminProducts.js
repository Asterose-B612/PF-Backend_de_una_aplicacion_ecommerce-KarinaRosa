// Example data, replace with actual data fetching
const products = [
    { title: 'Product 1', description: 'Description 1', price: 100, code: 'P001', stock: 10, category: 'Category 1', status: 'Available' },
    { title: 'Product 2', description: 'Description 2', price: 200, code: 'P002', stock: 20, category: 'Category 2', status: 'Out of Stock' }
  ];
  
  const productList = document.getElementById('product-list');
  const productForm = document.getElementById('product-form');
  
  // Populate initial product list
  function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.status}</td>
      `;
      productList.appendChild(tr);
    });
  }
  
  // Add new product
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
      title: productForm.title.value,
      description: productForm.description.value,
      price: productForm.price.value,
      code: productForm.code.value,
      stock: productForm.stock.value,
      category: productForm.category.value,
      status: productForm.status.value
    };
    products.push(newProduct);
    renderProducts();
    productForm.reset();
  });
  
  renderProducts();
  
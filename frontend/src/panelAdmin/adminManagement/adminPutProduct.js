document.addEventListener('DOMContentLoaded', function () {
    fetchAllProducts();
  
    // Función para obtener todos los productos
    async function fetchAllProducts() {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const products = await response.json();
        renderProducts(products);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron obtener los productos. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  
    // Función para renderizar productos en la página
    function renderProducts(products) {
      const productContainer = document.getElementById('productContainer');
      productContainer.innerHTML = '';
      products.forEach(product => {
        productContainer.innerHTML += `
          <div class="product">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Código: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <p>Estado: ${product.status}</p>
            <button onclick="editProduct('${product._id}')">Editar</button>
            <button onclick="confirmDeleteProduct('${product._id}')">Eliminar</button>
          </div>
        `;
      });
    }
  
    // Función para crear un nuevo producto
    async function createProduct(event) {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const price = document.getElementById('price').value;
      const code = document.getElementById('code').value;
      const stock = document.getElementById('stock').value;
      const category = document.getElementById('category').value;
      const status = document.getElementById('status').value;
  
      try {
        const response = await fetch('http://localhost:8000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            description,
            price,
            code,
            stock,
            category,
            status
          })
        });
  
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
  
        const newProduct = await response.json();
        Swal.fire({
          title: 'Producto Creado',
          text: `El producto ${newProduct.title} ha sido creado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchAllProducts();
        document.getElementById('createProductForm').reset();
      } catch (error) {
        console.error('Error al crear producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el producto. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  
    // Función para editar un producto
    async function editProduct(productId) {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`);
        const product = await response.json();
  
        document.getElementById('productDetails').innerHTML = `
          <form id="updateProductForm">
            <div>
              <label for="updateTitle"></label>
              <input type="text" id="updateTitle" name="updateTitle" value="${product.title}" required placeholder="Título" style="color: #555;">
            </div>
            <div>
              <label for="updateDescription"></label>
              <input type="text" id="updateDescription" name="updateDescription" value="${product.description}" required placeholder="Descripción" style="color: #555;">
            </div>
            <div>
              <label for="updatePrice"></label>
              <input type="number" id="updatePrice" name="updatePrice" value="${product.price}" required placeholder="Precio" style="color: #555;">
            </div>
            <div>
              <label for="updateCode"></label>
              <input type="text" id="updateCode" name="updateCode" value="${product.code}" required placeholder="Código" style="color: #555;">
            </div>
            <div>
              <label for="updateStock"></label>
              <input type="number" id="updateStock" name="updateStock" value="${product.stock}" required placeholder="Stock" style="color: #555;">
            </div>
            <div>
              <label for="updateCategory">Categoría</label>
              <select id="updateCategory" name="updateCategory" required>
                <option value="smartphones" ${product.category === 'smartphones' ? 'selected' : ''}>Smartphones</option>
                <option value="tablets" ${product.category === 'tablets' ? 'selected' : ''}>Tablets</option>
                <option value="notebooks" ${product.category === 'notebooks' ? 'selected' : ''}>Notebooks</option>
              </select>
            </div>
            <div>
              <label for="updateStatus">Estado</label>
              <select id="updateStatus" name="updateStatus" required>
                <option value="available" ${product.status === 'available' ? 'selected' : ''}>Disponible</option>
                <option value="out_of_stock" ${product.status === 'out_of_stock' ? 'selected' : ''}>Agotado</option>
                <option value="discontinued" ${product.status === 'discontinued' ? 'selected' : ''}>Descontinuado</option>
              </select>
            </div>
            <button type="submit">Actualizar Producto</button>
          </form>
        `;
        document.getElementById('updateProductForm').addEventListener('submit', (event) => {
          updateProduct(event, productId);
        });
      } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener los detalles del producto. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  
    // Función para actualizar un producto
    async function updateProduct(event, productId) {
      event.preventDefault();
      const title = document.getElementById('updateTitle').value;
      const description = document.getElementById('updateDescription').value;
      const price = document.getElementById('updatePrice').value;
      const code = document.getElementById('updateCode').value;
      const stock = document.getElementById('updateStock').value;
      const category = document.getElementById('updateCategory').value;
      const status = document.getElementById('updateStatus').value;
  
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            description,
            price,
            code,
            stock,
            category,
            status
          })
        });
  
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
  
        const updatedProduct = await response.json();
        Swal.fire({
          title: 'Producto Actualizado',
          text: `El producto ${updatedProduct.title} ha sido actualizado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchAllProducts();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el producto. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  
    // Función para confirmar la eliminación de un producto
    function confirmDeleteProduct(productId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(productId);
        }
      });
    }
  
    // Función para eliminar un producto
    async function deleteProduct(productId) {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: 'DELETE'
        });
  
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
  
        Swal.fire({
          title: 'Producto Eliminado',
          text: 'El producto ha sido eliminado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchAllProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  
    // Asignar la función createProduct al evento submit del formulario
    document.getElementById('createProductForm').addEventListener('submit', createProduct);
  });
  
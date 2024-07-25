// Archivo: adminManagement.js

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('mainContent');

  const getAllProductsLink = document.getElementById('getAllProducts');
  const createProductLink = document.getElementById('createProduct');
  const searchProductByIdLink = document.getElementById('searchProductById');

  getAllProductsLink.addEventListener('click', fetchAllProducts);
  createProductLink.addEventListener('click', showCreateProductForm);
  searchProductByIdLink.addEventListener('click', showSearchFormProduct);

  // Función para obtener todos los productos
  async function fetchAllProducts(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/products');
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      const products = await response.json();
      mainContent.innerHTML = '<h2>Product List</h2>';
      if (products.length > 0) {
        const productList = document.createElement('ul');
        products.forEach(product => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            Nombre: ${product.name}, Precio: ${product.price}, Categoría: ${product.category}
            <button onclick="showUpdateProductForm('${product._id}')">Actualizar</button>
            <button onclick="confirmDeleteProduct('${product._id}')">Eliminar</button>
          `;
          productList.appendChild(listItem);
        });
        mainContent.appendChild(productList);
      } else {
        mainContent.innerHTML = '<p>No hay productos disponibles.</p>';
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      mainContent.innerHTML = '<p>Error al obtener productos.</p>';
    }
  }

  // Función para mostrar formulario de búsqueda de producto por ID
  function showSearchFormProduct() {
    mainContent.innerHTML = `
      <h2>Buscar Producto por ID</h2>
      <form id="searchProductForm">
        <label for="productId">ID de Producto:</label>
        <input type="text" id="productId" name="productId" required>
        <button type="submit">Buscar</button>
      </form>
    `;
    document.getElementById('searchProductForm').addEventListener('submit', fetchProductById);
  }

  // Función para buscar producto por ID
  async function fetchProductById(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      const product = await response.json();
      mainContent.innerHTML = '';
      if (!product || !product._id) {
        mainContent.innerHTML = '<p>Producto no encontrado</p>';
        return;
      }
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.innerHTML = `
        <p>Nombre: ${product.name}</p>
        <p>Precio: ${product.price}</p>
        <p>Categoría: ${product.category}</p>
        <button onclick="showUpdateProductForm('${product._id}')">Actualizar</button>
        <button onclick="confirmDeleteProduct('${product._id}')">Eliminar</button>
      `;
      mainContent.appendChild(productDiv);
    } catch (err) {
      console.error('Error al obtener producto:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el producto. Por favor, intenta de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Función para mostrar formulario de creación de producto
  function showCreateProductForm() {
    mainContent.innerHTML = `
      <h2>Agregar Producto</h2>
      <form id="createProductForm">
        <div>
          <label for="title"></label>
          <input type="text" id="title" name="title" required placeholder="Título" style="color: #555;">
        </div>
        <div>
          <label for="description"></label>
          <input type="text" id="description" name="description" required placeholder="Descripción" style="color: #555;">
        </div>
        <div>
          <label for="price"></label>
          <input type="number" id="price" name="price" required placeholder="Precio" style="color: #555;">
        </div>
        <div>
          <label for="code"></label>
          <input type="text" id="code" name="code" required placeholder="Código" style="color: #555;">
        </div>
        <div>
          <label for="stock"></label>
          <input type="number" id="stock" name="stock" required placeholder="Stock" style="color: #555;">
        </div>
        <div>
          <label for="category">Categoría</label>
          <select id="category" name="category" required>
            <option value="smartphones">Smartphones</option>
            <option value="tablets">Tablets</option>
            <option value="notebooks">Notebooks</option>
          </select>
        </div>
        <div>
          <label for="status">Estado</label>
          <select id="status" name="status" required>
            <option value="available">Disponible</option>
            <option value="out_of_stock">Agotado</option>
            <option value="discontinued">Descontinuado</option>
          </select>
        </div>
        <button type="submit">Agregar Producto</button>
      </form>
    `;
    document.getElementById('createProductForm').addEventListener('submit', createProduct);
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

  // Función para mostrar formulario de actualización de producto
  async function showUpdateProductForm(productId) {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      const product = await response.json();
      mainContent.innerHTML = `
        <h2>Actualizar Producto</h2>
        <form id="updateProductForm">
          <div>
            <label for="updateTitle"></label>
            <input type="text" id="updateTitle" name="title" value="${product.title}" required placeholder="Título" style="color: #555;">
          </div>
          <div>
            <label for="updateDescription"></label>
            <input type="text" id="updateDescription" name="description" value="${product.description}" required placeholder="Descripción" style="color: #555;">
          </div>
          <div>
            <label for="updatePrice"></label>
            <input type="number" id="updatePrice" name="price" value="${product.price}" required placeholder="Precio" style="color: #555;">
          </div>
          <div>
            <label for="updateCode"></label>
            <input type="text" id="updateCode" name="code" value="${product.code}" required placeholder="Código" style="color: #555;">
          </div>
          <div>
            <label for="updateStock"></label>
            <input type="number" id="updateStock" name="stock" value="${product.stock}" required placeholder="Stock" style="color: #555;">
          </div>
          <div>
            <label for="updateCategory">Categoría</label>
            <select id="updateCategory" name="category" required>
              <option value="smartphones" ${product.category === 'smartphones' ? 'selected' : ''}>Smartphones</option>
              <option value="tablets" ${product.category === 'tablets' ? 'selected' : ''}>Tablets</option>
              <option value="notebooks" ${product.category === 'notebooks' ? 'selected' : ''}>Notebooks</option>
            </select>
          </div>
          <div>
            <label for="updateStatus">Estado</label>
            <select id="updateStatus" name="status" required>
              <option value="available" ${product.status === 'available' ? 'selected' : ''}>Disponible</option>
              <option value="out_of_stock" ${product.status === 'out_of_stock' ? 'selected' : ''}>Agotado</option>
              <option value="discontinued" ${product.status === 'discontinued' ? 'selected' : ''}>Descontinuado</option>
            </select>
          </div>
          <button type="submit">Actualizar Producto</button>
        </form>
      `;
      document.getElementById('updateProductForm').addEventListener('submit', (event) => updateProduct(event, product._id));
    } catch (error) {
      console.error('Error al obtener producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el producto. Por favor, intenta de nuevo más tarde.',
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

  // Función para confirmar eliminación de producto
  function confirmDeleteProduct(productId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
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

      Swal.fire(
        'Eliminado',
        'El producto ha sido eliminado.',
        'success'
      );
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
});

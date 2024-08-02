//CODIGO PARA CREAR UN PRODUCTO. TIRA ERROR.
document.addEventListener('DOMContentLoaded', () => {
    // Función para crear el formulario dinámico
    function loadCreateProductForm() {
      const mainContent = document.getElementById('mainContent');
      mainContent.innerHTML = `
        <form id="createProductForm">
          <h2>Crear Producto</h2>
          <div class="form-group">
            <label for="title">Título:</label>
            <input type="text" id="title" required>
          </div>
          <div class="form-group">
            <label for="description">Descripción:</label>
            <textarea id="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Precio:</label>
            <input type="number" id="price" required>
          </div>
          <div class="form-group">
            <label for="thumbnail">Imagen:</label>
            <input type="file" id="thumbnail" accept="image/*">
          </div>
          <div class="form-group">
            <label for="code">Código:</label>
            <input type="text" id="code" required>
          </div>
          <div class="form-group">
            <label for="stock">Stock:</label>
            <input type="number" id="stock" required>
          </div>
          <div class="form-group">
            <label for="category">Categoría:</label>
            <select id="category" required>
              <option value="smartphones">Smartphones</option>
              <option value="tablets">Tablets</option>
              <option value="notebooks">Notebooks</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Estado:</label>
            <select id="status" required>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <button type="submit">Crear Producto</button>
        </form>
      `;
  
      // Asignar la función createProduct al evento submit del formulario
      const form = document.getElementById('createProductForm');
      if (form) {
        form.addEventListener('submit', createProduct);
      } else {
        console.error('Formulario con ID "createProductForm" no encontrado.');
      }
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
      //const status = document.getElementById('status').value === 'true'; // Convertir a booleano
  
      // Manejo del campo thumbnail
      const thumbnailInput = document.getElementById('thumbnail');
      const thumbnail = thumbnailInput.files.length > 0 ? thumbnailInput.files[0] : null;
  
      try {
        // Mostrar mensaje de carga mientras se crea el producto
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos creando el producto.',
          icon: 'info',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        // Preparar los datos para el envío
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('code', code);
        formData.append('stock', stock);
        formData.append('category', category);
        //formData.append('status', status);
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }
  
        const response = await fetch('http://localhost:8000/api/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Autenticación con token
          },//FormData, que permite enviar archivos y otros datos en una sola solicitud.        Si incluyes JSON.stringify, solo puedes enviar datos en formato JSON y no archivos.
          body: formData, // Enviar los datos del formulario incluyendo el archivo
          credentials: 'include'
        });
  
        if (!response.ok) {
          const errorData = await response.json(); // Obtener el mensaje de error desde la respuesta
          console.error('Mensaje del servidor:', errorData.message);
          throw new Error(errorData.message || 'Error en la solicitud'); // Mostrar el mensaje de error
        }
  
        const newProduct = await response.json();
  
        Swal.fire({
          title: 'Producto Creado',
          text: `El producto ${newProduct.title} ha sido creado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
  
        document.getElementById('createProductForm').reset();
  
      } catch (error) {
        console.error('Error al crear producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el producto. Por favor, intenta de nuevo más tarde.' + error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } finally {
        // Cerrar mensaje de carga si es necesario
        Swal.close();
      }
    }
  
    // Asignar la función loadCreateProductForm al click en el botón "Crear"
    const createProductButton = document.getElementById('createProduct');
    if (createProductButton) {
      createProductButton.addEventListener('click', () => {
        loadCreateProductForm();
      });
    } else {
      console.error('Botón con ID "createProduct" no encontrado.');
    }
  });
  
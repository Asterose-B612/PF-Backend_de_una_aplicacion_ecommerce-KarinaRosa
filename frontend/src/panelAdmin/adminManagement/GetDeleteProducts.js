//1: document.addEventListener('DOMContentLoaded', () => { ... });:Este bloque asegura que el código dentro de la función solo se ejecute después de que todo el contenido del DOM haya sido completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
  //2:Obteniendo Elementos del DOM
  const getAllProductsLink = document.getElementById('getAllProducts');
  const mainContent = document.getElementById('mainContent');
  //3: Manejador de Evento para el Enlace "getAllProducts"
  getAllProductsLink.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

    //4: Mostrar mensaje de carga mientras se obtienen los productos del servidor.
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos listando los productos.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      //5:solicitud fetch al servidor para obtener la lista de productos.
      const response = await fetch('http://localhost:8000/api/products');
      console.log('Respuesta del servidor desde get prods:', response);
      //6:Procesar Respuesta del Servidor
      if (!response.ok) {
        //Verifica si la respuesta del servidor es exitosa. Si no, lanza un error.
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      //Convierte la respuesta en un objeto JSON.
      const data = await response.json();
      console.log('Datos de productos:', data);

      // 7: Limpiar Contenido Previo. Verifica si hay productos en la respuesta. Si hay, crea una tabla con los detalles de los productos.Inserta los botones "Editar" y "Eliminar" en cada fila, con los product._id correspondientes.
      mainContent.innerHTML = '';

      // Verificar si hay productos. 
      if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
        const productContainer = document.createElement('div');
        productContainer.id = 'productContainer';
        productContainer.innerHTML = `
          <table class="product-table">
            <thead>
              <tr>
               <th>id</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Código</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${data.docs.map(product => `
                <tr>
                 <td>${product._id}</td>
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>$${product.price}</td>
                  <td>${product.code}</td>
                  <td>${product.stock}</td>
                  <td>${product.category}</td>
                  <td>${product.status ? 'Disponible' : 'No disponible'}</td>
                  <td>
                    <button onclick="editProduct('${product._id}')">Editar</button>
                    <button onclick="confirmDeleteProduct('${product._id}')">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        mainContent.appendChild(productContainer);
      } else {
        mainContent.innerHTML = '<p>No se encontraron productos.</p>';
      }

      // Cerrar mensaje de carga
      Swal.close();

      //9: Definir Funciones Globales editProduct y confirmDeleteProduct
      window.editProduct = function (productId) {
        Swal.fire('Editar producto', `Producto ID: ${productId}`, 'info');
      };

      window.confirmDeleteProduct = function (productId) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'No podrás revertir esto',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const deleteResponse = await fetch(`http://localhost:8000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si usas token para autenticar solicitudes
                  
                },
                body: JSON.stringify({ id: productId }),
                  credentials: 'include'
              });
              console.log('Token:', localStorage.getItem('token'));

              console.log('Respuesta del servidor de eliminación:', deleteResponse);

              if (!deleteResponse.ok) {
                throw new Error('Error en la eliminación: ' + deleteResponse.statusText);
              }

              Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');

              // Volver a cargar la lista de productos
              getAllProductsLink.click();
            } catch (error) {
              console.error('Error al eliminar el producto:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el producto. Por favor, intenta de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        });
      };

    } catch (error) {
      console.error('Error al obtener productos:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron obtener los productos. Por favor, intenta de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });
});
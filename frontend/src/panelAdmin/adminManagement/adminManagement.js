// Archivo: adminManagement.js

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el elemento con el id 'getAllUsers'
    const getAllUsersLink = document.getElementById('getAllUsers');
    // Obtener el contenedor para mostrar los usuarios
    const mainContent = document.getElementById('mainContent');
    
    // Añadir un listener para el clic en el enlace 'Obtener todos'
    getAllUsersLink.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

        // Mostrar mensaje de carga
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo los datos de los usuarios.',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Hacer una solicitud GET a la API para obtener los usuarios
            const response = await fetch('http://localhost:8000/api/users');
            console.log('Respuesta del servidor:', response);
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            
            // Convertir la respuesta en JSON
            const users = await response.json();
            console.log('Datos de usuarios:', users);
            // Limpiar el contenido previo
            mainContent.innerHTML = '';
            
            // Mostrar los usuarios en el contenedor 'mainContent'
            if (users.length > 0) {
                const userList = document.createElement('ul');
                users.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.rol}`;
                    userList.appendChild(listItem);
                });
                mainContent.appendChild(userList);
            } else {
                mainContent.innerHTML = '<p>No hay usuarios disponibles.</p>';
            }

            // Mostrar notificación de éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Usuarios cargados exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            mainContent.innerHTML = '<p>Error al obtener usuarios.</p>';

            // Mostrar notificación de error
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron obtener los usuarios. Por favor, intenta de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});



//Eliminar usuarios inactivos.

// Obtener el enlace para eliminar usuarios inactivos
const deleteInactiveUsersLink = document.getElementById('deleteInactiveUsers');


  // Añadir un listener para el clic en el enlace 'Eliminar inactivos'
  deleteInactiveUsersLink.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    
    // Mostrar mensaje de carga
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos eliminando usuarios inactivos.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        // Hacer una solicitud DELETE a la API para eliminar los usuarios inactivos
        const response = await fetch('http://localhost:8000/api/users', {
            method: 'DELETE'
        });
        console.log('Respuesta del servidor:', response);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        
        // Convertir la respuesta en JSON
        const result = await response.json();
        console.log('Resultado de eliminación:', result);

        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Éxito',
            text: 'Usuarios inactivos eliminados exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        // Limpiar el contenido previo
        mainContent.innerHTML = '';

    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);

        // Mostrar mensaje de error
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron eliminar los usuarios inactivos. Por favor, intenta de nuevo más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});











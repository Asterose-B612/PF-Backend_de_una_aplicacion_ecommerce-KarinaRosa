document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');

    // Función para eliminar al usuario por ID
    async function deleteUser(userId) {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Usuario eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                mainContent.innerHTML = '';
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
                title: 'Error',
                text: `Error: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    // Función para obtener los detalles del usuario
    async function getUserDetails(userId) {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${userId}`);
            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error al obtener detalles del usuario:', error);
            Swal.fire({
                title: 'Error',
                text: `Error: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    // Manejar la búsqueda de usuario al hacer clic en el botón
    const searchUserByIdLink = document.getElementById('searchUserById');
    searchUserByIdLink.addEventListener('click', (event) => {
        event.preventDefault();
        mainContent.innerHTML = `
            <h2>Buscar Usuario por ID</h2>
            <input type="text" id="userIdInput" placeholder="Ingrese ID de usuario">
            <button id="searchUserByIdButton">Buscar</button>
            <div id="userDetailsDiv" style="display: none;"></div>
        `;

        const searchUserByIdButton = document.getElementById('searchUserByIdButton');
        searchUserByIdButton.addEventListener('click', async () => {
            const userIdInput = document.getElementById('userIdInput').value;
            const userDetailsDiv = document.getElementById('userDetailsDiv');

            if (userIdInput) {
                const user = await getUserDetails(userIdInput);
                if (user) {
                    userDetailsDiv.innerHTML = `
                        <h2>Detalles del Usuario</h2>
                        <p>ID: ${user._id}</p>
                        <p>Nombre: ${user.name}</p>
                         <p>Nombre: ${user.age}</p>
                        <p>Email: ${user.email}</p>
                        <p>Rol: ${user.rol}</p>
                        <button id="deleteUserButton">Eliminar Usuario</button>
                    `;
                    userDetailsDiv.style.display = 'block';

                    const deleteUserButton = document.getElementById('deleteUserButton');
                    deleteUserButton.addEventListener('click', () => {
                        Swal.fire({
                            title: '¿Estás seguro?',
                            text: "Esta acción no se puede deshacer",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                deleteUser(user._id);
                            }
                        });
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor ingrese un ID de usuario válido',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    });
});

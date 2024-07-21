async function fetchUsers() {
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const users = await response.json();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-card');
        userDiv.innerHTML = `
            <p>Nombre: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Rol: ${user.role}</p>
            <button onclick="deleteUser('${user._id}')">Eliminar</button>
        `;
        usersList.appendChild(userDiv);
    });
}

async function deleteUser(userId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        await fetchUsers();
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
    }
}

async function deleteInactiveUsers() {
    const result = await Swal.fire({
        title: '¿Eliminar usuarios inactivos?',
        text: "Esta acción eliminará todos los usuarios inactivos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        await fetch(`/api/users`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        await fetchUsers();
        Swal.fire('Eliminado!', 'Los usuarios inactivos han sido eliminados.', 'success');
    }
}

document.getElementById('fetch-users-btn').addEventListener('click', fetchUsers);
document.getElementById('delete-inactive-users-btn').addEventListener('click', deleteInactiveUsers);

document.addEventListener('DOMContentLoaded', fetchUsers);

// Obtiene el formulario de registro por su ID
const registerForm = document.getElementById('registerForm');

// Añade un evento al formulario para manejar el envío
registerForm.addEventListener('submit', (event) => {
    // Previene el comportamiento predeterminado del formulario (recargar la página)
    event.preventDefault();

    // Obtiene los valores de los campos del formulario
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const age = parseInt(document.getElementById('age').value);

    // Envía una solicitud POST al servidor con los datos del formulario
    fetch('http://localhost:8000/api/session/register', {
        method: 'POST', // Especifica el método HTTP
        headers: {
            'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud está en formato JSON
        },
        // Convierte los datos del formulario a una cadena JSON
        body: JSON.stringify({ name, surname, password, email, age }),
    })
    .then(response => {
        // Verifica si la respuesta del servidor es exitosa
        if (!response.ok) {
            // Lanza un error si la respuesta no es exitosa
            throw new Error('Network response was not ok');
        }
        // Convierte la respuesta a JSON
        return response.json();
    })
    .then(data => {
        // Muestra los datos del usuario registrados en la consola
        console.log("Datos de usuario al registrarse:", data);
        // Muestra una alerta de éxito utilizando SweetAlert2
        Swal.fire({
            title: 'Registro exitoso!',
            text: 'Usuario registrado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirige a la página de login después de que el usuario haga clic en "OK"
            window.location.href = '../login/login.html';
        });
    })
    .catch(error => {
        // Muestra un mensaje de error en la consola
        console.error('Error:', error);
        // Muestra una alerta de error utilizando SweetAlert2
        Swal.fire({
            title: 'Error!',
            text: 'Error al registrar usuario.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});

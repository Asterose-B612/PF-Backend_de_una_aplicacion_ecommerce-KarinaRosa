
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async(event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
        Swal.fire({
            title: 'Error!',
            text: 'Por favor, ingrese tanto el correo electrónico como la contraseña.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Detiene la ejecución si los campos están vacíos
    }


    try{
         // Envía una solicitud POST al servidor con los datos del formulario
        const response = await fetch('http://localhost:8000/api/session/login', {
        method: 'POST',
        headers: {
             // Indica que el cuerpo de la solicitud está en formato JSON
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
            if (!response.ok) {
                // Lanza un error si la respuesta no es exitosa
                throw new Error('Network response was not ok');
            }
            // Convierte la respuesta a JSON
            const data = await response.json();
            // Muestra la respuesta del servidor en la consola
                 console.log("DATA: LOGIN: ", data); 

                   // Maneja la respuesta del servidor
            // Verifica si el login fue exitoso
            if (data.success) {
                // Muestra una alerta de éxito utilizando SweetAlert2
                Swal.fire({
                    title: 'Logueo exitoso!',
                    text: 'Usuario logueado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirige según el rol del usuario
                    if (data.rol === 'admin') {
                        window.location.href = '../panelAdmin/adminManagement/adminManagement.html'; // Redirige al panel de administración
                    } else {
                        window.location.href = '../inicio/inicio.html'; // Redirige a la aplicación principal
                    }
                });
            } else {
                // Muestra una alerta de error utilizando SweetAlert2 si el login falla
                Swal.fire({
                    title: 'Error!',
                    text: 'Credenciales incorrectas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }catch(error) {
            // Muestra un mensaje de error en la consola
            console.error('Error:', error);
            // Muestra una alerta de error utilizando SweetAlert2
            Swal.fire({
                title: 'Error!',
                text: 'Error al loguearse.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };
});
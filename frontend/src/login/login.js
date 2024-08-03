
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
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


    try {
        // Envía una solicitud POST al servidor con los datos del formulario
        const response = await fetch('http://localhost:8000/api/session/login', {
            method: 'POST',
            headers: {
                // Indica que el cuerpo de la solicitud está en formato JSON
                'Content-Type': 'application/json',


            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            // Lanza un error si la respuesta no es exitosa
            const errorData = await response.json();
            //alerta de error
            Swal.fire({
                title: 'Error!',
                text: errorData.error || 'Credenciales incorrectas.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        // Convierte la respuesta a JSON
        const data = await response.json();
        // Muestra la respuesta del servidor en la consola
        console.log("DATA: LOGIN: ", data);

        // Verifica si ya existen el token, rol y cart_id en localStorage para no sobrescribirlos
        if (data.token && data.rol && data.cart_id) {
            // Guarda el token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('cart_id', data.cart_id);



            // Obtener el carrito después de iniciar sesión
            const cartResponse = await fetch(`http://localhost:8000/api/cart/${data.cart_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                }
            });


            if (!cartResponse.ok) {
                console.error('Error al obtener el carrito');
            } else {
                const cartData = await cartResponse.json();
                console.log('Datos del carrito:', cartData);
            }




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

        }
    } catch (error) {
        // Muestra un mensaje de error en la consola
        console.error('Error:', error);
        // Muestra una alerta de error utilizando SweetAlert2
        Swal.fire({
            title: 'Error!',
            text: 'Usuario no existente',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    };
});
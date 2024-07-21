document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('login-form');

    loginForm.addEventListener('click', (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8000/api/session/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("DATA: LOGIN: " + data); // Aquí puedes manejar la respuesta del backend
            // Por ejemplo, redireccionar a otra página si el login es exitoso
        })
        .catch(error => console.error('Error:', error));
    });
});

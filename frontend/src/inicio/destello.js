//GLOW
/*
document.addEventListener('DOMContentLoaded', () => {

    function createGlow(x, y) {
        const glow = document.createElement('div');
        glow.className = 'glow';


        
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        document.body.appendChild(glow);

        // Elimina el resplandor después de la animación
        glow.addEventListener('animationend', () => {
            glow.remove();
        });
    }

    // Crea un resplandor en la posición del mouse cuando se mueve
    document.addEventListener('mousemove', (e) => {
        createGlow(e.clientX, e.clientY);
    });
});*/

//PARTICULAS
/*
document.addEventListener('DOMContentLoaded', () => {

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);

        // Elimina la partícula después de la animación
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Crea una partícula en la posición del mouse cuando se mueve
    document.addEventListener('mousemove', (e) => {
        createParticle(e.clientX, e.clientY);
    });
});*/


// script.js
document.addEventListener('DOMContentLoaded', () => {

    function createGlow(x, y) {
        const glow = document.createElement('div');
        glow.className = 'glow';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        document.body.appendChild(glow);

        // Elimina el resplandor después de que la animación termina
        glow.addEventListener('animationend', () => {
            glow.remove();
        });
    }

    // Crear resplandor en la posición del mouse cuando se mueve
    document.addEventListener('mousemove', (e) => {
        createGlow(e.clientX, e.clientY);
    });
});





//CHISPA

/*document.addEventListener('DOMContentLoaded', () => {
    // Crear un contenedor para las chispa
    const sparkContainer = document.createElement('div');
    sparkContainer.id = 'spark-container';
    document.body.appendChild(sparkContainer);

    function createSpark(x, y) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        sparkContainer.appendChild(spark);

        // Elimina la chispa después de la animación
        spark.addEventListener('animationend', () => {
            spark.remove();
        });
    }

    // Crear chispa en la posición del movimiento del mouse
    document.addEventListener('mousemove', (e) => {
        createSpark(e.clientX, e.clientY);
    });

    // Crear chispa en la posición del clic del mouse
    document.addEventListener('click', (event) => {
        createSpark(event.pageX, event.pageY);
    });
});*/



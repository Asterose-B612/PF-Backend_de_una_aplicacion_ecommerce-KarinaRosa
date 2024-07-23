document.addEventListener('DOMContentLoaded', function() {
    const animatedText = document.getElementById('animated-text');
    const texts = [
      
        "Bienvenido a mi Proyecto Final",        
        "Backend de un E-commerce"
    ];

    let currentTextIndex = 0;
    let currentText = '';
    let letterIndex = 0;

    function type() {
        if (currentTextIndex < texts.length) {
            currentText = texts[currentTextIndex];
            animatedText.textContent = currentText.substring(0, letterIndex + 1);
            letterIndex++;

            if (animatedText.textContent === currentText) {
                currentTextIndex++;
                letterIndex = 0;
                 // Espera antes de borrar el texto actual
                setTimeout(type, 1000);
            } else {
                 // Tiempo entre cada letra
                setTimeout(type, 100);
            }
        } else {
            animatedText.textContent = texts[texts.length - 1]; // Texto estático final
        }
    }

    type();
});

const gato = document.getElementById('gato');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX - 10; // Ajusta 50px hacia la izquierda
  const y = e.clientY - 10; // Ajusta 50px hacia arriba

  gato.style.transform = `translate(${x}px, ${y}px)`;
});

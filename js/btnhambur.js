// Menú hamburguesa - solo funciona en pantallas pequeñas
const hamburguesa = document.querySelector('.hamburguesa');
const navMenu = document.querySelector('.nav-menu');

if (hamburguesa && navMenu) {
    hamburguesa.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const enlaces = navMenu.querySelectorAll('a');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Opcional: cerrar menú al redimensionar a tamaño desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
});
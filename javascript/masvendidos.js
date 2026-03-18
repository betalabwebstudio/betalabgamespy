// ==============================================
// CARGAR PRODUCTOS DESDE JSON
// ==============================================

// Función para cargar los productos
async function cargarProductos() {
    try {
        // 1. Hacer la petición al archivo JSON
        const respuesta = await fetch('/json/mas_vendidos.json');
        
        // 2. Verificar si la respuesta es correcta
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        
        // 3. Convertir la respuesta a objeto JavaScript
        const datos = await respuesta.json();
        
        // 4. Mostrar los productos en el carrusel
        mostrarProductos(datos.productos);
        
        // 5. Iniciar el movimiento automático
        iniciarMovimientoAutomatico();
        
    } catch (error) {
        console.error('Error:', error);
        // Si hay error, mostrar mensaje al usuario
        document.getElementById('carruselPista').innerHTML = `
            <div style="text-align: center; padding: 50px; color: red;">
                Error al cargar los productos. Por favor, recarga la página.
            </div>
        `;
    }
}

// ==============================================
// MOSTRAR PRODUCTOS EN EL HTML
// ==============================================

function mostrarProductos(productos) {
    const carruselPista = document.getElementById('carruselPista');
    
    // Limpiar contenido anterior
    carruselPista.innerHTML = '';

    // Recorrer cada producto y crear su HTML
    productos.forEach(producto => {

        const precioGs = formatearAGs(producto.precio);
        
        const productoHTML = `
            <div class="producto-card" data-id="${producto.id}">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="descripcion">${producto.descripcion}</p>
                    
                    <!-- ✅ Precio formateado como 850.000 Gs -->
                    <p class="producto-precio">${precioGs}</p>
                    
                    <p class="producto-vendidos">${producto.vendidos} vendidos</p>
                    <button class="btn-carrito" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                        🛒 Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        
        // Agregar al carrusel
        carruselPista.innerHTML += productoHTML;
    });
}

// ✅ FUNCIÓN CORREGIDA: 850.000 Gs (primero número, luego Gs.)
function formatearAGs(precio) {
    return precio.toLocaleString('es-PY') + ' Gs.';
    // Resultado: 850.000 Gs.
}
let intervaloMovimiento;
const carruselPista = document.getElementById('carruselPista');

function iniciarMovimientoAutomatico() {
    // Limpiar intervalo anterior si existe
    if (intervaloMovimiento) {
        clearInterval(intervaloMovimiento);
    }
    
    intervaloMovimiento = setInterval(() => {
        // Calcular máximo scroll
        const maxScroll = carruselPista.scrollWidth - carruselPista.clientWidth;
        const scrollActual = carruselPista.scrollLeft;
        
        // Ancho de un producto + gap
        const anchoProducto = 300; // 280px de ancho + 20px de gap
        
        // Si estamos al final, volver al principio
        if (scrollActual >= maxScroll - 10) {
            carruselPista.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            // Mover al siguiente producto
            carruselPista.scrollTo({
                left: scrollActual + anchoProducto,
                behavior: 'smooth'
            });
        }
    }, 3000); // Cada 3 segundos
}

// Pausar movimiento al pasar el mouse
carruselPista.addEventListener('mouseenter', () => {
    clearInterval(intervaloMovimiento);
});

carruselPista.addEventListener('mouseleave', () => {
    iniciarMovimientoAutomatico();
});


document.addEventListener('DOMContentLoaded', cargarProductos);
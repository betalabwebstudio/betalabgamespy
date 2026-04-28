let productos = [];

async function cargarProductos() {
    try {
        console.log('1. Intentando cargar JSON...');
        
        // PRUEBA CADA UNA DE ESTAS RUTAS (una por vez)
        const respuesta = await fetch('json/play2.json');  // Opción 1
        // const respuesta = await fetch('json/masvendidos.json');  // Opción 2
        // const respuesta = await fetch('masvendidos.json');       // Opción 3
        
        console.log('2. Respuesta recibida:', respuesta.status);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        productos = await respuesta.json();
        console.log('3. Productos cargados:', productos);
        console.log('4. Cantidad de productos:', productos.length);
        
        mostrarProductos();
        
    } catch (error) {
        console.error('❌ ERROR:', error);
        document.getElementById('productosGrid').innerHTML = `
            <div style="text-align:center; padding:50px; color:red;">
                Error: ${error.message}<br><br>
                Abre la consola (F12) para más detalles
            </div>
        `;
    }
}

function mostrarProductos() {
    const grid = document.getElementById('productosGridPS2');
    
    if (!grid) {
        console.error('No encontré el elemento productosGrid');
        return;
    }
    
    if (productos.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:50px;">No hay productos</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    productos.forEach((producto, index) => {
        console.log(`Mostrando producto ${index}:`, producto.nombre);
        
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        // Manejar imagen si no existe - CORREGIDO
        const imgSrc = producto.img || 'https://placehold.co/300x200?text=Sin+imagen';
        
        card.innerHTML = `
            <img class="producto-imagen" src="${imgSrc}" alt="${producto.nombre}"
                 onerror="this.src='https://placehold.co/300x200?text=Imagen+no+disponible'">
            <div class="producto-info">
                <div class="producto-nombre">${producto.nombre}</div>
                <span class="producto-consola">🎮 ${producto.consola || 'Sin consola'}</span>
                <div class="producto-descripcion">${producto.envios || 'Sin descripción'}</div>
                <div class="producto-descripcion">${producto.garantia || 'Sin descripción'}</div>
                <div class="producto-descripcion">${producto.seleccion || 'Sin descripción'}</div>
                <div class="producto-precio">${producto.precio || 'Consultar'}</div>
                <button onclick="agregarCarrito()" class="aggcarrito">Agregar al carrito</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    const contador = document.getElementById('contador');
    if (contador) {
        contador.innerHTML = `📦 ${productos.length} productos`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada, iniciando...');
    cargarProductos();
});
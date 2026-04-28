(function() {
    let productos = [];

    async function cargarProductos() {
        try {
            console.log('1. Intentando cargar JSON PC...');
            
            const respuesta = await fetch('json/pc.json');
            
            console.log('2. Respuesta recibida:', respuesta.status);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            
            productos = await respuesta.json();
            console.log('3. Productos PC cargados:', productos);
            console.log('4. Cantidad de productos:', productos.length);
            
            mostrarProductos();
            
        } catch (error) {
            console.error('❌ ERROR PC:', error);
            document.getElementById('productosGridPC').innerHTML = `
                <div style="text-align:center; padding:50px; color:red;">
                    Error: ${error.message}<br><br>
                    Abre la consola (F12) para más detalles
                </div>
            `;
        }
    }

    function mostrarProductos() {
        const grid = document.getElementById('productosGridPC');
        
        if (!grid) {
            console.error('No encontré el elemento productosGridPC');
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
            
            const imgSrc = producto.img || 'https://placehold.co/300x200?text=Sin+imagen';
            
            card.innerHTML = `
                <img class="producto-imagen" src="${imgSrc}" alt="${producto.nombre}"
                     onerror="this.src='https://placehold.co/300x200?text=Imagen+no+disponible'">
                <div class="producto-info">
                    <div class="producto-nombre">${producto.nombre}</div>
                    <span class="producto-consola">🎮 ${producto.consola || 'Sin consola'}</span>
                    <div class="producto-descripcion">${producto.envios || 'Sin descripción'}</div>
                    <div class="producto-precio"> ${producto.precio || 'Consultar'}</div>
                    <button onclick="agregarCarrito ('${producto.nombre}', '${producto.precio}')"  class="aggcarrito">🛒 Agregar al carrito</button>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        const contador = document.getElementById('contador');
        if (contador) {
            contador.innerHTML = `📦 ${productos.length} productos`;
        }
    }

    function agregarCarrito(nombre, precio) {
        alert(`✅ Agregaste al carrito:\n${nombre}\n${precio}`);
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('Página cargada, iniciando PC...');
        cargarProductos();
    });
})();
// ============================================
// BUSCADOR QUE LEE LOS JSON Y REDIRIGE
// ============================================

// Lista de tus archivos JSON con su página correspondiente
const archivosJSON = [
    { archivo: 'json/giftpag.json', pagina: 'gift.html' },
    { archivo: 'json/pcpag.json', pagina: 'pc.html' },
    { archivo: 'json/ps2pag.json', pagina: 'PS2.html' },
    { archivo: 'json/ps3pag.json', pagina: 'PS3.html' }
];

let todosLosProductos = [];

// ============================================
// 1. CARGAR TODOS LOS PRODUCTOS DE LOS JSON
// ============================================
async function cargarProductos() {
    try {
        const promesas = archivosJSON.map(async (item) => {
            const response = await fetch(item.archivo);
            const productos = await response.json();
            // Agregar la página y consola a cada producto
            return productos.map(p => ({
                ...p,
                pagina: item.pagina,
                consola: obtenerNombreConsola(item.pagina)
            }));
        });
        
        const resultados = await Promise.all(promesas);
        todosLosProductos = resultados.flat();
        console.log(`📦 ${todosLosProductos.length} productos cargados`);
        return todosLosProductos;
    } catch (error) {
        console.error('Error cargando JSON:', error);
        return [];
    }
}

// ============================================
// FUNCIÓN PARA OBTENER NOMBRE DE CONSOLA
// ============================================
function obtenerNombreConsola(pagina) {
    switch(pagina) {
        case 'PS2.html': return '🎮 PlayStation 2';
        case 'PS3.html': return '🎮 PlayStation 3';
        case 'pc.html': return '💻 PC';
        case 'gift.html': return '🎁 Gift Card';
        default: return '📦 Producto';
    }
}

// ============================================
// 2. BUSCAR PRODUCTOS
// ============================================
function buscarProductos(termino) {
    if (!termino || termino.length < 2) return [];
    
    const busqueda = termino.toLowerCase();
    
    return todosLosProductos.filter(producto => {
        return producto.nombre?.toLowerCase().includes(busqueda) ||
               producto.id?.toLowerCase().includes(busqueda) ||
               producto.descripcion?.toLowerCase().includes(busqueda);
    });
}

// ============================================
// 3. IR AL PRODUCTO (redirige y resalta)
// ============================================
function irAlProducto(producto) {
    // Guardar qué producto buscar al llegar
    sessionStorage.setItem('productoId', producto.id);
    sessionStorage.setItem('productoNombre', producto.nombre);
    
    // Redirigir a la página
    window.location.href = producto.pagina;
}

// ============================================
// 4. RESALTAR PRODUCTO AL LLEGAR A LA PÁGINA
// ============================================
function resaltarProducto() {
    const productoId = sessionStorage.getItem('productoId');
    const productoNombre = sessionStorage.getItem('productoNombre');
    
    if (!productoId) return;
    
    // Limpiar storage
    sessionStorage.removeItem('productoId');
    sessionStorage.removeItem('productoNombre');
    
    // Esperar a que la página cargue
    setTimeout(() => {
        // Buscar por ID
        let elemento = document.getElementById(productoId);
        
        // Si no lo encuentra, buscar por data-id
        if (!elemento) {
            elemento = document.querySelector(`[data-id="${productoId}"]`);
        }
        
        // Si no lo encuentra, buscar por nombre
        if (!elemento) {
            const tarjetas = document.querySelectorAll('.producto-card, .gift-card, .producto');
            for (const card of tarjetas) {
                if (card.innerText.includes(productoNombre)) {
                    elemento = card;
                    break;
                }
            }
        }
        
        if (elemento) {
            // Scroll suave
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Resaltar
            elemento.classList.add('resaltado');
            setTimeout(() => {
                elemento.classList.remove('resaltado');
            }, 3000);
        }
    }, 500);
}

// ============================================
// 5. MOSTRAR RESULTADOS EN DROPDOWN (imagen + nombre + consola)
// ============================================
let timeoutBusqueda;

function mostrarResultados(resultados, inputElement) {
    // Remover dropdown anterior
    const dropdownExistente = document.querySelector('.buscador-dropdown');
    if (dropdownExistente) dropdownExistente.remove();
    
    if (resultados.length === 0) return;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'buscador-dropdown';
    dropdown.style.cssText = `
        position: fixed;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        max-height: 350px;
        overflow-y: auto;
        width: 320px;
    `;
    
    // Mostrar máximo 8 resultados
    resultados.slice(0, 8).forEach(producto => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background 0.2s;
        `;
        
        // Usar la imagen del JSON o emoji por defecto
        const imagenUrl = producto.img;
        
        item.innerHTML = `
            <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                ${imagenUrl ? `<img src="${imagenUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23667eea%22/%3E%3Ctext x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22%3E🛍️%3C/text%3E%3C/svg%3E'">` : '🛍️'}
            </div>
            <div>
                <div style="font-weight: 500; color: #1a2a4f; font-size: 14px;">${producto.nombre}</div>
                <div style="font-size: 11px; color: #888; margin-top: 2px;">${producto.consola}</div>
            </div>
        `;
        
        item.onmouseenter = () => item.style.background = '#f0f7ff';
        item.onmouseleave = () => item.style.background = 'white';
        item.onclick = () => {
            irAlProducto(producto);  // REDIRIGE A LA PÁGINA
            dropdown.remove();
            inputElement.value = '';
        };
        
        dropdown.appendChild(item);
    });
    
    // Posicionar debajo del input
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 5}px`;
    dropdown.style.left = `${rect.left}px`;
    
    document.body.appendChild(dropdown);
}

// ============================================
// 6. INICIALIZAR BUSCADOR
// ============================================
async function inicializarBuscador() {
    await cargarProductos();
    
    const buscador = document.getElementById('buscador');
    if (!buscador) {
        console.log('❌ No se encontró el input con id="buscador"');
        return;
    }
    
    buscador.addEventListener('input', (e) => {
        clearTimeout(timeoutBusqueda);
        const termino = e.target.value.trim();
        
        if (termino.length < 2) {
            document.querySelector('.buscador-dropdown')?.remove();
            return;
        }
        
        timeoutBusqueda = setTimeout(() => {
            const resultados = buscarProductos(termino);
            mostrarResultados(resultados, buscador);
        }, 300);
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!buscador.contains(e.target)) {
            document.querySelector('.buscador-dropdown')?.remove();
        }
    });
}

// ============================================
// 7. CSS PARA RESALTADO
// ============================================
const estilo = document.createElement('style');
estilo.textContent = `
    .resaltado {
        animation: pulse 0.6s ease;
        box-shadow: 0 0 0 3px #25D366, 0 0 0 6px rgba(37,211,102,0.3) !important;
        scroll-margin: 100px;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); background: rgba(37,211,102,0.15); }
        100% { transform: scale(1); }
    }
    
    .buscador-dropdown::-webkit-scrollbar {
        width: 6px;
    }
    .buscador-dropdown::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .buscador-dropdown::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
`;
document.head.appendChild(estilo);

// Iniciar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarBuscador();
    resaltarProducto();
});
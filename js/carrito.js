// ============================================
// CARRITO FLOTANTE - GUARANÍES (G/S)
// ============================================

window.miCarrito = window.miCarrito || [];

// ============================================
// AGREGAR AL CARRITO
// ============================================
window.agregarCarrito = function(nombre, precio) {
    let precioLimpio = parseFloat(String(precio).replace(/[$.]/g, '').replace(',', '.'));
    if (isNaN(precioLimpio)) precioLimpio = 0;
    
    const existe = window.miCarrito.find(item => item.nombre === nombre);
    
    if (existe) {
        existe.cantidad++;
    } else {
        window.miCarrito.push({ nombre, precio: precioLimpio, cantidad: 1 });
    }
    
    actualizarCarritoVisual();
    mostrarNotificacion(nombre);
};

// ============================================
// FORMATEAR PRECIO EN GUARANÍES (G/S)
// ============================================
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(precio).replace('PYG', 'Gs');
}

// ============================================
// NOTIFICACIÓN BONITA
// ============================================
function mostrarNotificacion(nombre) {
    const notif = document.createElement('div');
    notif.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
            <div style="background:#25D366;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;">✅</div>
            <div>
                <div style="font-weight:600;">¡Agregado!</div>
                <div style="font-size:13px;color:#666;">${nombre}</div>
            </div>
        </div>
    `;
    notif.style.cssText = `
        position:fixed;
        bottom:100px;
        right:20px;
        background:white;
        padding:12px 18px;
        border-radius:16px;
        box-shadow:0 10px 25px -5px rgba(0,0,0,0.15);
        z-index:20001;
        animation: slideInRight 0.3s ease;
        border-left:4px solid #25D366;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// ============================================
// ACTUALIZAR VISUAL DEL CARRITO
// ============================================
function actualizarCarritoVisual() {
    const totalItems = window.miCarrito.reduce((sum, i) => sum + i.cantidad, 0);
    const contador = document.getElementById('carritoContador');
    if (contador) contador.textContent = totalItems;
    
    const total = calcularTotal();
    const resumen = document.getElementById('carritoResumenTexto');
    if (resumen) {
        if (totalItems === 0) {
            resumen.innerHTML = `<span>🛒 Vacío</span><span>${formatearPrecio(0)}</span>`;
        } else {
            const ultimo = window.miCarrito[window.miCarrito.length - 1];
            resumen.innerHTML = `<span>${ultimo.nombre}</span><span>${formatearPrecio(total)}</span>`;
        }
    }
}

function calcularTotal() {
    return window.miCarrito.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
}

// ============================================
// ABRIR MODAL DEL CARRITO
// ============================================
function abrirCarrito() {
    if (window.miCarrito.length === 0) {
        mostrarNotificacionVacia();
        return;
    }
    
    let productosHTML = '';
    let total = 0;
    
    window.miCarrito.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        productosHTML += `
            <div class="carrito-modal-item">
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-precio">${formatearPrecio(item.precio)} c/u</div>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="cantidad-btn" onclick="window.cambiarCantidad(${i}, -1)">−</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button class="cantidad-btn" onclick="window.cambiarCantidad(${i}, 1)">+</button>
                </div>
                <div class="carrito-item-subtotal">${formatearPrecio(subtotal)}</div>
                <button class="carrito-item-eliminar" onclick="window.eliminarProducto(${i})">🗑️</button>
            </div>
        `;
    });
    
    const modalHTML = `
        <div id="carritoModal" class="carrito-modal-overlay">
            <div class="carrito-modal-container">
                <div class="carrito-modal-header">
                    <div class="carrito-modal-titulo">
                        <span>🛒</span>
                        <h2>Mi Carrito</h2>
                    </div>
                    <button class="carrito-modal-cerrar" onclick="cerrarModal()">✕</button>
                </div>
                <div class="carrito-modal-body">
                    ${productosHTML}
                </div>
                <div class="carrito-modal-footer">
                    <div class="carrito-total">
                        <span>Total</span>
                        <span>${formatearPrecio(total)}</span>
                    </div>
                    <button class="carrito-whatsapp-btn" onclick="enviarWhatsApp()">
                        📲 Enviar pedido a WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function mostrarNotificacionVacia() {
    const notif = document.createElement('div');
    notif.innerHTML = `🛒 El carrito está vacío`;
    notif.style.cssText = `position:fixed;bottom:100px;right:20px;background:#1a2a4f;color:white;padding:12px 20px;border-radius:16px;z-index:20001;font-size:14px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.2);`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// ============================================
// CAMBIAR CANTIDAD
// ============================================
window.cambiarCantidad = function(index, cambio) {
    const nueva = window.miCarrito[index].cantidad + cambio;
    if (nueva <= 0) {
        window.miCarrito.splice(index, 1);
    } else {
        window.miCarrito[index].cantidad = nueva;
    }
    actualizarCarritoVisual();
    cerrarModal();
    if (window.miCarrito.length > 0) abrirCarrito();
};

window.eliminarProducto = function(index) {
    window.miCarrito.splice(index, 1);
    actualizarCarritoVisual();
    cerrarModal();
    if (window.miCarrito.length > 0) abrirCarrito();
    else mostrarNotificacionVacia();
};

window.cerrarModal = function() {
    const modal = document.getElementById('carritoModal');
    if (modal) modal.remove();
};

// ============================================
// ENVIAR A WHATSAPP
// ============================================
window.enviarWhatsApp = function() {
    if (window.miCarrito.length === 0) return;
    
    let mensaje = `🛍️ *NUEVO PEDIDO* 🛍️%0A%0A`;
    mensaje += `📋 *PRODUCTOS:*%0A`;
    mensaje += `─────────────────%0A`;
    
    window.miCarrito.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `${i+1}. *${item.nombre}*%0A`;
        mensaje += `   Cantidad: ${item.cantidad}%0A`;
        mensaje += `   Precio: ${formatearPrecio(item.precio)}%0A`;
        mensaje += `   Subtotal: ${formatearPrecio(subtotal)}%0A`;
        mensaje += `─────────────────%0A`;
    });
    
    mensaje += `%0A💰 *TOTAL: ${formatearPrecio(calcularTotal())}*%0A%0A`;
    mensaje += `📅 ${new Date().toLocaleString()}`;
    
    // 👇 CAMBIA ESTE NÚMERO POR EL TUYO 👇
    const numeroWhatsApp = "595993574822";
    
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
};

// ============================================
// CREAR BOTÓN FLOTANTE BONITO
// ============================================
function crearBotonFlotante() {
    if (document.getElementById('carritoFlotante')) return;
    
    const btn = document.createElement('div');
    btn.id = 'carritoFlotante';
    btn.className = 'carrito-flotante';
    btn.onclick = abrirCarrito;
    btn.innerHTML = `
        <img src="img/carritologo.png" 
         style="width: 28px; height: 28px; object-fit: contain;">
    <span class="carrito-contador" id="carritoContador">0</span>
</div>
<div class="carrito-resumen" id="carritoResumenTexto">
    <span>🛒 Vacío</span>
    <span>G/S 0</span>
    `;
    document.body.appendChild(btn);
}

// ============================================
// AGREGAR ESTILOS CSS
// ============================================
function agregarEstilos() {
    const estilos = document.createElement('style');
    estilos.textContent = `
        /* Botón flotante */
        .carrito-flotante {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: white;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 20px 10px 16px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 10px 30px -8px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0,0,0,0.05);
            backdrop-filter: blur(10px);
            background: rgba(255,255,255,0.95);
        }
        
        .carrito-flotante:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 35px -10px rgba(0,0,0,0.25);
        }
        
        .carrito-icono {
            position: relative;
            font-size: 26px;
        }
        
        .carrito-contador {
            position: absolute;
            top: -10px;
            right: -12px;
            background: #ff4757;
            color: white;
            font-size: 11px;
            font-weight: bold;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .carrito-resumen {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 12px;
            line-height: 1.3;
            border-left: 1.5px solid #e2e8f0;
            padding-left: 12px;
        }
        
        .carrito-resumen span:first-child {
            font-weight: 700;
            color: #1e293b;
            max-width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .carrito-resumen span:last-child {
            font-weight: 600;
            color: #2c5282;
            font-size: 13px;
        }
        
        /* Modal */
        .carrito-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            animation: fadeIn 0.2s ease;
        }
        
        .carrito-modal-container {
            background: white;
            border-radius: 28px;
            width: 90%;
            max-width: 520px;
            max-height: 85%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
        }
        
        .carrito-modal-header {
            padding: 20px 24px;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .carrito-modal-titulo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .carrito-modal-titulo span {
            font-size: 28px;
        }
        
        .carrito-modal-titulo h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
        
        .carrito-modal-cerrar {
            background: rgba(255,255,255,0.15);
            border: none;
            color: white;
            font-size: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .carrito-modal-cerrar:hover {
            background: rgba(255,255,255,0.25);
            transform: scale(1.05);
        }
        
        .carrito-modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 8px 0;
        }
        
        .carrito-modal-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            gap: 12px;
            transition: background 0.2s;
        }
        
        .carrito-modal-item:hover {
            background: #f8fafc;
        }
        
        .carrito-item-info {
            flex: 2;
            min-width: 120px;
        }
        
        .carrito-item-nombre {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
        }
        
        .carrito-item-precio {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 3px;
        }
        
        .carrito-item-cantidad {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .cantidad-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: #e2e8f0;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            color: #1e293b;
        }
        
        .cantidad-btn:hover {
            background: #cbd5e1;
            transform: scale(1.05);
        }
        
        .cantidad-numero {
            min-width: 28px;
            text-align: center;
            font-weight: 600;
            color: #1e293b;
        }
        
        .carrito-item-subtotal {
            font-weight: 700;
            color: #2c5282;
            min-width: 85px;
            text-align: right;
            font-size: 14px;
        }
        
        .carrito-item-eliminar {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #cbd5e1;
            transition: all 0.2s;
            padding: 5px;
        }
        
        .carrito-item-eliminar:hover {
            color: #ff4757;
            transform: scale(1.1);
        }
        
        .carrito-modal-footer {
            padding: 20px 24px;
            border-top: 1px solid #e2e8f0;
            background: white;
        }
        
        .carrito-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 18px;
            color: #1e293b;
        }
        
        .carrito-total span:last-child {
            color: #2c5282;
            font-size: 22px;
        }
        
        .carrito-whatsapp-btn {
            width: 100%;
            padding: 14px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 60px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .carrito-whatsapp-btn:hover {
            background: #128C7E;
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(37,211,102,0.3);
        }
        
        /* Animaciones */
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(20px);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Responsive */
        @media (max-width: 640px) {
            .carrito-flotante {
                bottom: 16px;
                right: 16px;
                padding: 8px 16px 8px 12px;
                gap: 8px;
            }
            
            .carrito-resumen {
                display: none;
            }
            
            .carrito-icono {
                font-size: 22px;
            }
            
            .carrito-modal-container {
                width: 95%;
                max-height: 90%;
                border-radius: 20px;
            }
            
            .carrito-modal-item {
                padding: 12px 16px;
                flex-wrap: wrap;
            }
            
            .carrito-item-subtotal {
                min-width: auto;
            }
            
            .carrito-total {
                font-size: 18px;
            }
            
            .carrito-total span:last-child {
                font-size: 20px;
            }
        }
        
        @media (max-width: 480px) {
            .carrito-modal-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .carrito-item-subtotal {
                text-align: left;
                width: 100%;
                padding-left: 0;
            }
            
            .carrito-item-eliminar {
                position: absolute;
                right: 16px;
                top: 12px;
            }
            
            .carrito-modal-item {
                position: relative;
            }
        }
    `;
    document.head.appendChild(estilos);
}

// ============================================
// INICIAR
// ============================================
function iniciarCarrito() {
    agregarEstilos();
    crearBotonFlotante();
    actualizarCarritoVisual();
    console.log('🛒 Carrito listo - Moneda: Guaraníes (G/S)');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCarrito);
} else {
    iniciarCarrito();
}
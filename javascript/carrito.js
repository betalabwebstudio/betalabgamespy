function agregarAlCarrito(id, nombre, precio) {
    // Crear objeto del producto
    const producto = {
        id: id,
        nombre: nombre,
        precio: precio,
        cantidad: 1
    };
    
    // Obtener carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('../javascript/carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        // Si existe, aumentar cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregar nuevo
        carrito.push(producto);
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar mensaje de confirmación
    alert(`✅ ${nombre} agregado al carrito!`);
}

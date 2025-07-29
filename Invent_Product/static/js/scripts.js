
function filterByCategory(category) {
    // Actualizamos la categoría seleccionada
    currentCategory = category;
    document.getElementById('currentCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);

    // Puedes hacer una solicitud al servidor para obtener los productos de esa categoría
    fetch(`/productos_categoria/?categoria=${category}`)
        .then(response => response.json())
        .then(data => {
            // Actualiza los productos mostrados
            products = data.products;  // Asumiendo que el backend regresa los productos en formato JSON
            renderProducts();
        });
}

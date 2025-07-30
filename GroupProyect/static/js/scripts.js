// Variables globales
let products = [];
let currentCategory = '';

// Elementos del DOM
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.querySelector('input[name="buscar"]');
const categoryDropdown = document.getElementById('categoryDropdown');

// Mostrar/ocultar modal para agregar producto
function toggleProductModal() {
  if (productModal.classList.contains('hidden')) {
    productModal.classList.remove('hidden');
    productModal.classList.add('show');
    // Si es edición, no resetear ni cambiar el título
    if (!productForm.getAttribute('data-edit-id')) {
      modalTitle.textContent = 'Añadir Producto';
      productForm.reset();
      document.getElementById('productCategory').value = currentCategory || '';
    }
  } else {
    productModal.classList.add('hidden');
    productModal.classList.remove('show');
    productForm.removeAttribute('data-edit-id');
    modalTitle.textContent = 'Añadir Producto';
  }
}

// Renderizar productos en el DOM
function renderProducts(productos) {
  productList.innerHTML = '';
  if (!productos || productos.length === 0) {
    productList.innerHTML = `<p>No hay productos para mostrar.</p>`;
    return;
  }
  productos.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3 style="display:flex;align-items:center;gap:10px;">
        ${product.nombre_producto}
        <button class="btn edit-btn" title="Editar" style="padding:6px 10px;font-size:1rem;" onclick="editProduct(${product.id}, '${product.nombre_producto.replace(/'/g, "\\'")}', '${product.categoria__nombre_categoria}', ${product.stock}, ${product.precio})">
          <i class='fas fa-edit'></i>
        </button>
        <button class="btn delete-btn" title="Eliminar" style="padding:6px 10px;font-size:1rem;" onclick="window.prepareDeleteProduct(${product.id}, '${product.nombre_producto.replace(/'/g, "\\'")}')">
          <i class='fas fa-trash'></i>
        </button>
      </h3>
      <p><strong>Código:</strong> ${product.id}</p>
      <p><strong>Cantidad:</strong> ${product.stock}</p>
      <p><strong>Precio:</strong> $${parseFloat(product.precio).toFixed(2)}</p>
    `;
    productList.appendChild(card);
  });
}

// Función para editar producto (abre el modal con los datos)
window.editProduct = function(id, nombre, categoria, stock, precio) {
  toggleProductModal();
  document.getElementById('productName').value = nombre;
  document.getElementById('productCategory').value = categoria;
  document.getElementById('productQuantity').value = stock;
  document.getElementById('productPrice').value = precio;
  productForm.setAttribute('data-edit-id', id);
  modalTitle.textContent = 'Editar Producto';
}

// Modal de confirmación para eliminar
let deleteModal = null;
let deleteProductId = null;
function showDeleteModal(id, nombre) {
  if (deleteModal) deleteModal.remove();
  deleteModal = document.createElement('div');
  deleteModal.style.position = 'fixed';
  deleteModal.style.top = '0';
  deleteModal.style.left = '0';
  deleteModal.style.width = '100vw';
  deleteModal.style.height = '100vh';
  deleteModal.style.background = 'rgba(0,0,0,0.4)';
  deleteModal.style.display = 'flex';
  deleteModal.style.justifyContent = 'center';
  deleteModal.style.alignItems = 'center';
  deleteModal.style.zIndex = '9999';
  deleteModal.innerHTML = `
    <div style="background:white;padding:32px 36px;border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;min-width:320px;">
      <h2 style='color:#d32f2f;margin-bottom:18px;'>¿Eliminar producto?</h2>
      <p style='font-size:1.1rem;margin-bottom:28px;'>¿Seguro que quieres eliminar <b>${nombre}</b>?</p>
      <button id="confirmDeleteBtn" style="background:#d32f2f;color:white;padding:10px 28px;border:none;border-radius:10px;font-size:1.1rem;margin-right:18px;cursor:pointer;">Eliminar</button>
      <button id="cancelDeleteBtn" style="background:#ccc;color:#333;padding:10px 28px;border:none;border-radius:10px;font-size:1.1rem;cursor:pointer;">Cancelar</button>
    </div>
  `;
  document.body.appendChild(deleteModal);
  document.getElementById('confirmDeleteBtn').onclick = function() {
    deleteProduct(id);
    deleteModal.remove();
  };
  document.getElementById('cancelDeleteBtn').onclick = function() {
    deleteModal.remove();
  };
}

// Preparar borrado (muestra modal)
window.prepareDeleteProduct = function(id, nombre) {
  showDeleteModal(id, nombre);
}

// Eliminar producto
window.deleteProduct = function(id) {
  fetch(`/eliminar_producto/${id}/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken()
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (currentCategory) {
          filterByCategory(currentCategory);
        } else {
          fetch('/buscar_producto/?nombre=')
            .then(response => response.json())
            .then(data => {
              renderProducts(data.products);
            });
        }
      } else {
        alert('Error al eliminar producto: ' + (data.error || ''));
      }
    });
}

// Buscar productos por nombre (y categoría si está seleccionada)
function buscarProductosPorNombre(nombre) {
  let url = `/buscar_producto/?nombre=${encodeURIComponent(nombre)}`;
  if (currentCategory) {
    url += `&categoria=${encodeURIComponent(currentCategory)}`;
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
      renderProducts(data.products);
    });
}

// Filtrar productos por categoría
function filterByCategory(category) {
  currentCategory = category;
  if (category) {
    fetch(`/productos_categoria/?categoria=${encodeURIComponent(category)}`)
      .then(response => response.json())
      .then(data => {
        renderProducts(data.products);
      });
  } else {
    // Si no hay categoría seleccionada, mostrar todos los productos
    fetch('/buscar_producto/?nombre=')
      .then(response => response.json())
      .then(data => {
        renderProducts(data.products);
      });
  }
}

// Enviar formulario para agregar producto
productForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('productName').value.trim();
  const categoria = document.getElementById('productCategory').value.trim();
  const stock = document.getElementById('productQuantity').value.trim();
  const precio = document.getElementById('productPrice').value.trim();
  const editId = productForm.getAttribute('data-edit-id');

  if (!nombre || !categoria || !stock || !precio) {
    alert('Por favor, rellena todos los campos correctamente.');
    return;
  }

  let url = '/agregar_producto/';
  let method = 'POST';
  let body = {
    nombre_producto: nombre,
    categoria: categoria,
    stock: stock,
    precio: precio
  };
  if (editId) {
    url = `/editar_producto/${editId}/`;
    method = 'POST'; // Django views.py debe aceptar POST para editar
    body['edit'] = true;
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        toggleProductModal();
        productForm.removeAttribute('data-edit-id');
        if (currentCategory) {
          filterByCategory(currentCategory);
        } else {
          fetch('/buscar_producto/?nombre=')
            .then(response => response.json())
            .then(data => {
              renderProducts(data.products);
            });
        }
      } else {
        alert('Error al guardar producto: ' + (data.error || ''));
      }
    });
});

// Obtener CSRF token de la cookie
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}

// Mostrar/ocultar dropdown de categorías
function toggleCategoryDropdown() {
  categoryDropdown.classList.toggle('hidden');
}


// Eventos
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const value = this.value.trim();
    if (value.length > 0) {
      buscarProductosPorNombre(value);
    } else if (currentCategory) {
      filterByCategory(currentCategory);
    } else {
      fetch('/buscar_producto/?nombre=')
        .then(response => response.json())
        .then(data => {
          renderProducts(data.products);
        });
    }
  });
}

// Prevenir recarga y buscar al hacer submit en el formulario
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const value = searchInput.value.trim();
    if (value.length > 0) {
      buscarProductosPorNombre(value);
    } else if (currentCategory) {
      filterByCategory(currentCategory);
    } else {
      fetch('/buscar_producto/?nombre=')
        .then(response => response.json())
        .then(data => {
          renderProducts(data.products);
        });
    }
  });
}

if (categoryDropdown) {
  categoryDropdown.addEventListener('change', function () {
    const value = this.value;
    currentCategory = value;
    if (value) {
      filterByCategory(value);
    } else {
      // Si selecciona "Ver todas las categorías", mostrar todos los productos
      fetch('/buscar_producto/?nombre=')
        .then(response => response.json())
        .then(data => {
          renderProducts(data.products);
        });
    }
  });
}

// Inicial: mostrar todos los productos de la primera categoría si existe
window.addEventListener('DOMContentLoaded', function () {
  if (categoryDropdown && categoryDropdown.options.length > 1) {
    const firstCategory = categoryDropdown.options[1].value;
    filterByCategory(firstCategory);
  }
});
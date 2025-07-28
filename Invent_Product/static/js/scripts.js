// Variables globales
let products = [];
let currentCategory = '';

// Modal y formulario
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');

// Mostrar/ocultar modal para agregar o editar producto
function toggleProductModal(edit = false, productData = null) {
  if (productModal.classList.contains('hidden')) {
    productModal.classList.remove('hidden');
    productModal.classList.add('show');
    if (edit) {
      modalTitle.textContent = 'Editar Producto';
      fillForm(productData);
    } else {
      modalTitle.textContent = 'Añadir Producto';
      productForm.reset();
      document.getElementById('productCategory').value = currentCategory || '';
    }
  } else {
    productModal.classList.add('hidden');
    productModal.classList.remove('show');
  }
}

// Completar formulario al editar
function fillForm(product) {
  if (!product) return;
  document.getElementById('productName').value = product.name;
  document.getElementById('productCode').value = product.code;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productQuantity').value = product.quantity;
  document.getElementById('productPrice').value = product.price;
}

// Filtrar productos por categoría
function filterByCategory(category) {
  currentCategory = category;
  document.getElementById('currentCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
  document.getElementById('categoryDropdown').classList.add('hidden');
  renderProducts();
}

// Renderizar productos en el DOM
function renderProducts() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  const filtered = products.filter(p => p.category === currentCategory);

  if (filtered.length === 0) {
    productList.innerHTML = `<p>No hay productos en esta categoría.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Cantidad:</strong> ${product.quantity}</p>
      <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
      <button onclick='editProduct("${product.code}")' class="btn edit-btn">Editar</button>
      <button onclick='deleteProduct("${product.code}")' class="btn delete-btn">Eliminar</button>
    `;

    productList.appendChild(card);
  });
}

// Añadir o actualizar producto con el formulario
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const code = document.getElementById('productCode').value.trim();
  const category = document.getElementById('productCategory').value.trim();
  const quantity = parseInt(document.getElementById('productQuantity').value);
  const price = parseFloat(document.getElementById('productPrice').value);

  if (!name || !code || !category || isNaN(quantity) || isNaN(price)) {
    alert('Por favor, rellena todos los campos correctamente.');
    return;
  }

  const existingIndex = products.findIndex(p => p.code === code);

  if (existingIndex >= 0) {
    // Actualizar producto existente
    products[existingIndex] = { name, code, category, quantity, price };
  } else {
    // Agregar nuevo producto
    products.push({ name, code, category, quantity, price });
  }

  toggleProductModal();
  renderProducts();
});

// Eliminar producto
function deleteProduct(code) {
  const confirmDelete = confirm('¿Seguro que quieres eliminar este producto?');
  if (!confirmDelete) return;

  products = products.filter(p => p.code !== code);
  renderProducts();
}

// Editar producto (abrir modal con datos)
function editProduct(code) {
  const product = products.find(p => p.code === code);
  if (!product) return;
  toggleProductModal(true, product);
}

// Buscar productos por nombre o código
function searchProducts() {
  const query = document.getElementById('search').value.toLowerCase();
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.code.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    productList.innerHTML = `<p>No se encontraron productos que coincidan con la búsqueda.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Cantidad:</strong> ${product.quantity}</p>
      <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
      <button onclick='editProduct("${product.code}")' class="btn edit-btn">Editar</button>
      <button onclick='deleteProduct("${product.code}")' class="btn delete-btn">Eliminar</button>
    `;

    productList.appendChild(card);
  });
}

// Mostrar/ocultar dropdown de categorías
function toggleCategoryDropdown() {
  const dropdown = document.getElementById('categoryDropdown');
  dropdown.classList.toggle('hidden');
}
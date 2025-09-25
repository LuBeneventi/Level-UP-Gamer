// ====== CONFIGURACIÓN Y DATOS INICIALES ======
const bootstrap = window.bootstrap;

// Datos de productos iniciales (simulando base de datos)
let products = [
  // ... (tus productos iniciales se mantienen igual)
];

// ====== FUNCIONES DE PRODUCTOS ======
function loadProducts() {
  const savedProducts = localStorage.getItem("levelup_products");
  if (savedProducts) {
    products = JSON.parse(savedProducts);
  }
  updateProductCount();
  renderProductsTable();
}

function saveProducts() {
  localStorage.setItem("levelup_products", JSON.stringify(products));
  updateProductCount();
}

function updateProductCount() {
  const element = document.getElementById("total-products");
  if (element) {
    element.textContent = products.length;
  }
}

function renderProductsTable() {
  const tbody = document.getElementById("products-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.code}</td>
      <td>
        <div class="product-image-small">
          ${product.image ?
        `<img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">` :
        `<div class="bg-secondary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 5px;">
              <i class="fas fa-image text-muted"></i>
            </div>`
      }
        </div>
      </td>
      <td>${product.name}</td>
      <td><span class="badge bg-info">${getCategoryName(product.category)}</span></td>
      <td>$${product.price.toLocaleString()} CLP</td>
      <td>
        <span class="badge ${product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger"}">
          ${product.stock}
        </span>
      </td>
      <td>
        <span class="badge ${product.status === "active" ? "bg-success" : "bg-secondary"}">
          ${product.status === "active" ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="editProduct(${product.id})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="toggleProductStatus(${product.id})" title="Cambiar Estado">
          <i class="fas fa-toggle-on"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function getCategoryName(category) {
  const categories = {
    "juegos-mesa": "Juegos de Mesa",
    accesorios: "Accesorios",
    consolas: "Consolas",
    computadores: "Computadores",
    sillas: "Sillas Gamers",
    mouse: "Mouse",
    mousepad: "Mousepad",
    ropa: "Ropa Gamer",
  };
  return categories[category] || category;
}

function addProduct(action = 'save') {
  const form = document.getElementById("addProductForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  let imageSource = document.getElementById("productImage").value;
  const imageFile = document.getElementById("productImageFile").files[0];

  const processImage = (imageSrc) => {
    const newProduct = {
      id: Date.now(),
      code: document.getElementById("productCode").value,
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: Number.parseInt(document.getElementById("productPrice").value),
      stock: Number.parseInt(document.getElementById("productStock").value),
      rating: Number.parseFloat(document.getElementById("productRating").value),
      description: document.getElementById("productDescription").value,
      image: imageSrc,
      status: "active",
    };

    if (products.some((p) => p.code === newProduct.code)) {
      alert("Ya existe un producto con ese código");
      return;
    }

    products.push(newProduct);
    saveProducts();
    renderProductsTable();

    const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
    modal.hide();
    form.reset();
    document.getElementById("imagePreview").style.display = "none";

    showNotification("Producto agregado exitosamente", "success");

    if (action === 'view') {
      window.open("productos.html", "_blank");
    }
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => processImage(e.target.result);
    reader.readAsDataURL(imageFile);
  } else {
    processImage(imageSource);
  }
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductCode").value = product.code;
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductCategory").value = product.category;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductStock").value = product.stock;
  document.getElementById("editProductRating").value = product.rating;
  document.getElementById("editProductDescription").value = product.description;
  document.getElementById("editProductImage").value = product.image;

  const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
  modal.show();
}

function updateProduct(action = 'save') {
  const id = Number.parseInt(document.getElementById("editProductId").value);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) return;

  let imageSource = document.getElementById("editProductImage").value;
  const imageFile = document.getElementById("editProductImageFile").files[0];

  const processUpdate = (imageSrc) => {
    products[productIndex] = {
      ...products[productIndex],
      code: document.getElementById("editProductCode").value,
      name: document.getElementById("editProductName").value,
      category: document.getElementById("editProductCategory").value,
      price: Number.parseInt(document.getElementById("editProductPrice").value),
      stock: Number.parseInt(document.getElementById("editProductStock").value),
      rating: Number.parseFloat(document.getElementById("editProductRating").value),
      description: document.getElementById("editProductDescription").value,
      image: imageSrc,
    };

    saveProducts();
    renderProductsTable();

    const modal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"));
    modal.hide();
    document.getElementById("editImagePreview").style.display = "none";

    showNotification("Producto actualizado exitosamente", "success");

    if (action === 'view') {
      window.open("productos.html", "_blank");
    }
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => processUpdate(e.target.result);
    reader.readAsDataURL(imageFile);
  } else {
    processUpdate(imageSource || products[productIndex].image);
  }
}

function toggleProductStatus(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  product.status = product.status === "active" ? "inactive" : "active";
  saveProducts();
  renderProductsTable();
  showNotification(`Producto ${product.status === "active" ? "activado" : "desactivado"}`, "info");
}

function deleteProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
    products = products.filter((p) => p.id !== id);
    saveProducts();
    renderProductsTable();
    showNotification("Producto eliminado exitosamente", "success");
  }
}

// ====== FUNCIONES DE PEDIDOS ======
function cargarPedidos(orderDirection = "desc", searchQuery = "") {
  let orders = JSON.parse(localStorage.getItem("levelup_orders")) || [];
  let users = JSON.parse(localStorage.getItem("levelup_users")) || [];

  // Ordenar por fecha
  orders.sort((a, b) => {
    return orderDirection === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  // Filtrar por cliente (usando RUT en lugar de nombre)
  if (searchQuery) {
    orders = orders.filter(order => {
      let user = users.find(u => u.id === order.userId);
      let userRun = user ? String(user.run).toLowerCase() : "desconocido"; // 👈 aseguramos string
      return userRun.includes(searchQuery.toLowerCase());
    });
  }

  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  orders.forEach(order => {
    let user = users.find(u => u.id === order.userId);
    let userRun = user ? user.run : "Desconocido";
    let fecha = new Date(order.date).toLocaleDateString();

    tbody.innerHTML += `
      <tr>
        <td>#${order.id}</td>
        <td>${userRun}</td>
        <td>${fecha}</td>
        <td>$${order.total.toLocaleString()} CLP</td>
        <td>
          <span class="badge ${order.status === "pendiente" ? "bg-warning" :
        order.status === "completado" ? "bg-success" :
          order.status === "cancelado" ? "bg-danger" : "bg-secondary"
      }">${order.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1" onclick="verPedido('${order.id}')">
            <i class="fas fa-eye"></i>
          </button>
          ${order.status === "pendiente" ? `
            <button class="btn btn-sm btn-outline-success me-1" onclick="cambiarEstado('${order.id}', 'completado')">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="cambiarEstado('${order.id}', 'cancelado')">
              <i class="fas fa-times"></i>
            </button>
          ` : `
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPedido('${order.id}')">
              <i class="fas fa-trash"></i>
            </button>
          `}
        </td>
      </tr>
    `;
  });
}


// ====== EVENTOS ======
const filter = document.getElementById("orderDateFilter");
if (filter) {
  filter.addEventListener("change", () => {
    const search = document.getElementById("orderSearchInput").value;
    cargarPedidos(filter.value, search);
  });
}

const searchInput = document.getElementById("orderSearchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const direction = document.getElementById("orderDateFilter").value;
    cargarPedidos(direction, searchInput.value);
  });
}

// Render inicial
cargarPedidos();


function cambiarEstado(id, nuevoEstado) {
  let orders = JSON.parse(localStorage.getItem("levelup_orders")) || [];
  orders = orders.map(o => o.id === id ? { ...o, status: nuevoEstado } : o);
  localStorage.setItem("levelup_orders", JSON.stringify(orders));
  cargarPedidos();
}

function eliminarPedido(id) {
  if (!confirm("¿Seguro que quieres eliminar este pedido?")) return;

  let orders = JSON.parse(localStorage.getItem("levelup_orders")) || [];
  orders = orders.filter(o => o.id !== id);
  localStorage.setItem("levelup_orders", JSON.stringify(orders));
  cargarPedidos();
}

function verPedido(id) {
  let orders = JSON.parse(localStorage.getItem("levelup_orders")) || [];
  let users = JSON.parse(localStorage.getItem("levelup_users")) || [];

  let order = orders.find(o => o.id === id);
  if (!order) return;

  let user = users.find(u => u.id === order.userId);
  let userRun = user ? user.run : "Desconocido"; // 👈 acá definimos el RUN
  let fecha = new Date(order.date).toLocaleString();

  const detallesHTML = `
    <p><strong>Pedido #${order.id}</strong></p>
    <p><strong>Cliente (RUN):</strong> ${userRun}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Total:</strong> $${order.total.toLocaleString()} CLP</p>
    <p><strong>Estado:</strong> ${order.status}</p>
    <p><strong>Descuento:</strong> ${order.discount}%</p>
    <p><strong>Puntos LevelUp:</strong> ${order.levelUpPointsEarned}</p>
    <p><strong>Items:</strong></p>
    <ul>${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}</ul>
  `;

  document.getElementById("orderModalBody").innerHTML = detallesHTML;
  new bootstrap.Modal(document.getElementById("orderModal")).show();
}

// ====== FUNCIONES DE EVENTOS ======
function loadEvents() {
  const eventsList = document.getElementById('eventos-list');
  if (!eventsList) return;

  const events = JSON.parse(localStorage.getItem('events')) || [];
  eventsList.innerHTML = '';

  if (events.length === 0) {
    eventsList.innerHTML = '<li class="list-group-item text-center text-muted">No hay eventos guardados.</li>';
    return;
  }

  events.forEach((event, index) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-white', 'border-secondary');
    li.innerHTML = `
      <div>
        <strong>${event.nombre}</strong><br>
        <small class="text-muted">${event.fecha} - ${event.lugar}</small>
      </div>
      <div class="d-flex">
        <span class="badge bg-neon-green me-2">${event.puntos} Pts</span>
        <button class="btn btn-sm btn-outline-warning" onclick="editEvent(${index})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteEvent(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    eventsList.appendChild(li);
  });
}

function editEvent(index) {
  const events = JSON.parse(localStorage.getItem('events'));
  const eventToEdit = events[index];

  document.getElementById('editEventName').value = eventToEdit.nombre;
  document.getElementById('editEventDescription').value = eventToEdit.descripcion;
  document.getElementById('editEventDate').value = eventToEdit.fecha;
  document.getElementById('editEventLocation').value = eventToEdit.lugar;
  document.getElementById('editEventPoints').value = eventToEdit.puntos;
  document.getElementById('editEventIndex').value = index;

  new bootstrap.Modal(document.getElementById('editEventModal')).show();
}

function saveEditedEvent() {
  const index = document.getElementById('editEventIndex').value;
  const events = JSON.parse(localStorage.getItem('events'));

  events[index].nombre = document.getElementById('editEventName').value;
  events[index].descripcion = document.getElementById('editEventDescription').value;
  events[index].fecha = document.getElementById('editEventDate').value;
  events[index].lugar = document.getElementById('editEventLocation').value;
  events[index].puntos = document.getElementById('editEventPoints').value;

  localStorage.setItem('events', JSON.stringify(events));
  showNotification('Evento actualizado exitosamente!', 'success');
  loadEvents();
  bootstrap.Modal.getInstance(document.getElementById('editEventModal')).hide();
}

function deleteEvent(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
    let events = JSON.parse(localStorage.getItem('events'));
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
  }
}

// ====== CONFIGURACIÓN ======
const availableLevels = ['Bronce', 'Plata', 'Oro', 'Diamante']; // Puedes cambiar esto

// ====== FUNCIONES DE USUARIOS ======
function loadUsers() {
  const usersTableBody = document.getElementById('usersTableBody');
  if (!usersTableBody) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  usersTableBody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    const statusClass = user.status === 'Activo' ? 'bg-success' : 'bg-secondary';

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.registrationDate}</td>
      <td><span class="badge bg-info">${user.level}</span></td>
      <td>${user.points}</td>
      <td><span class="badge ${statusClass}">${user.status}</span></td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-1" onclick="openEditUserModal('${user.id}')" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="toggleUserStatus('${user.id}')" title="Activar/Inactivar">
          <i class="fas ${user.status === 'Activo' ? 'fa-user-slash' : 'fa-user-check'}"></i>
        </button>
      </td>
    `;
    usersTableBody.appendChild(row);
  });
}

// ====== EDITAR USUARIO ======
function openEditUserModal(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userToEdit = users.find(user => user.id === userId);

  if (userToEdit) {
    document.getElementById('editUserId').value = userToEdit.id;
    document.getElementById('editUserName').value = userToEdit.name;
    document.getElementById('editUserPoints').value = userToEdit.points;

    // Crear opciones dinámicamente para el dropdown de nivel
    const levelSelect = document.getElementById('editUserLevel');
    levelSelect.innerHTML = ''; // Limpiar primero
    availableLevels.forEach(level => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = level;
      if (level === userToEdit.level) {
        option.selected = true;
      }
      levelSelect.appendChild(option);
    });

    new bootstrap.Modal(document.getElementById('editUserModal')).show();
  }
}

function saveUserChanges() {
  const userId = document.getElementById('editUserId').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex].name = document.getElementById('editUserName').value;
    users[userIndex].points = parseInt(document.getElementById('editUserPoints').value);
    users[userIndex].level = document.getElementById('editUserLevel').value;

    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Cambios de usuario guardados exitosamente!', 'success');
    loadUsers();
    bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
  }
}

// ====== ACTIVAR / DESACTIVAR USUARIO ======
function toggleUserStatus(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex].status = users[userIndex].status === 'Activo' ? 'Inactivo' : 'Activo';
    localStorage.setItem('users', JSON.stringify(users));

    const newStatus = users[userIndex].status === 'Activo' ? 'activado' : 'desactivado';
    showNotification(`El usuario ha sido ${newStatus} correctamente.`, 'info');
    loadUsers();
  }
}


// ====== FUNCIONES UTILITARIAS ======
function showSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(section => {
    section.style.display = 'none';
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }

  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  if (sectionId === 'products') {
    renderProductsTable();
  } else if (sectionId === 'orders') {
    cargarPedidos();
  } else if (sectionId === 'events') {
    loadEvents();
  } else if (sectionId === 'users') {
    loadUsers();
  } else if (sectionId === 'dashboard') {
    updateDashboardStats();
  }
}

function updateDashboardStats() {
  const products = JSON.parse(localStorage.getItem('levelup_products')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const orders = JSON.parse(localStorage.getItem('levelup_orders')) || [];

  const totalProducts = document.getElementById('total-products');
  const totalUsers = document.getElementById('total-users');
  const totalOrders = document.getElementById('total-orders');
  const totalSales = document.getElementById('total-sales');

  if (totalProducts) totalProducts.textContent = products.length;
  if (totalUsers) totalUsers.textContent = users.length;
  if (totalOrders) totalOrders.textContent = orders.length;

  if (totalSales) {
    const salesTotal = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    totalSales.textContent = `$${salesTotal.toLocaleString('es-CL')}`;
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type === "success" ? "success" : type === "error" ? "danger" : "info"} alert-dismissible fade show position-fixed`;
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("isAdmin");
    window.location.href = "index.html";
  }
}

function exportProducts() {
  localStorage.setItem("levelup_products_public", JSON.stringify(products.filter((p) => p.status === "active")));
  showNotification("Productos exportados a la tienda principal", "success");
}

function previewImage(input, previewId) {
  const file = input.files[0];
  const preview = document.getElementById(previewId);
  const previewImg = preview.querySelector("img");

  if (file && preview && previewImg) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else if (preview) {
    preview.style.display = "none";
  }
}

// ====== INICIALIZACIÓN ======
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const isAdmin = localStorage.getItem("isAdmin");
  if (!isAdmin) {
    const password = prompt("Ingresa la contraseña de administrador:");
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Contraseña incorrecta");
      window.location.href = "index.html";
      return;
    }
  }

  // Inicializar datos
  loadProducts();
  updateDashboardStats();
  showSection('dashboard');

  // Configurar listeners de modales
  const addModal = document.getElementById("addProductModal");
  const editModal = document.getElementById("editProductModal");

  if (addModal) {
    addModal.addEventListener("hidden.bs.modal", () => {
      const preview = document.getElementById("imagePreview");
      if (preview) preview.style.display = "none";
    });
  }

  if (editModal) {
    editModal.addEventListener("hidden.bs.modal", () => {
      const preview = document.getElementById("editImagePreview");
      if (preview) preview.style.display = "none";
    });
  }

  // Configurar filtro de pedidos
  const filter = document.getElementById("orderDateFilter");
  if (filter) {
    filter.addEventListener("change", () => {
      cargarPedidos(filter.value);
    });
  }

  addEventForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const eventDateValue = document.getElementById('eventDate').value;
    const eventDate = new Date(eventDateValue);
    const today = new Date();
  
    // Calcular la fecha límite (una semana antes de hoy)
    const oneWeekBefore = new Date(today);
    oneWeekBefore.setDate(today.getDate() - 7);
  
    if (eventDate < oneWeekBefore) {
      showNotification('No se pueden registrar eventos con fecha anterior a una semana desde hoy.', 'error');
      return; // salir para no guardar el evento
    }
  
    const newEvent = {
      nombre: document.getElementById('eventName').value,
      descripcion: document.getElementById('eventDescription').value,
      fecha: eventDateValue,
      lugar: document.getElementById('eventLocation').value,
      puntos: document.getElementById('eventPoints').value
    };
  
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
  
    showNotification('Evento guardado exitosamente!', 'success');
    addEventForm.reset();
    loadEvents();
  });
  

  // Inicializar usuarios si no existen
  if (!localStorage.getItem('users')) {
    const initialUsers = [
      { id: '001', name: 'Juan Pérez', email: 'juan@email.com', registrationDate: '2024-01-10', level: 'Bronce', points: 250, status: 'Activo' },
      { id: '002', name: 'María Gómez', email: 'maria@email.com', registrationDate: '2024-02-15', level: 'Plata', points: 600, status: 'Activo' },
      { id: '003', name: 'Carlos López', email: 'carlos@email.com', registrationDate: '2024-03-20', level: 'Oro', points: 1200, status: 'Activo' }
    ];
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
});
const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");
if (refreshOrdersBtn) {
  refreshOrdersBtn.addEventListener("click", () => {
    const orderDirection = document.getElementById("orderDateFilter").value;
    const searchQuery = document.getElementById("orderSearchInput").value;
    cargarPedidos(orderDirection, searchQuery);
  });
}

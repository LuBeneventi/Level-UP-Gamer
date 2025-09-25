
// ====== CONFIGURACIÓN Y DATOS INICIALES ======
const bootstrap = window.bootstrap;

// --- Variables globales del estado de la app ---
let cart = [];                // Carrito de compras (productos normales y de recompensa)
let cartTotal = 0;            // Total en CLP del carrito (solo productos normales)
let currentUser = null;       // Usuario actualmente logueado
let users = [];               // Lista de todos los usuarios registrados
let orders = [];              // Historial de pedidos
let levelUpPoints = 0;        // Puntos globales (aunque se usan desde currentUser)

// --- Catálogo de productos normales (se compran con dinero) ---
const products = {
  JM001: { name: "Catan", price: 29990, category: "juegos-mesa" },
  JM002: { name: "Carcassonne", price: 24990, category: "juegos-mesa" },
  AC001: { name: "Controlador Inalámbrico Xbox Series X", price: 59990, category: "accesorios" },
  AC002: { name: "Auriculares Gamer HyperX Cloud II", price: 79990, category: "accesorios" },
  CO001: { name: "PlayStation 5", price: 549990, category: "consolas" },
  CG001: { name: "PC Gamer ASUS ROG Strix", price: 1299990, category: "computadores" },
  SG001: { name: "Silla Gamer Secretlab Titan", price: 349990, category: "sillas" },
  MS001: { name: "Mouse Gamer Logitech G502 HERO", price: 49990, category: "mouse" },
  MP001: { name: "Mousepad Razer Goliathus Extended Chroma", price: 29990, category: "mousepad" },
  PP001: { name: "Polera Gamer Personalizada Level-Up", price: 14990, category: "ropa" },
};

// --- Productos de recompensa (se canjean con puntos LevelUp) ---
const rewardProducts = {
  RW001: { name: "LLavero pixelart", points: 6000 },
  RW002: { name: "Limpiador de Pantallas", points: 4500 },
  RW003: { name: "Stickers Level-up Gamer", points: 1200 },
  RW004: { name: "Termo termico", points: 7800 },
  RW005: { name: "Posavasos a tu elección", points: 2500 },
  RW006: { name: "Separadores de Libros", points: 2000 },
};

// ===================================================================
// =================== GESTIÓN DE DATOS (localStorage) ================
// ===================================================================

/**
 * Carga todos los datos guardados en localStorage al iniciar la app.
 */
function loadDataFromStorage() {
  try {
    const savedCart = localStorage.getItem("levelup_cart");
    if (savedCart) cart = JSON.parse(savedCart);

    const savedUser = localStorage.getItem("levelup_current_user");
    if (savedUser) currentUser = JSON.parse(savedUser);

    const savedUsers = localStorage.getItem("levelup_users");
    if (savedUsers) users = JSON.parse(savedUsers);

    const savedOrders = localStorage.getItem("levelup_orders");
    if (savedOrders) orders = JSON.parse(savedOrders);

    const savedPoints = localStorage.getItem("levelup_points");
    if (savedPoints) levelUpPoints = parseInt(savedPoints) || 0;

    console.log("[v1] Data loaded from localStorage");
  } catch (error) {
    console.error("[v1] Error loading data from localStorage:", error);
  }
}

/**
 * Guarda el estado actual de la app en localStorage.
 */
function saveDataToStorage() {
  try {
    localStorage.setItem("levelup_cart", JSON.stringify(cart));
    localStorage.setItem("levelup_current_user", JSON.stringify(currentUser));
    localStorage.setItem("levelup_users", JSON.stringify(users));
    //localStorage.setItem("levelup_orders", JSON.stringify(orders));
    localStorage.setItem("levelup_points", levelUpPoints.toString());
  } catch (error) {
    console.error("[v1] Error saving data to localStorage:", error);
  }
}

// ===================================================================
// =================== FUNCIONALIDAD DEL CARRITO =====================
// ===================================================================

/**
 * Agrega un producto normal (con precio en CLP) al carrito.
 */
function addToCart(productId) {
  const product = products[productId];
  if (!product) {
    console.error("[v1] Product not found:", productId);
    showNotification("Producto no encontrado", "danger");
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: "product"
    });
  }

  saveDataToStorage();
  updateCartCounter(); // El contador del navbar siempre está presente
  showCartNotification(product.name);
  console.log("[v1] Product added to cart:", product.name);
}

/**
 * Agrega un producto de recompensa (con puntos) al carrito.
 * Solo verifica disponibilidad de puntos, NO los descuenta aún.
 */
function addToCartWithPoints(productId) {
  const product = rewardProducts[productId];
  if (!product) {
    console.error("[v1] Reward product not found:", productId);
    showNotification("Producto de canje no encontrado", "danger");
    return;
  }

  if (!currentUser) {
    showNotification("Debes iniciar sesión para canjear productos.", "warning");
    return;
  }

  if (currentUser.levelUpPoints < product.points) {
    showNotification(`No tienes suficientes puntos. Necesitas ${product.points.toLocaleString()} puntos.`, "warning");
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      points: product.points,
      quantity: 1,
      type: "reward"
    });
  }

  saveDataToStorage();
  updateCartCounter();
  showCartNotification(product.name);
  console.log("[v1] Reward product added to cart:", product.name);
}

/**
 * Actualiza el número del contador del carrito en el navbar.
 */
function updateCartCounter() {
  const cartCounter = document.getElementById("cart-counter");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCounter) cartCounter.textContent = totalItems;
}

/**
 * Renderiza el contenido del modal del carrito.
 * Solo se llama cuando el modal se abre (evento show.bs.modal).
 */
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalElement) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
    cartTotalElement.textContent = "$0 CLP";
    return;
  }

  let cartHTML = "";
  let totalCLP = 0;
  let totalPoints = 0;

  cart.forEach((item) => {
    let itemTotalText, itemTotalValue;

    if (item.type === "reward") {
      itemTotalValue = item.points * item.quantity;
      totalPoints += itemTotalValue;
      itemTotalText = `${itemTotalValue.toLocaleString()} Puntos`;
    } else {
      itemTotalValue = item.price * item.quantity;
      totalCLP += itemTotalValue;
      itemTotalText = `$${itemTotalValue.toLocaleString()} CLP`;
    }

    cartHTML += `
      <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3" style="background-color: var(--color-dark-gray); border-radius: 8px;">
        <div>
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">
            ${item.type === "reward" ? `${item.points.toLocaleString()} Puntos x ${item.quantity}` : `$${item.price.toLocaleString()} CLP x ${item.quantity}`}
          </small>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="changeQuantity('${item.id}', -1)">-</button>
          <span class="me-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="changeQuantity('${item.id}', 1)">+</button>
          <strong>${itemTotalText}</strong>
          <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  let totalText = "";
  if (totalCLP > 0) totalText += `$${totalCLP.toLocaleString()} CLP`;
  if (totalPoints > 0) totalText += (totalText ? " + " : "") + `${totalPoints.toLocaleString()} Puntos`;
  if (totalText === "") totalText = "$0 CLP";

  cartItemsContainer.innerHTML = cartHTML;
  cartTotalElement.textContent = totalText;
  cartTotal = totalCLP;
}

/**
 * Cambia la cantidad de un producto en el carrito.
 */
function changeQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartCounter();
    saveDataToStorage();
  }
}

/**
 * Elimina un producto del carrito.
 */
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartCounter();
  saveDataToStorage();
  updateCartModal(); // Actualiza el modal inmediatamente
  console.log("[v1] Product removed from cart:", productId);
}

/**
 * Vacía completamente el carrito.
 */
function clearCart() {
  // Vaciar el array en memoria
  cart = [];

  // Guardar en localStorage
  saveDataToStorage(); // Asegúrate de que esta función guarda `cart`

  // Actualizar contador
  updateCartCounter();

  // Actualizar el contenido del modal inmediatamente
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = "$0 CLP";
  }
}

// Conectar el botón "Vaciar carrito"
const btnClearCart = document.getElementById("btnClearCart");
const notification = document.getElementById("cartNotification");

if (btnClearCart && notification) {
  btnClearCart.addEventListener("click", () => {
    clearCart();
  });
}

/**
 * Muestra una notificación flotante al agregar un producto.
 */
function showCartNotification(productName) {
  const notification = document.createElement("div");
  notification.className = "alert alert-success position-fixed";
  notification.style.cssText = `
    top: 100px;
    right: 20px;
    z-index: 9999;
    background-color: var(--color-neon-green);
    color: var(--color-black);
    border: none;
    animation: slideInRight 0.3s ease;
  `;
  notification.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${productName} agregado al carrito`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===================================================================
// =================== FUNCIONALIDAD DE USUARIOS =====================
// ===================================================================

/**
 * Maneja el registro de un nuevo usuario.
 */
function handleRegistration() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const age = document.getElementById("regAge").value;
  const password = document.getElementById("regPassword").value;
  const referralCode = document.getElementById("referralCode").value;

  const birthDate = new Date(age);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  if (ageInYears < 18) {
    showNotification("Debes ser mayor de 18 años para registrarte.", "warning");
    return;
  }

  if (users.find((user) => user.email === email)) {
    showNotification("Este email ya está registrado.", "warning");
    return;
  }

  const isDuocEmail = email.includes("@duocuc.cl");
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    birthDate: age,
    isDuocStudent: isDuocEmail,
    discount: isDuocEmail ? 20 : 0,
    levelUpPoints: referralCode ? 100 : 0,
    level: 1,
    registrationDate: new Date().toISOString(),
    referralCode: referralCode || null,
  };

  users.push(newUser);
  currentUser = newUser;
  saveDataToStorage();

  let message = "¡Registro exitoso!";
  if (isDuocEmail) message += " Has obtenido un 20% de descuento de por vida por tu email Duoc.";
  if (referralCode) message += " Has ganado 100 puntos LevelUp por usar un código de referido.";
  showNotification(message, "success");

  updateUserInterface();
  bootstrap.Modal.getInstance(document.getElementById("registerModal"))?.hide();
  console.log("[v1] User registered:", newUser);
}

/**
 * Maneja el inicio de sesión.
 */
function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    saveDataToStorage();
    updateUserInterface();

    if (user.needsPasswordChange) {
      showNotification(`¡Bienvenido de vuelta, ${user.name}! Debes cambiar tu contraseña temporal.`, "warning");
      bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
      setTimeout(openChangePassword, 500);
    } else {
      showNotification(`¡Bienvenido de vuelta, ${user.name}!`, "success");
      bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
    }
  } else {
    showNotification("Email o contraseña incorrectos.", "danger");
  }
}

/**
 * Genera una contraseña temporal aleatoria.
 */
function generateTempPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

/**
 * Maneja el olvido de contraseña.
 */
function handleForgotPassword() {
  const email = document.getElementById("forgotEmail").value;
  const user = users.find((u) => u.email === email);
  if (user) {
    const tempPassword = generateTempPassword();
    user.password = tempPassword;
    user.needsPasswordChange = true;
    users[users.findIndex((u) => u.email === email)] = user;
    saveDataToStorage();
    showNotification(`Nueva contraseña temporal: ${tempPassword}\nCámbiala al iniciar sesión.`, "info");
    bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"))?.hide();
    document.getElementById("forgotPasswordForm").reset();
  } else {
    showNotification("No se encontró ninguna cuenta con ese email.", "warning");
  }
}

/**
 * Abre el modal para editar perfil.
 */
function openEditProfile() {
  if (!currentUser) return;
  document.getElementById("editName").value = currentUser.name;
  document.getElementById("editEmail").value = currentUser.email;
  document.getElementById("editBirthDate").value = currentUser.birthDate;
  bootstrap.Modal.getInstance(document.getElementById("profileModal"))?.hide();
  new bootstrap.Modal(document.getElementById("editProfileModal")).show();
}

/**
 * Guarda los cambios del perfil.
 */
function handleEditProfile() {
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  const birthDate = document.getElementById("editBirthDate").value;

  if (users.find((u) => u.email === email && u.id !== currentUser.id)) {
    showNotification("Este email ya está en uso por otra cuenta.", "warning");
    return;
  }

  const isDuocEmail = email.includes("@duocuc.cl");
  currentUser.name = name;
  currentUser.email = email;
  currentUser.birthDate = birthDate;
  currentUser.isDuocStudent = isDuocEmail;
  currentUser.discount = isDuocEmail ? 20 : 0;

  users[users.findIndex((u) => u.id === currentUser.id)] = currentUser;
  saveDataToStorage();
  updateUserInterface();
  showNotification("Perfil actualizado correctamente.", "success");
  bootstrap.Modal.getInstance(document.getElementById("editProfileModal"))?.hide();
}

/**
 * Abre el modal para cambiar contraseña.
 */
function openChangePassword() {
  bootstrap.Modal.getInstance(document.getElementById("profileModal"))?.hide();
  new bootstrap.Modal(document.getElementById("changePasswordModal")).show();
}

/**
 * Procesa el cambio de contraseña.
 */
function handleChangePassword() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (currentUser.password !== currentPassword) {
    showNotification("La contraseña actual es incorrecta.", "danger");
    return;
  }
  if (newPassword !== confirmPassword) {
    showNotification("Las nuevas contraseñas no coinciden.", "warning");
    return;
  }
  if (newPassword.length < 6) {
    showNotification("La nueva contraseña debe tener al menos 6 caracteres.", "warning");
    return;
  }

  currentUser.password = newPassword;
  currentUser.needsPasswordChange = false;
  users[users.findIndex((u) => u.id === currentUser.id)] = currentUser;
  saveDataToStorage();
  showNotification("Contraseña cambiada correctamente.", "success");
  bootstrap.Modal.getInstance(document.getElementById("changePasswordModal"))?.hide();
  document.getElementById("changePasswordForm").reset();
}

/**
 * Muestra el perfil del usuario en un modal.
 */
function showUserProfile() {
  if (!currentUser) return;

  const profileContent = document.getElementById("profileContent");
  const registrationDate = new Date(currentUser.registrationDate).toLocaleDateString();

  profileContent.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h6 class="text-neon-green">Información Personal</h6>
        <p><strong>Nombre:</strong> ${currentUser.name}</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${new Date(currentUser.birthDate).toLocaleDateString()}</p>
        <p><strong>Miembro desde:</strong> ${registrationDate}</p>
      </div>
      <div class="col-md-6">
        <h6 class="text-electric-blue">Beneficios y Puntos</h6>
        <p><strong>Puntos LevelUp:</strong> <span class="text-neon-green">${currentUser.levelUpPoints}</span></p>
        <p><strong>Nivel:</strong> ${currentUser.level}</p>
        ${currentUser.isDuocStudent ? '<p><strong>Descuento Duoc:</strong> <span class="text-neon-green">20% de por vida</span></p>' : ""}
        <p><strong>Pedidos realizados:</strong> ${orders.filter((o) => o.userId === currentUser.id).length}</p>
      </div>
    </div>
  `;

  new bootstrap.Modal(document.getElementById("profileModal")).show();
}

/**
 * Actualiza la interfaz según si hay usuario logueado o no.
 */
function updateUserInterface() {
  const loginLink = document.querySelector('a[data-bs-target="#loginModal"]');
  const registerLink = document.querySelector('a[data-bs-target="#registerModal"]');
  const navbarNav = document.querySelector('.navbar-nav');
  const existingDropdown = document.querySelector(".nav-item.dropdown");

  if (currentUser) {
    const userDropdown = document.createElement("li");
    userDropdown.className = "nav-item dropdown";
    userDropdown.innerHTML = `
      <a class="nav-link dropdown-toggle text-neon-green" href="#" role="button" data-bs-toggle="dropdown">
        <i class="fas fa-user me-1"></i>${currentUser.name}
        ${currentUser.levelUpPoints > 0 ? `<span class="badge bg-neon-green text-black ms-2">${currentUser.levelUpPoints} pts</span>` : ""}
      </a>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li><a class="dropdown-item" href="#" onclick="showUserProfile()"><i class="fas fa-user me-2"></i>Mi Perfil</a></li>
        <li><a class="dropdown-item" href="#" onclick="openEditProfile()"><i class="fas fa-edit me-2"></i>Editar Perfil</a></li>
        <li><a class="dropdown-item" href="#" onclick="openChangePassword()"><i class="fas fa-key me-2"></i>Cambiar Contraseña</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
      </ul>
    `;

    if (loginLink?.parentNode) loginLink.parentNode.replaceChild(userDropdown, loginLink);
    else if (navbarNav) navbarNav.appendChild(userDropdown);

    if (registerLink) registerLink.style.display = "none";
  } else {
    if (existingDropdown) {
      const newLoginLink = document.createElement("li");
      newLoginLink.className = "nav-item";
      newLoginLink.innerHTML = `<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="fas fa-user me-1"></i>Iniciar Sesión</a>`;
      existingDropdown.parentNode.replaceChild(newLoginLink, existingDropdown);
    }
    if (registerLink) registerLink.style.display = "block";
  }
}

// ===================================================================
// =================== FUNCIONALIDAD DE PEDIDOS ======================
// ===================================================================

/**
 * Procesa la orden: aplica descuentos, descuenta puntos de recompensa,
 * otorga nuevos puntos y vacía el carrito.
 */
function processOrder() {
  if (cart.length === 0) {
    showNotification("Tu carrito está vacío.", "warning");
    return;
  }
  if (!currentUser) {
    showNotification("Debes iniciar sesión para realizar una compra o canje.", "warning");
    return;
  }

  // 1. Calcular puntos necesarios para productos de recompensa
  let totalPointsToRedeem = 0;
  const rewardItems = cart.filter(item => item.type === "reward");
  for (const item of rewardItems) {
    totalPointsToRedeem += item.points * item.quantity;
  }

  // 2. Validar nuevamente que el usuario tenga suficientes puntos
  if (totalPointsToRedeem > 0 && currentUser.levelUpPoints < totalPointsToRedeem) {
    showNotification("No tienes suficientes puntos para completar el canje. Algunos puntos pueden haber sido usados en otra sesión.", "danger");
    return;
  }

  // 3. Calcular total en CLP (solo productos normales)
  let totalCLP = cart.reduce((sum, item) =>
    item.type === "product" ? sum + (item.price * item.quantity) : sum, 0
  );
  const originalTotal = totalCLP;
  const discount = currentUser.isDuocStudent ? 0.2 : 0;
  totalCLP = Math.round(totalCLP * (1 - discount));

  // 4. Crear el pedido
  const order = {
    id: Date.now().toString(),
    userId: currentUser.id,
    items: [...cart],
    total: totalCLP,
    originalTotal: originalTotal,
    discount: currentUser.isDuocStudent ? 20 : 0,
    pointsRedeemed: totalPointsToRedeem,
    status: "pendiente",
    date: new Date().toISOString(),
    levelUpPointsEarned: totalCLP > 0 ? Math.floor(totalCLP / 1000) : 0,
  };

  // 5. Actualizar puntos del usuario
  currentUser.levelUpPoints += order.levelUpPointsEarned; // puntos ganados
  currentUser.levelUpPoints -= totalPointsToRedeem;        // puntos gastados
  if (currentUser.levelUpPoints < 0) currentUser.levelUpPoints = 0;

  // 6. Guardar y limpiar
  // 🔹 Guardar el pedido directamente en localStorage
  const storedOrders = JSON.parse(localStorage.getItem("levelup_orders")) || [];
  storedOrders.push(order);
  localStorage.setItem("levelup_orders", JSON.stringify(storedOrders));
  cart = [];
  saveDataToStorage();
  updateCartCounter();

  // 7. Notificación
  let message = "¡Pedido procesado!";
  if (totalCLP > 0) message += ` Total: $${totalCLP.toLocaleString()} CLP.`;
  if (totalPointsToRedeem > 0) message += ` Canjeados: ${totalPointsToRedeem.toLocaleString()} puntos.`;
  if (order.levelUpPointsEarned > 0) message += ` Ganaste ${order.levelUpPointsEarned} puntos.`;

  showNotification(message, "success");
  console.log("[v1] Order processed:", order);
}

// ===================================================================
// =================== FUNCIONALIDAD DE COMPARTIR ====================
// ===================================================================

/**
 * Inicializa los botones de compartir en redes sociales.
 */
function initializeShareButtons() {
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  if (!shareBtn || !shareModal) return;

  const referralCode = "LEVELUPGAMER25";
  const shareLink = `https://tusitio.com/registro?ref=${referralCode}`;

  const whatsappShare = document.getElementById('whatsappShare');
  const facebookShare = document.getElementById('facebookShare');
  const twitterShare = document.getElementById('twitterShare');

  if (whatsappShare) {
    whatsappShare.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Únete a LevelUp con mi código ${referralCode} ${shareLink}`)}`;
  }
  if (facebookShare) {
    facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
  }
  if (twitterShare) {
    twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Únete a LevelUp con mi código ${referralCode}`)}&url=${encodeURIComponent(shareLink)}`;
  }

  shareBtn.addEventListener('click', (e) => {
    e.preventDefault();
    shareModal.style.display = 'flex';
  });

  const closeShareModal = document.getElementById('closeShareModal');
  if (closeShareModal) {
    closeShareModal.addEventListener('click', () => shareModal.style.display = 'none');
  }

  window.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.style.display = 'none';
  });
}

// ===================================================================
// =================== INICIALIZACIÓN Y UTILIDADES ===================
// ===================================================================

/**
 * Inicializa los filtros de categoría de productos.
 */
function initializeProductFilters() {
  const filterButtons = document.querySelectorAll(".filter-buttons .btn");
  const productItems = document.querySelectorAll(".product-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      productItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "block";
          item.style.animation = "fadeInUp 0.6s ease forwards";
        } else {
          item.style.display = "none";
        }
      });

      console.log(`[v1] Products filtered by: ${filter}`);
    });
  });
}

/**
 * Normaliza texto para búsqueda (elimina tildes y pasa a minúsculas).
 */
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Inicializa la búsqueda en tiempo real.
 */
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const query = normalizeText(this.value.trim());
    const items = document.querySelectorAll(".product-item");

    items.forEach(item => {
      const titleEl = item.querySelector(".product-title");
      if (!titleEl) return;

      const title = normalizeText(titleEl.textContent || "");
      const words = title.split(/\W+/).filter(Boolean);
      const match = query === "" || words.some(w => w.startsWith(query));

      item.style.display = match ? "" : "none";
    });
  });
}

/**
 * Inicializa los botones del carrito (normales y de puntos).
 */
function initializeCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      addToCart(productId);
    });
  });

  const addToCartPointsButtons = document.querySelectorAll(".add-to-cart-points");
  addToCartPointsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      addToCartWithPoints(productId);
    });
  });
}

/**
 * Inicializa los formularios de usuario (registro, login, etc.).
 */
function initializeForms() {
  const registerForm = document.querySelector("#registerModal form");
  if (registerForm) registerForm.addEventListener("submit", (e) => { e.preventDefault(); handleRegistration(); });

  const loginForm = document.querySelector("#loginModal form");
  if (loginForm) loginForm.addEventListener("submit", (e) => { e.preventDefault(); handleLogin(); });

  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) forgotPasswordForm.addEventListener("submit", (e) => { e.preventDefault(); handleForgotPassword(); });

  const editProfileForm = document.getElementById("editProfileForm");
  if (editProfileForm) editProfileForm.addEventListener("submit", (e) => { e.preventDefault(); handleEditProfile(); });

  const changePasswordForm = document.getElementById("changePasswordForm");
  if (changePasswordForm) changePasswordForm.addEventListener("submit", (e) => { e.preventDefault(); handleChangePassword(); });
}

/**
 * Inicializa el scroll suave para enlaces de navegación.
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      e.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({ top: targetSection.offsetTop - 80, behavior: "smooth" });
      }
    });
  });
}

/**
 * Inicializa los modales de video para detener el video al cerrar.
 */
function initializeVideoModals() {
  ['videoModal1', 'videoModal2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('hidden.bs.modal', () => {
        const iframe = el.querySelector('iframe');
        if (iframe) iframe.src = iframe.src;
      });
    }
  });
}

/**
 * Muestra notificaciones temporales en la esquina superior derecha.
 */
function showNotification(message, type = "info") {
  const typeClass = { success: "success", danger: "danger", warning: "warning", info: "info" }[type] || "info";
  const notification = document.createElement("div");
  notification.className = `alert alert-${typeClass} alert-dismissible fade show position-fixed`;
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

/**
 * Cierra la sesión del usuario actual.
 */
function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    currentUser = null;
    saveDataToStorage();
    updateUserInterface();
    showNotification("Has cerrado sesión.", "info");
  }
}

// ===================================================================
// =================== INICIALIZACIÓN DE LA APP ======================
// ===================================================================

/**
 * Inicializa toda la funcionalidad de la app.
 */
function initializeApp() {
  try {
    initializeProductFilters();
    initializeCartButtons();
    initializeForms();
    initializeSmoothScrolling();
    initializeVideoModals();
    initializeSearch();
    initializeShareButtons();

    updateCartCounter();
    updateUserInterface();

    console.log("[v1] Level-Up Gamer app initialized successfully");
  } catch (error) {
    console.error("[v1] Error initializing app:", error);
  }
}

// --- Funciones globales accesibles desde HTML ---
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.logout = logout;
window.processOrder = processOrder;
window.showUserProfile = showUserProfile;
window.openEditProfile = openEditProfile;
window.openChangePassword = openChangePassword;
window.clearCart = clearCart;

// --- Inicialización final al cargar el DOM ---
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();
  initializeApp();

  // Actualizar contenido del carrito SOLO al abrir el modal
  const cartModalEl = document.getElementById("cartModal");
  if (cartModalEl) {
    cartModalEl.addEventListener("show.bs.modal", () => {
      updateCartModal();
    });
  }

// --- Abrir modal de pago ---
const btnProcessOrder = document.getElementById("btnProcessOrder");
if (btnProcessOrder && !btnProcessOrder.dataset.listenerAdded) {
  btnProcessOrder.addEventListener("click", () => {
    // Validar si el carrito está vacío
    if (!cart || cart.length === 0) {
      alert("⚠️ Tu carrito está vacío. Agrega productos antes de continuar con el pago.");
      return;
    }

    // Ocultar carrito si estaba abierto
    bootstrap.Modal.getInstance(cartModalEl)?.hide();

    // Instancia modal de pago
    const paymentModal = new bootstrap.Modal(document.getElementById("paymentModal"));

    // Prellenar con datos del usuario
    if (currentUser) {
      const nameInput = document.getElementById("paymentName");
      const emailInput = document.getElementById("paymentEmail");
      if (nameInput) nameInput.value = currentUser.name || "";
      if (emailInput) emailInput.value = currentUser.email || "";
    }

    paymentModal.show();
  });
  btnProcessOrder.dataset.listenerAdded = "true";
}


// --- Manejo del pago simulado ---

  const fakePaymentForm = document.getElementById("fakePaymentForm");
  const paymentModalEl = document.getElementById("paymentModal");
  if (!fakePaymentForm) return;

  fakePaymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validación HTML5
    if (!fakePaymentForm.checkValidity()) {
      event.stopPropagation();
      fakePaymentForm.classList.add("was-validated");
      return;
    }

    // Validación contra usuario
    const inputName = document.getElementById("paymentName").value.trim();
    const inputEmail = document.getElementById("paymentEmail").value.trim();

    if (!currentUser) {
      alert("Debes iniciar sesión antes de pagar.");
      return;
    }

    if (
      inputName.toLowerCase() !== currentUser.name.toLowerCase() ||
      inputEmail.toLowerCase() !== currentUser.email.toLowerCase()
    ) {
      alert("El nombre y el correo deben coincidir con los registrados.");
      return;
    }

    // --- Simulación de pago ---
    const submitButton = fakePaymentForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Procesando... ⏳";
    submitButton.disabled = true;

    setTimeout(() => {
      // Aquí se procesa realmente la orden
      processOrder();

      // Cerrar modal
      bootstrap.Modal.getInstance(document.getElementById("paymentModal"))?.hide();

      // Mensaje de éxito
      alert("✅ ¡Compra finalizada con éxito! Recibirás un correo de confirmación pronto.");

      // Resetear formulario
      fakePaymentForm.reset();
      fakePaymentForm.classList.remove("was-validated");
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }, 1500);
  });

  // Inyectar animaciones CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
});
// Seleccionamos todas las imágenes que deben abrir el modal
const images = document.querySelectorAll('.clickable-image');

images.forEach(img => {
  img.addEventListener('click', () => {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = img.src;   // Copia la imagen clickeada
    modalImg.alt = img.alt;   // Copia el alt
    // Abrimos el modal usando Bootstrap 5
    const myModal = new bootstrap.Modal(document.getElementById('imageModal'));
    myModal.show();
  });
});

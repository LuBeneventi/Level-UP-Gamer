// Product Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
    // Product data with detailed information, ratings and comments
    const productData = {
    JM001: {
        name: "Catan",
        description: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Perfecto para 3-4 jugadores, con una duración promedio de 60-90 minutos.",
        price: "$29.990 CLP",
        image: "public/juego-catan.png",
        rating: 4.8,
        ratingCount: 156,
        code: "JM001",
        comments: [
            {
                user: "Carlos M.",
                rating: 5,
                comment: "Excelente juego, muy entretenido para jugar en familia. La calidad de los componentes es muy buena.",
                date: "15 Nov 2024",
            },
            {
                user: "María P.",
                rating: 5,
                comment: "Mi juego favorito! Siempre es diferente cada partida. Totalmente recomendado.",
                date: "10 Nov 2024",
            },
            {
                user: "Diego R.",
                rating: 4,
                comment: "Muy buen juego de estrategia. Las reglas son fáciles de aprender pero difíciles de dominar.",
                date: "8 Nov 2024",
            },
        ],
    },
    JM002: {
        name: "Carcassonne",
        description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval. Con cada partida, el tablero cambia, ofreciendo una experiencia única y de alta rejugabilidad. Es ideal para 2-5 jugadores.",
        price: "$24.990 CLP",
        image: "public/juego-carcassonne.png",
        rating: 4.5,
        ratingCount: 89,
        code: "JM002",
        comments: [
            {
                user: "Sofía G.",
                rating: 5,
                comment: "Súper divertido y fácil de aprender. Lo he jugado con mi familia y siempre nos encanta.",
                date: "22 Nov 2024",
            },
            {
                user: "Lucas V.",
                rating: 4,
                comment: "Un clásico que no puede faltar en la colección. Un juego de estrategia simple pero adictivo.",
                date: "19 Nov 2024",
            },
            {
                user: "Ana S.",
                rating: 4,
                comment: "Perfecto para jugar con mi pareja. Las partidas son rápidas y muy competitivas.",
                date: "17 Nov 2024",
            },
        ],
    },
    AC001: {
        name: "Controlador Inalámbrico Xbox Series X",
        description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con Xbox Series X|S, Xbox One, PC con Windows, y dispositivos móviles.",
        price: "$59.990 CLP",
        image: "public/controlador-xbox.png",
        rating: 4.9,
        ratingCount: 215,
        code: "AC001",
        comments: [
            {
                user: "Pedro A.",
                rating: 5,
                comment: "Es el mejor control que he tenido. La ergonomía es perfecta y la conexión inalámbrica es muy estable.",
                date: "25 Nov 2024",
            },
            {
                user: "Javiera L.",
                rating: 5,
                comment: "Lo uso en mi PC para jugar y funciona de maravilla. La vibración es súper inmersiva.",
                date: "20 Nov 2024",
            },
        ],
    },
    AC002: {
        name: "Auriculares Gamer HyperX Cloud II",
        description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica que aseguran comodidad durante largas horas de juego.",
        price: "$79.990 CLP",
        image: "public/auriculares-hyperx.png",
        rating: 4.7,
        ratingCount: 190,
        code: "AC002",
        comments: [
            {
                user: "Felipe T.",
                rating: 5,
                comment: "El sonido 7.1 es increíble. Se escucha cada paso en los juegos. El micrófono es muy claro.",
                date: "24 Nov 2024",
            },
            {
                user: "Valentina G.",
                rating: 4,
                comment: "Muy cómodos y ligeros. Perfectos para sesiones de juego prolongadas.",
                date: "21 Nov 2024",
            },
            {
                user: "Rodrigo S.",
                rating: 5,
                comment: "Excelente calidad de audio. Los he usado en PS5 y PC sin problemas.",
                date: "18 Nov 2024",
            },
        ],
    },
    CO001: {
        name: "PlayStation 5",
        description: "La consola de última generación de Sony, que ofrece gráficos impresionantes en 4K y tiempos de carga ultrarrápidos gracias a su SSD de alta velocidad. Incluye un control inalámbrico DualSense con retroalimentación háptica.",
        price: "$549.990 CLP",
        image: "public/playstation-5-console.png",
        rating: 4.9,
        ratingCount: 350,
        code: "CO001",
        hot: true,
        comments: [
            {
                user: "Isabel B.",
                rating: 5,
                comment: "Una consola increíble. Los gráficos son de otro nivel y la velocidad de carga es asombrosa.",
                date: "26 Nov 2024",
            },
            {
                user: "Tomás C.",
                rating: 5,
                comment: "El DualSense es una maravilla. La inmersión en los juegos es total. La recomiendo 100%.",
                date: "25 Nov 2024",
            },
        ],
    },
    CG001: {
        name: "PC Gamer ASUS ROG Strix",
        description: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes. Cuenta con un procesador Intel Core i9, una tarjeta gráfica NVIDIA GeForce RTX 4080 y 32GB de RAM para un rendimiento inigualable.",
        price: "$1.299.990 CLP",
        image: "public/pc-gamer-asus.png",
        rating: 5.0,
        ratingCount: 45,
        code: "CG001",
        hot: true,
        premium: true,
        comments: [
            {
                user: "Daniel P.",
                rating: 5,
                comment: "Una bestia. Corre todos mis juegos en ultra sin problemas. La refrigeración es excelente.",
                date: "28 Nov 2024",
            },
            {
                user: "Fernanda R.",
                rating: 5,
                comment: "El mejor PC que he comprado. Rápido, silencioso y con un diseño espectacular.",
                date: "27 Nov 2024",
            },
        ],
    },
    SG001: {
        name: "Silla Gamer Secretlab Titan",
        description: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable, con reposabrazos 4D, reclinación multi-ángulo y soporte lumbar incorporado.",
        price: "$349.990 CLP",
        image: "public/silla-gamer-secretlab.png",
        rating: 4.8,
        ratingCount: 110,
        code: "SG001",
        comments: [
            {
                user: "José M.",
                rating: 5,
                comment: "Es increíblemente cómoda. Se nota la diferencia en la postura después de largas horas de uso.",
                date: "23 Nov 2024",
            },
            {
                user: "Marta E.",
                rating: 4,
                comment: "Una gran inversión. El montaje fue fácil y los materiales se sienten de muy alta calidad.",
                date: "20 Nov 2024",
            },
        ],
    },
    MS001: {
        name: "Mouse Gamer Logitech G502 HERO",
        description: "Con sensor de alta precisión y botones personalizables, ideal para gamers que buscan control preciso y respuesta ultrarrápida. Su peso es ajustable y tiene un diseño ergonómico.",
        price: "$49.990 CLP",
        image: "public/mouse-logitech-g502.png",
        rating: 4.9,
        ratingCount: 250,
        code: "MS001",
        comments: [
            {
                user: "Gabriel N.",
                rating: 5,
                comment: "El mejor mouse para gaming. Los botones extra son muy útiles y el sensor es perfecto para FPS.",
                date: "27 Nov 2024",
            },
            {
                user: "Paula F.",
                rating: 5,
                comment: "Me encanta este mouse. Es muy preciso y la sensación al usarlo es muy agradable.",
                date: "24 Nov 2024",
            },
        ],
    },
    MP001: {
        name: "Mousepad Razer Goliathus Extended Chroma",
        description: "Ofrece un área de juego amplia con iluminación RGB personalizable y una superficie de microtextura optimizada para todos los sensores de mouse, proporcionando un equilibrio perfecto entre velocidad y control.",
        price: "$29.990 CLP",
        image: "public/mousepad-razer-chroma.png",
        rating: 4.6,
        ratingCount: 75,
        code: "MP001",
        comments: [
            {
                user: "Ricardo Z.",
                rating: 5,
                comment: "Se ve genial en mi setup con la iluminación Chroma. La superficie es muy suave.",
                date: "21 Nov 2024",
            },
            {
                user: "Camila V.",
                rating: 4,
                comment: "Es muy grande, cubre todo mi escritorio. El mouse se desliza perfectamente.",
                date: "19 Nov 2024",
            },
        ],
    },
    PP001: {
        name: "Polera Gamer Personalizada 'Level-Up'",
        description: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito. Fabricada con algodón suave y de alta calidad para un ajuste perfecto.",
        price: "$14.990 CLP",
        image: "public/polera-gamer-personalizada.png",
        rating: 4.4,
        ratingCount: 30,
        code: "PP001",
        comments: [
            {
                user: "Juan C.",
                rating: 4,
                comment: "Me encantó el diseño y la personalización. La tela es muy cómoda.",
                date: "20 Nov 2024",
            },
            {
                user: "Laura H.",
                rating: 5,
                comment: "El regalo perfecto para mi hermano gamer. Le quedó perfecta y se ve de buena calidad.",
                date: "18 Nov 2024",
            },
        ],
    },
};
  
    // Add click event listeners to all product cards
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      card.style.cursor = "pointer"
      card.addEventListener("click", function (e) {
        // Prevent modal from opening when clicking the "Add to Cart" button
        if (e.target.closest(".add-to-cart")) {
          return
        }
  
        const productCode = this.querySelector(".product-badge").textContent
        openProductModal(productCode)
      })
    })
  
    function openProductModal(productCode) {
        
    // Escucha el evento 'shown.bs.modal'
    productModal.addEventListener('shown.bs.modal', function (event) {
        // El 'relatedTarget' es el elemento que activó el modal (en este caso, el botón)
        const button = event.relatedTarget;
        
        // Obtén el código del producto del atributo 'data-product' del botón
        const productCode = button.getAttribute('data-product');
        const product = productData[productCode];

        if (!product) {
            console.log("Producto no encontrado:", productCode);
            return;
        }

        // Rellena el modal con los datos del producto
        document.getElementById("productModalTitle").textContent = "Detalles del Producto";
        document.getElementById("productModalName").textContent = product.name;
        document.getElementById("productModalDescription").textContent = product.description;
        document.getElementById("productModalPrice").textContent = product.price;
        document.getElementById("productModalCode").textContent = product.code;

        const modalImage = document.getElementById("productModalImage");
        modalImage.src = product.image;
        modalImage.alt = product.name;

        const ratingContainer = document.getElementById("productModalRating");
        ratingContainer.innerHTML = generateStarRating(product.rating);

        document.getElementById("productModalRatingCount").textContent =
            `(${product.rating}) - ${product.ratingCount} reseñas`;

        const commentsContainer = document.getElementById("productComments");
        commentsContainer.innerHTML = generateComments(product.comments);
    });
  
      // Populate modal with product data
      document.getElementById("productModalTitle").textContent = "Detalles del Producto"
      document.getElementById("productModalName").textContent = product.name
      document.getElementById("productModalDescription").textContent = product.description
      document.getElementById("productModalPrice").textContent = product.price
      document.getElementById("productModalCode").textContent = product.code
  
      const modalImage = document.getElementById("productModalImage")
      modalImage.src = product.image
      modalImage.alt = product.name
  
      // Generate rating stars
      const ratingContainer = document.getElementById("productModalRating")
      ratingContainer.innerHTML = generateStarRating(product.rating)
  
      document.getElementById("productModalRatingCount").textContent =
        `(${product.rating}) - ${product.ratingCount} reseñas`
  
      // Generate comments
      const commentsContainer = document.getElementById("productComments")
      commentsContainer.innerHTML = generateComments(product.comments)
  

      // Show the modal
  const modalElement = document.getElementById("productModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
    }
  
    function generateStarRating(rating) {
      let starsHtml = ""
      const fullStars = Math.floor(rating)
      const hasHalfStar = rating % 1 !== 0
  
      // Full stars
      for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>'
      }
  
      // Half star
      if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>'
      }
  
      // Empty stars
      const emptyStars = 5 - Math.ceil(rating)
      for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>'
      }
  
      return starsHtml
    }
  
function generateComments(comments) {
  return comments.map(c => `
    <div class="review mb-3">
      <div class="d-flex justify-content-between">
        <strong class="review-author">${c.user}</strong>
        <span class="review-date">${c.date}</span>
      </div>
      <div class="rating">${generateStarRating(c.rating)}</div>
      <p>${c.comment}</p>
      <hr>
    </div>
  `).join("");
}
document.getElementById("reviewForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById("reviewText").value;

    if (!rating) {
        alert("Por favor selecciona una calificación");
        return;
    }

    // Aquí puedes enviarlo al backend con fetch o AJAX
    console.log("Nueva reseña:", { rating, comment });

    // Opcional: agregarlo directamente a la lista de comentarios
    const commentSection = document.getElementById("productComments");
    const newComment = document.createElement("div");
    newComment.innerHTML = `
        <p><strong>Tú</strong> - ${new Date().toLocaleDateString()}</p>
        <div>${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>
        <p>${comment}</p>
        <hr>
    `;
    commentSection.prepend(newComment);

    // Reset form
    document.getElementById("reviewForm").reset();
});

  })
  document.addEventListener('DOMContentLoaded', function() {
    // Función para filtrar los productos
    function filterProducts(filter) {
        // Remover la clase 'active' de todos los botones de filtro
        const filterButtons = document.querySelectorAll('.filter-buttons .btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Añadir la clase 'active' al botón de filtro seleccionado
        const selectedButton = document.querySelector(`.filter-buttons .btn[data-filter="${filter}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        // Ocultar todos los productos
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => item.style.display = 'none');

        // Mostrar solo los productos de la categoría seleccionada
        if (filter === 'all') {
            productItems.forEach(item => item.style.display = 'block');
        } else {
            const filteredItems = document.querySelectorAll(`.product-item[data-category="${filter}"]`);
            filteredItems.forEach(item => item.style.display = 'block');
        }
    }

    // Escuchar los clics en los botones de filtro de la página de productos
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });

    // Detectar si el usuario llegó con un filtro desde el pie de página
    const urlHash = window.location.hash.substring(1); // Obtener la parte después del '#'
    if (urlHash) {
        filterProducts(urlHash);
    }
});

// JS (reemplaza tu renderProducts + listener con esto)
const rawProducts = typeof products !== 'undefined' ? products : {}; // tu variable productos
const originalProducts = Array.isArray(rawProducts) ? rawProducts : Object.values(rawProducts);

function formatPrice(price) {
  if (price == null) return '';
  if (typeof price === 'string') {
    if (price.trim().startsWith('$')) return price;
    const digits = price.replace(/\D/g, '');
    if (digits) return `$${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    return price;
  }
  if (typeof price === 'number') {
    return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
  return String(price);
}

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Referencias
const favoriteBtn = document.getElementById("favoriteBtn");

// Función para actualizar botón según estado
function updateFavoriteButton(productCode) {
    if (favorites.includes(productCode)) {
        favoriteBtn.classList.add("favorited");
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i> Favorito';
    } else {
        favoriteBtn.classList.remove("favorited");
        favoriteBtn.innerHTML = '<i class="far fa-star"></i> Favorito';
    }
}

// Evento click en botón favorito
favoriteBtn.addEventListener("click", () => {
    const productCode = document.getElementById("productModalCode").textContent.trim();
    if (favorites.includes(productCode)) {
        favorites = favorites.filter(code => code !== productCode);
    } else {
        favorites.push(productCode);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteButton(productCode);
});

// Cuando se abre el modal, actualizar botón según producto cargado
document.getElementById("productModal").addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const productCode = button.getAttribute("data-product");
    updateFavoriteButton(productCode);
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-list");
  const publicProducts = JSON.parse(localStorage.getItem("levelup_products_public")) || [];

  if (!container) return;

  if (publicProducts.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No hay productos disponibles en este momento.</p>`;
    return;
  }

  container.innerHTML = "";
  publicProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height:200px;object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <span class="badge bg-info">${product.category}</span>
          <p class="mt-2 fw-bold">$${product.price.toLocaleString()} CLP</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
});

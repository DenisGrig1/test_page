// Общие функции сайта FORMA

document.addEventListener("DOMContentLoaded", () => {
  // Актуальный год в подвале всех страниц
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Мобильное меню
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню"
      );
    });
  }

  // Каталог товаров — запускается только на странице каталога
  initCatalog();

  // Контактная форма — запускается только на странице контактов
  initContactForm();
});

const products = [
  {
    id: 1,
    name: "Диван LINE",
    category: "sofas",
    categoryName: "Диваны",
    description: "Прямой минималистичный диван",
    price: 29999,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    alt: "Современный диван в спокойном интерьере"
  },
  {
    id: 2,
    name: "Диван SOFT",
    category: "sofas",
    categoryName: "Диваны",
    description: "Мягкий и удобный",
    price: 34999,
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=900&q=80",
    alt: "Светлый мягкий диван"
  },
  {
    id: 3,
    name: "Кресло FORM",
    category: "chairs",
    categoryName: "Стулья и кресла",
    description: "Дизайнерское кресло для отдыха",
    price: 6999,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
    alt: "Дизайнерское кресло"
  },
  {
    id: 4,
    name: "Стул WOOD",
    category: "chairs",
    categoryName: "Стулья и кресла",
    description: "Деревянный стул с мягким сиденьем",
    price: 2999,
    image: "https://i.pinimg.com/474x/62/36/07/6236075446bdbb3fc1965d1c386c4b1d.jpg?nii=t",
    alt: "Стул в современной обеденной зоне"
  },
  {
    id: 5,
    name: "Стол TABLE",
    category: "tables",
    categoryName: "Столы",
    description: "Небольшой прикроватный столик",
    price: 3999,
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=80",
    alt: "Деревянный стол"
  },
  {
    id: 6,
    name: "Стол WORK",
    category: "tables",
    categoryName: "Столы",
    description: "Рабочий стол для домашнего кабинета",
    price: 10999,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
    alt: "Рабочий стол в минималистичном интерьере"
  },
  {
    id: 7,
    name: "Комод BLOCK",
    category: "storage",
    categoryName: "Шкафы и комоды",
    description: "Компактный комод для одежды",
    price: 24999,
    image: "https://i.pinimg.com/originals/56/1d/42/561d42660daf39dec35730756e4581fd.jpg?nii=t",
    alt: "Мебель для хранения в интерьере"
  },
  {
    id: 8,
    name: "Тумба BASE",
    category: "storage",
    categoryName: "Шкафы и комоды",
    description: "Минималистичная прикроватная тумба",
    price: 3999,
    image: "https://elizaspb.ru/jpg/414aea5ac4630315b209251ad9ba558f.jpg",
    alt: "Лаконичная деревянная мебель"
  }
];

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function initCatalog() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const searchInput = document.getElementById("product-search");
  const emptyState = document.getElementById("empty-state");
  const filterButtons = document.querySelectorAll("[data-filter]");

  let activeCategory = "all";
  let searchQuery = "";

  function renderProducts() {
    const visibleProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const searchText = (
        product.name + " " + product.description + " " + product.categoryName
      ).toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    grid.innerHTML = visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img
            class="product-image"
            src="${product.image}"
            alt="${product.alt}"
            loading="lazy"
          >
          <span class="product-category">${product.categoryName}</span>
        </div>
        <div class="product-info">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
      </article>
    `).join("");

    emptyState.hidden = visibleProducts.length !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.trim();
      renderProducts();
    });
  }

  // Поддержка ссылок с главной страницы, например catalog.html?category=sofas
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  const allowedCategories = ["sofas", "chairs", "tables", "storage"];

  if (allowedCategories.includes(requestedCategory)) {
    activeCategory = requestedCategory;
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === activeCategory);
    });
  }

  renderProducts();
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();

    const subject = encodeURIComponent("Запрос с сайта FORMA");
    const body = encodeURIComponent(
      `Имя: ${name}\nЭлектронная почта: ${email}\n\nСообщение:\n${message}`
    );

    const recipient = "hello@forma.example";
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

    const status = document.getElementById("form-status");
    status.textContent = "Открываем почтовую программу с подготовленным письмом.";

    window.location.href = mailtoLink;
  });
}

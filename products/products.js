/**
 * Products Page Script
 * - Fetches products from FakeStoreAPI + localStorage (admin added products)
 * - Allows search, filter, and sorting
 * - Adds products to cart in localStorage
 */

document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("productContainer");
  const paginationContainer = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("sortSelect");

  let products = [];          // all products (API + localStorage)
  let filteredProducts = [];  // products after search/filter/sort
  let currentPage = 1;
  const itemsPerPage = 10;

  // --- Load Products from API + localStorage ---
  async function loadProducts() {
    try {
      // 1. Fetch products from API
      const response = await fetch("https://fakestoreapi.com/products");
      const apiProducts = await response.json();

      // 2. Load products from localStorage (added by admin)
      const localProducts = JSON.parse(localStorage.getItem("products")) || [];

      // 3. Merge API + localStorage products
      //    Important: API uses `title/description`, admin products use the same keys
      products = [...apiProducts, ...localProducts];

      // 4. Initialize filtered products
      filteredProducts = [...products];
      renderPage();
    } catch (err) {
      console.error("Error fetching products:", err);
      productContainer.innerHTML = `<p>⚠️ Failed to load products.</p>`;
    }
  }

  // --- Render products for current page ---
  function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredProducts.slice(start, end);

    renderProducts(items);
    renderPagination();
  }

  // --- Render products grid ---
  function renderProducts(items) {
    productContainer.innerHTML = items.map(p => `
      <div class="card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
        <button class="btn add-to-cart"
                data-id="${p.id}"
                data-title="${p.title}"
                data-price="${p.price}"
                data-image="${p.image}">
          Add to Cart
        </button>
      </div>
    `).join("");

    // Attach "Add to Cart" functionality
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        const product = {
          id: btn.getAttribute("data-id"),
          title: btn.getAttribute("data-title"),
          price: parseFloat(btn.getAttribute("data-price")),
          image: btn.getAttribute("data-image"),
          quantity: 1
        };
        const newQuantity = addToCart(product);
        btn.textContent = `+${newQuantity}`;
      });
    });

    // Update buttons with current cart state
    updateButtonsFromCart();
  }

  // --- Render pagination buttons ---
  function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    let html = "";

    if (currentPage > 1) {
      html += `<button class="page-btn" data-page="${currentPage - 1}">Prev</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
    }

    if (currentPage < totalPages) {
      html += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
    }

    paginationContainer.innerHTML = html;

    // Attach page switch
    document.querySelectorAll(".page-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentPage = parseInt(btn.getAttribute("data-page"));
        renderPage();
      });
    });
  }

  // --- Apply filters, search, sort ---
  function applyFilters() {
    filteredProducts = [...products];

    // Search by title
    const searchText = searchInput.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(searchText));

    // Filter by category (API products have category, local ones may not)
    const category = categoryFilter.value;
    if (category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by price range
    const price = priceFilter.value;
    if (price !== "all") {
      const [min, max] = price.split("-").map(Number);
      filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
    }

    // Sorting
    if (sortSelect.value === "low-to-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high-to-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    currentPage = 1;
    renderPage();
  }

  // --- Event listeners for filters ---
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  priceFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  // --- Initialize products ---
  loadProducts();
});

// --- Add to Cart & sync ---
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id == product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return existingItem ? existingItem.quantity : product.quantity;
}

// --- Update cart buttons with saved cart state ---
function updateButtonsFromCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach(item => {
    const btn = document.querySelector(`.add-to-cart[data-id="${item.id}"]`);
    if (btn) {
      btn.textContent = `+${item.quantity}`;
    }
  });
}

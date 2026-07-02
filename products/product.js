let allProducts = [];

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayProducts(allProducts);
  });

function displayProducts(products) {
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">$${product.price}</p>
      <p class="product-category">${product.category}</p>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;
    productContainer.appendChild(productCard);
  });
}

// 🔍 Search
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(query)
  );
  displayProducts(filtered);
});

// 🏷️ Filter by category
document.getElementById("categoryFilter").addEventListener("change", function () {
  const category = this.value;
  let filtered = allProducts;

  if (category !== "all") {
    filtered = allProducts.filter(p => p.category.toLowerCase() === category);
  }
  displayProducts(filtered);
});

// 💲 Filter by price
document.getElementById("priceFilter").addEventListener("change", function () {
  const range = this.value;
  let filtered = allProducts;

  if (range !== "all") {
    const [min, max] = range.split("-").map(Number);
    filtered = allProducts.filter(p => p.price >= min && p.price <= max);
  }
  displayProducts(filtered);
});

// ↕️ Sort by price
document.getElementById("sortSelect").addEventListener("change", function () {
  let sorted = [...allProducts];
  if (this.value === "low-to-high") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (this.value === "high-to-low") {
    sorted.sort((a, b) => b.price - a.price);
  }
  displayProducts(sorted);
});

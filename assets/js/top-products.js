/**
 * Top Products Script
 * - Fetches 5 products from FakeStoreAPI
 * - Renders them in the "topProducts" container
 * - Allows adding products to cart (stored in localStorage)
 */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("topProducts");

  if (!container) return; // Safety check if the element doesn't exist

  fetch("https://fakestoreapi.com/products?limit=5")
    .then(res => res.json())
    .then(products => {
      container.innerHTML = products.map(p => `
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

      // Attach event listeners to Add to Cart buttons
      const buttons = container.querySelectorAll(".add-to-cart");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const product = {
            id: btn.getAttribute("data-id"),
            title: btn.getAttribute("data-title"),
            price: parseFloat(btn.getAttribute("data-price")),
            image: btn.getAttribute("data-image"),
            quantity: 1
          };
          const newQuantity = addToCart(product);

          // Update button text
          btn.textContent = `+${newQuantity}`;
        });
      });

      // عند تحميل الصفحة، لو في منتجات بالفعل بالعربة، نحدث الأزرار
      updateButtonsFromCart();
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      container.innerHTML = `<p>⚠️ Failed to load products. Please try again later.</p>`;
    });
});

/**
 * Add product to cart in localStorage
 */
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.id == product.id);

  if (existingItem) {
    existingItem.quantity += 1; // increase quantity
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return existingItem ? existingItem.quantity : product.quantity;
}

/**
 * Update all Add to Cart buttons based on cart state
 */
function updateButtonsFromCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach(item => {
    const btn = document.querySelector(`.add-to-cart[data-id="${item.id}"]`);
    if (btn) {
      btn.textContent = `+${item.quantity}`;
    }
  });
}

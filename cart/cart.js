
/**
 * Cart Script
 * - Loads cart items from localStorage
 * - Renders them in the cart table
 * - Allows removing items, clearing cart, and checkout
 * - Bonus: Thank-you message, promo code, email simulation
 */

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkout");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Render cart items
  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <tr>
          <td colspan="5">Your cart is empty 🛒</td>
        </tr>
      `;
      cartTotalEl.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.title}"></td>
        <td>${item.title}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td><button class="removeBtn" data-index="${index}">Remove</button></td>
      `;

      cartItemsContainer.appendChild(row);

      total += item.price * item.quantity;
    });

    cartTotalEl.textContent = total.toFixed(2);

    // Attach remove button events
    document.querySelectorAll(".removeBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        removeItem(idx);
      });
    });
  }

  // Remove a single item
  function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Clear entire cart
  clearCartBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  // Checkout with login check + Bonus features
  checkoutBtn.addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      alert("⚠️ You must be logged in to checkout.");
      window.location.href = "../auth/login.html"; // عدل المسار لو مختلف
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // حساب المجموع
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ إدخال كود الخصم
    const promoCode = prompt("Enter promo code (if any):");
    if (promoCode && promoCode.toLowerCase() === "discount10") {
      total = total * 0.9; // خصم 10%
      alert("🎉 Promo code applied! 10% discount.");
    }

    // ✅ حفظ الطلبات في localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: "ORD-" + Date.now(),
      user: currentUser.username,
      items: cart,
      total: total.toFixed(2),
      date: new Date().toLocaleString()
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // ✅ تفريغ العربة بعد الشراء
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ رسالة شكر
    alert(`✅ Thank you for your purchase, ${currentUser.username}!\nOrder ID: ${newOrder.id}\nTotal: $${newOrder.total}`);

    // ✅ محاكاة إرسال إيميل
    console.log(`📧 Email sent to ${currentUser.username}: Order ${newOrder.id} confirmed.`);

    // ✅ إعادة التوجيه إلى صفحة الطلبات
    window.location.href = "../orders/orders.html"; // عدل المسار لو مختلف
  });

  // Initial render
  renderCart();
});

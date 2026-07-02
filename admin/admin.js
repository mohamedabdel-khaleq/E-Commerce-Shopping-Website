const usersList = document.getElementById("users-list");
const productsTable = document.querySelector("#productsTable tbody");
const ordersTable = document.querySelector("#ordersTable tbody");
const productForm = document.getElementById("productForm");

let products = JSON.parse(localStorage.getItem("products")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// --- Render Users ---
function renderUsers() {
  usersList.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.isAdmin ? "Admin" : "User"}</td>
    `;
    usersList.appendChild(tr);
  });
  document.getElementById("total-users").textContent = users.length;
}

// --- Render Products ---
function renderProducts() {
  productsTable.innerHTML = "";
  products.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.title}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><img src="${p.image}" alt="${p.title}" style="max-width:60px; max-height:60px;"></td>
      <td>
        <button onclick="editProduct(${i})">✏️ Edit</button>
        <button onclick="deleteProduct(${i})">🗑️ Delete</button>
      </td>
    `;
    productsTable.appendChild(tr);
  });
  document.getElementById("total-products").textContent = products.length;
}

// --- Save Products ---
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// --- Add Product Handler ---
function addHandler(e) {
  e.preventDefault();
  const title = document.getElementById("productTitle").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const image = document.getElementById("productImage").value;
  const description = document.getElementById("productDescription").value;

  const newProduct = {
    id: Date.now(),
    title,
    description,
    image,
    price
  };

  products.push(newProduct);
  saveProducts();
  productForm.reset();
}

// --- Edit Product ---
function editProduct(index) {
  const p = products[index];
  document.getElementById("productTitle").value = p.title;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productImage").value = p.image;
  document.getElementById("productDescription").value = p.description;

  // Replace submit handler temporarily
  productForm.onsubmit = function (e) {
    e.preventDefault();
    p.title = document.getElementById("productTitle").value;
    p.price = parseFloat(document.getElementById("productPrice").value);
    p.image = document.getElementById("productImage").value;
    p.description = document.getElementById("productDescription").value;
    saveProducts();
    productForm.reset();
    productForm.onsubmit = addHandler; // Restore add handler
  };
}

// --- Delete Product ---
function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    saveProducts();
  }
}

// --- Render Orders ---
function renderOrders() {
  ordersTable.innerHTML = "";
  let totalSales = 0;

  orders.forEach((o, i) => {
    totalSales += o.total;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.user}</td>
      <td>$${o.total.toFixed(2)}</td>
      <td>${o.date}</td>
      <td><button onclick="deleteOrder(${i})">🗑️ Delete</button></td>
    `;
    ordersTable.appendChild(tr);
  });

  document.getElementById("total-sales").textContent = totalSales.toFixed(2);
}

// --- Delete Order ---
function deleteOrder(index) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

// --- Stats Init ---
function updateStats() {
  renderUsers();
  renderProducts();
  renderOrders();
}

// --- Bind Default Add Handler ---
productForm.onsubmit = addHandler;

// --- Initial Render ---
updateStats();

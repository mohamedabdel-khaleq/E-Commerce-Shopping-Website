document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const ordersBody = document.getElementById("ordersBody");

  if (!currentUser) {
    alert("⚠️ You must be logged in to view your orders.");
    window.location.href = "../auth/login.html";
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let userOrders = orders.filter(order => order.user === currentUser.username);

  if (userOrders.length === 0) {
    ordersBody.innerHTML = `
      <tr>
        <td colspan="4">You have no orders yet.</td>
      </tr>
    `;
    return;
  }

  userOrders.forEach(order => {
    const row = document.createElement("tr");

    const itemsList = order.items.map(
      item => `${item.title} (x${item.quantity})`
    ).join(", ");

    row.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.date}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td>${itemsList}</td>
    `;

    ordersBody.appendChild(row);
  });
});

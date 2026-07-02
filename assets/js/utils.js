// utils.js
// Session + UI management + page access control

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  updateAuthUI();
window.location.reload();
}

function updateAuthUI() {
  const loginLink = document.getElementById("login-link");
  const signupLink = document.getElementById("signup-link");
  const logoutBtn = document.getElementById("logout-btn");
  const welcomeMsg = document.getElementById("welcome-msg");
  const adminLink = document.getElementById("admin-link");
  const ordersLink = document.getElementById("orders-link");

  const currentUser = getCurrentUser();

  if (currentUser) {
    // --- Logged in ---
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.onclick = () => logoutUser();
    }

    if (welcomeMsg) {
      welcomeMsg.style.display = "inline-block";
      welcomeMsg.textContent = `Welcome, ${currentUser.username}`;
    }

    if (ordersLink) {
      ordersLink.style.display = "inline-block"; // يظهر فقط لو مسجل دخول
    }

    if (adminLink) {
      adminLink.style.display = currentUser.isAdmin ? "inline-block" : "none";
    }

  } else {
    // --- Logged out ---
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";

    if (welcomeMsg) {
      welcomeMsg.style.display = "none";
      welcomeMsg.textContent = "";
    }

    if (ordersLink) {
      ordersLink.style.display = "none"; // اختفاء لو مش مسجل دخول
    }

    if (adminLink) {
      adminLink.style.display = "none";
    }
  }
}

// --- Access Control ---
// Prevent logged-out users from accessing protected pages
function checkPageAccess() {
  const currentUser = getCurrentUser();
  const path = window.location.pathname;

  const isLoginPage = path.includes("login.html");
  const isSignupPage = path.includes("signup.html");
  const isAdminPage = path.includes("admin.html");

  // If NOT logged in and tries to access admin → redirect
  if (!currentUser && isAdminPage) {
    window.location.href = "../index.html";
  }

  // If logged in and tries to access login/signup → redirect
  if (currentUser && (isLoginPage || isSignupPage)) {
    window.location.href = "../index.html";
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  checkPageAccess();
});

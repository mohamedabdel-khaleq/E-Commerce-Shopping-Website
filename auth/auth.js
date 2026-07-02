
// auth.js
// Handles signup & login only (data layer)

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const isAdmin = document.getElementById("isAdmin").checked;

    let users = getUsers();

    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );
    if (existingUser) {
      alert("User already exists with this username or email.");
      return;
    }

    users.push({ username, email, password, isAdmin });
    saveUsers(users);

    alert("Signup successful! You can now login.");
    window.location.href = "login.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loginId = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(
      (u) =>
        (u.username === loginId || u.email === loginId) &&
        u.password === password
    );

    if (!user) {
      alert("Invalid credentials.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "../index.html";
  });
}

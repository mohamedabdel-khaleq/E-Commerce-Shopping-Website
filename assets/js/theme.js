/**
 * Theme Toggle Script
 * - Handles switching between Light and Dark mode
 * - Saves user's preference in localStorage
 * - Applies the saved preference across all pages
 */

// Select the toggle button
const toggleBtn = document.getElementById("themeToggle");

// Function to apply the theme
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️"; // sun icon for switching back
  } else {
    document.body.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙"; // moon icon for dark mode
  }
  // Save preference
  localStorage.setItem("theme", theme);
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});

// Toggle theme on button click
toggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
});

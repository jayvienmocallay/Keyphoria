// Configuration - loaded from config.js
let API_URL = "http://localhost:5000"; // Default, overridden by config

// State
let currentUser = null;
let passwords = [];
let editingPasswordId = null;

// Initialize config
async function initConfig() {
  try {
    API_URL = await Config.getApiUrl();
  } catch (error) {
    console.warn("Using default API URL:", API_URL);
  }
}

// Utility Functions
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${isError ? "error" : ""}`;
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function clearError(errorId) {
  document.getElementById(errorId).textContent = "";
}

// API Functions
async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Authentication Functions
async function checkSession() {
  try {
    const data = await apiCall("/check-session");
    if (data.logged_in) {
      currentUser = data.username;
      showMainSection();
      await loadPasswords();
    } else {
      showAuthSection();
    }
  } catch (error) {
    console.error("Session check failed:", error);
    showAuthSection();
  }
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  clearError("login-error");

  if (!username || !password) {
    document.getElementById("login-error").textContent =
      "Please fill in all fields";
    return;
  }

  try {
    showLoading();
    const data = await apiCall("/login", "POST", { username, password });
    currentUser = data.username;
    showNotification("Login successful!");
    showMainSection();
    await loadPasswords();
  } catch (error) {
    document.getElementById("login-error").textContent = error.message;
  } finally {
    hideLoading();
  }
}

async function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document
    .getElementById("register-confirm")
    .value.trim();

  clearError("register-error");

  if (!username || !password || !confirmPassword) {
    document.getElementById("register-error").textContent =
      "Please fill in all fields";
    return;
  }

  if (password !== confirmPassword) {
    document.getElementById("register-error").textContent =
      "Passwords do not match";
    return;
  }

  if (password.length < 6) {
    document.getElementById("register-error").textContent =
      "Password must be at least 6 characters";
    return;
  }

  try {
    showLoading();
    const data = await apiCall("/register", "POST", { username, password });
    currentUser = username;
    showNotification("Registration successful!");
    showMainSection();
    await loadPasswords();
  } catch (error) {
    document.getElementById("register-error").textContent = error.message;
  } finally {
    hideLoading();
  }
}

async function logout() {
  try {
    await apiCall("/logout", "POST");
    currentUser = null;
    passwords = [];
    showNotification("Logged out successfully");
    showAuthSection();
  } catch (error) {
    showNotification("Logout failed", true);
  }
}

// Password Management Functions
async function loadPasswords() {
  try {
    showLoading();
    const data = await apiCall("/get-all-passwords");
    passwords = data;
    renderPasswords(passwords);
  } catch (error) {
    showNotification("Failed to load passwords", true);
  } finally {
    hideLoading();
  }
}

async function addPassword() {
  const service = document.getElementById("new-service").value.trim();
  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();

  clearError("add-error");

  if (!service || !username || !password) {
    document.getElementById("add-error").textContent =
      "Please fill in all fields";
    return;
  }

  try {
    showLoading();
    await apiCall("/add", "POST", { service, username, password });
    showNotification("Password added successfully!");
    closeAddModal();
    await loadPasswords();
  } catch (error) {
    document.getElementById("add-error").textContent = error.message;
  } finally {
    hideLoading();
  }
}

async function updatePassword() {
  const password = document.getElementById("edit-password").value.trim();

  clearError("edit-error");

  if (!password) {
    document.getElementById("edit-error").textContent =
      "Please enter a password";
    return;
  }

  try {
    showLoading();
    await apiCall("/edit-password", "POST", {
      id: editingPasswordId,
      password,
    });
    showNotification("Password updated successfully!");
    closeEditModal();
    await loadPasswords();
  } catch (error) {
    document.getElementById("edit-error").textContent = error.message;
  } finally {
    hideLoading();
  }
}

async function deletePassword(id, service) {
  if (
    !confirm(`Are you sure you want to delete the password for ${service}?`)
  ) {
    return;
  }

  try {
    showLoading();
    await apiCall("/delete-password", "POST", { id });
    showNotification("Password deleted successfully!");
    await loadPasswords();
  } catch (error) {
    showNotification("Failed to delete password", true);
  } finally {
    hideLoading();
  }
}

// UI Functions
function showAuthSection() {
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("main-section").classList.add("hidden");
}

function showMainSection() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("main-section").classList.remove("hidden");
  document.getElementById("username-display").textContent = `👤 ${currentUser}`;
}

function renderPasswords(passwordsToRender) {
  const container = document.getElementById("passwords-list");

  if (passwordsToRender.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>🔒 No passwords saved yet</p>
        <p>Click "Add Password" to get started!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = passwordsToRender
    .map(
      (pwd) => `
    <div class="password-item" data-id="${pwd.id}">
      <div class="password-info">
        <div class="password-service">${escapeHtml(pwd.service)}</div>
        <div class="password-username">${escapeHtml(pwd.username)}</div>
      </div>
      <div class="password-actions">
        <button class="btn btn-secondary btn-sm" data-action="copy" data-id="${pwd.id}">Copy</button>
        <button class="btn btn-secondary btn-sm" data-action="fill" data-id="${pwd.id}">Fill</button>
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${pwd.id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${pwd.id}">Delete</button>
      </div>
    </div>
  `
    )
    .join("");

  // Event delegation — handle all button clicks safely
  container.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const pwd = passwords.find((p) => p.id === id);
      if (!pwd) return;

      switch (btn.dataset.action) {
        case "copy":
          copyPasswordToClipboard(pwd.password);
          break;
        case "fill":
          fillPassword(id);
          break;
        case "edit":
          openEditModal(id);
          break;
        case "delete":
          deletePassword(id, pwd.service);
          break;
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function copyPasswordToClipboard(password) {
  navigator.clipboard
    .writeText(password)
    .then(() => {
      showNotification("Password copied to clipboard!");
    })
    .catch(() => {
      showNotification("Failed to copy password", true);
    });
}

async function fillPassword(id) {
  const pwd = passwords.find((p) => p.id === id);
  if (!pwd) return;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (username, password) => {
        const usernameFields = document.querySelectorAll(
          'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]'
        );
        const passwordFields = document.querySelectorAll(
          'input[type="password"]'
        );

        if (usernameFields.length > 0) {
          usernameFields[0].value = username;
        }

        if (passwordFields.length > 0) {
          passwordFields[0].value = password;
        }
      },
      args: [pwd.username, pwd.password],
    });

    showNotification("Credentials filled!");
  } catch (error) {
    showNotification("Failed to fill credentials", true);
  }
}

function openAddModal() {
  document.getElementById("add-modal").classList.remove("hidden");
  document.getElementById("new-service").value = "";
  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";
  clearError("add-error");
}

function closeAddModal() {
  document.getElementById("add-modal").classList.add("hidden");
}

function openEditModal(id) {
  const pwd = passwords.find((p) => p.id === id);
  if (!pwd) return;

  editingPasswordId = id;
  document.getElementById("edit-service").value = pwd.service;
  document.getElementById("edit-username").value = pwd.username;
  document.getElementById("edit-password").value = "";
  document.getElementById("edit-modal").classList.remove("hidden");
  clearError("edit-error");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
  editingPasswordId = null;
}

function generatePassword() {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  document.getElementById("new-password").value = password;
  showNotification("Strong password generated!");
}

function searchPasswords() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filtered = passwords.filter(
    (pwd) =>
      pwd.service.toLowerCase().includes(searchTerm) ||
      pwd.username.toLowerCase().includes(searchTerm)
  );
  renderPasswords(filtered);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Load config first
  await initConfig();

  // Auth events
  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("register-btn").addEventListener("click", register);
  document.getElementById("logout-btn").addEventListener("click", logout);

  document.getElementById("show-register").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
  });

  document.getElementById("show-login").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
  });

  // Password management events
  document
    .getElementById("add-password-btn")
    .addEventListener("click", openAddModal);
  document
    .getElementById("save-password-btn")
    .addEventListener("click", addPassword);
  document
    .getElementById("cancel-add-btn")
    .addEventListener("click", closeAddModal);
  document
    .getElementById("update-password-btn")
    .addEventListener("click", updatePassword);
  document
    .getElementById("cancel-edit-btn")
    .addEventListener("click", closeEditModal);
  document
    .getElementById("refresh-btn")
    .addEventListener("click", loadPasswords);
  document
    .getElementById("generate-password-btn")
    .addEventListener("click", generatePassword);
  document
    .getElementById("search-input")
    .addEventListener("input", searchPasswords);

  // Modal close buttons
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".modal").classList.add("hidden");
    });
  });

  // Enter key support
  document
    .getElementById("login-password")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") login();
    });

  document
    .getElementById("register-confirm")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") register();
    });

  // Initialize - check if already logged in
  await checkSession();
});

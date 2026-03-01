// ─── Auth Form Handlers ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
      const errorEl = document.getElementById("login-error");

      if (!username || !password) {
        if (errorEl) errorEl.textContent = "Please fill in all fields";
        return;
      }

      try {
        // Show loader
        const loader = document.getElementById("login-loader");
        if (loader) loader.style.display = "block";
        if (errorEl) errorEl.textContent = "";

        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = data.redirect || "/profile";
        } else {
          if (loader) loader.style.display = "none";
          if (errorEl) errorEl.textContent = data.error || "Login failed";
        }
      } catch (err) {
        const loader = document.getElementById("login-loader");
        if (loader) loader.style.display = "none";
        if (errorEl) errorEl.textContent = "Network error. Please try again.";
      }
    });
  }

  // Signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-confirm").value;
      const errorEl = document.getElementById("signup-error");

      if (!username || !password || !confirm) {
        if (errorEl) errorEl.textContent = "Please fill in all fields";
        return;
      }

      if (password !== confirm) {
        if (errorEl) errorEl.textContent = "Passwords do not match";
        return;
      }

      if (password.length < 6) {
        if (errorEl) errorEl.textContent = "Password must be at least 6 characters";
        return;
      }

      try {
        // Show loader
        const loader = document.getElementById("signup-loader");
        if (loader) loader.style.display = "block";
        if (errorEl) errorEl.textContent = "";

        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = data.redirect || "/profile";
        } else {
          if (loader) loader.style.display = "none";
          if (errorEl) errorEl.textContent = data.error || "Registration failed";
        }
      } catch (err) {
        const loader = document.getElementById("signup-loader");
        if (loader) loader.style.display = "none";
        if (errorEl) errorEl.textContent = "Network error. Please try again.";
      }
    });
  }
});

// ─── Utility Functions ───────────────────────────────────────────────────────

function showNotification(message, type = "info") {
  // Try the inline notification modal first (exists on profile/view pages)
  const notificationModal = document.getElementById("notification-modal");
  if (notificationModal) {
    const notificationMessage = document.getElementById("notification-message");
    if (notificationMessage) {
      notificationMessage.textContent = message;
      notificationModal.style.display = "block";
      setTimeout(() => {
        notificationModal.style.display = "none";
      }, 3500);
      return;
    }
  }

  // Fallback: create a floating notification
  const notification = document.createElement("div");
  notification.textContent = message;

  const colors = {
    success: "#28a745",
    error: "#dc3545",
    info: "#007bff",
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s;
    background-color: ${colors[type] || colors.info};
  `;

  document.body.appendChild(notification);
  setTimeout(() => (notification.style.opacity = "1"), 100);
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function showErrorModal(message) {
  const errorMsg = document.getElementById("error-message");
  const errorModal = document.getElementById("error-modal");
  if (errorMsg && errorModal) {
    errorMsg.innerText = message;
    errorModal.style.display = "flex";
  } else {
    // Fallback to notification if error modal doesn't exist
    showNotification(message, "error");
  }
}

function closeErrorModal() {
  const errorModal = document.getElementById("error-modal");
  if (errorModal) errorModal.style.display = "none";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

function showLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "block";
}

function hideLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

function disableButton(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = true;
}

function enableButton(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = false;
}


// ─── Modal Functions ─────────────────────────────────────────────────────────

function showAddPasswordModal() {
  const modal = document.getElementById("add-password-modal");
  if (modal) modal.style.display = "flex";
}




// ─── Password Functions ──────────────────────────────────────────────────────

async function addPassword() {
  const serviceEl = document.getElementById("add-service");
  const usernameEl = document.getElementById("add-username");
  const passwordEl = document.getElementById("add-password");

  if (!serviceEl || !usernameEl || !passwordEl) return;

  const service = serviceEl.value;
  const username = usernameEl.value;
  const password = passwordEl.value;

  if (!service || !username || !password) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  // Get the submit button and disable it with loader
  const btn = document.querySelector("#add-password-modal .neo-btn");
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.style.opacity = "0.7";
  btn.style.cursor = "not-allowed";
  btn.innerHTML = '<span class="neo-btn-loader"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';

  try {
    const response = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      showNotification(data.success || "Password added!", "success");
      closeModal("add-password-modal");
      // Clear the form
      serviceEl.value = "";
      usernameEl.value = "";
      passwordEl.value = "";
    } else {
      showNotification(data.error || "An unknown error occurred.", "error");
    }
  } catch (error) {
    showNotification("Failed to add password. Please try again.", "error");
    console.error(error);
  } finally {
    // Restore button
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.textContent = originalText;
  }
}




// ─── Auth Functions ──────────────────────────────────────────────────────────

async function login() {
  const usernameEl = document.getElementById("login-username");
  const passwordEl = document.getElementById("login-password");
  const errorElement = document.getElementById("login-error");

  if (!usernameEl || !passwordEl) return;

  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();

  if (errorElement) errorElement.textContent = "";

  if (!username || !password) {
    if (errorElement) errorElement.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = "/profile";
    } else {
      if (errorElement) errorElement.textContent = data.error || "Login failed.";
    }
  } catch (error) {
    console.error("Login error:", error);
    if (errorElement) errorElement.textContent = "Failed to log in. Please try again.";
  }
}

async function register() {
  const usernameEl = document.getElementById("register-username");
  const passwordEl = document.getElementById("register-password");
  const errorElement = document.getElementById("signup-error");

  if (!usernameEl || !passwordEl) return;

  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();

  if (errorElement) errorElement.textContent = "";

  if (!username || !password) {
    if (errorElement) errorElement.textContent = "Please fill in all fields.";
    return;
  }

  if (password.length < 6) {
    if (errorElement) errorElement.textContent = "Password must be at least 6 characters long.";
    return;
  }

  showLoading();

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = "/profile";
    } else {
      if (errorElement) errorElement.textContent = data.error || "Registration failed.";
    }
  } catch (error) {
    console.error("Register error:", error);
    if (errorElement) errorElement.textContent = "Failed to sign up. Please try again.";
  } finally {
    hideLoading();
  }
}

async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      window.location.href = "/";
    } else {
      showNotification("Error logging out.", "error");
    }
  } catch (error) {
    console.error("Logout error:", error);
    showNotification("Failed to log out. Please try again.", "error");
  }
}

async function checkAuthStatus() {
  try {
    const response = await fetch("/check-session");
    const data = await response.json();

    const logoutBtn = document.getElementById("logout-btn");

    if (data.logged_in) {
      if (logoutBtn) logoutBtn.style.display = "block";
    } else {
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Auth check error:", error);
  }
}

// Check auth on profile page
if (window.location.pathname === "/profile") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/check-session");
      const data = await response.json();
      if (!data.logged_in) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  });
}

function exitApp() {
  window.close();
  window.location.href = "about:blank";
}





// ─── Page Initialization ─────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Bind login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  // Bind signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  }



  // Check auth status (shows/hides logout button)
  checkAuthStatus();

  // Dropdown menu toggle
  const dropdownBtn = document.getElementById("dropdownBtn");
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", function () {
      const content = document.getElementById("dropdownContent");
      if (content) {
        content.style.display = content.style.display === "block" ? "none" : "block";
      }
    });
  }
});

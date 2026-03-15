// Content Script - Detects and fills login forms

(function () {
  "use strict";

  let detectedForms = [];
  let currentDomain = window.location.hostname;

  async function requestCredentialsForDomain(domain) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getCredentials",
        domain,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        errorCode: "messaging_failed",
        error: "Unable to communicate with extension background service",
      };
    }
  }

  // Detect login forms on page load
  function detectLoginForms() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      const passwordFields = form.querySelectorAll('input[type="password"]');
      const usernameFields = form.querySelectorAll(
        'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"], input[autocomplete="username"]',
      );

      if (passwordFields.length > 0 && usernameFields.length > 0) {
        detectedForms.push({
          form: form,
          usernameField: usernameFields[0],
          passwordField: passwordFields[0],
        });

        // Add autofill button
        addAutofillButton(form, usernameFields[0], passwordFields[0]);

        // Intercept form submission to offer saving
        interceptFormSubmit(form, usernameFields[0], passwordFields[0]);
      }
    });
  }

  // Add autofill button to login form
  function addAutofillButton(form, usernameField, passwordField) {
    // Check if button already exists
    if (form.querySelector(".pm-autofill-btn")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "pm-autofill-btn";
    button.innerHTML = "🔐 Autofill with Password Manager";
    button.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
      width: 100%;
      transition: transform 0.2s;
    `;

    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
    });

    button.addEventListener("click", async () => {
      await autofillForm(usernameField, passwordField);
    });

    // Insert button before the submit button or at the end of the form
    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (submitButton) {
      submitButton.parentNode.insertBefore(button, submitButton);
    } else {
      form.appendChild(button);
    }
  }

  // Autofill form with saved credentials
  async function autofillForm(usernameField, passwordField) {
    try {
      const response = await requestCredentialsForDomain(currentDomain);

      if (!response || !response.success) {
        if (response?.errorCode === "auth_required") {
          showNotification(
            "Please login to the Password Manager extension first",
            "error",
          );
        } else if (response?.errorCode === "api_unreachable") {
          showNotification(
            "Cannot reach Keyphoria server. Check your connection/API URL.",
            "error",
          );
        } else {
          showNotification(
            response?.error || "Failed to retrieve credentials",
            "error",
          );
        }
        return;
      }

      const matching = Array.isArray(response.credentials)
        ? response.credentials
        : [];

      if (matching.length === 0) {
        showNotification("No saved passwords found for this site", "info");
        return;
      }

      // If multiple matches, show selection dialog
      if (matching.length === 1) {
        fillFields(usernameField, passwordField, matching[0]);
        showNotification("Credentials filled successfully!", "success");
      } else {
        showCredentialSelector(usernameField, passwordField, matching);
      }
    } catch (error) {
      showNotification("Failed to retrieve credentials", "error");
      console.error("Autofill error:", error);
    }
  }

  // Fill form fields
  function fillFields(usernameField, passwordField, credentials) {
    usernameField.value = credentials.username;
    passwordField.value = credentials.password;

    // Trigger input events for frameworks like React
    const inputEvent = new Event("input", { bubbles: true });
    usernameField.dispatchEvent(inputEvent);
    passwordField.dispatchEvent(inputEvent);
  }

  // Show credential selector when multiple matches
  function showCredentialSelector(usernameField, passwordField, credentials) {
    const overlay = document.createElement("div");
    overlay.className = "pm-credential-selector-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;

    dialog.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #333;">Select Account</h3>
      <div class="pm-credential-list">
        ${credentials
          .map(
            (cred, index) => `
          <div class="pm-credential-item" data-index="${index}" style="
            padding: 12px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
          ">
            <div style="font-weight: 600; color: #333;">${cred.service}</div>
            <div style="font-size: 14px; color: #666;">${cred.username}</div>
          </div>
        `,
          )
          .join("")}
      </div>
      <button class="pm-cancel-btn" style="
        width: 100%;
        padding: 10px;
        margin-top: 12px;
        background: #f0f0f0;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      ">Cancel</button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Add hover effects
    dialog.querySelectorAll(".pm-credential-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.background = "#e9ecef";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "#f8f9fa";
      });
      item.addEventListener("click", () => {
        const index = parseInt(item.dataset.index);
        fillFields(usernameField, passwordField, credentials[index]);
        document.body.removeChild(overlay);
        showNotification("Credentials filled successfully!", "success");
      });
    });

    dialog.querySelector(".pm-cancel-btn").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
  }

  // Show notification
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = "pm-notification";

    const colors = {
      success: "#28a745",
      error: "#dc3545",
      info: "#667eea",
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      animation: pmSlideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "pmSlideOut 0.3s ease";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Intercept form submissions to offer saving credentials
  function interceptFormSubmit(form, usernameField, passwordField) {
    if (form.dataset.pmIntercepted) return;
    form.dataset.pmIntercepted = "true";

    form.addEventListener("submit", () => {
      const username = usernameField.value.trim();
      const password = passwordField.value;

      if (username && password) {
        const serviceName = currentDomain.replace("www.", "").split(".")[0];
        const capitalized =
          serviceName.charAt(0).toUpperCase() + serviceName.slice(1);

        // Small delay so the page processes the submit first
        setTimeout(() => {
          showSavePopup(capitalized, username, password);
        }, 500);
      }
    });
  }

  // Show a small save-password popup in the top-right corner (near extension area)
  function showSavePopup(service, username, password) {
    // Remove any existing popup
    const existing = document.getElementById("kp-save-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "kp-save-popup";
    popup.style.cssText = `
      position: fixed;
      top: 8px;
      right: 8px;
      width: 280px;
      background: linear-gradient(135deg, #0f0c29, #302b63);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 14px 16px;
      z-index: 2147483647;
      font-family: 'Segoe UI', sans-serif;
      color: white;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      animation: kpPopIn 0.3s ease;
    `;

    popup.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <span style="font-size: 18px;">🔐</span>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 13px;">Keyphoria</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Save password for ${service}?</div>
        </div>
        <span id="kp-popup-close" style="cursor: pointer; font-size: 18px; color: rgba(255,255,255,0.4); line-height: 1;">&times;</span>
      </div>
      <div style="background: rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px; margin-bottom: 10px;">
        <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Username</div>
        <div style="font-size: 13px; font-weight: 600; margin-top: 2px;">${username}</div>
      </div>
      <div style="display: flex; gap: 6px;">
        <button id="kp-popup-save" style="
          flex: 1;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: white;
          border: none;
          padding: 8px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        ">Save</button>
        <button id="kp-popup-dismiss" style="
          flex: 1;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        ">Dismiss</button>
      </div>
    `;

    // Add animation keyframes
    if (!document.getElementById("kp-popup-styles")) {
      const style = document.createElement("style");
      style.id = "kp-popup-styles";
      style.textContent = `
        @keyframes kpPopIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kpPopOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(popup);

    function dismissPopup() {
      popup.style.animation = "kpPopOut 0.2s ease";
      setTimeout(() => popup.remove(), 200);
    }

    // Save button
    popup
      .querySelector("#kp-popup-save")
      .addEventListener("click", async () => {
        const saveBtn = popup.querySelector("#kp-popup-save");
        saveBtn.textContent = "Saving...";
        saveBtn.style.opacity = "0.7";

        try {
          const response = await chrome.runtime.sendMessage({
            action: "saveCredentials",
            credentials: { service, username, password },
          });

          if (response && response.success) {
            showNotification("✅ Password saved to Keyphoria!", "success");
          } else {
            showNotification(
              response?.error || "Failed to save. Log in to Keyphoria first.",
              "error",
            );
          }
        } catch (err) {
          showNotification(
            "Failed to save. Log in to Keyphoria extension first.",
            "error",
          );
        }
        dismissPopup();
      });

    // Dismiss / close
    popup
      .querySelector("#kp-popup-dismiss")
      .addEventListener("click", dismissPopup);
    popup
      .querySelector("#kp-popup-close")
      .addEventListener("click", dismissPopup);

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) dismissPopup();
    }, 30000);
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openSaveDialog") {
      if (detectedForms.length > 0) {
        const last = detectedForms[detectedForms.length - 1];
        const username = last.usernameField.value.trim();
        const password = last.passwordField.value;
        if (username && password) {
          const serviceName = currentDomain.replace("www.", "").split(".")[0];
          const capitalized =
            serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
          showSavePopup(capitalized, username, password);
        } else {
          showNotification("No credentials detected on this page", "info");
        }
      } else {
        showNotification("No login form detected on this page", "info");
      }
    }
  });

  // Initialize: get API URL, then detect forms
  async function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", detectLoginForms);
    } else {
      detectLoginForms();
    }
  }

  init();

  // Also detect forms added dynamically
  const observer = new MutationObserver(() => {
    detectLoginForms();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pmSlideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes pmSlideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes pmSlideUp {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }
    @keyframes pmSlideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

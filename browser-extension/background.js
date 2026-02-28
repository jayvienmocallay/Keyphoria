// Background Service Worker for Password Manager Extension

// Import config
importScripts("config.js");

let API_URL = "http://localhost:5000";

// Initialize config
async function initBackgroundConfig() {
  try {
    API_URL = await Config.getApiUrl();
  } catch (error) {
    console.warn("Using default API URL:", API_URL);
  }
}

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Password Manager Extension installed");
  await initBackgroundConfig();

  // Context menu for saving passwords
  chrome.contextMenus.create({
    id: "savePassword",
    title: "Save Password with Password Manager",
    contexts: ["editable"],
  });
});

// Also init on service worker startup
initBackgroundConfig();

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCredentials") {
    handleGetCredentials(request.domain, sendResponse);
    return true; // Indicates async response
  } else if (request.action === "saveCredentials") {
    handleSaveCredentials(request.credentials, sendResponse);
    return true;
  } else if (request.action === "getApiUrl") {
    // Allow content scripts to request the API URL
    sendResponse({ url: API_URL });
    return false;
  }
});

// Get credentials for a specific domain
async function handleGetCredentials(domain, sendResponse) {
  try {
    const response = await fetch(`${API_URL}/get-all-passwords`, {
      credentials: "include",
    });

    if (response.ok) {
      const passwords = await response.json();
      const matching = passwords.filter((pwd) =>
        pwd.service.toLowerCase().includes(domain.toLowerCase())
      );
      sendResponse({ success: true, credentials: matching });
    } else {
      sendResponse({ success: false, error: "Not logged in" });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Save new credentials
async function handleSaveCredentials(credentials, sendResponse) {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      sendResponse({ success: true });
    } else {
      const data = await response.json();
      sendResponse({ success: false, error: data.error });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "savePassword") {
    chrome.tabs.sendMessage(tab.id, { action: "openSaveDialog" });
  }
});

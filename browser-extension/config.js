/**
 * Configuration module for Password Manager Extension
 * Loads API URL from config.json and provides it to all extension scripts.
 * 
 * To switch between local development and production:
 *   - Edit config.json and update api.url
 *   - Local: "http://localhost:5000"
 *   - Production: "https://your-deployed-api.vercel.app"
 */

const Config = {
  _config: null,

  async load() {
    if (this._config) return this._config;

    try {
      const response = await fetch(chrome.runtime.getURL("config.json"));
      this._config = await response.json();
    } catch (error) {
      console.warn("Failed to load config.json, using defaults:", error);
      this._config = {
        api: { url: "http://localhost:5000" },
        security: { passwordMinLength: 6, usernameMinLength: 3 },
        ui: { notificationDuration: 3000 }
      };
    }

    return this._config;
  },

  async getApiUrl() {
    const config = await this.load();
    return config.api.url;
  },

  async getEndpoint(name) {
    const config = await this.load();
    const base = config.api.url;
    const path = config.api.endpoints?.[name] || `/${name}`;
    return `${base}${path}`;
  }
};

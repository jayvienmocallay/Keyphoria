# Browser Extension Installation Guide

## Quick Start

### 1. Start the Backend Server

```bash
# Navigate to the project directory
cd "Password Manager"

# Install dependencies (if not already done)
pip install -r requirements.txt

# Run the API server
python api.py
```

The server will start on `http://localhost:5000`

### 2. Load the Extension

#### Google Chrome / Microsoft Edge:

1. Open your browser
2. Navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Browse to and select the `browser-extension` folder
6. The extension icon should appear in your toolbar!

#### Mozilla Firefox:

1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Browse to the `browser-extension` folder
5. Select the `manifest.json` file
6. The extension will be loaded (Note: temporary add-ons are removed when Firefox closes)

For permanent installation in Firefox, you'll need to sign the extension through Mozilla.

### 3. Using the Extension

1. **Click the extension icon** in your browser toolbar
2. **Sign up** with a username and password
3. **Add passwords** using the "+ Add Password" button
4. **Visit any login page** and look for the auto-fill button!

## Features

- 🔐 Secure password storage with encryption
- 🔄 Auto-fill login forms
- 🔍 Search your passwords
- 🎲 Generate strong passwords
- ✏️ Edit and manage your passwords
- 📋 Copy passwords to clipboard

## Troubleshooting

**Issue: Extension can't connect to server**

- Make sure `api.py` is running on port 5000
- Check console for errors (Right-click extension → Inspect)

**Issue: Auto-fill not working**

- Ensure you're logged into the extension
- Some websites may block auto-fill functionality

**Issue: Session keeps expiring**

- This is normal - sessions expire after inactivity for security
- Just log in again when needed

## Next Steps

Check out the full `README_EXTENSION.md` for more details on:

- Security features
- API endpoints
- Development tips
- Configuration options

Enjoy your secure password manager! 🎉

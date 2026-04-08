# 🔐 Keyphoria — Secure Password Manager

A modern, secure password manager with a Flask backend, Supabase (PostgreSQL) database, and a Chrome browser extension for autofilling credentials. Deployed to **Vercel**.

🌐 **Live**: [keyphoria.vercel.app](https://keyphoria.vercel.app)

---
## Features

- 🔒 **Encrypted Password Storage** — Passwords encrypted with the `cryptography` library (Fernet symmetric encryption)
- 🔄 **Flip-Card Auth** — Animated login/signup form with toggle switch and bouncing ball loader
- 🎨 **Keyphoria Loader** — Custom SVG loading screen with animated K-E-Y letters
- 🧩 **Chrome Extension** — Auto-detect login forms and autofill saved credentials
- 📋 **Password Management** — Add, view, edit, and delete passwords with animated action buttons
- 🌐 **Vercel Deployment** — Serverless Flask on Vercel with Supabase PostgreSQL via connection pooler
- 📱 **Responsive Design** — Works on desktop and mobile with adaptive layouts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Flask, Flask-SQLAlchemy, Gunicorn |
| **Database** | Supabase (PostgreSQL) via transaction pooler |
| **Frontend** | HTML, CSS, JavaScript (Vanilla) |
| **Encryption** | `cryptography` (Fernet) |
| **Deployment** | Vercel (Serverless Python) |
| **Extension** | Chrome Manifest V3 |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- `pip` package manager
- A Supabase account (for production) or SQLite (for local dev)

### Local Development

```bash
# Clone the repo
git clone https://github.com/pasta-lover69/Password-Manager.git
cd Password-Manager

# Install dependencies
pip install -r requirements.txt

# Set environment variables
set SECRET_KEY=your-secret-key
set ENCRYPTION_KEY=your-fernet-key
set DATABASE_URL=your-supabase-url  # optional, defaults to SQLite

# Run the app
python app.py
```

Open http://127.0.0.1:5000/ in your browser.

### Browser Extension Setup

1. **Download** — Clone/download the `browser-extension` folder
2. **Chrome Extensions** — Go to `chrome://extensions` and enable **Developer Mode**
3. **Load Unpacked** — Click "Load unpacked" and select the `browser-extension` folder
4. **Pin & Login** — Pin the extension and log in with your Keyphoria account
5. **Autofill** — Visit any login page and Keyphoria will offer to autofill credentials

> ⚠️ **Note:** Not all websites use the same login form structure, so the auto-save popup may not always appear. If it doesn't, you can manually add the password through the extension or the [Keyphoria web app](https://keyphoria.vercel.app).

---

## 📂 Project Structure

```
Password-Manager/
├── app.py                    # Flask backend & API routes
├── requirements.txt          # Python dependencies
├── vercel.json               # Vercel deployment config
├── templates/
│   ├── base.html             # Base template with navbar
│   ├── index.html            # Split-panel login page
│   ├── signup.html           # Redirect to index
│   ├── profile.html          # User profile & modals
│   └── view_passwords.html   # Password table with actions
├── static/
│   ├── style.css             # All styles (loader, flip-card, buttons)
│   ├── main.js               # Auth handlers & utilities
│   └── keyphoria.png         # Favicon
└── browser-extension/
    ├── manifest.json          # Chrome extension manifest (V3)
    ├── popup.html             # Extension popup UI
    ├── background.js          # Service worker
    ├── content.js             # Autofill content script
    ├── config.js              # API configuration
    └── icons/                 # Extension icons
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Flask session secret key |
| `ENCRYPTION_KEY` | Fernet encryption key for passwords |
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `FLASK_ENV` | `production` or `development` |
| `CORS_ORIGINS` | Allowed CORS origins |

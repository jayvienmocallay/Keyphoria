# 🔐 Secure Password Manager - Browser Extension

A modern, secure password manager with browser extension support, auto-fill capabilities, and encrypted storage.

## ✨ What's New

This project has been **completely refactored and transformed** from a basic Flask web app into a professional browser extension with a clean REST API backend!

### Major Improvements:

- ✅ **Browser Extension** - Works in Chrome, Edge, and Firefox
- ✅ **Clean Code** - Refactored backend with DRY principles
- ✅ **Auto-Fill** - Automatic login form detection and filling
- ✅ **Better Security** - Proper CORS, validation, and error handling
- ✅ **Modern UI** - Beautiful, responsive interface
- ✅ **Password Generator** - Built-in strong password generation
- ✅ **Search Function** - Quick password filtering

📖 **See [IMPROVEMENTS.md](IMPROVEMENTS.md) for detailed code improvements**  
🏗️ **See [ARCHITECTURE.md](ARCHITECTURE.md) for system architecture**

## 🚀 Quick Start

### Option 1: Using the Start Script (Easiest)

**Windows:**

```bash
start.bat
```

**Mac/Linux:**

```bash
python start.py
```

### Option 2: Manual Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Start the API server:**

```bash
python api.py
```

3. **Load the browser extension:**

   - **Chrome/Edge:** Navigate to `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → Select `browser-extension` folder
   - **Firefox:** Navigate to `about:debugging` → "Load Temporary Add-on" → Select `browser-extension/manifest.json`

4. **Start using it!**
   - Click the extension icon
   - Create an account
   - Add your passwords
   - Visit login pages to see auto-fill in action!

## 📂 Project Structure

```
Password Manager/
├── 📱 browser-extension/      # Browser extension files
│   ├── manifest.json          # Extension configuration
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Styles
│   ├── popup.js               # Main extension logic
│   ├── background.js          # Background service worker
│   ├── content.js             # Auto-fill content script
│   └── INSTALL.md             # Installation guide
│
├── 🔧 Backend Files
│   ├── api.py                 # ✨ NEW: Clean REST API
│   ├── app.py                 # Legacy Flask app (reference)
│   └── requirements.txt       # Python dependencies
│
├── 📚 Documentation
│   ├── README.md              # This file
│   ├── README_EXTENSION.md    # Detailed extension docs
│   ├── IMPROVEMENTS.md        # Code improvements summary
│   └── ARCHITECTURE.md        # System architecture
│
└── 🛠️ Utilities
    ├── start.py               # Quick start script
    ├── start.bat              # Windows start script
    └── test_api.py            # API test suite
```

## 🎯 Features

### Security Features

- 🔒 **AES-128 Encryption** - All passwords encrypted with Fernet
- 🛡️ **Password Hashing** - User passwords hashed with PBKDF2
- 🔐 **Session Management** - Secure cookie-based sessions
- ✅ **Input Validation** - Comprehensive validation on all inputs
- 🚫 **CORS Protection** - Only extension origins allowed

### User Features

- 📝 **Password Management** - Add, edit, delete passwords
- 🔍 **Search** - Quick password search and filtering
- 🎲 **Password Generator** - Generate strong passwords
- 📋 **Copy to Clipboard** - One-click password copying
- 🔄 **Auto-Fill** - Automatic form detection and filling
- 💾 **Persistent Storage** - SQLite (dev) or PostgreSQL (prod)

### Developer Features

- 🏗️ **Clean Architecture** - Separated concerns, DRY code
- 🎨 **Modern Stack** - ES6+, async/await, Flask 3.1
- 📊 **Error Handling** - Comprehensive error handling and logging
- 🧪 **Test Suite** - API testing script included
- 📖 **Well Documented** - Extensive documentation and comments

## Configuration

### Environment Variables

For production, set these environment variables:

```bash
# Required
SECRET_KEY=your-secret-key-here

# For password encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key())")
ENCRYPTION_KEY=your-base64-encryption-key

# Database (optional, defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost/dbname

# Environment
FLASK_ENV=production
```

### Extension Configuration

Edit `browser-extension/popup.js` to change the API URL:

```javascript
const API_URL = "http://localhost:5000"; // Change for production
```

## Testing

Run the test suite to verify everything works:

```bash
python test_api.py
```

This will test:

- ✅ API health check
- ✅ User registration
- ✅ User login
- ✅ Session management
- ✅ Password operations (add, retrieve)
- ✅ Logout

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/register`      | Create new user account     |
| POST   | `/login`         | Authenticate user           |
| POST   | `/logout`        | End user session            |
| GET    | `/check-session` | Check authentication status |

### Password Management Endpoints

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/add`               | Add new password       |
| GET    | `/get-all-passwords` | Get all user passwords |
| POST   | `/get/<service>`     | Get specific password  |
| POST   | `/edit-password`     | Update password        |
| POST   | `/delete-password`   | Delete password        |
| GET    | `/get-services`      | Get list of services   |

All password endpoints require authentication (session cookie).

## 🛠️ Development

### Code Quality Improvements

The codebase has been significantly improved:

**Backend (api.py):**

- ✅ DRY principle - no code duplication
- ✅ Decorators for authentication
- ✅ Model methods for encryption/decryption
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Proper logging

**Frontend (popup.js):**

- ✅ Async/await instead of callbacks
- ✅ Centralized API calls
- ✅ Better state management
- ✅ Improved UX (notifications instead of alerts)
- ✅ Loading states

**See [IMPROVEMENTS.md](IMPROVEMENTS.md) for detailed breakdown**

### Tech Stack

- **Backend:** Flask 3.1, SQLAlchemy, Cryptography (Fernet)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Extension:** Web Extensions API (Chrome/Firefox compatible)
- **Database:** SQLite (dev) / PostgreSQL (prod)

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit sensitive keys** to version control
2. **Use environment variables** for production secrets
3. **Keep encryption key backed up** securely
4. **Use HTTPS** in production
5. **Regularly update dependencies**
6. **Use strong master password**

## Troubleshooting

**Extension can't connect to API:**

- Ensure `api.py` is running on port 5000
- Check browser console for errors
- Verify API_URL in `popup.js`

**Auto-fill not working:**

- Ensure you're logged into the extension
- Some sites may block auto-fill
- Try using the copy button instead

**Session expires quickly:**

- This is a security feature
- Sessions expire after inactivity
- Just log in again when needed

**Database errors:**

- Delete `instance/password_manager.db` to reset
- Check file permissions
- Verify SQLAlchemy version

## TODO / Future Enhancements

- [ ] Password strength indicator
- [ ] Breach detection (HaveIBeenPwned API)
- [ ] Two-factor authentication
- [ ] Secure password sharing
- [ ] Cross-device sync
- [ ] Import/export functionality
- [ ] Password history tracking
- [ ] Biometric unlock support
- [ ] Dark mode

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Author

Created as a personal project to learn:

- Browser extension development
- REST API design
- Cryptography implementation
- Code refactoring and clean code principles

## Acknowledgments

- Flask framework and community
- Cryptography library contributors
- Web Extensions API documentation

---

** If you find this useful, please star the repository!**
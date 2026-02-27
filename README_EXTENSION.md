# 🔐 Secure Password Manager - Browser Extension

A modern, secure password manager browser extension with auto-fill capabilities and encrypted storage.

## Features

✨ **Key Features:**

- 🔒 **Secure Encryption**: All passwords encrypted using Fernet (symmetric encryption)
- 🌐 **Browser Extension**: Works as a Chrome/Firefox extension
- 🔄 **Auto-Fill**: Automatically detects and fills login forms
- 💾 **Local + Cloud**: Backend API with SQLite/PostgreSQL support
- 🎨 **Modern UI**: Beautiful, responsive interface
- 🔐 **Password Generator**: Built-in strong password generator
- 🔍 **Search**: Quick password search functionality

## Project Structure

```
Password Manager/
├── browser-extension/          # Browser extension files
│   ├── manifest.json          # Extension manifest (Chrome/Firefox)
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Extension styles
│   ├── popup.js               # Extension logic
│   ├── background.js          # Background service worker
│   ├── content.js             # Content script for auto-fill
│   └── icons/                 # Extension icons
├── api.py                     # Clean REST API backend
├── app.py                     # Legacy Flask app (for reference)
├── requirements.txt           # Python dependencies
└── README_EXTENSION.md        # This file
```

## Installation

### Backend Setup

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Set environment variables (optional):**

```bash
# For production
export SECRET_KEY="your-secret-key-here"
export ENCRYPTION_KEY="your-base64-encryption-key"
export DATABASE_URL="postgresql://user:pass@localhost/dbname"
```

3. **Run the API server:**

```bash
python api.py
```

The API will run on `http://localhost:5000`

### Browser Extension Setup

#### Chrome/Edge:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder

#### Firefox:

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file in the `browser-extension` folder

## Usage

### First Time Setup

1. Click the extension icon in your browser
2. Create an account (username & password)
3. You're ready to store passwords!

### Adding Passwords

**Method 1: Using the Extension Popup**

- Click the extension icon
- Click "Add Password"
- Fill in Service, Username, and Password
- Click "Save"

**Method 2: Auto-detect (Coming Soon)**

- The extension will detect login forms and offer to save credentials

### Auto-Fill Passwords

1. Navigate to any login page
2. Look for the "🔐 Autofill with Password Manager" button
3. Click to auto-fill your credentials
4. If multiple accounts exist, select the one you want

### Managing Passwords

- **View**: All passwords are listed in the extension popup
- **Search**: Use the search box to filter passwords
- **Edit**: Click "Edit" on any password to update it
- **Delete**: Click "Delete" to remove a password
- **Copy**: Click "Copy" to copy password to clipboard

## Security Features

🔒 **Encryption:**

- All passwords are encrypted using Fernet (AES-128)
- Encryption key stored securely (environment variable recommended)
- Passwords never stored in plain text

🛡️ **Authentication:**

- User passwords hashed using Werkzeug (PBKDF2)
- Session-based authentication
- Secure cookie configuration

🌐 **API Security:**

- CORS enabled only for extension origins
- Login required decorator for protected endpoints
- Input validation on all endpoints

## API Endpoints

### Authentication

- `POST /register` - Create new user
- `POST /login` - Authenticate user
- `POST /logout` - End session
- `GET /check-session` - Check auth status

### Password Management

- `POST /add` - Add new password
- `GET /get-all-passwords` - Get all user passwords
- `POST /get/<service>` - Get specific password
- `POST /edit-password` - Update password
- `POST /delete-password` - Delete password
- `GET /get-services` - Get list of services

## Development

### Code Structure

**api.py** - Clean, refactored backend with:

- Class-based models (User, Password)
- Decorators for authentication
- Proper error handling
- Clean separation of concerns

**popup.js** - Frontend logic with:

- Async/await for API calls
- Clean state management
- Modular functions
- Event-driven architecture

**content.js** - Auto-fill functionality:

- Form detection
- Credential matching
- DOM manipulation
- User notifications

### Improvements from Original Code

✅ **Backend Improvements:**

- Removed duplicate code
- Added proper error handling
- Implemented decorators for auth
- Better model methods (encrypt/decrypt)
- Added input validation
- Cleaner endpoint structure
- Added CORS support for extension

✅ **Frontend Improvements:**

- Modern async/await instead of promises
- Better state management
- Cleaner UI/UX
- Password generator
- Search functionality
- Better error messages

✅ **New Features:**

- Browser extension interface
- Auto-fill capability
- Content script for form detection
- Background service worker
- Password strength generator

## Configuration

### Environment Variables

```bash
# Required for production
SECRET_KEY=your-secret-key-change-this

# For encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key())")
ENCRYPTION_KEY=your-base64-encoded-key

# Database (optional, defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### Extension Configuration

Edit `browser-extension/popup.js` to change API URL:

```javascript
const API_URL = "http://localhost:5000"; // Change for production
```

## Troubleshooting

**Extension can't connect to API:**

- Ensure the API server is running (`python api.py`)
- Check the API_URL in popup.js matches your server
- Verify CORS is enabled in api.py

**Passwords not auto-filling:**

- Ensure you're logged in to the extension
- Check that passwords are saved for the current domain
- Some sites block auto-fill - use copy/paste instead

**Session expires quickly:**

- This is a security feature
- Configure Flask session timeout if needed

## Future Enhancements

- [ ] Password strength indicator
- [ ] Breach detection (Have I Been Pwned API)
- [ ] Two-factor authentication
- [ ] Secure password sharing
- [ ] Browser sync across devices
- [ ] Import/export functionality
- [ ] Password history
- [ ] Biometric unlock

## License

MIT License - Feel free to use and modify!

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security Note

⚠️ **Important:**

- Never commit your SECRET_KEY or ENCRYPTION_KEY
- Use environment variables for sensitive data
- Keep your encryption key backed up securely
- Use HTTPS in production
- Regularly update dependencies

---

Made with ❤️ for better password security

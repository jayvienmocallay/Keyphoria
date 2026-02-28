#!/usr/bin/env python3
"""
Quick start script for Password Manager
"""

import os
import sys
import subprocess

def print_header():
    print("=" * 60)
    print("🔐 Secure Password Manager - Browser Extension")
    print("=" * 60)
    print()

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    
    try:
        import flask
        import flask_sqlalchemy
        import flask_cors
        import cryptography
        print("✅ All dependencies installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\n💡 Install dependencies with:")
        print("   pip install -r requirements.txt")
        return False

def setup_database():
    """Initialize the database"""
    print("\n🗄️  Setting up database...")
    
    from app import app, db
    
    with app.app_context():
        db.create_all()
        print("✅ Database initialized!")

def print_instructions():
    """Print usage instructions"""
    print("\n" + "=" * 60)
    print("🚀 Server is running!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("\n1. Load the browser extension:")
    print("   • Chrome: chrome://extensions/ → 'Load unpacked' → select 'browser-extension' folder")
    print("   • Firefox: about:debugging → 'Load Temporary Add-on' → select 'manifest.json'")
    print("\n2. Click the extension icon and create an account")
    print("\n3. Start managing your passwords securely! 🔒")
    print("\n💡 Tips:")
    print("   • Visit any login page to see auto-fill in action")
    print("   • Use the password generator for strong passwords")
    print("   • Search your passwords using the search box")
    print("\n⚠️  Press Ctrl+C to stop the server")
    print("=" * 60)
    print()

def main():
    print_header()
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Setup database
    try:
        setup_database()
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        sys.exit(1)
    
    # Print instructions
    print_instructions()
    
    # Start the server
    print("🌐 Starting API server on http://localhost:5000...")
    print()
    
    try:
        from app import app
        app.run(debug=True, port=5000, use_reloader=True)
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

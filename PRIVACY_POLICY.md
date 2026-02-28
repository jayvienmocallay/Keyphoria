# Privacy Policy — Secure Password Manager

**Last updated:** February 28, 2026

## Overview

Secure Password Manager ("the Extension") is a browser extension that helps you store, manage, and auto-fill passwords securely. This privacy policy explains how we handle your data.

## Data We Collect

### Account Credentials
- **Username/email** and a **hashed password** for your Password Manager account.
- Your account password is **never stored in plain text** — it is hashed using PBKDF2-SHA256.

### Saved Passwords
- Service names, usernames, and passwords you choose to store in the Password Manager.
- All stored passwords are **encrypted using AES-128 (Fernet)** before being saved to the database.
- Passwords are only decrypted when you explicitly request them (view, copy, or auto-fill).

## Data We Do NOT Collect

- ❌ Browsing history
- ❌ Cookies or tracking data
- ❌ Personal information beyond what you enter
- ❌ Analytics or usage telemetry
- ❌ Data from forms you don't interact with

## How Your Data Is Stored

- All data is stored on the backend server you configure (self-hosted or deployed).
- Passwords are encrypted at rest using industry-standard Fernet (AES-128-CBC) encryption.
- Session authentication uses secure, HTTP-only cookies with SameSite protection.

## Data Sharing

We do **not** share, sell, or transfer your data to any third parties.

## Auto-Fill Feature

- The Extension's content script detects login forms on web pages you visit.
- It **only fills credentials when you explicitly click** the "Autofill" button.
- No data is sent or received without your action.

## Your Rights

You can:
- **View** all your stored passwords at any time
- **Edit** or **delete** any stored password
- **Delete your account** and all associated data
- **Export** or manage your data through the web interface

## Security Measures

- PBKDF2-SHA256 password hashing for account authentication
- AES-128 (Fernet) symmetric encryption for stored passwords
- HTTP-only, Secure, SameSite cookies for session management
- CORS restrictions to prevent unauthorized access
- No plain-text password storage at any point

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last updated" date above.

## Contact

For questions or concerns about this privacy policy, contact:

**Jayvien Mocallay**  
Email: jayvienmocallay7@example.com

Simple Translator (Frontend-focused) — Demo
=========================================

What's included
- frontend/
  - index.html
  - styles.css
  - app.js
- backend/
  - index.js
  - package.json
- README.md

What it does
- A responsive, user-friendly frontend that fetches language metadata and translates text.
- A minimal Node.js/Express backend that proxies `/languages` and `/translate` to a LibreTranslate instance (by default: https://libretranslate.de).

How to run (local)
1. Node.js >= 14 installed.
2. In the backend folder:
   npm install
3. From the backend folder run:
   npm start
4. Open http://localhost:3000 in your browser.

Notes & security
- This demo proxies requests to a public LibreTranslate instance. Public instances may have rate limits or terms of use.
- For production, run your own LibreTranslate server or add proper API key handling, rate limiting and authentication.
- The frontend is intentionally self-contained and easy to read for students and beginners.

Files are licensed for learning and demo use.

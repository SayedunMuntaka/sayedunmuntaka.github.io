# Sayedun Muntaka — Portfolio Website

Clean, responsive single-page portfolio with optional lightweight analytics (Cloudflare Workers + KV).

Badges: ![status-active](https://img.shields.io/badge/status-active-brightgreen) ![license-mit](https://img.shields.io/badge/license-MIT-blue)

---

## Contents

- Overview
- Features
- Files in this repo
- Frontend behavior & theme images
- Preview & verification (how to check the new images)
- Cloudflare Worker notes (deployment)
- Customization
- Security & privacy
- Local preview
- Troubleshooting

---

## Overview

This repository holds a static portfolio site (HTML/CSS) that optionally integrates with Cloudflare Workers for visitor logging and a monthly visitor counter.

Workers are optional — the site works as a standalone portfolio without them.

---

## Features

- Responsive layout using W3.CSS and custom `styles.css`.
- Dark / Light theme toggle with early initialization to prevent flashes.
- Theme-aware avatar images and favicon: `myimgdark.jpg` (dark) and `myimglight.jpg` (light).
- Animated monthly visitor counter (reads from `GET /get-count`).
- Optional visitor logging (`POST /log`) and Telegram notifications via Workers.

---

## Files in this repo

```
index.html
styles.css
viewerlogger.js
fullmonthlogger.js
README.md
myimgdark.jpg
myimglight.jpg
```

Note: There is no `myimg.jpg` file locally — social meta tags in `index.html` reference an absolute URL. If you want a local OG image, add it and update `index.html`.

---

## Frontend behavior & theme images

- Elements with class `.theme-image` use `data-dark` / `data-light` attributes. The script swaps `src` according to `theme-dark` / `theme-light` on `<html>`.
- `#favicon` and `#appleIcon` are updated early in the `<head>` to match the selected theme.
- Default behavior (on first load): reads `localStorage.site-theme` or falls back to `prefers-color-scheme`.

---

## Preview & verification (check the new defaults)

1. Start a local server in the repo root:

```bash
# Python
python -m http.server 8000

# Or Node
npx http-server -p 8000
```

2. Open `http://localhost:8000`.

3. Verify defaults:
   - On initial load the avatar and hero images should have `src="myimgdark.jpg"` unless `localStorage.site-theme` is set to `light`.
   - Use DevTools to inspect `.theme-image` `data-dark`/`data-light` attributes.

4. Toggle theme (click `#themeToggle`) and confirm:
   - In light theme the `.theme-image` `src` becomes `myimglight.jpg` and `#favicon` href points to `myimglight.jpg`.
   - In dark theme they revert to `myimgdark.jpg`.

5. Confirm the files exist in the repo (`myimgdark.jpg`, `myimglight.jpg`).

If these checks pass, the theme-image defaults are wired correctly.

---

## Cloudflare Worker notes (optional)

- `viewerlogger.js` provides `POST /log` and `GET /get-count` when deployed to Cloudflare Workers.
- Use Wrangler + KV for storage; keep `BOT_TOKEN` / `CHAT_ID` out of git and in environment variables.

Quick `wrangler.toml` example:

```toml
name = "viewerlogger"
main = "viewerlogger.js"
compatibility_date = "2026-01-01"

[[kv_namespaces]]
binding = "VISITOR_LOGS"
id = "YOUR_KV_NAMESPACE_ID"

[env.production.vars]
BOT_TOKEN = "<your-bot-token>"
CHAT_ID = "<your-chat-id>"
```

---

## Customization

- Replace `myimgdark.jpg` and `myimglight.jpg` with your images and keep `data-dark`/`data-light` attributes in sync.
- Edit personal text, contact links (they use `data-href` and are applied at runtime), and styles in `styles.css`.

---

## Security & privacy

- Geolocation is requested only when supported and permitted by the user.
- The site sends device/browser metadata to the Worker; it does not collect user-entered PII by default.
- Consider a visible privacy notice if you publish this publicly.

---

## Local preview

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`.

---

## Troubleshooting

- Counter shows 0: verify Worker deployment, KV binding and `GET /get-count` response.
- Missing device fields: some browser APIs are unavailable or require permissions.

---

## License

MIT

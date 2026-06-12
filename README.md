# 🌟 Sayedun Muntaka's Portfolio Website

> A modern, responsive portfolio with **real-time visitor analytics**, **Telegram notifications**, and **monthly visitor tracking** powered by Cloudflare Workers & KV Storage.

![Portfolio Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Framework](https://img.shields.io/badge/framework-W3.CSS-blue)
![Backend](https://img.shields.io/badge/backend-Cloudflare%20Workers-orange)

---

## 📋 Table of Contents

- [Overview](#-overview)
### Advanced Analytics
The previous dedicated analytics page (`my-visit.html`) has been removed; visitor logging still runs via Cloudflare Workers and the monthly counter remains on the main site.

```
sayedunmuntaka.github.io/
├── index.html              # Main portfolio page (HTML + inline scripts)
├── styles.css              # Styling (W3.CSS framework + custom)
├── viewerlogger.js         # Cloudflare Worker (visitor logging + counter API)
├── fullmonthlogger.js      # Cloudflare Worker (monthly report generator)
├── README.md               # This file
└── myimg.jpg               # Avatar image
```
3. **Location Statistics** - Cards displaying:
   - Country
   - City
   - Timezone
   - ISP (Internet Service Provider)

4. **Device Information** - Including:
   - Device type (Mobile/Tablet/Desktop)
   - Operating system
   - Screen resolution
   - RAM/Device memory
   - CPU cores

5. **Browser & Software** - Showing:
   - Browser name and version
   - Language preferences
   - Complete User-Agent string

6. **Network Performance** - Displaying:
   - Connection type
   - Effective network type
   - Download speed
   - RTT and other metrics

7. **25+ Advanced Features** - All displayed in beautiful card layouts with:
   - Status indicators (✓ Enabled / ✗ Disabled)
   - Color-coded values
   - Real-time detection using browser APIs
   - Graceful fallbacks for unsupported features

---



```
sayedunmuntaka.github.io/
├── index.html              # Main portfolio page (HTML + inline scripts)
├── styles.css              # Styling (W3.CSS framework + custom)
├── viewerlogger.js         # Cloudflare Worker (visitor logging + counter API)
├── fullmonthlogger.js      # Cloudflare Worker (monthly report generator)
├── README.md               # This file
└── myimg.jpg               # Avatar image
```

### 📄 File Details

| File | Purpose | Key Features |
|------|---------|--------------|
| **index.html** | Main portfolio site | Visitor data collection, counter display, portfolio sections |
| **styles.css** | Complete styling | Dark theme, responsive layout, counter animations |
| **viewerlogger.js** | Main Worker script | `POST /log` endpoint, `GET /get-count` endpoint, KV management |
| **fullmonthlogger.js** | Report generator | Monthly summary, Telegram notifications, analytics |

---

## 🏗️ Technical Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     VISITOR FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Browser visits portfolio                                    │
│     └─> Collects device info (resolution, battery, network...)  │
│                                                                  │
│  2. POSTs to Cloudflare Worker (/log endpoint)                  │
│     └─> Includes JSON body with all device data                 │
│                                                                  │
│  3. Worker processes data                                       │
│     ├─> Creates unique device ID (IP + UA + resolution)        │
│     ├─> Checks if returning visitor (30-day TTL)                │
│     ├─> Increments monthly counter in KV                        │
│     └─> Returns updated visitor count to frontend               │
│                                                                  │
│  4. Worker sends to Telegram Bot                                │
│     └─> Detailed message with all device info                   │
│                                                                  │
│  5. Browser counter updates                                     │
│     └─> Fetches from /get-count endpoint (real-time, no cache)  │
│     └─> Animates counter change                                 │
│                                                                  │
│  6. Optional: Monthly summary                                   │
│     └─> fullmonthlogger.js sends monthly report to Telegram     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Device Data Collected

The visitor logger captures:

| Category | Data Points |
|----------|-------------|
| **Device** | Resolution, Memory, Platform, CPU Cores, Model, OS |
# Sayedun Muntaka — Portfolio Website

Comprehensive, responsive personal portfolio with a lightweight analytics integration (Cloudflare Workers + KV). This README explains the site structure, features, how visitor logging works, customization, deployment, and privacy considerations.

![status-active](https://img.shields.io/badge/status-active-brightgreen) ![license-mit](https://img.shields.io/badge/license-MIT-blue) ![w3.css](https://img.shields.io/badge/framework-W3.CSS-blue) ![cloudflare](https://img.shields.io/badge/backend-Cloudflare%20Workers-orange)

---

## Table of contents

- Overview
- Purpose & Features
- File / Folder Layout
- How the Frontend Works (`index.html`)
- Visitor logging: Worker overview (`viewerlogger.js`, `fullmonthlogger.js`)
- Cloudflare Worker setup & deployment
- Customization guide
- Security & privacy
- Local development & preview
- Troubleshooting
- License

---

## Overview

This repository contains a single-page portfolio that showcases personal information, skills, photos, contact links, and a monthly visitor counter. The site is static (HTML + CSS) and integrates with Cloudflare Workers to collect optional visitor metadata and to maintain a server-side monthly visitor counter. Optional Telegram notifications are used by the Worker to forward visitor details.

Purpose: provide a modern, accessible portfolio with a subtle analytics counter and an extensible logging backend that the owner controls.

---

## Purpose & Key features

- Clean, responsive portfolio layout using W3.CSS and custom `styles.css`.
- Theme toggle (dark / light) with early-init script to avoid flash of wrong theme.
- Theme-aware images and favicon (swapped between `myimgdark.jpg` and `myimglight.jpg`).
- Monthly visitor counter shown in the footer area, animated client-side.
- Visitor logging (optional) via Cloudflare Worker endpoints:
  - `POST /log` — collect device/network/browser info and increment the monthly counter
  - `GET /get-count` — return current month count
- Optional Telegram notifications for each visit (configured in Worker environment variables).

---

## File / Folder Layout

Repository root (relevant files):

```
index.html                # Main static page (HTML + inline scripts)
styles.css                # Custom styling + W3.CSS usage
viewerlogger.js           # Cloudflare Worker: /log & /get-count
fullmonthlogger.js        # Cloudflare Worker: optional monthly summary/report
README.md                 # This file
myimgdark.jpg             # Avatar (dark variant)
myimglight.jpg            # Avatar (light variant)
myimg.jpg                 # Original avatar (legacy)
```

Notes:
- `index.html` contains the theme switching logic, CSP header, contact links, and the client-side code that posts visitor data to the Worker.
- Workers are not required for the site to work as a portfolio; they enable analytics and the counter.

---

## How the frontend works (`index.html`)

Key behaviors and where to find them inside `index.html`:

- Theme initialization (early, in <head>):
  - Reads `localStorage.site-theme` or falls back to `prefers-color-scheme`.
  - Adds `theme-dark` or `theme-light` class to `<html>` to control CSS variables.
  - Swaps favicon and apple-touch-icon early to avoid a flash of the wrong icon.

- Theme toggle (bottom of body):
  - Button with id `themeToggle` toggles between themes and saves choice to `localStorage`.
  - `setThemeImages()` replaces `src` of elements with `.theme-image` using `data-dark`/`data-light` attributes.

- Images & favicon defaults:
  - Sidebar avatar and hero image include `data-dark` and `data-light` attributes.
  - Favicon (`#favicon`) and apple icon (`#appleIcon`) also include `data-dark`/`data-light` and now default to `myimgdark.jpg` in dark mode and `myimglight.jpg` in light mode.

- Visitor logging (client-side):
  - `sendVisitorInfo()` collects available data via browser APIs (screen, navigator, battery, geolocation when permitted).
  - `logVisitorInfo()` posts a JSON object to the configured Worker `logURL` (default in code: `https://viewerlogger.shafikkazi25.workers.dev/log`).
  - The frontend gracefully handles denied geolocation and missing APIs.
  - A guard `logInProgress` prevents duplicate logs during a single page load.

- Monthly counter:
  - `loadMonthlyVisitorCount()` calls the Worker `GET /get-count` endpoint and animates the number in the DOM element `#monthlyCount`.
  - The animation is a simple incrementing timer for a smooth UX.

- Contact links:
  - To avoid raw exposure of contact strings in the static HTML, links use `data-href` and are converted to `href` on DOMContentLoaded.

---

## Visitor logging: Worker overview (`viewerlogger.js` and `fullmonthlogger.js`)

These Workers are optional backend pieces meant to run on Cloudflare Workers. They provide:

- A `POST /log` endpoint that:
  - Validates the origin (recommended to set `allowedOrigin` in the Worker).
  - Constructs a visitor record from posted data and server-side metadata (IP, request geo if available).
  - Generates a simple device identifier and stores it (or a marker) in KV with a TTL to identify returning visitors.
  - Increments a per-month key in KV: `visitor_count_YYYY-MM`.
  - Optionally formats and sends a Telegram message using provided `BOT_TOKEN` and `CHAT_ID`.

- A `GET /get-count` endpoint that returns the current monthly visitor count and month label.

- `fullmonthlogger.js` (optional) can be scheduled (CRON or periodic) to create a monthly report and send a summary to Telegram or store extra analytics in KV.

Storage and keys:

- Monthly count: `visitor_count_<YYYY-MM>` (numeric value stored as string in KV).
- Device markers: `visitor_<deviceHash>` with TTL (e.g., 30 days) to indicate returning status.

---

## Cloudflare Worker setup & deployment

Prerequisites:

- Cloudflare account
- Wrangler CLI (`npm i -g wrangler`)
- Telegram bot token and chat ID (if using Telegram alerts)

Quick steps:

1. Create and bind a KV namespace; record its ID for `wrangler.toml`.
2. Populate environment variables in `wrangler.toml` or the Cloudflare dashboard:
   - `BOT_TOKEN` (optional)
   - `CHAT_ID` (optional)
3. Deploy Workers with `wrangler publish viewerlogger.js` (and `fullmonthlogger.js` if used).
4. Update `index.html` `logURL` constant to point at your deployed Worker domain.

Example `wrangler.toml` snippet:

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

Security note: keep tokens out of git; use environment variables in Cloudflare or secrets in Wrangler.

---

## Customization guide (what to change)

- Replace your name, bio, and contact links in `index.html` header and contact section.
- Replace images:
  - `myimgdark.jpg` — avatar for dark mode
  - `myimglight.jpg` — avatar for light mode
  - Update `data-dark`/`data-light` attributes on elements with `.theme-image` if you add new images.
- Update the Worker endpoint in `index.html` if you deploy under a custom domain.
- Tweak colors and spacing in `styles.css`.

How to change the theme default:

- The early-init script in the `<head>` sets the theme based on `localStorage.site-theme` or the device preference. To force a default, set `localStorage.setItem('site-theme', 'light')` (or `dark`) before the DOM loads.

---

## Security & privacy

- Geolocation: the site requests geolocation only if the browser supports it and the user allows; if denied, no coordinates are sent.
- Personal data: the site posts device metadata (screen resolution, browser user-agent, approximate geolocation if granted) to the Worker; it does not collect user-entered personal data.
- Storage: visitor markers and counts are saved in Cloudflare KV; retention is based on TTLs configured in the Worker (e.g., 30 days for return-visitor markers).
- GDPR / privacy: if you intend to run this publicly, consider adding a short privacy notice and an opt-out for analytics.

---

## Local development & preview

To preview the static site locally:

```bash
# using Python
python -m http.server 8000

# or with Node (http-server)
npx http-server -p 8000
```

Visit `http://localhost:8000`.

Notes:
- The Worker endpoints won't run locally; logging calls will fail unless you point `logURL` at a reachable endpoint. This is expected during local testing.

---

## Troubleshooting

- Counter shows 0:
  - Verify `logURL` is correct and the Worker is deployed.
  - Call `GET /get-count` in the browser and inspect the JSON response.
  - Confirm KV namespace is bound and accessible to the Worker.

- Missing device fields:
  - Some browser APIs are unavailable or require permission (e.g., Battery API or Geolocation). The frontend falls back to "Unknown" for those.

- Telegram messages not arriving:
  - Verify `BOT_TOKEN` and `CHAT_ID` are set and correct.
  - Check Cloudflare Worker logs for HTTP errors when calling Telegram API.

---

## Contributing

If you want to improve the site:

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request describing your changes

---

## License

This project is provided under the MIT License. Replace or update the license text if you need a different license.

---

If you'd like, I can also:

- Add a short privacy statement to `index.html` linking to this README.
- Add a development README section with step-by-step Wrangler deployment commands.
- Preview how the site looks with the new `myimgdark.jpg`/`myimglight.jpg` defaults.

# 🌟 Sayedun Muntaka's Portfolio Website

> A modern, responsive portfolio with **real-time visitor analytics**, **Telegram notifications**, and **monthly visitor tracking** powered by Cloudflare Workers & KV Storage.

![Portfolio Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Framework](https://img.shields.io/badge/framework-W3.CSS-blue)
![Backend](https://img.shields.io/badge/backend-Cloudflare%20Workers-orange)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technical Architecture](#-technical-architecture)
- [Quick Start](#-quick-start)
- [Visitor Logging System](#-visitor-logging-system)
- [Cloudflare Worker Setup](#-cloudflare-worker-setup)
- [Customization Guide](#-customization-guide)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌐 Overview

This is a **full-stack portfolio website** that goes beyond static HTML. It includes:

- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-time Analytics** - Track visitor data in real-time
- ✅ **Monthly Visitor Counter** - Beautiful animated counter showing current month's visitors
- ✅ **Device Tracking** - Detailed logging of visitor device information
- ✅ **Telegram Integration** - Instant notifications for every visit
- ✅ **Edge Computing** - Powered by Cloudflare Workers for global performance

---

## ✨ Features

### Frontend Features
- 🎨 **Dark Theme Design** - Modern, minimalist aesthetic with W3.CSS
- 🖼️ **Portfolio Showcase** - Home, About, Education, Photos, Reputation, Contact sections
- ⬆️ **Back-to-Top Button** - Smooth scroll navigation
- 📱 **Responsive Sidebar** - Hidden on small screens for better mobile UX
- 🔄 **Smooth Animations** - Fade-in effects and hover transitions
- 📊 **Live Visitor Counter** - Displays current month's visitor count with smooth animation

### Backend Features (Cloudflare Workers)
- 📍 **Real-time Visitor Logging** - Captures comprehensive device & network info
- 🔐 **CORS & Security** - Origin validation, referrer checks, CSP headers
- 💾 **KV Storage** - Persistent visitor count tracking per month
- 🔔 **Telegram Integration** - Automated notifications with detailed visitor stats
- 🌍 **Geolocation Data** - Country, city, timezone, ISP information
- ⚡ **Zero-Latency Edge** - Cloudflare's edge network for global performance

---

## 📁 Project Structure

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
| **Network** | ISP, Country, City, Region, Connection Type, Effective Type, Downlink |
| **Browser** | User Agent, Browser Type, Language Preference |
| **Location** | Latitude, Longitude, Timezone, Geolocation (with permission) |
| **Battery** | Battery percentage & charging status (if available) |
| **Session** | Visitor type (New/Returning), Referrer, Timestamp |

---

## 🚀 Quick Start

### Step 1: Clone Repository

```bash
git clone https://github.com/SayedunMuntaka/sayedunmuntaka.github.io.git
cd sayedunmuntaka.github.io
```

### Step 2: Local Preview (Static)

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

> ⚠️ **Note**: Visitor logging requires Cloudflare Worker deployment. Local testing will show errors in the console but won't break the site.

### Step 3: Deploy to GitHub Pages

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Your site will be available at `https://sayedunmuntaka.github.io`

---

## 📊 Visitor Logging System

### How It Works

1. **Frontend Collection** (`index.html`, lines 20-100)
   - Runs on page load
   - Collects device and network information
   - POSTs JSON data to Cloudflare Worker

2. **Backend Processing** (`viewerlogger.js`)
   - **POST /log**: Receives visitor data, validates origin, logs to KV, sends to Telegram
   - **GET /get-count**: Returns current monthly visitor count (real-time, no caching)

3. **Data Storage** (Cloudflare KV)
   - **Keys**: `visitor_count_YYYY-MM` (e.g., `visitor_count_2025-12`)
   - **Keys**: Device IDs with 30-day TTL (determines returning visitors)

4. **Notifications** (Telegram Bot)
   - Real-time visitor alerts with full device details
   - Monthly summary reports (optional)

### Monthly Counter

The counter is displayed prominently after the footer:

```html
<!-- Monthly Visitor Counter -->
<div class="w3-black w3-padding-32 w3-center" id="monthlyCounterSection">
  <h2 class="w3-text-grey">Total Monthly Visitors</h2>
  <div class="visitor-count-display">
    <span class="count-number" id="monthlyCount">0</span>
    <span class="count-label" id="countMonth">December 2025</span>
  </div>
</div>
```

**Features**:
- ✨ Animated counter (0 → actual count)
- 📱 Responsive (72px desktop, 48px mobile)
- 🔄 Real-time updates (no caching)
- 🎨 Matches dark theme aesthetic

---

## ⚙️ Cloudflare Worker Setup

### Prerequisites

- ✅ Cloudflare account (free tier works)
- ✅ Telegram bot token (create via [@BotFather](https://t.me/BotFather))
- ✅ Telegram chat ID
- ✅ Wrangler CLI installed (`npm install -g wrangler`)

### Step 1: Create KV Namespace

```bash
wrangler kv:namespace create visitor_logs
wrangler kv:namespace create visitor_logs --preview  # for testing
```

Note the namespace ID — you'll need it for `wrangler.toml`.

### Step 2: Configure wrangler.toml

```toml
name = "viewerlogger"
main = "viewerlogger.js"
compatibility_date = "2024-12-16"
routes = [
  { pattern = "viewerlogger.shafikkazi25.workers.dev/*", zone_name = "shafikkazi25.workers.dev" }
]

# KV Namespace Binding
[[kv_namespaces]]
binding = "visitor_logs"
id = "YOUR_KV_NAMESPACE_ID"
preview_id = "YOUR_KV_PREVIEW_ID"

# Environment Variables
[env.production.vars]
BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
CHAT_ID = "YOUR_TELEGRAM_CHAT_ID"
```

### Step 3: Deploy Worker

```bash
# Deploy viewerlogger.js
wrangler publish viewerlogger.js

# Deploy fullmonthlogger.js (optional, for monthly reports)
wrangler publish fullmonthlogger.js
```

### Step 4: Update Frontend Endpoint

In `index.html`, ensure the logging URL matches your Worker:

```javascript
let logURL = "https://viewerlogger.shafikkazi25.workers.dev/log";
```

### API Endpoints

#### POST /log
**Purpose**: Log visitor information

```javascript
// Request (from frontend)
POST /log
Content-Type: application/json

{
  "resolution": "1920x1080",
  "battery": "85%",
  "location": "Country, City",
  "deviceMemory": "8",
  "effectiveType": "4g",
  "downlink": "7.5",
  "platform": "Linux",
  "hardwareConcurrency": "8",
  "userAgent": "Mozilla/5.0..."
}

// Response
{
  "message": "Logged & Sent to Telegram!",
  "visitorCount": 156
}
```

#### GET /get-count
**Purpose**: Fetch current monthly visitor count

```javascript
// Request
GET /get-count

// Response
{
  "count": 156,
  "month": "December 2025",
  "monthKey": "2025-12"
}
```

**Headers**: `Cache-Control: no-cache, no-store, must-revalidate` (real-time)

---

## 🎨 Customization Guide

### Personal Information

**In `index.html`**:

```html
<!-- Update these sections -->
<h1>Your Name</h1>
<p>Your bio and introduction...</p>

<!-- Update contact section -->
<a href="tel:+YOUR_NUMBER">Your Phone</a>
<a href="https://www.facebook.com/YOUR_PROFILE">Facebook</a>
<!-- ... update all social links ... -->
```

### Styling & Colors

**In `styles.css`**:

```css
/* Change sidebar color */
.w3-sidebar {
  background: #222; /* Change this hex value */
}

/* Update counter appearance */
.count-number {
  font-size: 72px; /* Adjust size */
  color: #fff; /* Change color */
}

/* Modify hover effects */
.count-number:hover {
  transform: scale(1.05); /* Adjust scale */
}
```

### Logging Endpoint

If using a different Worker URL:

```javascript
// In index.html, line ~60
let logURL = "https://YOUR_WORKER_URL/log";
```

### Origin & Security

**In `viewerlogger.js`, line ~75**:

```javascript
const allowedOrigin = "https://yourdomain.com"; // Update this
```

**In `index.html`, CSP header**:

```html
<meta http-equiv="Content-Security-Policy" content="
  connect-src 'self' https://YOUR_WORKER_URL;
  ...
">
```

---

## 🔍 Monitoring & Analytics

### View Live Logs

**Option 1: Telegram Bot**
- Every visitor automatically sends a message
- Shows device details, location, network info

**Option 2: Cloudflare Dashboard**
- Log into [Cloudflare Workers](https://dash.cloudflare.com/)
- Go to Workers → View logs
- See request/response activity in real-time

**Option 3: KV Storage**
```bash
# List all keys
wrangler kv:key list --binding=visitor_logs

# Get specific count
wrangler kv:key get visitor_count_2025-12 --binding=visitor_logs

# List all keys matching pattern
wrangler kv:key list --binding=visitor_logs --prefix=visitor_count_
```

---

## 🐛 Troubleshooting

### Counter shows "0" or won't update

**Problem**: Counter displays 0 and doesn't increment

**Solutions**:
1. Check browser console for errors (`F12` → Console tab)
2. Verify Worker URL in `index.html` is correct
3. Ensure KV namespace is properly bound in `wrangler.toml`
4. Test `/get-count` endpoint directly in browser: `https://your-worker.workers.dev/get-count`
5. Check Cloudflare Worker logs: Dashboard → Workers → View logs

### Device info shows "Unknown" or "N/A"

**Problem**: Telegram messages show missing device details

**Causes & Fixes**:
- **Battery**: Not all devices report battery (normal)
- **Geolocation**: User must grant permission (browser prompt)
- **Network info**: Some networks/browsers don't expose this
- **Effective Type**: Check browser support (older browsers don't report)

### Logging not working

**Problem**: No visitors are being logged

**Checklist**:
- [ ] Cloudflare Worker is deployed
- [ ] KV namespace exists and is bound in `wrangler.toml`
- [ ] `BOT_TOKEN` and `CHAT_ID` environment variables are set
- [ ] Origin in `viewerlogger.js` matches your domain
- [ ] Browser console shows no CORS errors

### "Origin not allowed" error

**Problem**: Console shows 403 error

**Fix**: Update the allowed origin in `viewerlogger.js`:

```javascript
// Line 75
const allowedOrigin = "https://yourdomain.com"; // Match your actual domain
```

### Telegram bot not sending messages

**Problem**: Worker runs but Telegram receives nothing

**Fix**:
1. Verify `BOT_TOKEN` is correct (no extra spaces)
2. Verify `CHAT_ID` is correct (get it by messaging bot, checking logs)
3. Test token: `https://api.telegram.org/botYOUR_TOKEN/getMe`
4. Check Worker logs for API responses

---

## 📞 Contact & Support

**For questions about this project**:
- 📧 Direct message on social media (footer links)
- 🐙 GitHub issues: [sayedunmuntaka.github.io](https://github.com/SayedunMuntaka/sayedunmuntaka.github.io)
- 💬 Telegram: [@sayedunmuntaka](https://t.me/sayedunmuntaka)

**External Resources**:
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [W3.CSS Documentation](https://www.w3schools.com/w3css/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to fork, modify, and deploy your own version!

See the `LICENSE` file for full details.

---

## 🎯 Future Roadmap

Planned enhancements:

- [ ] Analytics dashboard (visitor trends, peak times)
- [ ] Advanced filtering (filter logs by country, device type)
- [ ] Device fingerprinting improvements
- [ ] Custom analytics endpoint
- [ ] Dark/Light theme toggle
- [ ] Blog section with CMS integration

---

<div align="center">

**Made with ❤️ by [Sayedun Muntaka](https://github.com/SayedunMuntaka)**

⭐ If you find this helpful, consider giving it a star!

</div>

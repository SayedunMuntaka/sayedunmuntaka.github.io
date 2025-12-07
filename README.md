# 🌟 Sayedun Muntaka's Portfolio 🌟
Welcome to the repository for the portfolio website. This README has been upgraded to highlight the repository contents, explain the visitor-logging setup, and provide quick local testing and deployment instructions.

**Repository Files**
- `index.html`: Main static site markup. Includes a visitor-logging client script and Content Security Policy meta header.
- `styles.css`: Styling for the site (sidebar, back-to-top button, animations).
- `viewerlogger.js`: Cloudflare Worker script that receives visitor logs (from the front-end), stores data in a KV namespace (`visitor_logs`), and sends formatted messages to a Telegram chat.
- `fullmonthlogger.js`: Cloudflare Worker script that reads monthly counts from KV and sends a monthly summary to Telegram.

## 🌐 Website Overview

This portfolio website includes these sections:
- Home: A brief introduction and avatar image.
- About: Background, skills, and testimonials.
- Education: Academic background and qualifications.
- Photos: A gallery placeholder for photography work.
- Reputation: Testimonials and client/colleague recommendations.
- Contact: Contact methods and social links.

## ✨ Key Features

- Smooth scrolling and responsive layout using W3.CSS.
- Simple back-to-top functionality.
- Visitor logging pipeline: front-end collects device/network info and calls a Cloudflare Worker to store/log visitors and forward details to Telegram.

## 📊 Visitor Logging (Details)

- `index.html` contains a client script that collects: screen resolution, battery status (if available), geolocation (with permission), device memory, network information, platform, hardwareConcurrency, and user agent.
- The front-end currently calls a logging endpoint like `https://viewerlogger.shafikkazi25.workers.dev/log`. Replace that URL with your Worker route when deploying your own Worker.
- `viewerlogger.js` expects the following Cloudflare environment bindings:
  - KV namespace binding named `visitor_logs`.
  - `BOT_TOKEN` (Telegram bot token) and `CHAT_ID` (chat or channel ID) set in Worker environment variables.
- `fullmonthlogger.js` reads `visitor_count_<YYYY-MM>` keys from the same `visitor_logs` KV and sends a monthly summary to Telegram. It also requires the same `BOT_TOKEN` and `CHAT_ID` env vars.

Security notes:
- `viewerlogger.js` includes an allowed origin check (currently set to `https://sayedunmuntaka.github.io`). If you host the site under a different origin, update that value or make the origin check configurable.
- `index.html` sets a Content Security Policy meta header. If you change external resources or the logging endpoint, update the CSP accordingly.

## 🛠️ Setup & Local Testing

1. Clone the repository:
```
git clone https://github.com/SayedunMuntaka/sayedunmuntaka.github.io.git
cd sayedunmuntaka.github.io
```

2. Quick local preview (static):
```
python -m http.server 8000
# or
npx http-server -p 8000
```
Then open `http://localhost:8000/index.html` in your browser.

3. If you want to test the visitor logging end-to-end, deploy `viewerlogger.js` as a Cloudflare Worker and update the logging URL in `index.html` to match your Worker route. Ensure your Worker has the KV binding and env vars described above.

## 🚀 Deploying the Worker (brief)

Using Wrangler (Cloudflare official CLI):

1. Configure `wrangler.toml` for your account and add bindings:
- `kv_namespaces` with a binding name `visitor_logs`.
- `vars` for `BOT_TOKEN` and `CHAT_ID`.

2. Publish your Worker:
```
wrangler publish viewerlogger.js
wrangler publish fullmonthlogger.js
```

Note: The exact `wrangler` config depends on your Cloudflare account and preferred route. See Cloudflare Workers docs for details.

## 🔧 Environment variables required for logging Workers

- `BOT_TOKEN`: Telegram bot token (string)
- `CHAT_ID`: Telegram chat id (string or number)
- `visitor_logs`: KV namespace bound to the Worker

## 🔁 Customization

- Update personal details and images in `index.html`.
- Modify `styles.css` to adjust layout, colors, or fonts.
- Update allowed origin checks and CSP if hosting from a different domain.

## 📞 Contact

For contact details, see the `index.html` contact section. Social links are present in the footer of the page.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Thank you for using this project — the README has been expanded to make the repo easier to use and deploy.

export default {
    async fetch(request, env) {
        const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
        const country = request.headers.get("CF-IPCountry") || "Unknown";
        const city = request.cf?.city || "Unknown";
        const region = request.cf?.region || "Unknown";
        const latitude = request.cf?.latitude || "Unknown";
        const longitude = request.cf?.longitude || "Unknown";
        const isp = request.cf?.asOrganization || "Unknown";
        const timezone = request.cf?.timezone || "UTC";
        const ua = request.headers.get("User-Agent") || "Unknown";
        const referer = request.headers.get("Referer") || "Direct";
        const language = request.headers.get("Accept-Language") || "Unknown";
        const connectionType = request.headers.get("CF-Visitor") ? JSON.parse(request.headers.get("CF-Visitor")).scheme : "Unknown";
        const timestamp = new Date().toLocaleString("en-US", { timeZone: timezone });

        // Check if the referer is from your hosted website
        if (!referer.includes("https://sayedunmuntaka.github.io/")) {
            return new Response("Referer not allowed, skipping log.", { status: 403 });
        }

        // Get extra details via frontend script
        const urlParams = new URL(request.url).searchParams;
        const resolution = urlParams.get("res") || "Unknown";
        const battery = urlParams.get("battery") || "Unknown";
        const locationDetails = urlParams.get("location") || "Unknown";
        const deviceMemory = urlParams.get("deviceMemory") || "Unknown";
        const effectiveType = urlParams.get("effectiveType") || "Unknown";
        const downlink = urlParams.get("downlink") || "Unknown";
        const platform = urlParams.get("platform") || "Unknown";

        // Device model extraction from User-Agent
        const deviceModel = ua.match(/\(([^)]+)\)/)?.[1] || "Unknown";
        const browser = ua.match(/(firefox|msie|chrome|safari|trident)/i)?.[0] || "Unknown";
        const os = ua.match(/\(([^)]+)\)/)?.[1].split(";")[0] || "Unknown";

        // Block bots & crawlers
        const botPatterns = [
            "bot", "crawl", "spider", "fetch", "httpclient", "monitor", "pingdom",
            "curl", "wget", "headless", "chrome-lighthouse"
        ];
        if (botPatterns.some(bot => ua.toLowerCase().includes(bot))) {
            return new Response("Bot detected, skipping log.", { status: 403 });
        }

        // Detect in-app browsers and redirect
        const inAppBrowserPatterns = ["FBAN", "FBAV", "Instagram", "TikTok"];
        if (inAppBrowserPatterns.some(pattern => ua.includes(pattern))) {
            return new Response("Please open in a real browser like Chrome.", {
                status: 302,
                headers: { "Location": "https://www.google.com/chrome/" }
            });
        }

        // Generate a unique identifier for each device
        const uniqueDeviceId = `${ip}-${ua}-${resolution}-${platform}`;

        // Cloudflare KV Storage for visitor tracking
        const KV = env.visitor_logs;
        const existingVisitor = await KV.get(uniqueDeviceId);

        let visitorType = "🆕 *New Visitor*";
        if (existingVisitor) {
            visitorType = "🔁 *Returning Visitor*";
        } else {
            // Increment visitor count for new visitors
            let totalVisitors = await KV.get("visitor_count");
            totalVisitors = totalVisitors ? parseInt(totalVisitors) : 0;
            await KV.put("visitor_count", (totalVisitors + 1).toString());
        }

        // Store visitor in KV storage (set expiry for 30 days)
        await KV.put(uniqueDeviceId, timestamp, { expirationTtl: 2592000 });

        // Send visitor log to Telegram
        const message = `
📢 ${visitorType}
🕒 *Time*: ${timestamp}

🌍 *Country*: ${country}
🏙 *City*: ${city}, ${region}

📌 *IP*: ${ip}
📍 *Location*: [${latitude}, ${longitude}] (${locationDetails})

⏳ *Time Zone*: ${timezone}
📱 *Device Model*: ${deviceModel}
💾 *Device Memory*: ${deviceMemory} GB
📏 *Screen Resolution*: ${resolution}
🔋 *Battery*: ${battery}
🖥 *Browser*: ${browser}

💻 *OS*: ${os}
🌐 *Language*: ${language}

🔗 *Referrer*: ${referer}
🌐 *ISP*: ${isp}
🔗 *Connection Type*: ${connectionType}
📶 *Network Effective Type*: ${effectiveType}
📡 *Network Downlink*: ${downlink} Mbps

🖥 *Platform*: ${platform}

🖥 *User-Agent*: ${ua}
        `;

        // Load API keys from environment variables (safer than hardcoding)
        const botToken = env.BOT_TOKEN;
        const chatId = env.CHAT_ID;
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        return new Response("Logged & Sent to Telegram!", { status: 200 });
    }
};

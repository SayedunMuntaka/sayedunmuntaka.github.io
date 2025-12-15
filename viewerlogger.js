function getMonthKey(date) {
    return date.toISOString().slice(0, 7); // Format: YYYY-MM
}

function formatMonthYear(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Route 1: GET /get-count — Fetch monthly visitor count
        if (pathname === "/get-count" && request.method === "GET") {
            return handleGetCount(request, env);
        }

        // Route 2: POST /log — Log visitor info (existing logic)
        if (pathname === "/log" && request.method === "POST") {
            return handleLogVisitor(request, env);
        }

        // OPTIONS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Max-Age": "86400"
                }
            });
        }

        return new Response("Not Found", { status: 404 });
    }
};

async function handleGetCount(request, env) {
    try {
        const KV = env.visitor_logs;
        const currentMonthKey = getMonthKey(new Date());
        const monthYear = formatMonthYear(new Date());

        let visitorCount = await KV.get(`visitor_count_${currentMonthKey}`);
        visitorCount = visitorCount ? parseInt(visitorCount) : 0;

        return new Response(JSON.stringify({
            count: visitorCount,
            month: monthYear,
            monthKey: currentMonthKey
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache, no-store, must-revalidate" // Always fetch fresh from KV
            }
        });
    } catch (error) {
        console.error("Error fetching count:", error);
        return new Response(JSON.stringify({
            count: 0,
            month: formatMonthYear(new Date()),
            error: error.message
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

async function handleLogVisitor(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigin = "https://sayedunmuntaka.github.io";

    if (origin !== allowedOrigin) {
        return new Response("Origin not allowed", { status: 403 });
    }

        // Parse POST body as JSON
        let bodyData = {};
        try {
            const body = await request.text();
            if (body) {
                bodyData = JSON.parse(body);
            }
        } catch (e) {
            console.error("Error parsing request body:", e);
        }

        const headers = request.headers;
        const ip = headers.get("CF-Connecting-IP") || "Unknown";
        const country = headers.get("CF-IPCountry") || "Unknown";
        const city = request.cf?.city || "Unknown";
        const region = request.cf?.region || "Unknown";
        const latitude = request.cf?.latitude || "Unknown";
        const longitude = request.cf?.longitude || "Unknown";
        const isp = request.cf?.asOrganization || "Unknown";
        const timezone = request.cf?.timezone || "UTC";
        const ua = headers.get("User-Agent") || "Unknown";
        const referer = headers.get("Referer") || "Direct";
        const language = headers.get("Accept-Language") || "Unknown";
        const connectionType = headers.get("CF-Visitor") ? JSON.parse(headers.get("CF-Visitor")).scheme : "Unknown";
        const timestamp = new Date().toLocaleString("en-US", { timeZone: timezone });

        if (referer !== "Direct" && !referer.startsWith("https://sayedunmuntaka.github.io")) {
            return new Response("Referer not allowed, skipping log.", { status: 403 });
        }

// Support both JSON POST body (new) and URL query params (legacy clients)
    const urlParams = new URL(request.url).searchParams;
    const resolution = bodyData.resolution || urlParams.get("resolution") || "Unknown";
    const battery = bodyData.battery || urlParams.get("battery") || "Unknown";
    const locationDetails = bodyData.location || urlParams.get("location") || "Unknown";
    const deviceMemory = bodyData.deviceMemory || urlParams.get("deviceMemory") || "Unknown";
    const effectiveType = bodyData.effectiveType || urlParams.get("effectiveType") || "Unknown";
    const downlink = bodyData.downlink || urlParams.get("downlink") || "Unknown";
    const platform = bodyData.platform || urlParams.get("platform") || "Unknown";
    const hardwareConcurrency = bodyData.hardwareConcurrency || urlParams.get("hardwareConcurrency") || "Unknown";
    const userAgent = bodyData.userAgent || urlParams.get("userAgent") || "Unknown";

        const deviceModel = ua.match(/\(([^)]+)\)/)?.[1] || "Unknown";
        const browser = ua.match(/(firefox|msie|chrome|safari|trident)/i)?.[0] || "Unknown";
        const os = ua.match(/\(([^)]+)\)/)?.[1].split(";")[0] || "Unknown";

        const uniqueDeviceId = `${ip}-${ua}-${resolution}-${platform}`;
        const KV = env.visitor_logs;
        const currentMonthKey = getMonthKey(new Date());

        // **Batch Fetch for Optimization**
        const [existingVisitor, visitorCount] = await Promise.all([
            KV.get(uniqueDeviceId),
            KV.get(`visitor_count_${currentMonthKey}`)
        ]);

        let visitorType = "🆕 *New Visitor*";
        let updatedVisitorCount = visitorCount ? parseInt(visitorCount) : 0;

        if (!existingVisitor) {
            updatedVisitorCount++;
            await KV.put(`visitor_count_${currentMonthKey}`, updatedVisitorCount.toString());
            await KV.put(uniqueDeviceId, timestamp, { expirationTtl: 2592000 });
        } else {
            visitorType = "🔁 *Returning Visitor*";
            updatedVisitorCount++;
            await KV.put(`visitor_count_${currentMonthKey}`, updatedVisitorCount.toString());
        }

        const messageParts = [
            `📢 *${visitorType}*`,
            `🕒 *Time*: ${timestamp}`,
            `🌍 *Country*: ${country}`,
            `🏙 *City*: ${city}, ${region}`,
            `📌 *IP*: ${ip}`,
            `📍 *Location*: [${latitude}, ${longitude}] (${locationDetails})`,
            `⏳ *Time Zone*: ${timezone}`,
            `📱 *Device Model*: ${deviceModel !== "Unknown" ? deviceModel : "N/A"}`,
            `💾 *Device Memory*: ${deviceMemory !== "Unknown" ? `${deviceMemory} GB` : "N/A"}`,
            `📏 *Screen Resolution*: ${resolution !== "Unknown" ? resolution : "N/A"}`,
            `🔋 *Battery*: ${battery !== "Unknown" ? battery : "N/A"}`,
            `🖥 *Browser*: ${browser !== "Unknown" ? browser : "N/A"}`,
            `💻 *OS*: ${os !== "Unknown" ? os : "N/A"}`,
            `🌐 *Language*: ${language !== "Unknown" ? language : "N/A"}`,
            `🔗 *Referrer*: ${referer}`,
            `🌐 *ISP*: ${isp !== "Unknown" ? isp : "N/A"}`,
            `🔗 *Connection Type*: ${connectionType !== "Unknown" ? connectionType : "N/A"}`,
            `📶 *Network Effective Type*: ${effectiveType !== "Unknown" ? effectiveType : "N/A"}`,
            `📡 *Network Downlink*: ${downlink !== "Unknown" ? `${downlink} Mbps` : "N/A"}`,
            `🖥 *Platform*: ${platform !== "Unknown" ? platform : "N/A"}`,
            `🖥 *CPU Cores/Threads*: ${hardwareConcurrency !== "Unknown" ? hardwareConcurrency : "N/A"}`,
            `🖥 *CPU Name*: ${userAgent !== "Unknown" ? userAgent : "N/A"}`,
            `🖥 *User-Agent*: ${ua}`
        ].filter(part => part.trim() !== "").join("\n");

        const message = `\`\`\`markdown\n${messageParts}\n\`\`\``;

        const botToken = env.BOT_TOKEN;
        const chatId = env.CHAT_ID;
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        if (!botToken || !chatId) {
            console.error("Bot token or chat ID is missing!");
            return new Response("Bot token or chat ID is missing!", { status: 400 });
        }

        console.log("Bot token and chat ID are present");

        try {
            const response = await fetch(telegramUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown"
                })
            });

            const responseData = await response.json(); // Log the response data
            console.log("Telegram API response:", responseData);

            if (!response.ok) {
                console.error(`Telegram API error: ${response.status}`);
                return new Response(`Telegram API error: ${response.status}`, { status: 500 });
            }
        } catch (error) {
            console.error("Error sending message to Telegram:", error);
            return new Response("Error sending message to Telegram", { status: 500 });
        }

        return new Response(JSON.stringify({
            message: "Logged & Sent to Telegram!",
            visitorCount: updatedVisitorCount
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": origin || "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Permissions-Policy": "compute-pressure=()",
                "Content-Security-Policy": "default-src 'self'; script-src 'self' https://api.telegram.org; connect-src 'self' https://api.telegram.org"
            }
        });
}

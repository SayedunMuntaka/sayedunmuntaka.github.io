function formatDate(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthKey(date) {
    return date.toISOString().slice(0, 7); // Format: YYYY-MM
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // Handle /count endpoint to fetch visitor count
        if (url.pathname === '/count') {
            const KV = env.visitor_logs;
            const monthParam = url.searchParams.get('month');
            const currentMonthKey = monthParam || getMonthKey(new Date());

            try {
                let totalVisitors = await KV.get(`visitor_count_${currentMonthKey}`);
                totalVisitors = totalVisitors ? parseInt(totalVisitors) : 0;

                return new Response(JSON.stringify({ count: totalVisitors }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                });
            } catch (error) {
                console.error("Error fetching visitor count:", error);
                return new Response(JSON.stringify({ error: 'Failed to fetch count', count: 0 }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Handle OPTIONS for CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // Original behavior for monthly report (POST request or cron trigger)
        const KV = env.visitor_logs;
        const currentMonthKey = getMonthKey(new Date());

        // Fetch total visitor count for the current month from KV storage
        let totalVisitors = await KV.get(`visitor_count_${currentMonthKey}`);
        totalVisitors = totalVisitors ? parseInt(totalVisitors) : 0;

        // Construct the Telegram message
        const message = `
📊 *Monthly Visitor Report*
📆 Month: ${formatDate(new Date())}
👥 Total Visitors: ${totalVisitors}
`;

        // Fetch bot token & chat ID from Cloudflare environment variables
        const botToken = env.BOT_TOKEN;
        const chatId = env.CHAT_ID;

        if (!botToken || !chatId) {
            console.error("Bot token or chat ID is missing!");
            return new Response("Bot token or chat ID is missing!", { status: 400 });
        }

        console.log("Bot token and chat ID are present");

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

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
                throw new Error(`Telegram API responded with status ${response.status}`);
            }

            // Return success response when the report is sent without errors
            return new Response("Monthly report sent successfully!", { status: 200 });
        } catch (error) {
            console.error("Failed to send message to Telegram:", error);
            return new Response("Failed to send monthly report.", { status: 500 });
        }
    }
};

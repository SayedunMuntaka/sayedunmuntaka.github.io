function formatDate(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthKey(date) {
    return date.toISOString().slice(0, 7); // Format: YYYY-MM
}

export default {
    async fetch(request, env) {
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

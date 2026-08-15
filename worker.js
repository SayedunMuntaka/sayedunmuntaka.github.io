export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers so your frontend can communicate with the worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. INGEST DATA (POST from ESP32)
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const device = body.device || "jbd-bms-ble";
        
        // Add a timestamp if the ESP32 didn't provide one
        if (!body.ts) {
          body.ts = Date.now();
        }

        // Store the ENTIRE JSON payload so no metrics are lost
        const rawPayload = JSON.stringify(body);

        await env.DB.prepare(
          `INSERT INTO bms_telemetry (device, raw_payload) VALUES (?, ?)`
        ).bind(device, rawPayload).run();

        return new Response(JSON.stringify({ success: true }), { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        });
      }
    }

    // 2. LIVE DASHBOARD DATA (Only fetches the 1 latest row)
    if (request.method === "GET" && url.pathname === "/api/live") {
      const device = url.searchParams.get("device") || "jbd-bms-ble";
      try {
        const { results } = await env.DB.prepare(
          `SELECT raw_payload FROM bms_telemetry WHERE device = ? ORDER BY id DESC LIMIT 1`
        ).bind(device).all();

        if (results && results.length > 0) {
          return new Response(results[0].raw_payload, { 
            status: 200, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          });
        }
        return new Response("{}", { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 3. HISTORY CHART DATA (Fetches the last ~10-15 minutes of points for the chart)
    if (request.method === "GET" && url.pathname === "/api/history") {
      const device = url.searchParams.get("device") || "jbd-bms-ble";
      try {
        const { results } = await env.DB.prepare(
          `SELECT raw_payload FROM bms_telemetry WHERE device = ? ORDER BY id DESC LIMIT 200`
        ).bind(device).all();

        // Parse JSON and reverse so it plots chronologically
        const items = results.map(row => JSON.parse(row.raw_payload)).reverse();

        return new Response(JSON.stringify({ items }), { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
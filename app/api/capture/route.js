// app/api/capture/route.js - Client-side only version (no Playwright)
export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export async function POST(req) {
    const body = await req.json();
    const { html, timeout = 5000 } = body || {};
    
    if (!html) {
        return new Response(JSON.stringify({ error: "html required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Return instructions for client-side analysis
    return new Response(JSON.stringify({ 
        message: "Use client-side analysis",
        instructions: "This endpoint requires client-side network analysis. Enable 'Deep Capture' in the UI for full functionality."
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

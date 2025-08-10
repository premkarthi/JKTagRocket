// app/api/capture-simple/route.js - Simple capture without browser automation
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

    try {
        // Extract URLs from HTML using regex
        const urlRegex = /(https?:\/\/[^\s"<>]+)/gi;
        const urls = html.match(urlRegex) || [];
        
        // Filter out common non-network URLs
        const networkUrls = urls.filter(url => {
            const excluded = [
                'data:', 'blob:', 'file:', 'mailto:', 'tel:', 'javascript:',
                'about:', 'chrome:', 'moz-extension:', 'chrome-extension:'
            ];
            return !excluded.some(prefix => url.startsWith(prefix));
        });

        // Also extract URLs from script src attributes
        const scriptSrcRegex = /src=["']([^"']+)["']/gi;
        const scriptUrls = [];
        let match;
        while ((match = scriptSrcRegex.exec(html)) !== null) {
            if (match[1] && match[1].startsWith('http')) {
                scriptUrls.push(match[1]);
            }
        }

        // Combine and deduplicate URLs
        const allUrls = [...new Set([...networkUrls, ...scriptUrls])];

        // Create mock network calls based on URLs found
        const calls = allUrls.map((url, index) => ({
            name: url,
            initiatorType: 'script', // Default to script
            transferSize: Math.floor(Math.random() * 10000) + 1000, // Mock size
            encodedBodySize: Math.floor(Math.random() * 10000) + 1000,
            status: 200,
            startTime: index * 100, // Stagger start times
            responseEnd: (index * 100) + Math.floor(Math.random() * 500) + 100,
        }));

        // Mock performance data
        const perf = {
            domContentLoaded: Math.floor(Math.random() * 1000) + 500,
            loadTime: Math.floor(Math.random() * 2000) + 1000,
            firstPaint: Math.floor(Math.random() * 500) + 100,
        };

        console.log(`✅ Simple analysis complete. Found ${calls.length} potential network calls from URLs:`, allUrls);

        return new Response(JSON.stringify({ 
            calls, 
            perf,
            source: "server-side-simple",
            message: "Simple URL extraction analysis (no browser automation)"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('❌ Simple capture error:', error.message);
        
        return new Response(JSON.stringify({ 
            calls: [],
            perf: {
                domContentLoaded: 0,
                loadTime: 0,
                firstPaint: 0
            },
            message: "Simple analysis failed",
            error: error.message,
            source: "server-side-simple-error"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
} 
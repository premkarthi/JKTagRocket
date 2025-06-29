// app/api/capture/route.js
import { chromium } from '@playwright/test';

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

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const calls = [];

    page.on("requestfinished", async (request) => {
        try {
            const response = await request.response();
            const status = response.status();
            const timing = await request.timing();

            let bodySize = 0;
            if (status < 300 || status >= 400) {
                const body = await response.body();
                bodySize = body?.byteLength || 0;
            }

            calls.push({
                name: request.url(),
                initiatorType: request.resourceType(),
                transferSize: bodySize,
                encodedBodySize: bodySize,
                status,
                startTime: timing.startTime || 0,
                responseEnd: timing.responseEnd || timing.startTime || 0,
            });
        } catch (err) {
            console.warn("Error in requestfinished handler:", err.message);
        }
    });


    await page.goto(`data:text/html,${encodeURIComponent(html)}`, { waitUntil: "load" });
    await page.waitForTimeout(timeout);

    const perf = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0] || {};
        const paint = performance.getEntriesByType("paint").find(p => p.name === "first-contentful-paint") || {};
        return {
            domContentLoaded: nav.domContentLoadedEventEnd ? nav.domContentLoadedEventEnd - nav.startTime : 0,
            loadTime: nav.loadEventEnd ? nav.loadEventEnd - nav.startTime : 0,
            firstPaint: paint.startTime || 0,
        };
    });

    await browser.close();

    return new Response(JSON.stringify({ calls, perf }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

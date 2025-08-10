// app/api/capture/route.js - Enhanced version with Railway compatibility
export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

async function tryPlaywright(html, timeout) {
    try {
        const { chromium } = await import('@playwright/test');
        
        console.log('🚀 Starting Playwright browser...');
        
        const browser = await chromium.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-default-browser-check',
                '--disable-component-extensions-with-background-pages',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-client-side-phishing-detection',
                '--disable-hang-monitor',
                '--disable-prompt-on-repost',
                '--disable-domain-reliability',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-features=VizDisplayCompositor',
                '--disable-ipc-flooding-protection',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows',
                '--disable-background-timer-throttling',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-client-side-phishing-detection',
                '--disable-hang-monitor',
                '--disable-prompt-on-repost',
                '--disable-domain-reliability',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-features=VizDisplayCompositor',
                '--disable-ipc-flooding-protection',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows',
                '--disable-background-timer-throttling',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ],
            headless: true,
            timeout: 30000,
            // Railway-specific optimizations
            executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            ignoreDefaultArgs: ['--disable-extensions'],
            ignoreHTTPSErrors: true
        });
        
        console.log('✅ Browser launched successfully');
        
        const page = await browser.newPage();
        const calls = [];

        // Set viewport and user agent for better compatibility
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        page.on("requestfinished", async (request) => {
            try {
                const response = await request.response();
                if (!response) return;
                
                const status = response.status();
                const timing = await request.timing();

                let bodySize = 0;
                if (status < 300 || status >= 400) {
                    try {
                        const body = await response.body();
                        bodySize = body?.byteLength || 0;
                    } catch (bodyError) {
                        console.warn("Could not get response body:", bodyError.message);
                    }
                }

                calls.push({
                    name: request.url(),
                    initiatorType: request.resourceType(),
                    transferSize: bodySize,
                    encodedBodySize: bodySize,
                    status,
                    startTime: timing.startTime || Date.now(),
                    responseEnd: timing.responseEnd || timing.startTime || Date.now(),
                });
                
                console.log(`📡 Network call captured: ${request.url()}`);
            } catch (err) {
                console.warn("Error in requestfinished handler:", err.message);
            }
        });

        console.log('🌐 Navigating to HTML content...');
        await page.goto(`data:text/html,${encodeURIComponent(html)}`, { 
            waitUntil: "networkidle",
            timeout: timeout 
        });
        
        console.log('⏳ Waiting for additional network activity...');
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
        console.log(`✅ Analysis complete. Captured ${calls.length} network calls`);

        return { calls, perf };
    } catch (error) {
        console.error('❌ Playwright failed:', error.message);
        throw error;
    }
}

async function tryPuppeteer(html, timeout) {
    try {
        const puppeteer = await import('puppeteer');
        
        console.log('🚀 Trying Puppeteer as fallback...');
        
        const browser = await puppeteer.default.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ],
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            ignoreHTTPSErrors: true
        });
        
        const page = await browser.newPage();
        const calls = [];

        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        page.on("response", async (response) => {
            try {
                const request = response.request();
                const status = response.status();
                
                let bodySize = 0;
                if (status < 300 || status >= 400) {
                    try {
                        const buffer = await response.buffer();
                        bodySize = buffer?.byteLength || 0;
                    } catch (bufferError) {
                        console.warn("Could not get response buffer:", bufferError.message);
                    }
                }

                calls.push({
                    name: request.url(),
                    initiatorType: request.resourceType(),
                    transferSize: bodySize,
                    encodedBodySize: bodySize,
                    status,
                    startTime: Date.now(),
                    responseEnd: Date.now(),
                });
                
                console.log(`📡 Network call captured (Puppeteer): ${request.url()}`);
            } catch (err) {
                console.warn("Error in response handler:", err.message);
            }
        });

        await page.goto(`data:text/html,${encodeURIComponent(html)}`, { 
            waitUntil: "networkidle",
            timeout: timeout 
        });
        
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
        console.log(`✅ Puppeteer analysis complete. Captured ${calls.length} network calls`);

        return { calls, perf };
    } catch (error) {
        console.error('❌ Puppeteer also failed:', error.message);
        throw error;
    }
}

export async function POST(req) {
    const body = await req.json();
    const { html, timeout = 8000 } = body || {}; // Increased timeout for Railway
    
    if (!html) {
        return new Response(JSON.stringify({ error: "html required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    console.log('🔍 Starting server-side network analysis...');
    console.log('📊 Environment:', {
        nodeEnv: process.env.NODE_ENV,
        playwrightPath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        puppeteerPath: process.env.PUPPETEER_EXECUTABLE_PATH
    });

    try {
        // Try Playwright first
        const result = await tryPlaywright(html, timeout);
        return new Response(JSON.stringify({ ...result, source: "server-side" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (playwrightError) {
        console.error('❌ Playwright failed:', playwrightError.message);
        
        try {
            // Try Puppeteer as fallback
            const result = await tryPuppeteer(html, timeout);
            return new Response(JSON.stringify({ ...result, source: "server-side-puppeteer" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (puppeteerError) {
            console.error('❌ Puppeteer also failed:', puppeteerError.message);
            
            // Return fallback data
            return new Response(JSON.stringify({ 
                calls: [],
                perf: {
                    domContentLoaded: 0,
                    loadTime: 0,
                    firstPaint: 0
                },
                message: "Server-side analysis not available, using client-side fallback",
                error: `Playwright: ${playwrightError.message}, Puppeteer: ${puppeteerError.message}`,
                source: "server-side-error"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}

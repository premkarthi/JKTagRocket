// Health check endpoint for Railway
export async function GET() {
    try {
        // Check if Playwright is available
        let playwrightStatus = 'unknown';
        let puppeteerStatus = 'unknown';
        
        try {
            const { chromium } = await import('@playwright/test');
            playwrightStatus = 'available';
        } catch (error) {
            playwrightStatus = 'unavailable';
        }
        
        try {
            const puppeteer = await import('puppeteer');
            puppeteerStatus = 'available';
        } catch (error) {
            puppeteerStatus = 'unavailable';
        }
        
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            browserAutomation: {
                playwright: playwrightStatus,
                puppeteer: puppeteerStatus,
                chromiumPath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || 'not set'
            },
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            }
        };
        
        return new Response(JSON.stringify(health, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
} 
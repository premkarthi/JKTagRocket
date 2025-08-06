// Test endpoint to verify capture API functionality
export async function GET() {
  const testHtml = `
    <!doctype html>
    <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <script>
        // Make a test network call
        fetch('https://httpbin.org/get')
          .then(response => response.json())
          .then(data => console.log('Test call successful'));
      </script>
    </body>
    </html>
  `;

  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: testHtml })
    });

    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      captureResult: result,
      message: 'Test completed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Test failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
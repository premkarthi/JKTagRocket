// Simple test for network analysis
const testHtml = `
<!doctype html>
<html>
<head>
  <title>Test Ad</title>
</head>
<body>
  <script>
    // Simulate ad tag
    console.log('Ad loaded');
    
    // Make a test network call
    fetch('https://httpbin.org/get')
      .then(response => response.json())
      .then(data => console.log('Network call successful'));
  </script>
</body>
</html>
`;

// Test the capture API
async function testCapture() {
  try {
    const response = await fetch('/api/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: testHtml })
    });
    
    const result = await response.json();
    console.log('Capture result:', result);
    
    if (result.calls && result.calls.length > 0) {
      console.log('✅ Network analysis working!');
      console.log('Network calls found:', result.calls.length);
    } else {
      console.log('⚠️ No network calls captured');
    }
  } catch (error) {
    console.error('❌ Capture test failed:', error);
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  testCapture();
} 
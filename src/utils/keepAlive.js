import https from 'https';

// Ping server every 14 minutes to prevent Render cold start
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

export function startKeepAlive(url) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏭️  Keep-alive disabled in development');
    return;
  }

  console.log('🔄 Keep-alive started - pinging every 14 minutes');

  setInterval(() => {
    const healthUrl = `${url}/health`;
    
    https.get(healthUrl, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
      }
    }).on('error', (err) => {
      console.error('❌ Keep-alive ping failed:', err.message);
    });
  }, PING_INTERVAL);
}

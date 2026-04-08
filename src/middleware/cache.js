// Cache middleware for public content endpoints
export const cacheControl = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      // Set cache headers
      res.set({
        'Cache-Control': `public, max-age=${duration}, s-maxage=${duration}`,
        'Expires': new Date(Date.now() + duration * 1000).toUTCString(),
        'Vary': 'Accept-Encoding'
      });
    }
    next();
  };
};

// No cache for admin/protected routes
export const noCache = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

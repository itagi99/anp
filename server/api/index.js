import app from '../src/server.js';

// Vercel serverless function entrypoint.
// All routes (/store, /auth, /orders, /salesman, /admin-features) are handled by the Express app.
// If Vercel rewrites the request path under /api, strip that prefix so Express matches correctly.
export default function handler(req, res) {
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
}

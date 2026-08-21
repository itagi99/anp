import app from '../server/src/server.js';

// Vercel serverless function entrypoint (canonical pattern).
// vercel.json rewrites "/(.*)" -> "/api", and Vercel invokes this function
// with the ORIGINAL request path (e.g. /store/products), so Express matches
// it directly. We also guard against a "/api" prefix just in case.
export default function handler(req, res) {
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
}

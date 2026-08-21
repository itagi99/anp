import app from '../src/server.js';

// Vercel serverless function (optional catch-all: matches /api and /api/*).
// The vercel.json rewrite forwards "/<path>" -> "/api/<path>", so we strip
// the leading "/api" before handing the request to the Express app.
export default function handler(req, res) {
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
}

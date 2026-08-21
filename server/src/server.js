import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocket } from './socket.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/categories.js';
import couponRoutes from './routes/coupons.js';
import bannerRoutes from './routes/banners.js';
import storeRoutes from './routes/store.js';
import salesmanRoutes from './routes/salesman.js';
import adminFeaturesRoutes from './routes/adminFeatures.js';

dotenv.config();

const app = express();
let server = null;

// Initialize Socket.io only for long-running (local) servers, not Vercel serverless
if (!process.env.VERCEL) {
  server = http.createServer(app);
  initializeSocket(server);
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShopKart API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/coupons', couponRoutes);
app.use('/banners', bannerRoutes);
app.use('/store', storeRoutes);
app.use('/salesman', salesmanRoutes);
app.use('/admin-features', adminFeaturesRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled API Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start the HTTP server only when run as a standalone process (local/dev/Node host),
// not when imported as a Vercel serverless function.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 ShopKart Server running on http://localhost:${PORT}`);
  });
}

export default app;

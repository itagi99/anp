import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initSocketServer } from './socket.js';

// Route Imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import inventoryRoutes from './routes/inventory.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import couponRoutes from './routes/coupons.js';
import bannerRoutes from './routes/banners.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGINS = process.env.CLIENT_ORIGIN 
  ? [process.env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080']
  : '*';

// Initialize WebSocket Engine
initSocketServer(server, CLIENT_ORIGINS);

// Middleware
app.use(cors({ origin: CLIENT_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes Mounting
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/coupons', couponRoutes);
app.use('/banners', bannerRoutes);

// Health Check & Root
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'ShopKart API & Real-time Inventory Server',
    database: 'Turso libSQL Edge',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ShopKart E-Commerce Platform API',
    version: '1.0.0',
    documentation: '/health',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start HTTP + Socket.io Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚀 ShopKart Server running on port ${PORT}`);
  console.log(` 🔌 Socket.io Real-Time Inventory Server active`);
  console.log(` 🗄️  Turso libSQL: ${process.env.TURSO_DATABASE_URL ? 'Connected' : 'File SQLite Mode'}`);
  console.log(`=======================================================`);
});

export default app;

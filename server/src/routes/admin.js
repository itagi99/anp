import express from 'express';
import { query, queryOne, transaction } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { emitInventoryUpdate, emitLowStockAlert, emitOrderUpdate } from '../socket.js';

const router = express.Router();

// Guard all admin routes
router.use(authenticate, requireRole('admin', 'warehouse_manager'));

// GET /admin/stats - KPI Summary & Chart Data
router.get('/stats', async (req, res) => {
  try {
    const totalSalesRow = await queryOne(`SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status != 'CANCELLED'`);
    const totalOrdersRow = await queryOne(`SELECT COUNT(*) AS total_orders FROM orders`);
    const ordersTodayRow = await queryOne(`SELECT COUNT(*) AS today_orders FROM orders WHERE date(created_at) = date('now')`);
    const activeProductsRow = await queryOne(`SELECT COUNT(*) AS total_products FROM products WHERE is_active = 1`);
    const totalCustomersRow = await queryOne(`SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'`);

    // Low stock count
    const lowStockRow = await queryOne(
      `SELECT COUNT(*) AS low_stock_count FROM inventory WHERE stock_qty <= low_stock_threshold`
    );

    // Revenue by last 7 days
    const revenueTrend = await query(`
      SELECT 
        date(created_at) AS date,
        COUNT(id) AS orders_count,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE created_at >= datetime('now', '-7 days') AND status != 'CANCELLED'
      GROUP BY date(created_at)
      ORDER BY date ASC
    `);

    // Top selling products
    const topProducts = await query(`
      SELECT 
        p.id, p.name, p.brand, p.price, p.image_urls,
        SUM(oi.quantity) AS total_sold,
        SUM(oi.total_price) AS total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    res.json({
      kpis: {
        totalRevenue: Number(totalSalesRow?.total_revenue || 0),
        totalOrders: Number(totalOrdersRow?.total_orders || 0),
        ordersToday: Number(ordersTodayRow?.today_orders || 0),
        totalProducts: Number(activeProductsRow?.total_products || 0),
        totalCustomers: Number(totalCustomersRow?.total_customers || 0),
        lowStockCount: Number(lowStockRow?.low_stock_count || 0),
      },
      revenueTrend,
      topProducts: topProducts.map((p) => ({
        ...p,
        image_urls: JSON.parse(p.image_urls || '[]'),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: error.message });
  }
});

// GET /admin/inventory - Real-time stock grid across all warehouses
router.get('/inventory', async (req, res) => {
  try {
    const { lowStockOnly, warehouseId, search } = req.query;

    let sql = `
      SELECT 
        i.id AS inventory_id,
        i.stock_qty,
        i.reserved_qty,
        i.low_stock_threshold,
        i.updated_at,
        p.id AS product_id,
        p.name AS product_name,
        p.brand,
        p.price,
        p.image_urls,
        w.id AS warehouse_id,
        w.name AS warehouse_name,
        w.code AS warehouse_code,
        w.city AS warehouse_city
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (lowStockOnly === 'true') {
      sql += ` AND i.stock_qty <= i.low_stock_threshold`;
    }

    if (warehouseId) {
      sql += ` AND i.warehouse_id = ?`;
      params.push(warehouseId);
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.brand LIKE ? OR w.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY i.stock_qty ASC, p.name ASC`;

    const rows = await query(sql, params);

    res.json({
      inventory: rows.map((r) => ({
        ...r,
        image_urls: JSON.parse(r.image_urls || '[]'),
        is_low_stock: r.stock_qty <= r.low_stock_threshold,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory', details: error.message });
  }
});

// POST /admin/inventory/adjust - Manual stock adjust with audit log & live socket emit
router.post('/inventory/adjust', async (req, res) => {
  try {
    const { productId, warehouseId, changeQty, reason, newStockQty } = req.body;
    const actor = req.user.name || req.user.email;

    if (!productId || !warehouseId || (!changeQty && newStockQty === undefined) || !reason) {
      return res.status(400).json({ error: 'productId, warehouseId, adjustment value and reason required' });
    }

    const currentInv = await queryOne(
      `SELECT i.*, p.name AS product_name 
       FROM inventory i 
       JOIN products p ON i.product_id = p.id 
       WHERE i.product_id = ? AND i.warehouse_id = ?`,
      [productId, warehouseId]
    );

    if (!currentInv) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }

    const finalQty = newStockQty !== undefined ? Number(newStockQty) : currentInv.stock_qty + Number(changeQty);
    if (finalQty < 0) {
      return res.status(400).json({ error: 'Stock quantity cannot be negative' });
    }

    const netChange = finalQty - currentInv.stock_qty;

    const logId = `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    await transaction([
      {
        sql: `UPDATE inventory SET stock_qty = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ? AND warehouse_id = ?`,
        args: [finalQty, productId, warehouseId],
      },
      {
        sql: `INSERT INTO inventory_logs (id, product_id, warehouse_id, change_qty, new_stock_qty, reason, actor)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [logId, productId, warehouseId, netChange, finalQty, reason, actor],
      },
    ]);

    // Emit live socket event
    emitInventoryUpdate(productId, warehouseId, finalQty, reason);

    if (finalQty <= currentInv.low_stock_threshold) {
      emitLowStockAlert(productId, currentInv.product_name, warehouseId, finalQty, currentInv.low_stock_threshold);
    }

    res.json({
      message: 'Inventory adjusted successfully',
      productId,
      warehouseId,
      newStockQty: finalQty,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust inventory', details: error.message });
  }
});

// GET /admin/inventory/logs - View audit trail
router.get('/inventory/logs', async (req, res) => {
  try {
    const { productId, limit = 50 } = req.query;

    let sql = `
      SELECT 
        l.*,
        p.name AS product_name,
        w.name AS warehouse_name
      FROM inventory_logs l
      JOIN products p ON l.product_id = p.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (productId) {
      sql += ` AND l.product_id = ?`;
      params.push(productId);
    }

    sql += ` ORDER BY l.timestamp DESC LIMIT ?`;
    params.push(Number(limit));

    const logs = await query(sql, params);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
});

// GET /admin/orders - Order management with status filtering
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let sql = `
      SELECT o.*, u.name AS customer_name, u.email AS customer_email, a.city, a.state
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN addresses a ON o.address_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND o.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const orders = await query(sql, params);

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await query(
          `SELECT oi.*, p.name, p.image_urls, w.name AS warehouse_name
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           JOIN warehouses w ON oi.warehouse_id = w.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return {
          ...order,
          items: items.map((i) => ({ ...i, image_urls: JSON.parse(i.image_urls || '[]') })),
        };
      })
    );

    res.json({ orders: fullOrders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin orders', details: error.message });
  }
});

// PUT /admin/orders/:id/status - Progress order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await query(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, id]);

    const order = await queryOne(`SELECT user_id FROM orders WHERE id = ?`, [id]);
    emitOrderUpdate(id, status, order?.user_id);

    res.json({ message: `Order status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
});

// GET /admin/users - User management
router.get('/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.phone, u.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total), 0) AS total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'CANCELLED'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

export default router;

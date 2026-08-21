import express from 'express';
import { query, queryOne, transaction } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { emitInventoryUpdate, emitLowStockAlert, emitOrderUpdate } from '../socket.js';

const router = express.Router();

router.use(authenticate);

// POST /orders/anp-checkout - ANP MART client-side cart checkout
// Expects: { items:[{product_id, quantity, price_each, category_id}], subtotal, discount, delivery_charge, total, coupon_code, delivery_address, payment_method, gps_lat, gps_lng, new_address }
router.post('/anp-checkout', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items, subtotal = 0, discount = 0, delivery_charge = 0, total = 0,
      coupon_code, delivery_address, payment_method = 'COD',
      gps_lat, gps_lng, new_address,
    } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Cart items are required' });
    }
    if (!delivery_address || String(delivery_address).length < 10) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    // Validate coupon & resolve id
    let couponId = null;
    if (coupon_code) {
      const coupon = await queryOne(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expiry_date >= datetime('now')`,
        [String(coupon_code).toUpperCase()]
      );
      if (coupon) couponId = coupon.id;
    }

    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Save new address to user_details if provided
    if (new_address && (new_address.new_address || new_address.address)) {
      const addr = new_address;
      await query(
        `INSERT OR REPLACE INTO user_details (id, user_id, address, city, state, postal_code, country, latitude, longitude, location_captured_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          `ud-${Date.now().toString(36)}`,
          userId,
          addr.new_address || addr.address,
          addr.new_city || addr.city || '',
          addr.new_state || addr.state || '',
          addr.new_postal_code || addr.postal_code || '',
          addr.new_country || addr.country || 'India',
          gps_lat || null,
          gps_lng || null,
        ]
      );
    }

    const transactionStatements = [];
    const inventoryUpdatesToEmit = [];

    const paymentMethodNorm = ['UPI', 'CARD', 'NETBANKING'].includes(payment_method) ? payment_method : 'COD';

    // Insert main order record FIRST so order_items FK resolves
    transactionStatements.push({
      sql: `INSERT INTO orders (id, user_id, status, subtotal, discount, delivery_fee, delivery_charge, total, total_price, delivery_address, coupon_id, coupon_code, coupon_discount, payment_method, payment_status, delivery_status, order_date, updated_at)
            VALUES (?, ?, 'PLACED', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        orderId, userId,
        Number(subtotal), Number(discount),
        Number(delivery_charge), Number(total), Number(total),
        String(delivery_address),
        couponId, coupon_code || null, Number(discount),
        paymentMethodNorm,
        paymentMethodNorm === 'COD' ? 'PENDING' : 'PAID',
      ],
    });

    for (const item of items) {
      const product = await queryOne(`SELECT id, name, price, mrp FROM products WHERE id = ?`, [item.product_id]);
      if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });

      const quantity = Number(item.quantity);
      const unitPrice = Number(item.price_each) || Number(product.price);

      const inventoryRow = await queryOne(
        `SELECT i.* FROM inventory i
         WHERE i.product_id = ? AND i.stock_qty >= ?
         ORDER BY i.stock_qty DESC LIMIT 1`,
        [item.product_id, quantity]
      );

      if (!inventoryRow) {
        return res.status(409).json({ error: `Insufficient stock for '${product.name}'`, productId: item.product_id });
      }

      const newQty = inventoryRow.stock_qty - quantity;
      const orderItemId = `oi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      transactionStatements.push({
        sql: `UPDATE inventory SET stock_qty = stock_qty - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [quantity, inventoryRow.id],
      });
      transactionStatements.push({
        sql: `INSERT INTO inventory_logs (id, product_id, warehouse_id, change_qty, new_stock_qty, reason, actor)
              VALUES (?, ?, ?, ?, ?, 'ORDER_PLACED', ?)`,
        args: [`log-${Date.now().toString(36)}`, item.product_id, inventoryRow.warehouse_id, -quantity, newQty, orderId],
      });
      transactionStatements.push({
        sql: `INSERT INTO order_items (id, order_id, product_id, warehouse_id, quantity, unit_price, total_price)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [orderItemId, orderId, item.product_id, inventoryRow.warehouse_id, quantity, unitPrice, unitPrice * quantity],
      });

      inventoryUpdatesToEmit.push({ productId: item.product_id, productName: product.name, warehouseId: inventoryRow.warehouse_id, newQty, threshold: inventoryRow.low_stock_threshold });
    }

    if (couponId) {
      transactionStatements.push({ sql: `UPDATE coupons SET times_used = times_used + 1 WHERE id = ?`, args: [couponId] });
    }

    // Record delivery calculation details
    transactionStatements.push({
      sql: `INSERT INTO order_delivery_details (id, order_id, subtotal_for_delivery, excluded_products_value, delivery_charge_applied)
            VALUES (?, ?, ?, 0, ?)`,
      args: [`odd-${Date.now().toString(36)}`, orderId, Number(delivery_charge) > 0 ? Number(subtotal) : 0, Number(delivery_charge)],
    });

    await transaction(transactionStatements);

    inventoryUpdatesToEmit.forEach((update) => {
      emitInventoryUpdate(update.productId, update.warehouseId, update.newQty, 'ORDER_PLACED');
      if (update.newQty <= update.threshold) {
        emitLowStockAlert(update.productId, update.productName, update.warehouseId, update.newQty, update.threshold);
      }
    });
    emitOrderUpdate(orderId, 'PLACED', userId);

    res.status(201).json({ message: 'Order placed successfully', orderId, total: Number(total), status: 'PLACED' });
  } catch (error) {
    res.status(500).json({ error: 'Order checkout transaction failed', details: error.message });
  }
});

// POST /orders/checkout - Place order with atomic stock check & decrement
router.post('/checkout', async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, couponCode, paymentMethod = 'COD' } = req.body;

    if (!addressId) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    // 1. Fetch user's cart items
    const cartItems = await query(
      `SELECT c.product_id, c.quantity, p.name, p.price
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }

    // 2. Validate Coupon if provided
    let discount = 0;
    let couponId = null;
    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (couponCode) {
      const coupon = await queryOne(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expiry_date > datetime('now')`,
        [couponCode.toUpperCase()]
      );

      if (coupon) {
        if (subtotal >= coupon.min_order_value) {
          discount = Math.min((subtotal * coupon.discount_pct) / 100, coupon.max_discount_amount || Infinity);
          couponId = coupon.id;
        }
      }
    }

    const deliveryFee = subtotal > 500 ? 0 : 49;
    const total = subtotal - discount + deliveryFee;
    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // 3. For each cart item, select warehouse with highest stock and prepare atomic transaction
    const transactionStatements = [];
    const inventoryUpdatesToEmit = [];

    for (const item of cartItems) {
      // Find suitable warehouse with sufficient stock
      const inventoryRow = await queryOne(
        `SELECT i.*, p.name AS product_name
         FROM inventory i
         JOIN products p ON i.product_id = p.id
         WHERE i.product_id = ? AND i.stock_qty >= ?
         ORDER BY i.stock_qty DESC
         LIMIT 1`,
        [item.product_id, item.quantity]
      );

      if (!inventoryRow) {
        return res.status(409).json({
          error: `Insufficient stock for product '${item.name}'. Please update your cart quantity.`,
          productId: item.product_id,
        });
      }

      const newQty = inventoryRow.stock_qty - item.quantity;
      const orderItemId = `oi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      // Decrement inventory
      transactionStatements.push({
        sql: `UPDATE inventory SET stock_qty = stock_qty - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [item.quantity, inventoryRow.id],
      });

      // Insert inventory audit log
      transactionStatements.push({
        sql: `INSERT INTO inventory_logs (id, product_id, warehouse_id, change_qty, new_stock_qty, reason, actor)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          item.product_id,
          inventoryRow.warehouse_id,
          -item.quantity,
          newQty,
          'ORDER_PLACED',
          orderId,
        ],
      });

      // Insert order item
      transactionStatements.push({
        sql: `INSERT INTO order_items (id, order_id, product_id, warehouse_id, quantity, unit_price, total_price)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [orderItemId, orderId, item.product_id, inventoryRow.warehouse_id, item.quantity, item.price, item.price * item.quantity],
      });

      inventoryUpdatesToEmit.push({
        productId: item.product_id,
        productName: item.name,
        warehouseId: inventoryRow.warehouse_id,
        newQty,
        threshold: inventoryRow.low_stock_threshold,
      });
    }

    // Insert main Order record
    transactionStatements.push({
      sql: `INSERT INTO orders (id, user_id, status, subtotal, discount, delivery_fee, total, total_price, delivery_charge, delivery_address, address_id, coupon_id, coupon_code, coupon_discount, payment_method, payment_status, delivery_status, order_date, updated_at)
            VALUES (?, ?, 'PLACED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        orderId,
        userId,
        subtotal,
        discount,
        deliveryFee,
        total,
        total,
        deliveryFee,
        null,
        addressId,
        couponId,
        couponCode || null,
        discount,
        paymentMethod,
        paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      ],
    });

    // Clear cart
    transactionStatements.push({
      sql: `DELETE FROM cart_items WHERE user_id = ?`,
      args: [userId],
    });

    // Increment coupon usage if used
    if (couponId) {
      transactionStatements.push({
        sql: `UPDATE coupons SET times_used = times_used + 1 WHERE id = ?`,
        args: [couponId],
      });
    }

    // Execute atomic batch transaction
    await transaction(transactionStatements);

    // 4. Emit Real-Time WebSocket Events for live inventory & low stock
    inventoryUpdatesToEmit.forEach((update) => {
      emitInventoryUpdate(update.productId, update.warehouseId, update.newQty, 'ORDER_PLACED');
      if (update.newQty <= update.threshold) {
        emitLowStockAlert(update.productId, update.productName, update.warehouseId, update.newQty, update.threshold);
      }
    });

    emitOrderUpdate(orderId, 'PLACED', userId);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total,
      status: 'PLACED',
    });
  } catch (error) {
    res.status(500).json({ error: 'Order checkout transaction failed', details: error.message });
  }
});

// GET /orders - User's order history
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await query(
      `SELECT o.*, a.city, a.state, a.street_address
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await query(
          `SELECT oi.*, p.name, p.image_urls
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
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
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// GET /orders/:id - Order detail with tracking status
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await queryOne(
      `SELECT o.*, a.full_name, a.phone, a.street_address, a.city, a.state, a.postal_code
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND (o.user_id = ? OR ? = 'admin')`,
      [id, userId, req.user.role]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await query(
      `SELECT oi.*, p.name, p.image_urls, w.name AS warehouse_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN warehouses w ON oi.warehouse_id = w.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({
      order: {
        ...order,
        items: items.map((i) => ({ ...i, image_urls: JSON.parse(i.image_urls || '[]') })),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details', details: error.message });
  }
});

// POST /orders/:id/cancel - Cancel order and atomically restore stock
router.post('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['PLACED', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: `Cannot cancel order in '${order.status}' status` });
    }

    const orderItems = await query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    const transactionStatements = [
      {
        sql: `UPDATE orders SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [id],
      },
    ];

    const inventoryUpdatesToEmit = [];

    for (const item of orderItems) {
      // Restore stock in warehouse
      transactionStatements.push({
        sql: `UPDATE inventory SET stock_qty = stock_qty + ?, updated_at = CURRENT_TIMESTAMP 
              WHERE product_id = ? AND warehouse_id = ?`,
        args: [item.quantity, item.product_id, item.warehouse_id],
      });

      transactionStatements.push({
        sql: `INSERT INTO inventory_logs (id, product_id, warehouse_id, change_qty, new_stock_qty, reason, actor)
              VALUES (?, ?, ?, ?, (SELECT stock_qty FROM inventory WHERE product_id = ? AND warehouse_id = ?), ?, ?)`,
        args: [
          `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          item.product_id,
          item.warehouse_id,
          item.quantity,
          item.product_id,
          item.warehouse_id,
          'ORDER_CANCELLED',
          userId,
        ],
      });

      inventoryUpdatesToEmit.push({
        productId: item.product_id,
        warehouseId: item.warehouse_id,
      });
    }

    await transaction(transactionStatements);

    // Emit live inventory updates
    for (const update of inventoryUpdatesToEmit) {
      const currentStock = await queryOne(
        `SELECT stock_qty FROM inventory WHERE product_id = ? AND warehouse_id = ?`,
        [update.productId, update.warehouseId]
      );
      emitInventoryUpdate(update.productId, update.warehouseId, currentStock?.stock_qty || 0, 'ORDER_CANCELLED');
    }

    emitOrderUpdate(id, 'CANCELLED', userId);

    res.json({ message: 'Order cancelled and stock restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order', details: error.message });
  }
});

export default router;

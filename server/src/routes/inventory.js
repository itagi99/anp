import express from 'express';
import { query, withTransaction, mapRows, mapFirst } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { emitInventoryUpdate, emitLowStockAlert } from '../socket.js';

const router = express.Router();

/**
 * GET /inventory
 * Real-time warehouse inventory table with low-stock status and product information
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { warehouse_id, low_stock_only, search } = req.query;

    const conditions = ['1=1'];
    const params = [];

    if (warehouse_id) {
      conditions.push('inv.warehouse_id = ?');
      params.push(warehouse_id);
    }

    if (low_stock_only === 'true') {
      conditions.push('inv.stock_qty <= inv.low_stock_threshold');
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.brand LIKE ? OR w.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const sql = `
      SELECT 
        inv.*,
        p.name AS product_name,
        p.brand AS product_brand,
        p.price AS product_price,
        p.image_urls,
        w.name AS warehouse_name,
        w.code AS warehouse_code,
        w.city AS warehouse_city,
        (inv.stock_qty <= inv.low_stock_threshold) AS is_low_stock
      FROM inventory inv
      JOIN products p ON inv.product_id = p.id
      JOIN warehouses w ON inv.warehouse_id = w.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY is_low_stock DESC, inv.stock_qty ASC
    `;

    const result = await query(sql, params);
    const inventoryList = mapRows(result).map(item => ({
      ...item,
      image_urls: JSON.parse(item.image_urls || '[]'),
      is_low_stock: Boolean(item.is_low_stock),
    }));

    return res.json(inventoryList);
  } catch (error) {
    console.error('[Inventory Query Error]', error);
    return res.status(500).json({ error: 'Failed to fetch inventory dashboard' });
  }
});

/**
 * GET /inventory/logs
 * Audit trail history of all stock movements, orders, returns, and manual adjustments
 */
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { product_id, reason, limit = 50 } = req.query;
    const conditions = ['1=1'];
    const params = [];

    if (product_id) {
      conditions.push('l.product_id = ?');
      params.push(product_id);
    }
    if (reason) {
      conditions.push('l.reason = ?');
      params.push(reason);
    }

    const sql = `
      SELECT 
        l.*,
        p.name AS product_name,
        w.name AS warehouse_name
      FROM inventory_logs l
      JOIN products p ON l.product_id = p.id
      LEFT JOIN warehouses w ON l.warehouse_id = w.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY l.timestamp DESC
      LIMIT ?
    `;

    const result = await query(sql, [...params, parseInt(limit)]);
    return res.json(mapRows(result));
  } catch (error) {
    console.error('[Inventory Logs Error]', error);
    return res.status(500).json({ error: 'Failed to load inventory audit logs' });
  }
});

/**
 * POST /inventory/adjust
 * Atomic manual stock adjustment with validation, audit logging, and live WebSocket broadcast
 */
router.post('/adjust', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { product_id, warehouse_id, change_qty, reason, notes } = req.body;

    if (!product_id || !warehouse_id || change_qty === undefined || !reason) {
      return res.status(400).json({ error: 'product_id, warehouse_id, change_qty, and reason are required' });
    }

    const validReasons = ['MANUAL_ADJUST', 'RESTOCK', 'DAMAGE', 'AUDIT', 'RESERVATION_HOLD', 'RESERVATION_RELEASE'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` });
    }

    let updatedInventory = null;
    let totalStockAcrossWarehouses = 0;
    let productName = '';
    let threshold = 5;

    await withTransaction(async (tx) => {
      // 1. Fetch current inventory row with lock
      const curRes = await tx.execute({
        sql: `SELECT inv.*, p.name as product_name 
              FROM inventory inv 
              JOIN products p ON inv.product_id = p.id 
              WHERE inv.product_id = ? AND inv.warehouse_id = ?`,
        args: [product_id, warehouse_id],
      });

      const current = mapFirst(curRes);
      if (!current) {
        throw new Error('Inventory record not found for this product and warehouse combination');
      }

      productName = current.product_name;
      threshold = current.low_stock_threshold;
      const previousQty = current.stock_qty;
      const newQty = previousQty + parseInt(change_qty);

      if (newQty < 0) {
        throw new Error(`Adjustment would result in negative stock (${newQty}). Operation aborted.`);
      }

      // 2. Update stock_qty
      await tx.execute({
        sql: `UPDATE inventory 
              SET stock_qty = ?, updated_at = CURRENT_TIMESTAMP 
              WHERE product_id = ? AND warehouse_id = ?`,
        args: [newQty, product_id, warehouse_id],
      });

      // 3. Insert audit log
      const logId = `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
      await tx.execute({
        sql: `INSERT INTO inventory_logs (id, product_id, warehouse_id, change_qty, previous_qty, new_qty, reason, actor, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [logId, product_id, warehouse_id, parseInt(change_qty), previousQty, newQty, reason, req.user.id || 'ADMIN', notes || 'Manual Admin adjustment'],
      });

      // 4. Calculate new total stock
      const sumRes = await tx.execute({
        sql: `SELECT SUM(stock_qty) as total FROM inventory WHERE product_id = ?`,
        args: [product_id],
      });
      totalStockAcrossWarehouses = sumRes.rows[0][0] || 0;

      updatedInventory = { product_id, warehouse_id, previousQty, newQty, totalStockAcrossWarehouses };
    });

    // 5. Emit real-time WebSocket events
    emitInventoryUpdate(product_id, totalStockAcrossWarehouses, {
      warehouseId: warehouse_id,
      reason,
    });

    if (updatedInventory.newQty <= threshold) {
      emitLowStockAlert(product_id, productName, updatedInventory.newQty, threshold, warehouse_id);
    }

    return res.json({
      message: 'Inventory updated successfully and broadcasted in real-time',
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error('[Adjust Inventory Error]', error.message);
    return res.status(400).json({ error: error.message || 'Failed to adjust stock' });
  }
});

/**
 * GET /inventory/low-stock
 * Quick alert list for admin header / dashboard
 */
router.get('/low-stock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT 
        inv.*,
        p.name AS product_name,
        p.brand AS product_brand,
        p.image_urls,
        w.name AS warehouse_name
      FROM inventory inv
      JOIN products p ON inv.product_id = p.id
      JOIN warehouses w ON inv.warehouse_id = w.id
      WHERE inv.stock_qty <= inv.low_stock_threshold
      ORDER BY inv.stock_qty ASC
    `;
    const result = await query(sql);
    return res.json(mapRows(result).map(item => ({
      ...item,
      image_urls: JSON.parse(item.image_urls || '[]'),
    })));
  } catch (error) {
    console.error('[Low Stock Query Error]', error);
    return res.status(500).json({ error: 'Failed to retrieve low-stock alerts' });
  }
});

export default router;

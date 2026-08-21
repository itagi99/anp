import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart endpoints require customer auth
router.use(authenticate);

// GET /cart - Get user cart with item stock verification
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await query(
      `SELECT 
        c.id AS cart_item_id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.mrp,
        p.image_urls,
        COALESCE(SUM(i.stock_qty), 0) AS total_stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE c.user_id = ?
       GROUP BY c.id`,
      [userId]
    );

    const formattedItems = items.map((item) => ({
      ...item,
      image_urls: JSON.parse(item.image_urls || '[]'),
      total_stock: Number(item.total_stock),
      is_available: Number(item.total_stock) >= item.quantity,
    }));

    const subtotal = formattedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    res.json({
      items: formattedItems,
      subtotal,
      total_items: formattedItems.reduce((acc, curr) => acc + curr.quantity, 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
});

// POST /cart - Add item or increment quantity
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: 'Valid productId and positive quantity required' });
    }

    // Check available stock
    const stockRow = await queryOne(
      'SELECT COALESCE(SUM(stock_qty), 0) AS total_stock FROM inventory WHERE product_id = ?',
      [productId]
    );

    const totalStock = Number(stockRow?.total_stock || 0);
    if (totalStock <= 0) {
      return res.status(400).json({ error: 'Item is out of stock' });
    }

    const existingCart = await queryOne(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingCart) {
      const newQty = existingCart.quantity + quantity;
      if (newQty > totalStock) {
        return res.status(400).json({ error: `Cannot add more than available stock (${totalStock})` });
      }

      await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existingCart.id]);
    } else {
      const id = `cart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      await query(
        'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [id, userId, productId, Math.min(quantity, totalStock)]
      );
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
});

// PUT /cart/:productId - Set exact quantity
router.put('/:productId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
      return res.json({ message: 'Item removed from cart' });
    }

    // Check stock
    const stockRow = await queryOne(
      'SELECT COALESCE(SUM(stock_qty), 0) AS total_stock FROM inventory WHERE product_id = ?',
      [productId]
    );

    const totalStock = Number(stockRow?.total_stock || 0);
    if (quantity > totalStock) {
      return res.status(400).json({ error: `Requested quantity exceeds available stock (${totalStock})` });
    }

    await query('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId]);

    res.json({ message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity', details: error.message });
  }
});

// DELETE /cart/:productId - Remove item
router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item', details: error.message });
  }
});

export default router;

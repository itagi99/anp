import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /coupons - List active coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await query(
      `SELECT * FROM coupons WHERE is_active = 1 AND expiry_date > datetime('now') ORDER BY discount_pct DESC`
    );
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons', details: error.message });
  }
});

// POST /coupons/validate - Validate coupon for cart
router.post('/validate', authenticate, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const coupon = await queryOne(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expiry_date > datetime('now')`,
      [code.toUpperCase()]
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    if (orderAmount < coupon.min_order_value) {
      return res.status(400).json({
        error: `Minimum order value of ₹${coupon.min_order_value} required for this coupon`,
      });
    }

    const discount = Math.min((orderAmount * coupon.discount_pct) / 100, coupon.max_discount_amount || Infinity);

    res.json({
      valid: true,
      code: coupon.code,
      discount_pct: coupon.discount_pct,
      discount_amount: discount,
      message: `${coupon.discount_pct}% discount applied successfully!`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate coupon', details: error.message });
  }
});

// POST /coupons - Admin create coupon
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { code, discountPct, minOrderValue = 0, maxDiscountAmount, expiryDate, usageLimit = 1000 } = req.body;
    if (!code || !discountPct || !expiryDate) {
      return res.status(400).json({ error: 'code, discountPct, and expiryDate are required' });
    }

    const id = `cp-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO coupons (id, code, discount_pct, min_order_value, max_discount_amount, expiry_date, usage_limit)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, code.toUpperCase(), discountPct, minOrderValue, maxDiscountAmount || null, expiryDate, usageLimit]
    );

    res.status(201).json({ message: 'Coupon created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon', details: error.message });
  }
});

export default router;

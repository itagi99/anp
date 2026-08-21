import express from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate, requireRole('admin'));

// ===== Units CRUD =====
router.get('/units', async (req, res) => {
  try {
    const units = await query(`SELECT * FROM units ORDER BY name ASC`);
    res.json({ units });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch units', details: error.message });
  }
});

router.post('/units', async (req, res) => {
  try {
    const { name, symbol } = req.body;
    if (!name || !symbol) return res.status(400).json({ error: 'name and symbol are required' });
    const id = `unit-${Date.now().toString(36)}`;
    await query(`INSERT INTO units (id, name, symbol) VALUES (?, ?, ?)`, [id, name, symbol]);
    res.status(201).json({ message: 'Unit created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create unit', details: error.message });
  }
});

router.delete('/units/:id', async (req, res) => {
  try {
    await query(`DELETE FROM units WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Unit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete unit', details: error.message });
  }
});

// ===== Tier Pricing CRUD =====
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await query(
      `SELECT t.*, p.name AS product_name FROM product_tier_pricing t
       LEFT JOIN products p ON t.product_id = p.id ORDER BY p.name ASC, t.min_quantity ASC`
    );
    res.json({ tiers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tiers', details: error.message });
  }
});

router.post('/tiers', async (req, res) => {
  try {
    const { product_id, min_quantity, discount_type, discount_value } = req.body;
    if (!product_id || !min_quantity || !discount_type || !discount_value) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const id = `tier-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO product_tier_pricing (id, product_id, min_quantity, discount_type, discount_value)
       VALUES (?, ?, ?, ?, ?)`,
      [id, product_id, min_quantity, discount_type, discount_value]
    );
    res.status(201).json({ message: 'Tier created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tier', details: error.message });
  }
});

router.put('/tiers/:id', async (req, res) => {
  try {
    const { min_quantity, discount_type, discount_value } = req.body;
    await query(
      `UPDATE product_tier_pricing SET min_quantity = ?, discount_type = ?, discount_value = ? WHERE id = ?`,
      [min_quantity, discount_type, discount_value, req.params.id]
    );
    res.json({ message: 'Tier updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tier', details: error.message });
  }
});

router.delete('/tiers/:id', async (req, res) => {
  try {
    await query(`DELETE FROM product_tier_pricing WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Tier deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tier', details: error.message });
  }
});

// ===== Flash Deals CRUD =====
router.get('/flash-deals', async (req, res) => {
  try {
    const deals = await query(
      `SELECT f.*, p.name AS product_name FROM flash_deals f
       LEFT JOIN products p ON f.product_id = p.id ORDER BY f.created_at DESC`
    );
    res.json({ flash_deals: deals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flash deals', details: error.message });
  }
});

router.post('/flash-deals', async (req, res) => {
  try {
    const { product_id, flash_price, flash_start, flash_end, status = 1 } = req.body;
    if (!product_id || !flash_price || !flash_start || !flash_end) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const id = `flash-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO flash_deals (id, product_id, flash_price, flash_start, flash_end, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, product_id, flash_price, flash_start, flash_end, status]
    );
    res.status(201).json({ message: 'Flash deal created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flash deal', details: error.message });
  }
});

router.put('/flash-deals/:id', async (req, res) => {
  try {
    const { flash_price, flash_start, flash_end, status } = req.body;
    await query(
      `UPDATE flash_deals SET flash_price = ?, flash_start = ?, flash_end = ?, status = ? WHERE id = ?`,
      [flash_price, flash_start, flash_end, status, req.params.id]
    );
    res.json({ message: 'Flash deal updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update flash deal', details: error.message });
  }
});

router.delete('/flash-deals/:id', async (req, res) => {
  try {
    await query(`DELETE FROM flash_deals WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Flash deal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete flash deal', details: error.message });
  }
});

// ===== Delivery Charge Rules =====
router.get('/delivery-rules', async (req, res) => {
  try {
    const rules = await query(`SELECT * FROM delivery_charge_rules ORDER BY priority ASC`);
    res.json({ rules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules', details: error.message });
  }
});

router.post('/delivery-rules', async (req, res) => {
  try {
    const { name, min_order_value, max_order_value, delivery_charge, priority = 10, is_active = 1 } = req.body;
    if (!name || delivery_charge === undefined) {
      return res.status(400).json({ error: 'name and delivery_charge are required' });
    }
    const id = `dlv-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO delivery_charge_rules (id, name, min_order_value, max_order_value, delivery_charge, priority, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, min_order_value || 0, max_order_value || null, delivery_charge, priority, is_active]
    );
    res.status(201).json({ message: 'Delivery rule created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create delivery rule', details: error.message });
  }
});

router.put('/delivery-rules/:id', async (req, res) => {
  try {
    const { name, min_order_value, max_order_value, delivery_charge, priority, is_active } = req.body;
    await query(
      `UPDATE delivery_charge_rules SET name = ?, min_order_value = ?, max_order_value = ?, delivery_charge = ?, priority = ?, is_active = ? WHERE id = ?`,
      [name, min_order_value, max_order_value, delivery_charge, priority, is_active, req.params.id]
    );
    res.json({ message: 'Delivery rule updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery rule', details: error.message });
  }
});

router.delete('/delivery-rules/:id', async (req, res) => {
  try {
    await query(`DELETE FROM delivery_charge_rules WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Delivery rule deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete delivery rule', details: error.message });
  }
});

// ===== Popups CRUD =====
router.get('/popups', async (req, res) => {
  try {
    const popups = await query(`SELECT * FROM popups ORDER BY created_at DESC`);
    res.json({ popups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popups', details: error.message });
  }
});

router.post('/popups', async (req, res) => {
  try {
    const { title, message, image_url, button_text, button_link, active = 1, start_date, end_date, per_session = 0, dismissible = 1 } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const id = `pop-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO popups (id, title, message, image_url, button_text, button_link, active, start_date, end_date, per_session, dismissible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, message || null, image_url || null, button_text || null, button_link || null, active, start_date || null, end_date || null, per_session, dismissible]
    );
    res.status(201).json({ message: 'Popup created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create popup', details: error.message });
  }
});

router.put('/popups/:id', async (req, res) => {
  try {
    const { title, message, image_url, button_text, button_link, active, start_date, end_date, per_session, dismissible } = req.body;
    await query(
      `UPDATE popups SET title = ?, message = ?, image_url = ?, button_text = ?, button_link = ?, active = ?, start_date = ?, end_date = ?, per_session = ?, dismissible = ? WHERE id = ?`,
      [title, message, image_url, button_text, button_link, active, start_date, end_date, per_session, dismissible, req.params.id]
    );
    res.json({ message: 'Popup updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update popup', details: error.message });
  }
});

router.delete('/popups/:id', async (req, res) => {
  try {
    await query(`DELETE FROM popups WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Popup deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete popup', details: error.message });
  }
});

// ===== Coupons (4-scope system) CRUD =====
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await query(
      `SELECT c.*, cat.name AS category_name, p.name AS product_name
       FROM coupons c
       LEFT JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN products p ON c.product_id = p.id
       ORDER BY c.created_at DESC`
    );
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons', details: error.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const {
      code, discount_pct, min_order_value = 0, max_discount_amount = 0,
      expiry_date, usage_limit = 1000, is_active = 1,
      scope = 'sitewide', category_id = null, product_id = null,
    } = req.body;
    if (!code || discount_pct === undefined || !expiry_date) {
      return res.status(400).json({ error: 'code, discount_pct and expiry_date are required' });
    }
    const id = `cp-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO coupons (id, code, discount_pct, min_order_value, max_discount_amount, expiry_date, usage_limit, times_used, is_active, scope, category_id, product_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [id, code.toUpperCase(), discount_pct, min_order_value, max_discount_amount, expiry_date, usage_limit, is_active, scope, category_id, product_id]
    );
    res.status(201).json({ message: 'Coupon created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon', details: error.message });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const {
      code, discount_pct, min_order_value, max_discount_amount,
      expiry_date, usage_limit, is_active, scope, category_id, product_id,
    } = req.body;
    const sets = [];
    const params = [];
    if (code !== undefined) { sets.push('code = ?'); params.push(code.toUpperCase()); }
    if (discount_pct !== undefined) { sets.push('discount_pct = ?'); params.push(discount_pct); }
    if (min_order_value !== undefined) { sets.push('min_order_value = ?'); params.push(min_order_value); }
    if (max_discount_amount !== undefined) { sets.push('max_discount_amount = ?'); params.push(max_discount_amount); }
    if (expiry_date !== undefined) { sets.push('expiry_date = ?'); params.push(expiry_date); }
    if (usage_limit !== undefined) { sets.push('usage_limit = ?'); params.push(usage_limit); }
    if (is_active !== undefined) { sets.push('is_active = ?'); params.push(is_active); }
    if (scope !== undefined) { sets.push('scope = ?'); params.push(scope); }
    if (category_id !== undefined) { sets.push('category_id = ?'); params.push(category_id); }
    if (product_id !== undefined) { sets.push('product_id = ?'); params.push(product_id); }
    if (!sets.length) return res.status(400).json({ error: 'No fields provided' });
    params.push(req.params.id);
    await query(`UPDATE coupons SET ${sets.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Coupon updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon', details: error.message });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await query(`DELETE FROM coupons WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon', details: error.message });
  }
});

// ===== Salesman Management =====
router.get('/salesmen', async (req, res) => {
  try {
    const salesmen = await query(
      `SELECT s.*,
              (SELECT COUNT(*) FROM salesman_orders so WHERE so.salesman_id = s.id) AS total_orders,
              (SELECT COALESCE(SUM(total_amount), 0) FROM salesman_orders so WHERE so.salesman_id = s.id) AS total_sales
       FROM salesman_accounts s ORDER BY s.created_at DESC`
    );
    res.json({ salesmen });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salesmen', details: error.message });
  }
});

router.post('/salesmen', async (req, res) => {
  try {
    const { employee_id, name, email, phone, password } = req.body;
    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({ error: 'employee_id, name, email, password are required' });
    }
    const id = `slm-${Date.now().toString(36)}`;
    const hash = await bcrypt.hash(password, 10);
    await query(
      `INSERT INTO salesman_accounts (id, employee_id, name, email, phone, password_hash, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [id, employee_id.toUpperCase(), name, email, phone || null, hash]
    );
    res.status(201).json({ message: 'Salesman created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create salesman', details: error.message });
  }
});

router.put('/salesmen/:id', async (req, res) => {
  try {
    const { employee_id, name, email, phone, is_active } = req.body;
    await query(
      `UPDATE salesman_accounts SET employee_id = ?, name = ?, email = ?, phone = ?, is_active = ? WHERE id = ?`,
      [employee_id.toUpperCase(), name, email, phone || null, is_active, req.params.id]
    );
    res.json({ message: 'Salesman updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update salesman', details: error.message });
  }
});

router.delete('/salesmen/:id', async (req, res) => {
  try {
    await query(`DELETE FROM salesman_accounts WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Salesman deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete salesman', details: error.message });
  }
});

// ===== Salesman Beats =====
router.get('/salesmen/:id/beats', async (req, res) => {
  try {
    const beats = await query(
      `SELECT b.*,
              (SELECT COUNT(*) FROM salesman_beat_customers sbc WHERE sbc.beat_id = b.id) AS customer_count
       FROM salesman_beats b WHERE b.salesman_id = ? ORDER BY b.day_of_week`,
      [req.params.id]
    );
    res.json({ beats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beats', details: error.message });
  }
});

router.post('/beats', async (req, res) => {
  try {
    const { salesman_id, beat_name, area, day_of_week, is_active = 1 } = req.body;
    if (!salesman_id || !beat_name || !day_of_week) {
      return res.status(400).json({ error: 'salesman_id, beat_name, day_of_week are required' });
    }
    const id = `beat-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO salesman_beats (id, salesman_id, beat_name, area, day_of_week, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, salesman_id, beat_name, area || null, day_of_week, is_active]
    );
    res.status(201).json({ message: 'Beat created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create beat', details: error.message });
  }
});

router.delete('/beats/:id', async (req, res) => {
  try {
    await query(`DELETE FROM salesman_beats WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Beat deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete beat', details: error.message });
  }
});

// ===== Targets =====
router.get('/salesmen/:id/targets', async (req, res) => {
  try {
    const targets = await query(
      `SELECT * FROM salesman_targets WHERE salesman_id = ? ORDER BY target_year DESC, target_month DESC`,
      [req.params.id]
    );
    res.json({ targets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets', details: error.message });
  }
});

router.post('/targets', async (req, res) => {
  try {
    const { salesman_id, target_month, target_year, target_amount, target_orders = 0 } = req.body;
    if (!salesman_id || !target_month || !target_year || !target_amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const id = `tgt-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO salesman_targets (id, salesman_id, target_month, target_year, target_amount, target_orders)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, salesman_id, target_month, target_year, target_amount, target_orders]
    );
    res.status(201).json({ message: 'Target created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create target', details: error.message });
  }
});

// ===== Excluded Delivery Products =====
router.get('/delivery-exclusions', async (req, res) => {
  try {
    const [products, categories] = await Promise.all([
      query(`SELECT e.*, p.name AS product_name FROM excluded_products_delivery e LEFT JOIN products p ON e.product_id = p.id`),
      query(`SELECT e.*, c.name AS category_name FROM excluded_categories_delivery e LEFT JOIN categories c ON e.category_id = c.id`),
    ]);
    res.json({ products, categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exclusions', details: error.message });
  }
});

router.post('/delivery-exclusions/products', async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    await query(`INSERT OR REPLACE INTO excluded_products_delivery (product_id, exclude_from_delivery_calc) VALUES (?, 1)`, [product_id]);
    res.status(201).json({ message: 'Product excluded from delivery calc' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exclusion', details: error.message });
  }
});

router.delete('/delivery-exclusions/products/:id', async (req, res) => {
  try {
    await query(`DELETE FROM excluded_products_delivery WHERE product_id = ?`, [req.params.id]);
    res.json({ message: 'Exclusion removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove exclusion', details: error.message });
  }
});

router.post('/delivery-exclusions/categories', async (req, res) => {
  try {
    const { category_id } = req.body;
    if (!category_id) return res.status(400).json({ error: 'category_id is required' });
    await query(`INSERT OR REPLACE INTO excluded_categories_delivery (category_id, exclude_from_delivery_calc) VALUES (?, 1)`, [category_id]);
    res.status(201).json({ message: 'Category excluded from delivery calc' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exclusion', details: error.message });
  }
});

router.delete('/delivery-exclusions/categories/:id', async (req, res) => {
  try {
    await query(`DELETE FROM excluded_categories_delivery WHERE category_id = ?`, [req.params.id]);
    res.json({ message: 'Exclusion removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove exclusion', details: error.message });
  }
});

// ===== Product flags & unit settings =====
router.put('/products/:id/settings', async (req, res) => {
  try {
    const {
      primary_unit_id, secondary_unit_id, unit_conversion,
      is_deal_of_day, is_best_seller, is_product_of_week, is_must_buy,
      deal_start, deal_end, visible,
    } = req.body;

    const sets = [];
    const params = [];
    if (primary_unit_id !== undefined) { sets.push('primary_unit_id = ?'); params.push(primary_unit_id); }
    if (secondary_unit_id !== undefined) { sets.push('secondary_unit_id = ?'); params.push(secondary_unit_id); }
    if (unit_conversion !== undefined) { sets.push('unit_conversion = ?'); params.push(unit_conversion); }
    if (is_deal_of_day !== undefined) { sets.push('is_deal_of_day = ?'); params.push(is_deal_of_day); }
    if (is_best_seller !== undefined) { sets.push('is_best_seller = ?'); params.push(is_best_seller); }
    if (is_product_of_week !== undefined) { sets.push('is_product_of_week = ?'); params.push(is_product_of_week); }
    if (is_must_buy !== undefined) { sets.push('is_must_buy = ?'); params.push(is_must_buy); }
    if (deal_start !== undefined) { sets.push('deal_start = ?'); params.push(deal_start); }
    if (deal_end !== undefined) { sets.push('deal_end = ?'); params.push(deal_end); }
    if (visible !== undefined) { sets.push('visible = ?'); params.push(visible); }

    if (!sets.length) return res.status(400).json({ error: 'No settings provided' });

    params.push(req.params.id);
    await query(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Product settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product settings', details: error.message });
  }
});

export default router;

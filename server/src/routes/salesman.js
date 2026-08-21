import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_jwt_secret_key_shopkart_prod_2026';

// Helper: verify salesman JWT
async function requireSalesman(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const salesman = await queryOne('SELECT id, employee_id, name, email, phone, is_active FROM salesman_accounts WHERE id = ?', [decoded.id]);
    if (!salesman || salesman.is_active !== 1) {
      return res.status(401).json({ error: 'Salesman account not found or inactive' });
    }
    req.salesman = salesman;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
}

// POST /salesman/login - Salesman login
router.post('/login', async (req, res) => {
  try {
    const { employee_id, password } = req.body;
    if (!employee_id || !password) {
      return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    const salesman = await queryOne(
      `SELECT * FROM salesman_accounts WHERE (employee_id = ? OR email = ?) AND is_active = 1`,
      [employee_id.toUpperCase(), employee_id.toLowerCase()]
    );

    if (!salesman) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, salesman.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    await query(`UPDATE salesman_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [salesman.id]);

    const token = jwt.sign({ id: salesman.id, role: 'salesman' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      salesman: {
        id: salesman.id,
        employee_id: salesman.employee_id,
        name: salesman.name,
        email: salesman.email,
        phone: salesman.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// GET /salesman/dashboard - Punch status, today's beat, targets, stats
router.get('/dashboard', requireSalesman, async (req, res) => {
  try {
    const salesman = req.salesman;
    const today = new Date().toISOString().slice(0, 10);
    const day_of_week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const [attendance, today_beat, today_stats, monthly_stats, target] = await Promise.all([
      queryOne(`SELECT * FROM salesman_attendance WHERE salesman_id = ? AND attendance_date = ?`, [salesman.id, today]),
      queryOne(`SELECT * FROM salesman_beats WHERE salesman_id = ? AND day_of_week = ? AND is_active = 1 LIMIT 1`, [salesman.id, day_of_week]),
      queryOne(`SELECT COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS sales FROM salesman_orders WHERE salesman_id = ? AND DATE(order_date) = ?`, [salesman.id, today]),
      queryOne(`SELECT COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS sales FROM salesman_orders WHERE salesman_id = ? AND strftime('%m', order_date) = ? AND strftime('%Y', order_date) = ?`, [salesman.id, String(month).padStart(2,'0'), String(year)]),
      queryOne(`SELECT * FROM salesman_targets WHERE salesman_id = ? AND target_month = ? AND target_year = ?`, [salesman.id, month, year]),
    ]);

    let beat_customers = [];
    let beat_customer_count = 0;
    if (today_beat) {
      const customers = await query(
        `SELECT sc.customer_id, sc.customer_name, sc.customer_phone, ud.address, ud.city,
                EXISTS(SELECT 1 FROM salesman_orders so WHERE so.customer_id = sc.customer_id AND so.salesman_id = ? AND DATE(so.order_date) = ?) AS visited_today
         FROM salesman_beat_customers sbc
         INNER JOIN salesman_customers sc ON sbc.customer_id = sc.customer_id
         LEFT JOIN user_details ud ON sc.customer_id = ud.user_id
         WHERE sbc.beat_id = ? AND sc.status = 'active'
         ORDER BY sc.customer_name LIMIT 5`,
        [salesman.id, today, today_beat.id]
      );
      beat_customers = customers;
      beat_customer_count = (await queryOne(
        `SELECT COUNT(*) AS cnt FROM salesman_beat_customers sbc INNER JOIN salesman_customers sc ON sbc.customer_id = sc.customer_id WHERE sbc.beat_id = ? AND sc.status = 'active'`,
        [today_beat.id]
      ))?.cnt || 0;
    }

    const achievement = target && Number(target.target_amount) > 0
      ? Math.round((Number(monthly_stats.sales) / Number(target.target_amount)) * 1000) / 10
      : 0;

    const unread = (await queryOne(`SELECT COUNT(*) AS cnt FROM salesman_notifications WHERE salesman_id = ? AND is_read = 0`, [salesman.id]))?.cnt || 0;

    res.json({
      salesman,
      date: today,
      day_of_week,
      attendance: attendance || null,
      is_punched_in: !!(attendance && attendance.punch_in_time && !attendance.punch_out_time),
      is_punched_out: !!(attendance && attendance.punch_out_time),
      today_beat: today_beat ? { ...today_beat, customers: beat_customers, total_customers: beat_customer_count } : null,
      today_stats,
      monthly_stats,
      target: target || null,
      achievement,
      unread_notifications: unread,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard', details: error.message });
  }
});

// POST /salesman/punch - Punch in/out with GPS
router.post('/punch', requireSalesman, async (req, res) => {
  try {
    const salesman = req.salesman;
    const { type, lat, lng, time } = req.body; // type: 'in' | 'out'
    const today = new Date().toISOString().slice(0, 10);

    if (!['in', 'out'].includes(type)) {
      return res.status(400).json({ error: 'Punch type must be "in" or "out"' });
    }

    const existing = await queryOne(
      `SELECT * FROM salesman_attendance WHERE salesman_id = ? AND attendance_date = ?`,
      [salesman.id, today]
    );

    if (type === 'in') {
      if (existing && existing.punch_in_time) {
        return res.status(400).json({ error: 'Already punched in today' });
      }
      if (existing) {
        await query(
          `UPDATE salesman_attendance SET punch_in_time = CURRENT_TIMESTAMP, punch_in_lat = ?, punch_in_lng = ? WHERE id = ?`,
          [lat || null, lng || null, existing.id]
        );
      } else {
        await query(
          `INSERT INTO salesman_attendance (id, salesman_id, attendance_date, punch_in_time, punch_in_lat, punch_in_lng)
           VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`,
          [`att-${Date.now().toString(36)}`, salesman.id, today, lat || null, lng || null]
        );
      }
      return res.json({ message: 'Punched in successfully', type: 'in' });
    } else {
      if (!existing || !existing.punch_in_time) {
        return res.status(400).json({ error: 'Must punch in before punching out' });
      }
      await query(
        `UPDATE salesman_attendance SET punch_out_time = CURRENT_TIMESTAMP, punch_out_lat = ?, punch_out_lng = ? WHERE id = ?`,
        [lat || null, lng || null, existing.id]
      );
      return res.json({ message: 'Punched out successfully', type: 'out' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to punch', details: error.message });
  }
});

// GET /salesman/beat/customers - Today's beat customers (full list)
router.get('/beat/customers', requireSalesman, async (req, res) => {
  try {
    const salesman = req.salesman;
    const today = new Date().toISOString().slice(0, 10);
    const day_of_week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

    const beat = await queryOne(
      `SELECT * FROM salesman_beats WHERE salesman_id = ? AND day_of_week = ? AND is_active = 1 LIMIT 1`,
      [salesman.id, day_of_week]
    );
    if (!beat) return res.json({ beat: null, customers: [] });

    const customers = await query(
      `SELECT sc.customer_id, sc.customer_name, sc.customer_phone, ud.address, ud.city, ud.state, ud.postal_code,
              EXISTS(SELECT 1 FROM salesman_orders so WHERE so.customer_id = sc.customer_id AND so.salesman_id = ? AND DATE(so.order_date) = ?) AS visited_today
       FROM salesman_beat_customers sbc
       INNER JOIN salesman_customers sc ON sbc.customer_id = sc.customer_id
       LEFT JOIN user_details ud ON sc.customer_id = ud.user_id
       WHERE sbc.beat_id = ? AND sc.status = 'active'
       ORDER BY sc.customer_name`,
      [salesman.id, today, beat.id]
    );

    res.json({ beat, customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beat customers', details: error.message });
  }
});

// GET /salesman/customers - All my customers
router.get('/customers', requireSalesman, async (req, res) => {
  try {
    const customers = await query(
      `SELECT * FROM salesman_customers WHERE salesman_id = ? AND status = 'active' ORDER BY customer_name ASC`,
      [req.salesman.id]
    );
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
  }
});

// GET /salesman/products - Product catalog for order taking (wholesale pricing)
router.get('/products', requireSalesman, async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : null;
    const params = [];
    let where = `p.visible = 1 AND p.is_active = 1`;
    if (search) {
      where += ` AND (p.name LIKE ? OR p.brand LIKE ?)`;
      params.push(search, search);
    }

    const products = await query(
      `SELECT p.id, p.name, p.brand, p.price, p.mrp, c.name AS category_name,
              u1.name AS primary_unit, u2.name AS secondary_unit, COALESCE(p.unit_conversion, 1) AS unit_conversion,
              COALESCE((SELECT SUM(stock_qty) FROM inventory i WHERE i.product_id = p.id), 0) AS stock_total,
              (SELECT image_urls FROM products WHERE id = p.id) AS image_urls
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN units u1 ON p.primary_unit_id = u1.id
       LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
       WHERE ${where} ORDER BY p.name ASC`,
      params
    );

    const ids = products.map((p) => p.id);
    const tiersMap = ids.length ? await (async () => {
      const ph = ids.map(() => '?').join(',');
      const rows = await query(
        `SELECT product_id, min_quantity AS min, discount_type AS type, discount_value AS value
         FROM product_tier_pricing WHERE product_id IN (${ph}) ORDER BY min_quantity ASC`,
        ids
      );
      const m = {};
      rows.forEach((r) => {
        if (!m[r.product_id]) m[r.product_id] = [];
        m[r.product_id].push({ min: r.min, type: r.type, value: r.value });
      });
      return m;
    })() : {};

    res.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        category: p.category_name,
        primary_unit: p.primary_unit || 'Box',
        secondary_unit: p.secondary_unit || 'Piece',
        unit_conversion: Number(p.unit_conversion) || 1,
        stock_total: Number(p.stock_total),
        tiers: tiersMap[p.id] || [],
        image_url: p.image_urls ? JSON.parse(p.image_urls)[0] || '' : '',
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// POST /salesman/orders - Create a salesman order
router.post('/orders', requireSalesman, async (req, res) => {
  try {
    const { customer_id, items } = req.body; // items: [{product_id, quantity, unit_price}]
    if (!customer_id || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'customer_id and items are required' });
    }

    let total = 0;
    for (const item of items) {
      total += Number(item.quantity) * Number(item.unit_price);
    }

    const orderId = `so-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    await query(
      `INSERT INTO salesman_orders (id, salesman_id, customer_id, order_date, total_amount, status)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, 'pending')`,
      [orderId, req.salesman.id, customer_id, total]
    );

    res.status(201).json({ message: 'Salesman order created', orderId, total_amount: total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// GET /salesman/orders - My orders history
router.get('/orders', requireSalesman, async (req, res) => {
  try {
    const orders = await query(
      `SELECT so.*, sc.customer_name
       FROM salesman_orders so
       LEFT JOIN salesman_customers sc ON so.customer_id = sc.customer_id
       WHERE so.salesman_id = ?
       ORDER BY so.order_date DESC`,
      [req.salesman.id]
    );
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// GET /salesman/orders/:id - Order detail
router.get('/orders/:id', requireSalesman, async (req, res) => {
  try {
    const order = await queryOne(
      `SELECT so.*, sc.customer_name, sc.customer_phone
       FROM salesman_orders so
       LEFT JOIN salesman_customers sc ON so.customer_id = sc.customer_id
       WHERE so.id = ? AND so.salesman_id = ?`,
      [req.params.id, req.salesman.id]
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// DELETE /salesman/orders/:id - Delete order
router.delete('/orders/:id', requireSalesman, async (req, res) => {
  try {
    await query(`DELETE FROM salesman_orders WHERE id = ? AND salesman_id = ?`, [req.params.id, req.salesman.id]);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

// GET /salesman/reports - Daily/monthly stats
router.get('/reports', requireSalesman, async (req, res) => {
  try {
    const salesman = req.salesman;
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const [daily, monthly, attendance, target] = await Promise.all([
      query(
        `SELECT DATE(order_date) AS day, COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS sales
         FROM salesman_orders WHERE salesman_id = ? AND strftime('%Y-%m', order_date) = ? 
         GROUP BY DATE(order_date) ORDER BY day DESC`,
        [salesman.id, `${year}-${String(month).padStart(2, '0')}`]
      ),
      queryOne(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS sales
         FROM salesman_orders WHERE salesman_id = ? AND strftime('%m', order_date) = ? AND strftime('%Y', order_date) = ?`,
        [salesman.id, String(month).padStart(2, '0'), String(year)]
      ),
      query(
        `SELECT attendance_date, punch_in_time, punch_out_time FROM salesman_attendance
         WHERE salesman_id = ? AND strftime('%Y-%m', attendance_date) = ? ORDER BY attendance_date DESC`,
        [salesman.id, `${year}-${String(month).padStart(2, '0')}`]
      ),
      queryOne(`SELECT * FROM salesman_targets WHERE salesman_id = ? AND target_month = ? AND target_year = ?`, [salesman.id, month, year]),
    ]);

    res.json({ daily, monthly: monthly || { orders: 0, sales: 0 }, attendance, target: target || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

// GET /salesman/attendance - Attendance history
router.get('/attendance', requireSalesman, async (req, res) => {
  try {
    const attendance = await query(
      `SELECT * FROM salesman_attendance WHERE salesman_id = ? ORDER BY attendance_date DESC LIMIT 60`,
      [req.salesman.id]
    );
    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: error.message });
  }
});

// GET /salesman/notifications
router.get('/notifications', requireSalesman, async (req, res) => {
  try {
    const notifications = await query(
      `SELECT * FROM salesman_notifications WHERE salesman_id = ? ORDER BY created_at DESC LIMIT 50`,
      [req.salesman.id]
    );
    await query(`UPDATE salesman_notifications SET is_read = 1 WHERE salesman_id = ?`, [req.salesman.id]);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

export default router;
export { requireSalesman };

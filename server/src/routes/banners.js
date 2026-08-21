import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /banners - List active promotional banners
router.get('/', async (req, res) => {
  try {
    const banners = await query(`SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC`);
    res.json({ banners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners', details: error.message });
  }
});

// POST /banners - Admin create promotional banner
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { title, subtitle, imageUrl, actionType = 'category', actionValue, displayOrder = 0 } = req.body;
    if (!title || !imageUrl || !actionValue) {
      return res.status(400).json({ error: 'title, imageUrl, and actionValue are required' });
    }

    const id = `ban-${Date.now().toString(36)}`;
    await query(
      `INSERT INTO banners (id, title, subtitle, image_url, action_type, action_value, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, subtitle || null, imageUrl, actionType, actionValue, displayOrder]
    );

    res.status(201).json({ message: 'Banner created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner', details: error.message });
  }
});

export default router;

import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /categories - List nested category hierarchy
router.get('/', async (req, res) => {
  try {
    const rows = await query(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    // Build category tree
    const rootCategories = rows.filter((c) => !c.parent_id);
    const categoryTree = rootCategories.map((root) => ({
      ...root,
      children: rows.filter((c) => c.parent_id === root.id),
    }));

    res.json({ categories: categoryTree, flat: rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// POST /categories - Admin create category
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { name, slug, iconEmoji, parentId, imageUrl } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Category name and slug are required' });
    }

    const id = `cat-${slug.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    await query(
      'INSERT INTO categories (id, name, slug, icon_emoji, parent_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, slug.toLowerCase(), iconEmoji || null, parentId || null, imageUrl || null]
    );

    res.status(201).json({ message: 'Category created', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
});

export default router;

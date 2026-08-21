import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /products - List & search products with filters & pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort = 'popular',
      page = 1,
      limit = 20,
    } = req.query;

    let sql = `
      SELECT 
        p.*,
        c.name AS category_name,
        COALESCE(SUM(i.stock_qty), 0) AS total_stock,
        COALESCE(SUM(i.reserved_qty), 0) AS total_reserved
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (category) {
      sql += ` AND (p.category_id = ? OR c.slug = ?)`;
      params.push(category, category);
    }

    if (brand) {
      sql += ` AND p.brand = ?`;
      params.push(brand);
    }

    if (minPrice) {
      sql += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    if (minRating) {
      sql += ` AND p.rating >= ?`;
      params.push(Number(minRating));
    }

    sql += ` GROUP BY p.id`;

    // Sorting
    switch (sort) {
      case 'price_asc':
        sql += ` ORDER BY p.price ASC`;
        break;
      case 'price_desc':
        sql += ` ORDER BY p.price DESC`;
        break;
      case 'newest':
        sql += ` ORDER BY p.created_at DESC`;
        break;
      case 'rating':
        sql += ` ORDER BY p.rating DESC`;
        break;
      case 'discount':
        sql += ` ORDER BY p.discount_pct DESC`;
        break;
      case 'popular':
      default:
        sql += ` ORDER BY p.review_count DESC, p.rating DESC`;
        break;
    }

    const offset = (Number(page) - 1) * Number(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = await query(sql, params);

    const parsedProducts = rows.map((p) => ({
      ...p,
      image_urls: JSON.parse(p.image_urls || '[]'),
      attributes: JSON.parse(p.attributes || '{}'),
      total_stock: Number(p.total_stock),
      is_in_stock: Number(p.total_stock) > 0,
    }));

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: parsedProducts.length,
      products: parsedProducts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// GET /products/:id - Product detail with per-warehouse stock breakdown
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await queryOne(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? OR p.slug = ?`,
      [id, id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch warehouse inventory breakdown
    const inventory = await query(
      `SELECT i.*, w.name AS warehouse_name, w.city, w.state
       FROM inventory i
       JOIN warehouses w ON i.warehouse_id = w.id
       WHERE i.product_id = ?`,
      [product.id]
    );

    // Fetch recent reviews
    const reviews = await query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [product.id]
    );

    const totalStock = inventory.reduce((sum, item) => sum + item.stock_qty, 0);

    res.json({
      product: {
        ...product,
        image_urls: JSON.parse(product.image_urls || '[]'),
        attributes: JSON.parse(product.attributes || '{}'),
        total_stock: totalStock,
        is_in_stock: totalStock > 0,
      },
      inventory,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details', details: error.message });
  }
});

export default router;

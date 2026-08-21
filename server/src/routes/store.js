import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper: Fetch active flash deal price for a product
async function getActiveFlashDeals() {
  try {
    const rows = await query(
      `SELECT product_id, flash_price FROM flash_deals
       WHERE status = 1 AND flash_start <= datetime('now') AND flash_end >= datetime('now')`
    );
    const map = {};
    rows.forEach((r) => { map[r.product_id] = { flash_price: r.flash_price }; });
    return map;
  } catch (e) {
    return {};
  }
}

// Helper: Fetch tier pricing for a set of product ids
async function fetchTiersForProducts(productIds) {
  if (!productIds.length) return {};
  const ph = productIds.map(() => '?').join(',');
  const rows = await query(
    `SELECT product_id, min_quantity AS min, discount_type AS type, discount_value AS value
     FROM product_tier_pricing WHERE product_id IN (${ph}) ORDER BY product_id, min_quantity ASC`,
    productIds
  );
  const map = {};
  rows.forEach((r) => {
    const pid = r.product_id;
    if (!map[pid]) map[pid] = [];
    map[pid].push({ min: r.min, type: r.type, value: r.value });
  });
  return map;
}

// Helper: Resolve product card display price with flash + tier
function resolveDisplayPrice(product, flashMap) {
  const flash = flashMap[product.id];
  const price = Number(product.price);
  const mrp = Number(product.mrp);
  if (flash) {
    return { displayPrice: flash.flash_price, mrp, isFlash: true, hasDisc: mrp > flash.flash_price && flash.flash_price > 0 };
  }
  return { displayPrice: price > 0 ? price : mrp, mrp, isFlash: false, hasDisc: price > 0 && mrp > price };
}

// GET /store/home - Homepage sections (flash deals, deal of day, best sellers, etc.)
router.get('/home', async (req, res) => {
  try {
    const baseSql = `
      SELECT p.*, c.name AS category_name, u1.name AS primary_unit, u2.name AS secondary_unit,
             COALESCE(p.unit_conversion, 1) AS unit_conversion,
             COALESCE((SELECT SUM(stock_qty) FROM inventory i WHERE i.product_id = p.id), 0) AS stock_total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN units u1 ON p.primary_unit_id = u1.id
      LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
      WHERE p.visible = 1 AND p.is_active = 1
    `;

    const [flashRows, dealRows, bestRows, weekRows, mustRows, banners, popups] = await Promise.all([
      query(baseSql + ` AND p.is_deal_of_day = 1 AND (p.deal_start IS NULL OR p.deal_start <= datetime('now')) AND (p.deal_end IS NULL OR p.deal_end >= datetime('now')) ORDER BY p.created_at DESC LIMIT 20`),
      query(baseSql + ` AND p.is_deal_of_day = 1 ORDER BY p.created_at DESC LIMIT 20`),
      query(baseSql + ` AND p.is_best_seller = 1 ORDER BY p.created_at DESC LIMIT 20`),
      query(baseSql + ` AND p.is_product_of_week = 1 ORDER BY p.created_at DESC LIMIT 20`),
      query(baseSql + ` AND p.is_must_buy = 1 ORDER BY p.created_at DESC LIMIT 20`),
      query(`SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC`),
      query(`SELECT * FROM popups WHERE active = 1 AND (start_date IS NULL OR start_date <= datetime('now')) AND (end_date IS NULL OR end_date >= datetime('now')) ORDER BY created_at DESC LIMIT 3`),
    ]);

    const flashMap = await getActiveFlashDeals();
    const tiersFor = async (rows) => {
      const ids = rows.map((r) => r.id);
      return fetchTiersForProducts(ids);
    };

    const mapProducts = (rows, tiersMap) =>
      rows.map((p) => {
        const priceInfo = resolveDisplayPrice(p, flashMap);
        const imgSrc = p.image_urls ? JSON.parse(p.image_urls)[0] || '' : '';
        return {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category_name: p.category_name || 'General',
          image_url: imgSrc,
          price: priceInfo.displayPrice,
          mrp: priceInfo.mrp,
          has_discount: priceInfo.hasDisc,
          is_flash: priceInfo.isFlash,
          primary_unit: p.primary_unit || 'Box',
          secondary_unit: p.secondary_unit || 'Piece',
          unit_conversion: Number(p.unit_conversion) || 1,
          tiers: tiersMap[p.id] || [],
          in_stock: Number(p.stock_total ?? 0) > 0,
        };
      });

    const [tiersFlash, tiersDeal, tiersBest, tiersWeek, tiersMust] = await Promise.all([
      tiersFor(flashRows), tiersFor(dealRows), tiersFor(bestRows), tiersFor(weekRows), tiersFor(mustRows),
    ]);

    res.json({
      flash_deals: mapProducts(flashRows, tiersFlash),
      deal_of_day: mapProducts(dealRows, tiersDeal),
      best_sellers: mapProducts(bestRows, tiersBest),
      product_of_week: mapProducts(weekRows, tiersWeek),
      must_buy: mapProducts(mustRows, tiersMust),
      banners,
      popups,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store home', details: error.message });
  }
});

// GET /store/categories - Category sidebar
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(`SELECT * FROM categories ORDER BY name ASC`);
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// GET /store/products?category_id=&search=&sort= - Category/product listing
router.get('/products', async (req, res) => {
  try {
    const { category_id = 0, search = '', sort = 'alpha' } = req.query;
    const params = [];
    let where = `p.visible = 1 AND p.is_active = 1`;

    if (search) {
      where += ` AND (p.name LIKE ? OR p.id = ?)`;
      params.push(`%${search}%`, search);
    }
    if (Number(category_id) > 0 || String(category_id).startsWith('cat-')) {
      where += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    let orderBy = 'p.name ASC';
    switch (sort) {
      case 'price_asc': orderBy = 'p.price ASC'; break;
      case 'price_desc': orderBy = 'p.price DESC'; break;
      case 'newest': orderBy = 'p.created_at DESC'; break;
    }

    const sql = `
      SELECT p.*, c.name AS category_name, u1.name AS primary_unit, u2.name AS secondary_unit,
             COALESCE(p.unit_conversion, 1) AS unit_conversion,
             COALESCE((SELECT SUM(stock_qty) FROM inventory i WHERE i.product_id = p.id), 0) AS stock_total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN units u1 ON p.primary_unit_id = u1.id
      LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
      WHERE ${where} ORDER BY ${orderBy} LIMIT 100
    `;

    const products = await query(sql, params);
    const flashMap = await getActiveFlashDeals();
    const tiersMap = await fetchTiersForProducts(products.map((r) => r.id));

    const result = products.map((p) => {
      const priceInfo = resolveDisplayPrice(p, flashMap);
      const imgSrc = p.image_urls ? JSON.parse(p.image_urls)[0] || '' : '';
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category_name: p.category_name || 'General',
        sku: `ANP-${Number(String(p.id).replace(/\D/g, '')) + 1000}`,
        image_url: imgSrc,
        price: priceInfo.displayPrice,
        mrp: priceInfo.mrp,
        has_discount: priceInfo.hasDisc,
        is_flash: priceInfo.isFlash,
        primary_unit: p.primary_unit || 'Box',
        secondary_unit: p.secondary_unit || 'Piece',
        unit_conversion: Number(p.unit_conversion) || 1,
        tiers: tiersMap[p.id] || [],
        in_stock: Number(p.stock_total) > 0,
        stock_total: Number(p.stock_total),
      };
    });

    res.json({ products: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// GET /store/search?q= - Live search suggestions
router.get('/search', async (req, res) => {
  try {
    const q = `%${(req.query.q || '').trim()}%`;
    if (!q) return res.json([]);
    const rows = await query(
      `SELECT id, name FROM products WHERE visible = 1 AND is_active = 1 AND name LIKE ? LIMIT 8`,
      [q]
    );
    res.json(rows);
  } catch (error) {
    res.json([]);
  }
});

// GET /store/product/:id - Product detail (specs, tiers, flash, units)
router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await queryOne(
      `SELECT p.*, c.name AS category_name, u1.name AS primary_unit, u2.name AS secondary_unit,
              COALESCE(p.unit_conversion, 1) AS unit_conversion,
              COALESCE((SELECT SUM(stock_qty) FROM inventory i WHERE i.product_id = p.id), 0) AS stock_total
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN units u1 ON p.primary_unit_id = u1.id
       LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
       WHERE p.id = ? AND p.visible = 1 AND p.is_active = 1`,
      [id]
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const flashMap = await getActiveFlashDeals();
    const tiers = await fetchTiersForProducts([id]);
    const priceInfo = resolveDisplayPrice(product, flashMap);

    const imageUrls = product.image_urls ? JSON.parse(product.image_urls) : [];
    const attributes = product.attributes ? JSON.parse(product.attributes) : {};

    res.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category_name || 'General',
        sku: `ANP-${Number(String(product.id).replace(/\D/g, '')) + 1000}`,
        image_urls: imageUrls,
        attributes,
        price: priceInfo.displayPrice,
        mrp: priceInfo.mrp,
        has_discount: priceInfo.hasDisc,
        is_flash: priceInfo.isFlash,
        save_amount: priceInfo.hasDisc ? priceInfo.mrp - priceInfo.displayPrice : 0,
        discount_pct: priceInfo.hasDisc ? Math.round(((priceInfo.mrp - priceInfo.displayPrice) / priceInfo.mrp) * 100) : 0,
        primary_unit: product.primary_unit || 'Box',
        secondary_unit: product.secondary_unit || 'Piece',
        unit_conversion: Number(product.unit_conversion) || 1,
        tiers: tiers[id] || [],
        in_stock: Number(product.stock_total) > 0,
        stock_total: Number(product.stock_total),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

// GET /store/units - Units of measurement
router.get('/units', async (req, res) => {
  try {
    const units = await query(`SELECT * FROM units ORDER BY name ASC`);
    res.json({ units });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch units', details: error.message });
  }
});

// GET /store/offers - Active coupons
router.get('/offers', async (req, res) => {
  try {
    const coupons = await query(
      `SELECT c.*, cat.name AS category_name, p.name AS product_name
       FROM coupons c
       LEFT JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN products p ON c.product_id = p.id
       WHERE c.is_active = 1 AND c.expiry_date >= datetime('now')
       ORDER BY c.created_at DESC`
    );
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers', details: error.message });
  }
});

// POST /store/delivery/calculate - Calculate delivery charge
router.post('/delivery/calculate', async (req, res) => {
  try {
    const { items } = req.body; // [{product_id, quantity, price_each}]
    if (!Array.isArray(items) || !items.length) {
      return res.json({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0 });
    }

    const excludedProducts = (await query(`SELECT product_id FROM excluded_products_delivery WHERE exclude_from_delivery_calc = 1`)).map((r) => r.product_id);
    const excludedCategories = (await query(`SELECT category_id FROM excluded_categories_delivery WHERE exclude_from_delivery_calc = 1`)).map((r) => r.category_id);

    let subtotal_for_delivery = 0;
    let excluded_value = 0;

    for (const item of items) {
      const itemTotal = Number(item.quantity) * Number(item.price_each);
      if (excludedProducts.includes(item.product_id)) {
        excluded_value += itemTotal;
        continue;
      }
      const prod = await queryOne(`SELECT category_id FROM products WHERE id = ?`, [item.product_id]);
      if (prod && excludedCategories.includes(prod.category_id)) {
        excluded_value += itemTotal;
        continue;
      }
      subtotal_for_delivery += itemTotal;
    }

    const rule = await queryOne(
      `SELECT * FROM delivery_charge_rules
       WHERE is_active = 1 AND min_order_value <= ? AND (max_order_value IS NULL OR max_order_value >= ?)
       ORDER BY priority ASC LIMIT 1`,
      [subtotal_for_delivery, subtotal_for_delivery]
    );

    const delivery_charge = rule ? Number(rule.delivery_charge) : 0;
    res.json({ delivery_charge, subtotal_for_delivery, excluded_value, rule_id: rule ? rule.id : null });
  } catch (error) {
    res.json({ delivery_charge: 0, subtotal_for_delivery: 0, excluded_value: 0 });
  }
});

// GET /store/addresses - Saved delivery address for logged-in user
router.get('/addresses', authenticate, async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, address, city, state, postal_code, country, latitude, longitude
       FROM user_details WHERE user_id = ? ORDER BY location_captured_at DESC LIMIT 5`,
      [req.user.id]
    );
    const addresses = rows.map((r) => {
      const parts = [r.address, r.city, r.state, r.postal_code ? `- ${r.postal_code}` : null, r.country].filter(Boolean);
      return {
        id: r.id,
        address: parts.join(', '),
        city: r.city,
        state: r.state,
        postal_code: r.postal_code,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
      };
    });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch addresses', details: error.message });
  }
});

// POST /store/coupon/validate - Validate & apply coupon (4 scopes)
router.post('/coupon/validate', authenticate, async (req, res) => {
  try {
    const { code, line_items, subtotal_total } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    // Build lookup of line_sub if not supplied (compute from quantity * unit price)
    const lineItems = (line_items || []).map((li) => ({
      ...li,
      line_sub: Number(li.line_sub) || (Number(li.quantity) * (Number(li.price_each) || Number(li.unit_price) || 0)),
    }));

    const coupon = await queryOne(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expiry_date >= datetime('now')`,
      [code.toUpperCase()]
    );

    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon code' });

    const scope = coupon.scope || 'sitewide';
    const target_cat = coupon.category_id;
    const target_pid = coupon.product_id;
    const min_total = coupon.min_order_value;

    let eligible = false;
    let reason = '';

    if (scope === 'sitewide') eligible = true;
    else if (scope === 'item') {
      eligible = lineItems.some((li) => String(li.product_id) === String(target_pid) && Number(li.quantity) > 0);
      if (!eligible) reason = 'This code applies only to a specific product.';
    } else if (scope === 'category') {
      eligible = lineItems.some((li) => String(li.category_id) === String(target_cat) && Number(li.quantity) > 0);
      if (!eligible) reason = 'This code applies only to a specific category.';
    } else if (scope === 'grand_total') {
      if (min_total !== null && subtotal_total >= Number(min_total)) eligible = true;
      else reason = `Requires cart ≥ ₹${Number(min_total).toFixed(2)}.`;
    }

    if (!eligible) return res.json({ valid: false, reason });

    // Calculate discount amount
    const dval = Number(coupon.discount_pct);
    const dType = 'percentage';
    let eligible_amount = subtotal_total;

    if (scope === 'category') {
      eligible_amount = lineItems
        .filter((li) => String(li.category_id) === String(target_cat))
        .reduce((s, li) => s + Number(li.line_sub), 0);
    } else if (scope === 'item') {
      eligible_amount = lineItems
        .filter((li) => String(li.product_id) === String(target_pid))
        .reduce((s, li) => s + Number(li.line_sub), 0);
    }

    const discount_amount = Math.min((dval / 100) * eligible_amount, coupon.max_discount_amount || Infinity);

    res.json({
      valid: true,
      code: coupon.code,
      scope,
      discount_type: dType,
      discount_value: dval,
      discount_amount,
      max_discount_amount: coupon.max_discount_amount,
      message: 'Coupon applied successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate coupon', details: error.message });
  }
});

export default router;

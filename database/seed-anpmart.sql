-- ============================================================================
-- ANP MART - Seed Data for Wholesale/B2B Features
-- Run AFTER schema.sql and seed.sql
-- ============================================================================

-- 1. Seed Units of Measurement
INSERT OR REPLACE INTO units (id, name, symbol) VALUES
('unit-box', 'Box', 'box'),
('unit-piece', 'Piece', 'pcs'),
('unit-kg', 'Kilogram', 'kg'),
('unit-liter', 'Liter', 'L'),
('unit-pack', 'Pack', 'pack'),
('unit-carton', 'Carton', 'ctn'),
('unit-dozen', 'Dozen', 'dz'),
('unit-gram', 'Gram', 'g');

-- 2. Update Products with Units, Flags & Brand visibility
-- Wire unit relationships and deal flags onto existing products
UPDATE products SET
  primary_unit_id = 'unit-box',
  secondary_unit_id = 'unit-piece',
  unit_conversion = 12,
  visible = 1
WHERE category_id IN ('cat-home', 'cat-appliances');

UPDATE products SET
  primary_unit_id = 'unit-box',
  secondary_unit_id = 'unit-piece',
  unit_conversion = 6,
  visible = 1
WHERE category_id IN ('cat-beauty', 'cat-fashion');

UPDATE products SET
  primary_unit_id = 'unit-box',
  secondary_unit_id = 'unit-piece',
  unit_conversion = 1,
  visible = 1
WHERE category_id IN ('cat-mobiles', 'cat-laptops', 'cat-audio', 'cat-watches');

-- Product flags: Deal of Day, Best Seller, Product of Week, Must Buy
UPDATE products SET is_deal_of_day = 1, deal_start = datetime('now', '-1 day'), deal_end = datetime('now', '+3 days') WHERE id IN ('p-01', 'p-11', 'p-26', 'p-35');
UPDATE products SET is_best_seller = 1 WHERE id IN ('p-13', 'p-21', 'p-28', 'p-31', 'p-36');
UPDATE products SET is_product_of_week = 1 WHERE id IN ('p-06', 'p-18', 'p-30', 'p-38');
UPDATE products SET is_must_buy = 1 WHERE id IN ('p-04', 'p-08', 'p-22', 'p-34');

-- 3. Product Tier Pricing (Bulk Discounts)
INSERT OR REPLACE INTO product_tier_pricing (id, product_id, min_quantity, discount_type, discount_value) VALUES
('tier-01', 'p-01', 5, 'percentage', 5),
('tier-02', 'p-01', 10, 'percentage', 10),
('tier-03', 'p-01', 25, 'percentage', 15),
('tier-04', 'p-11', 5, 'amount', 500),
('tier-05', 'p-11', 10, 'amount', 1200),
('tier-06', 'p-13', 10, 'percentage', 8),
('tier-07', 'p-13', 25, 'percentage', 12),
('tier-08', 'p-26', 3, 'percentage', 7),
('tier-09', 'p-26', 6, 'percentage', 12),
('tier-10', 'p-28', 2, 'amount', 1000),
('tier-11', 'p-35', 4, 'percentage', 10),
('tier-12', 'p-35', 10, 'percentage', 18),
('tier-13', 'p-31', 3, 'amount', 2000),
('tier-14', 'p-21', 5, 'percentage', 6),
('tier-15', 'p-36', 2, 'percentage', 5);

-- 4. Flash Deals (Time-based Special Prices)
INSERT OR REPLACE INTO flash_deals (id, product_id, flash_price, flash_start, flash_end, status) VALUES
('flash-01', 'p-01', 124900, datetime('now', '-2 hours'), datetime('now', '+6 hours'), 1),
('flash-02', 'p-11', 19990, datetime('now', '-1 hour'), datetime('now', '+8 hours'), 1),
('flash-03', 'p-26', 11999, datetime('now', '-3 hours'), datetime('now', '+4 hours'), 1),
('flash-04', 'p-35', 9999, datetime('now', '-30 minutes'), datetime('now', '+10 hours'), 1),
('flash-05', 'p-13', 17990, datetime('now', '+1 day'), datetime('now', '+2 days'), 0);

-- 5. Delivery Charge Rules
INSERT OR REPLACE INTO delivery_charge_rules (id, name, min_order_value, max_order_value, delivery_charge, priority, is_active) VALUES
('dlv-01', 'Under 250', 0, 249.99, 49, 1, 1),
('dlv-02', '250 to 500', 250, 499.99, 29, 2, 1),
('dlv-03', 'Above 500 - Free', 500, NULL, 0, 3, 1);

-- 6. Excluded Products/Categories from Delivery Calc
-- Some products ship free regardless of order value
INSERT OR REPLACE INTO excluded_products_delivery (product_id, exclude_from_delivery_calc) VALUES
('p-06', 1),
('p-31', 1);

-- 7. Popups (Homepage Marketing)
INSERT OR REPLACE INTO popups (id, title, message, image_url, button_text, button_link, active, start_date, end_date, per_session, dismissible) VALUES
('pop-01', 'Festive Sale Live! 🎉', 'Grab up to 50% OFF on daily essentials. Limited period offer!', 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800', 'Shop Now', 'category.php', 1, datetime('now', '-1 day'), datetime('now', '+7 days'), 1, 1),
('pop-02', 'Bulk Pricing Available 📦', 'Wholesale rates on bulk orders. Save more when you buy more!', NULL, 'Explore', 'category.php', 1, NULL, NULL, 0, 1);

-- 8. Seed Salesman Accounts
-- Passwords: salesman123 (bcrypt hash same pattern as seed users)
INSERT OR REPLACE INTO salesman_accounts (id, employee_id, name, email, phone, password_hash, is_active) VALUES
('slm-001', 'SAL01', 'Ravi Kumar', 'ravi@anpmart.com', '9740123456', '$2a$10$26g2ARrWEIiUnm.amVO9KOr9B6jxPAB/BgqYE7UZoUWq97ziIiCo6', 1),
('slm-002', 'SAL02', 'Sunita Patil', 'sunita@anpmart.com', '9740654321', '$2a$10$VuQ2RqlsOwPUJCNphHWSRumRaE5JnQdG2PotNPR5FG6/fQNLAnqcm', 1);

-- 9. Salesman Beats (Weekly Routes)
INSERT OR REPLACE INTO salesman_beats (id, salesman_id, beat_name, area, day_of_week, is_active) VALUES
('beat-001', 'slm-001', 'Kittur Central', 'Kittur, Belagavi', 'Monday', 1),
('beat-002', 'slm-001', 'Market Road', 'Market Road, Kittur', 'Wednesday', 1),
('beat-003', 'slm-001', 'Gururwar Peth', 'Gururwar Peth', 'Friday', 1),
('beat-004', 'slm-002', 'Dharwad East', 'Dharwad East', 'Tuesday', 1),
('beat-005', 'slm-002', 'Hubli Hub', 'Hubli Central', 'Thursday', 1);

-- 10. Salesman Beat Customers (assign existing customers to beats)
INSERT OR REPLACE INTO salesman_beat_customers (id, beat_id, customer_id) VALUES
('sbc-001', 'beat-001', 'usr-cust-01'),
('sbc-002', 'beat-002', 'usr-cust-02');

-- 11. Salesman Customers (direct assignment)
INSERT OR REPLACE INTO salesman_customers (id, salesman_id, customer_id, customer_name, customer_phone, customer_email, assigned_date, status) VALUES
('sc-001', 'slm-001', 'usr-cust-01', 'Praveen Kumar', '+91 9811223344', 'customer1@shopkart.com', datetime('now', '-10 days'), 'active'),
('sc-002', 'slm-002', 'usr-cust-02', 'Ananya Sharma', '+91 9822334455', 'customer2@shopkart.com', datetime('now', '-5 days'), 'active');

-- 12. Salesman Targets (Monthly)
INSERT OR REPLACE INTO salesman_targets (id, salesman_id, target_month, target_year, target_amount, target_orders) VALUES
('tgt-001', 'slm-001', 8, 2026, 150000, 60),
('tgt-002', 'slm-002', 8, 2026, 120000, 45);

-- 13. Sample Salesman Orders
INSERT OR REPLACE INTO salesman_orders (id, salesman_id, customer_id, order_date, total_amount, status) VALUES
('so-001', 'slm-001', 'usr-cust-01', datetime('now', '-1 day'), 4250, 'completed'),
('so-002', 'slm-001', 'usr-cust-01', datetime('now', '-3 days'), 1890, 'completed');

-- 14. Sample Salesman Attendance
INSERT OR REPLACE INTO salesman_attendance (id, salesman_id, attendance_date, punch_in_time, punch_out_time, punch_in_lat, punch_in_lng, punch_out_lat, punch_out_lng) VALUES
('att-001', 'slm-001', date('now'), datetime('now', '-6 hours'), datetime('now', '-1 hour'), 15.60, 74.10, 15.61, 74.11);

-- 15. Salesman Notifications
INSERT OR REPLACE INTO salesman_notifications (id, salesman_id, title, message, is_read, created_at) VALUES
('sn-001', 'slm-001', 'New Target Assigned', 'Your August target has been set to ₹1,50,000.', 0, datetime('now', '-1 day'));

-- 16. Extended Coupons (4-scope system)
INSERT OR REPLACE INTO coupons (id, code, discount_pct, min_order_value, max_discount_amount, expiry_date, usage_limit, times_used, is_active, scope, category_id, product_id) VALUES
('cp-10', 'GROCERY10', 10, 499, 500, '2027-12-31 23:59:59', 5000, 12, 1, 'category', 'cat-home', NULL),
('cp-11', 'PHONE5', 5, 9999, 3000, '2027-12-31 23:59:59', 1000, 3, 1, 'item', NULL, 'p-01'),
('cp-12', 'MEGA15', 15, 2999, 5000, '2027-12-31 23:59:59', 2000, 0, 1, 'grand_total', NULL, NULL);

-- 17. User Details (extended profile with GPS)
INSERT OR REPLACE INTO user_details (id, user_id, address, city, state, postal_code, country, latitude, longitude, location_captured_at) VALUES
('ud-001', 'usr-cust-01', 'Flat 402, Royal Palms, Outer Ring Road', 'Bengaluru', 'Karnataka', '560103', 'India', 12.9716, 77.5946, datetime('now', '-2 days')),
('ud-002', 'usr-cust-02', 'B-12/4, Vasant Vihar', 'New Delhi', 'Delhi', '110057', 'India', 28.6139, 77.2090, datetime('now', '-1 day'));

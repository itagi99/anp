-- ============================================================================
-- ShopKart - Edge E-Commerce Database Schema (Turso / libSQL / SQLite)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin', 'warehouse_manager')),
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- 3. Categories (Supports infinite nesting via parent_id)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_emoji TEXT,
    parent_id TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 4. Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 50000,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);

-- 5. Products
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    mrp REAL NOT NULL CHECK(mrp >= price),
    discount_pct INTEGER GENERATED ALWAYS AS (ROUND(((mrp - price) / mrp) * 100)) VIRTUAL,
    rating REAL DEFAULT 5.0 CHECK(rating >= 0 AND rating <= 5.0),
    review_count INTEGER DEFAULT 0,
    image_urls TEXT NOT NULL DEFAULT '[]', -- JSON Array of URLs
    attributes TEXT NOT NULL DEFAULT '{}',  -- JSON Key-Value specs
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- ANP MART Extensions
    primary_unit_id TEXT,
    secondary_unit_id TEXT,
    unit_conversion REAL DEFAULT 1 CHECK(unit_conversion > 0),
    is_deal_of_day INTEGER DEFAULT 0,
    is_best_seller INTEGER DEFAULT 0,
    is_product_of_week INTEGER DEFAULT 0,
    is_must_buy INTEGER DEFAULT 0,
    deal_start DATETIME,
    deal_end DATETIME,
    visible INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (primary_unit_id) REFERENCES units(id),
    FOREIGN KEY (secondary_unit_id) REFERENCES units(id)
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 6. Inventory (Per Product, Per Warehouse)
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    stock_qty INTEGER NOT NULL DEFAULT 0 CHECK(stock_qty >= 0),
    reserved_qty INTEGER NOT NULL DEFAULT 0 CHECK(reserved_qty >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    UNIQUE(product_id, warehouse_id)
);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);

-- 7. Inventory Audit Logs
CREATE TABLE IF NOT EXISTS inventory_logs (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    change_qty INTEGER NOT NULL,
    new_stock_qty INTEGER NOT NULL,
    reason TEXT NOT NULL, -- 'ORDER_PLACED', 'ORDER_CANCELLED', 'RESTOCK', 'MANUAL_ADJUSTMENT', 'RETURN'
    actor TEXT NOT NULL,  -- user_id or 'SYSTEM'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON inventory_logs(product_id);

-- 8. Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

-- 9. Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_pct INTEGER NOT NULL CHECK(discount_pct > 0 AND discount_pct <= 100),
    min_order_value REAL DEFAULT 0,
    max_discount_amount REAL,
    expiry_date DATETIME NOT NULL,
    usage_limit INTEGER DEFAULT 1000,
    times_used INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    -- ANP MART: 4-scope coupon system
    scope TEXT NOT NULL DEFAULT 'sitewide' CHECK(scope IN ('sitewide','category','item','grand_total')),
    category_id TEXT,
    product_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 10. Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PLACED' CHECK(status IN ('PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED')),
    subtotal REAL NOT NULL,
    discount REAL NOT NULL DEFAULT 0,
    delivery_fee REAL NOT NULL DEFAULT 0,
    delivery_charge REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    address_id TEXT,
    delivery_address TEXT,
    coupon_id TEXT,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('COD', 'UPI', 'CARD', 'NETBANKING')),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 11. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 12. Payments
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    amount REAL NOT NULL,
    method TEXT NOT NULL,
    transaction_ref TEXT,
    status TEXT NOT NULL DEFAULT 'SUCCESS' CHECK(status IN ('SUCCESS', 'PENDING', 'FAILED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

-- 13. Returns
CREATE TABLE IF NOT EXISTS returns (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    order_item_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK(status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'REFUNDED')),
    refund_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

-- 14. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- 15. Banners
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    action_type TEXT NOT NULL DEFAULT 'category', -- 'category', 'product', 'deal'
    action_value TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 16. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- NULL for broadcast / admin notifications
    type TEXT NOT NULL, -- 'ORDER_UPDATE', 'LOW_STOCK', 'PRICE_DROP', 'PROMOTION'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================================================
-- ANP MART Extensions - Wholesale/B2B Features
-- ============================================================================

-- 17. Units of Measurement
CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,           -- 'Box', 'Piece', 'Kg', 'Liter', 'Pack'
    symbol TEXT NOT NULL,                -- 'box', 'pcs', 'kg', 'L', 'pack'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. Product Tier Pricing (Bulk Discounts)
CREATE TABLE IF NOT EXISTS product_tier_pricing (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    min_quantity INTEGER NOT NULL CHECK(min_quantity > 0),
    discount_type TEXT NOT NULL CHECK(discount_type IN ('amount', 'percentage')),
    discount_value REAL NOT NULL CHECK(discount_value > 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tier_pricing_product ON product_tier_pricing(product_id);

-- 19. Flash Deals (Time-based Special Prices)
CREATE TABLE IF NOT EXISTS flash_deals (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL UNIQUE,
    flash_price REAL NOT NULL CHECK(flash_price >= 0),
    flash_start DATETIME NOT NULL,
    flash_end DATETIME NOT NULL,
    status INTEGER DEFAULT 1 CHECK(status IN (0,1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_flash_deals_active ON flash_deals(status, flash_start, flash_end);

-- 20. Delivery Charge Rules
CREATE TABLE IF NOT EXISTS delivery_charge_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    min_order_value REAL NOT NULL DEFAULT 0,
    max_order_value REAL,                -- NULL = no upper limit
    delivery_charge REAL NOT NULL DEFAULT 0,
    priority INTEGER DEFAULT 10,         -- Lower = higher priority
    is_active INTEGER DEFAULT 1 CHECK(is_active IN (0,1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. Excluded Products from Delivery Calculation
CREATE TABLE IF NOT EXISTS excluded_products_delivery (
    product_id TEXT PRIMARY KEY,
    exclude_from_delivery_calc INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 22. Excluded Categories from Delivery Calculation
CREATE TABLE IF NOT EXISTS excluded_categories_delivery (
    category_id TEXT PRIMARY KEY,
    exclude_from_delivery_calc INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 23. Order Delivery Details (Audit)
CREATE TABLE IF NOT EXISTS order_delivery_details (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    subtotal_for_delivery REAL NOT NULL,
    excluded_products_value REAL NOT NULL DEFAULT 0,
    delivery_charge_applied REAL NOT NULL DEFAULT 0,
    rule_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES delivery_charge_rules(id) ON DELETE SET NULL
);

-- 24. Popups (Homepage Marketing)
CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    active INTEGER DEFAULT 1,
    start_date DATETIME,
    end_date DATETIME,
    per_session INTEGER DEFAULT 0,
    dismissible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 25. Salesman Accounts
CREATE TABLE IF NOT EXISTS salesman_accounts (
    id TEXT PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,    -- 'SAL01', 'SAL02'
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 26. Salesman Beats (Daily Routes)
CREATE TABLE IF NOT EXISTS salesman_beats (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    beat_name TEXT NOT NULL,
    area TEXT,
    day_of_week TEXT NOT NULL CHECK(day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_salesman_beats_salesman ON salesman_beats(salesman_id);
CREATE INDEX IF NOT EXISTS idx_salesman_beats_day ON salesman_beats(day_of_week);

-- 27. Salesman Beat Customers (Customer assignments to beats)
CREATE TABLE IF NOT EXISTS salesman_beat_customers (
    id TEXT PRIMARY KEY,
    beat_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,           -- references users(id)
    FOREIGN KEY (beat_id) REFERENCES salesman_beats(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(beat_id, customer_id)
);
CREATE INDEX IF NOT EXISTS idx_beat_customers_beat ON salesman_beat_customers(beat_id);
CREATE INDEX IF NOT EXISTS idx_beat_customers_customer ON salesman_beat_customers(customer_id);

-- 28. Salesman Customers (Direct assignments)
CREATE TABLE IF NOT EXISTS salesman_customers (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,           -- references users(id)
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive')),
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(salesman_id, customer_id)
);
CREATE INDEX IF NOT EXISTS idx_salesman_customers_salesman ON salesman_customers(salesman_id);

-- 29. Salesman Orders (Orders taken by salesmen)
CREATE TABLE IF NOT EXISTS salesman_orders (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_salesman_orders_salesman ON salesman_orders(salesman_id);
CREATE INDEX IF NOT EXISTS idx_salesman_orders_customer ON salesman_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_salesman_orders_date ON salesman_orders(order_date);

-- 30. Salesman Attendance (GPS Punch In/Out)
CREATE TABLE IF NOT EXISTS salesman_attendance (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    attendance_date DATE NOT NULL,
    punch_in_time DATETIME,
    punch_out_time DATETIME,
    punch_in_lat REAL, punch_in_lng REAL,
    punch_out_lat REAL, punch_out_lng REAL,
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE,
    UNIQUE(salesman_id, attendance_date)
);
CREATE INDEX IF NOT EXISTS idx_salesman_attendance_salesman ON salesman_attendance(salesman_id);

-- 31. Salesman Targets (Monthly Goals)
CREATE TABLE IF NOT EXISTS salesman_targets (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    target_month INTEGER NOT NULL CHECK(target_month BETWEEN 1 AND 12),
    target_year INTEGER NOT NULL,
    target_amount REAL NOT NULL,
    target_orders INTEGER DEFAULT 0,
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE,
    UNIQUE(salesman_id, target_month, target_year)
);
CREATE INDEX IF NOT EXISTS idx_salesman_targets_salesman ON salesman_targets(salesman_id);

-- 32. Salesman Notifications
CREATE TABLE IF NOT EXISTS salesman_notifications (
    id TEXT PRIMARY KEY,
    salesman_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salesman_id) REFERENCES salesman_accounts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_salesman_notifications_salesman ON salesman_notifications(salesman_id);

-- 33. User Details (Extended profile with GPS)
CREATE TABLE IF NOT EXISTS user_details (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'India',
    latitude REAL,
    longitude REAL,
    location_captured_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_details_user ON user_details(user_id);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '../../../byte.sql');

export function convert(raw) {
  let s = raw;
  // strip MariaDB/MySQL comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/^--.*$/gm, '');
  s = s.replace(/`/g, '');
  // protect SQL functions that contain type words (use placeholders)
  s = s.replace(/current_timestamp\(\)/gi, '@@CTS@@');
  s = s.replace(/current_date\(\)/gi, '@@CDS@@');
  s = s.replace(/current_time\(\)/gi, '@@CTMS@@');
  // type conversions
  s = s.replace(/int\(\d+\)\s+unsigned/gi, 'INTEGER');
  s = s.replace(/bigint\(\d+\)/gi, 'INTEGER');
  s = s.replace(/tinyint\(\d+\)/gi, 'INTEGER');
  s = s.replace(/smallint\(\d+\)/gi, 'INTEGER');
  s = s.replace(/mediumint\(\d+\)/gi, 'INTEGER');
  s = s.replace(/int\(\d+\)/gi, 'INTEGER');
  s = s.replace(/varchar\(\d+\)/gi, 'TEXT');
  s = s.replace(/char\(\d+\)/gi, 'TEXT');
  s = s.replace(/longtext/gi, 'TEXT');
  s = s.replace(/mediumtext/gi, 'TEXT');
  s = s.replace(/\btext\b/gi, 'TEXT');
  s = s.replace(/datetime/gi, 'TEXT');
  s = s.replace(/timestamp/gi, 'TEXT');
  s = s.replace(/\bdate\b/gi, 'TEXT');
  s = s.replace(/\btime\b/gi, 'TEXT');
  s = s.replace(/decimal\(\s*\d+\s*,\s*\d+\s*\)/gi, 'REAL');
  s = s.replace(/float/gi, 'REAL');
  s = s.replace(/double/gi, 'REAL');
  s = s.replace(/json/gi, 'TEXT');
  s = s.replace(/enum\([^)]*\)/gi, 'TEXT');
  s = s.replace(/AUTO_INCREMENT(?:\s*=\s*\d+)?/gi, '');
  s = s.replace(/COLLATE\s+[a-zA-Z0-9_]+/gi, '');
  s = s.replace(/CHARACTER SET\s+[a-zA-Z0-9_]+/gi, '');
  s = s.replace(/DEFAULT\s+current_timestamp\(\)/gi, 'DEFAULT CURRENT_TIMESTAMP');
  s = s.replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '');
  // drop index/constraint/comment lines inside CREATE TABLE
  s = s.replace(/,\s*(UNIQUE KEY|KEY|FULLTEXT KEY|SPATIAL KEY)[^\n;]*\([^)]*\)/gi, '');
  s = s.replace(/,\s*CONSTRAINT[^\n;]*/gi, '');
  s = s.replace(/,\s*[^\n;]*\bFOREIGN KEY\b[^\n;]*/gi, '');
  s = s.replace(/ON DELETE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION)/gi, '');
  s = s.replace(/ON UPDATE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION)/gi, '');
  s = s.replace(/ON DELETE[^\n,;]*/gi, '');
  s = s.replace(/ON UPDATE[^\n,;]*/gi, '');
  s = s.replace(/COMMENT\s+'[^']*'/gi, '');
  s = s.replace(/,\s*PRIMARY KEY\s*\([^)]*\)/gi, '');
  s = s.replace(/ENGINE\s*=\s*[A-Za-z0-9_]+\s*/gi, '');
  s = s.replace(/DEFAULT CHARSET[^\n;]*/gi, '');
  s = s.replace(/ROW_FORMAT[^\n;]*/gi, '');
  s = s.replace(/,\s*\)/g, ')');
  // drop any leftover foreign-key / references lines (SQLite parses them poorly)
  s = s.split('\n').map((l) => (/FOREIGN KEY|REFERENCES/.test(l) ? '' : l)).join('\n');
  // restore protected function placeholders
  s = s.replace(/@@CTS@@/gi, 'CURRENT_TIMESTAMP');
  s = s.replace(/@@CDS@@/gi, 'CURRENT_DATE');
  s = s.replace(/@@CTMS@@/gi, 'CURRENT_TIME');
  return s;
}

export function parseTuples(str) {
  const rows = [];
  let i = 0;
  const n = str.length;
  while (i < n && str[i] !== '(') i++;
  while (i < n) {
    if (str[i] !== '(') { i++; continue; }
    i++;
    const row = [];
    while (i < n) {
      while (i < n && /\s/.test(str[i])) i++;
      if (str[i] === ')') { i++; break; }
      if (str[i] === "'") {
        i++;
        let val = '';
        while (i < n) {
          if (str[i] === '\\' && str[i + 1] === "'") { val += "'"; i += 2; continue; }
          if (str[i] === "'" && str[i + 1] === "'") { val += "'"; i += 2; continue; }
          if (str[i] === "'") { i++; break; }
          val += str[i]; i++;
        }
        row.push(val);
      } else if (str[i] === 'N' && str.substr(i, 4).toUpperCase() === 'NULL') {
        row.push(null); i += 4;
      } else {
        let val = '';
        while (i < n && str[i] !== ',' && str[i] !== ')') { val += str[i]; i++; }
        const t = val.trim();
        if (t === '') row.push(null);
        else if (/^-?\d+(\.\d+)?$/.test(t)) row.push(Number(t));
        else row.push(t);
      }
      while (i < n && /\s/.test(str[i])) i++;
      if (str[i] === ',') { i++; continue; }
      if (str[i] === ')') { i++; break; }
    }
    rows.push(row);
    while (i < n && /\s/.test(str[i])) i++;
    if (str[i] === ',') { i++; continue; }
    break;
  }
  return rows;
}

async function run() {
  const raw = fs.readFileSync(FILE, 'utf8');
  const converted = convert(raw) + '\n';
  const stmts = converted
    .split(/;\s*\n/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .filter((x) => /^(CREATE TABLE|INSERT INTO|DROP TABLE)/i.test(x));

  await db.execute('PRAGMA foreign_keys=OFF');

  let created = 0;
  let inserted = 0;
  let errors = 0;
  for (const st of stmts) {
    try {
      if (/^DROP TABLE/i.test(st)) {
        await db.execute(st);
      } else if (/^CREATE TABLE/i.test(st)) {
        await db.execute(st);
        created++;
      } else if (/^INSERT INTO/i.test(st)) {
        const m = st.match(/^INSERT INTO\s+`?(\w+)`?\s+VALUES\s*([\s\S]*)$/i);
        if (!m) { await db.execute(st); inserted++; continue; }
        const table = m[1];
        const rows = parseTuples(m[2]);
        for (const row of rows) {
          const placeholders = row.map(() => '?').join(',');
          await db.execute(
            `INSERT INTO ${table} VALUES (${placeholders})`,
            row
          );
          inserted++;
        }
      }
    } catch (e) {
      errors++;
      if (errors <= 30) console.error('ERR:', st.slice(0, 80), '->', e.message);
    }
  }
  console.log(`DONE: created=${created} inserted=${inserted} errors=${errors}`);
  await augment();
}

// Add the columns/tables our application expects on top of the legacy byte.sql schema
// so the app runs unchanged against the real production data.
async function augment() {
  const run = async (sql) => {
    try { await db.execute(sql); } catch (e) { /* idempotent / best-effort */ }
  };

  // Tables the app needs that byte.sql does not have
  await run(`CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run(`INSERT OR IGNORE INTO warehouses (id, name) VALUES ('wh-1','Main Warehouse')`);

  await run(`CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY, product_id TEXT, warehouse_id TEXT,
    stock_qty INTEGER NOT NULL DEFAULT 0, low_stock_threshold INTEGER NOT NULL DEFAULT 0, updated_at TEXT)`);

  await run(`CREATE TABLE IF NOT EXISTS inventory_logs (
    id TEXT PRIMARY KEY, product_id TEXT, warehouse_id TEXT, change_qty INTEGER,
    new_stock_qty INTEGER, reason TEXT, actor TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);

  await run(`CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY, user_id TEXT, full_name TEXT, phone TEXT, street_address TEXT,
    city TEXT, state TEXT, postal_code TEXT, country TEXT DEFAULT 'India',
    latitude REAL, longitude REAL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);

  await run(`CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY, user_id TEXT, product_id TEXT, quantity INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);

  // order_delivery_details in byte.sql has NOT NULL rule_id/created_at; recreate nullable
  await run(`DROP TABLE IF EXISTS order_delivery_details`);
  await run(`CREATE TABLE order_delivery_details (
    id TEXT, order_id TEXT, subtotal_for_delivery REAL, excluded_products_value REAL,
    delivery_charge_applied REAL, rule_id TEXT, created_at TEXT)`);

  // Missing columns on byte.sql tables
  await run(`ALTER TABLE products ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`);
  await run(`ALTER TABLE products ADD COLUMN image_urls TEXT`);
  await run(`UPDATE products SET image_urls = json_array(image_path) WHERE image_path IS NOT NULL AND image_urls IS NULL`);

  await run(`ALTER TABLE banners ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`);
  await run(`ALTER TABLE banners ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0`);

  await run(`ALTER TABLE coupons ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`);
  await run(`ALTER TABLE coupons ADD COLUMN discount_pct REAL`);
  await run(`UPDATE coupons SET discount_pct = COALESCE(discount_percent, discount_value) WHERE discount_pct IS NULL`);
  await run(`ALTER TABLE coupons ADD COLUMN min_order_value REAL`);
  await run(`UPDATE coupons SET min_order_value = min_cart_total WHERE min_order_value IS NULL`);
  await run(`ALTER TABLE coupons ADD COLUMN max_discount_amount REAL`);
  await run(`ALTER TABLE coupons ADD COLUMN usage_limit INTEGER NOT NULL DEFAULT 0`);
  await run(`ALTER TABLE coupons ADD COLUMN times_used INTEGER NOT NULL DEFAULT 0`);

  await run(`ALTER TABLE units ADD COLUMN symbol TEXT NOT NULL DEFAULT ''`);

  await run(`ALTER TABLE salesman_accounts ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`);
  await run(`UPDATE salesman_accounts SET is_active = CASE WHEN status = 'active' THEN 1 ELSE 0 END WHERE is_active = 1`);

  await run(`ALTER TABLE orders ADD COLUMN subtotal REAL`);
  await run(`ALTER TABLE orders ADD COLUMN discount REAL`);
  await run(`ALTER TABLE orders ADD COLUMN delivery_fee REAL`);
  await run(`ALTER TABLE orders ADD COLUMN coupon_id TEXT`);
  await run(`ALTER TABLE orders ADD COLUMN payment_status TEXT`);
  await run(`ALTER TABLE orders ADD COLUMN address_id TEXT`);
  await run(`ALTER TABLE orders ADD COLUMN total REAL`);
  await run(`ALTER TABLE orders ADD COLUMN created_at TEXT`);
  await run(`UPDATE orders SET created_at = order_date WHERE created_at IS NULL`);

  await run(`ALTER TABLE order_items ADD COLUMN warehouse_id TEXT`);
  await run(`ALTER TABLE order_items ADD COLUMN unit_price REAL`);
  await run(`ALTER TABLE order_items ADD COLUMN total_price REAL`);

  // Populate inventory from products.stock (single default warehouse)
  await run(`INSERT INTO inventory (id, product_id, warehouse_id, stock_qty)
    SELECT 'inv-' || id, id, 'wh-1', COALESCE(stock, 0)
    FROM products WHERE id NOT IN (SELECT product_id FROM inventory)`);

  console.log('AUGMENT: done');
}

run().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});

import bcrypt from 'bcryptjs';
import { query, queryOne } from '../db.js';

// Usage: node server/src/scripts/createAdmin.js [email] [password] [name]
const email = (process.argv[2] || 'admin@anpmart.com').toLowerCase();
const password = process.argv[3] || 'admin123';
const name = process.argv[4] || 'ANP Admin';

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);

  if (existing) {
    await query(
      `UPDATE users SET password_hash = ?, role = 'admin', name = ?, updated_at = datetime('now') WHERE email = ?`,
      [password_hash, name, email]
    );
    console.log(`Updated admin: ${email}`);
  } else {
    const id = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO users (id, name, email, password_hash, role, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'admin', NULL, datetime('now'), datetime('now'))`,
      [id, name, email, password_hash]
    );
    console.log(`Created admin: ${email} (id=${id})`);
  }
  console.log(`Credentials -> email: ${email}  password: ${password}`);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });

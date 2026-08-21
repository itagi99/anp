import bcrypt from 'bcryptjs';
import { query, queryOne } from '../db.js';

// Usage: node server/src/scripts/createSalesman.js [employee_id] [email] [password] [name]
const employee_id = process.argv[2] || 'SA01';
const email = (process.argv[3] || 'sales@anpmart.com').toLowerCase();
const password = process.argv[4] || 'salesman123';
const name = process.argv[5] || 'ANP Sales';

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const existing = await queryOne('SELECT id FROM salesman_accounts WHERE employee_id = ?', [employee_id]);
  if (existing) {
    await query(
      `UPDATE salesman_accounts SET password_hash = ?, is_active = 1, status = 'active', updated_at = datetime('now') WHERE employee_id = ?`,
      [password_hash, employee_id]
    );
    console.log(`Updated salesman: ${employee_id}`);
  } else {
    const row = await queryOne('SELECT COALESCE(MAX(id), 0) + 1 AS next FROM salesman_accounts');
    const id = row.next;
    await query(
      `INSERT INTO salesman_accounts (id, employee_id, name, email, password_hash, phone, commission_percentage, status, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NULL, 5.00, 'active', 1, datetime('now'), datetime('now'))`,
      [id, employee_id, name, email, password_hash]
    );
    console.log(`Created salesman: ${employee_id} (id=${id})`);
  }
  console.log(`Credentials -> employee_id: ${employee_id}  email: ${email}  password: ${password}`);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });

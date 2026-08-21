import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseStatements(sqlContent) {
  const cleaned = sqlContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  return cleaned
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function seedDatabase() {
  try {
    console.log('[Turso DB Seed] Reading seed.sql...');
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    const sqlContent = fs.readFileSync(seedPath, 'utf-8');

    const statements = parseStatements(sqlContent);
    console.log(`[Turso DB Seed] Executing ${statements.length} seed statements (Warehouses, Categories, 40 Products, Inventory)...`);

    for (const stmt of statements) {
      try {
        await db.execute(stmt);
      } catch (e) {
        console.error('FAILED STATEMENT:', stmt.slice(0, 120));
        throw e;
      }
    }

    console.log('✅ ShopKart database seeded successfully! Admin: admin@shopkart.com / admin123');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
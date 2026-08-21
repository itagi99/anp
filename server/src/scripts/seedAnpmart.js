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

async function seedAnpmartDatabase() {
  try {
    console.log('[Turso DB Seed] Reading seed-anpmart.sql...');
    const seedPath = path.resolve(__dirname, '../../database/seed-anpmart.sql');
    const sqlContent = fs.readFileSync(seedPath, 'utf-8');

    const statements = parseStatements(sqlContent);
    console.log(`[Turso DB Seed] Executing ${statements.length} ANP MART statements (Units, Tiers, Flash Deals, Delivery Rules, Popups, Salesmen)...`);

    for (const stmt of statements) {
      await db.execute(stmt);
    }

    console.log('✅ ANP MART database seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed ANP MART database:', error);
    process.exit(1);
  }
}

seedAnpmartDatabase();

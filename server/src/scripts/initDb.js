import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Split SQL file into executable statements, stripping comment lines.
 */
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

async function initializeDatabase() {
  try {
    console.log('[Turso DB Init] Reading schema.sql...');
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

    const statements = parseStatements(sqlContent);
    console.log(`[Turso DB Init] Executing ${statements.length} schema statements...`);

    for (const stmt of statements) {
      await db.execute(stmt);
    }

    console.log('✅ ShopKart database schema initialized successfully in Turso/libSQL!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
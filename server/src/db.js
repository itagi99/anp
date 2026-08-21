import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const db = createClient({
  url,
  authToken,
});

/**
 * Execute a single query and return all rows
 */
export async function query(sql, args = []) {
  try {
    const result = await db.execute({ sql, args });
    return result.rows;
  } catch (error) {
    console.error(`[DB Error in query]: ${sql}`, error);
    throw error;
  }
}

/**
 * Execute a single query and return the first row (or null)
 */
export async function queryOne(sql, args = []) {
  const rows = await query(sql, args);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute a batch of queries sequentially inside a transaction
 */
export async function transaction(statements) {
  try {
    return await db.batch(statements, 'write');
  } catch (error) {
    console.error('[DB Transaction Error]:', error);
    throw error;
  }
}

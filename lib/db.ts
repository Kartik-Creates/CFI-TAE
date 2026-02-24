import { neon } from '@neondatabase/serverless'
import { getConfig } from './config'

const config = getConfig()

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(config.databaseUrl)

// ✅ Named export (fixes your build error)
export { sql }

// Query multiple rows
export async function query<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  try {
    const result = await sql(strings, ...values)
    return result as T[]
  } catch (error) {
    console.error('[v0] Database query error:', error)
    throw error
  }
}

// Query single row
export async function queryOne<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T | null> {
  const results = await query<T>(strings, ...values)
  return results.length > 0 ? results[0] : null
}

// Optional default export (safe to keep)
export default sql

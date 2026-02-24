import { neon } from '@neondatabase/serverless'
import { getConfig } from './config'

const config = getConfig()

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(config.databaseUrl)

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

export async function queryOne<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T | null> {
  const results = await query<T>(strings, ...values)
  return results.length > 0 ? results[0] : null
}

export default sql

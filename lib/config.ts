/**
 * Configuration and environment variable verification
 */

export function getConfig() {
  const config = {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    openaiApiKey: process.env.OPENAI_API_KEY,
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
  }

  // Warn about missing env vars in development
  if (!config.isProduction) {
    if (!config.databaseUrl) {
      console.warn('[v0] DATABASE_URL not set - database operations will fail')
    }
  }

  return config
}

export function validateConfig(): string[] {
  const errors: string[] = []
  const config = getConfig()

  if (!config.databaseUrl) {
    errors.push('DATABASE_URL environment variable is required')
  }

  if (config.isProduction && config.sessionSecret === 'dev-secret-change-in-production') {
    errors.push('SESSION_SECRET must be set in production')
  }

  return errors
}

// Initialize and check configuration on module load
if (typeof window === 'undefined') {
  // Server-side only
  const errors = validateConfig()
  if (errors.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('[v0] Configuration errors:', errors)
  }
}

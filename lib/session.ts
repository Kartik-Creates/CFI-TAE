import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  email: string
  organizationId?: string
  isLoggedIn: boolean
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long!!',
  cookieName: 'cyberrisk_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

/**
 * Get the current session
 */
export async function getSession(): Promise<SessionData & { save: () => Promise<void> }> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  email: string,
  organizationId?: string
): Promise<void> {
  const session = await getSession()
  session.userId = userId
  session.email = email
  session.organizationId = organizationId
  session.isLoggedIn = true
  await session.save()
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const session = await getSession()
  session.destroy()
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session.isLoggedIn === true
}

/**
 * Get current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session.userId || null
}

/**
 * Get current organization ID from session
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  const session = await getSession()
  return session.organizationId || null
}

import { query, queryOne } from './db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  role?: string
}

export interface Organization {
  id: string
  name: string
  created_by: string
  created_at: string
}

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Verify user password from account table
 */
export async function verifyUserPassword(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const account = await queryOne<any>`
      SELECT a.password
      FROM neon_auth.account a
      JOIN neon_auth.user u ON a."userId" = u.id
      WHERE u.email = ${email}
    `
    if (!account || !account.password) return false
    return bcrypt.compare(password, account.password)
  } catch (error) {
    console.error('[v0] Error verifying user password:', error)
    return false
  }
}

/**
 * Create a new user (for cyber risk system)
 */
export async function createUser(
  email: string,
  password: string,
  fullName: string,
  organizationId: string
): Promise<User> {
  const userId = crypto.randomUUID()
  const passwordHash = await hashPassword(password)

  // Create user in Stack Auth schema
  await query`
    INSERT INTO neon_auth.user (
      id, email, name, "emailVerified", "createdAt", "updatedAt"
    )
    VALUES (
      ${userId}, ${email}, ${fullName}, false, NOW(), NOW()
    )
  `

  // Store password in account table
  await query`
    INSERT INTO neon_auth.account (
      id, "userId", password, "providerId", "createdAt", "updatedAt"
    )
    VALUES (
      ${crypto.randomUUID()}, ${userId}, ${passwordHash}, 'password', NOW(), NOW()
    )
  `.catch(() => {
    // Account may already exist
  })

  return {
    id: userId,
    email,
    name: fullName,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await queryOne<User>`
    SELECT id, email, name, "createdAt", role
    FROM neon_auth.user
    WHERE email = ${email}
  `
  return user
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = await queryOne<User>`
    SELECT id, email, name, "createdAt", role
    FROM neon_auth.user
    WHERE id = ${userId}
  `
  return user
}

/**
 * Create a new organization
 */
export async function createOrganization(
  name: string,
  createdById: string
): Promise<Organization> {
  const orgId = crypto.randomUUID()
  const slug = name.toLowerCase().replace(/\s+/g, '-')

  await query`
    INSERT INTO neon_auth.organization (
      id, name, slug, "createdAt"
    )
    VALUES (
      ${orgId}, ${name}, ${slug}, NOW()
    )
  `

  return {
    id: orgId,
    name,
    created_by: createdById,
    created_at: new Date().toISOString(),
  }
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(
  orgId: string
): Promise<Organization | null> {
  const org = await queryOne<Organization>`
    SELECT id, name, "createdAt" as created_at
    FROM neon_auth.organization
    WHERE id = ${orgId}
  `
  return org
}

/**
 * Link user to organization
 */
export async function linkUserToOrganization(
  userId: string,
  organizationId: string,
  role: string = 'member'
): Promise<void> {
  await query`
    INSERT INTO neon_auth.member (
      id, "organizationId", "userId", role, "createdAt"
    )
    VALUES (
      ${crypto.randomUUID()}, ${organizationId}, ${userId}, ${role}, NOW()
    )
    ON CONFLICT DO NOTHING
  `.catch(() => {
    // Member may already exist
  })
}

/**
 * Get user organizations
 */
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const orgs = await query<any>`
    SELECT o.id, o.name, o."createdAt" as created_at
    FROM neon_auth.organization o
    JOIN neon_auth.member m ON o.id = m."organizationId"
    WHERE m."userId" = ${userId}
    ORDER BY o."createdAt" DESC
  `
  return orgs.map(o => ({
    id: o.id,
    name: o.name,
    created_at: o.created_at,
    created_by: '',
  }))
}

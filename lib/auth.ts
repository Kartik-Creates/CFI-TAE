import { query, queryOne } from './db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  created_at: string
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
 * Create a new user (for cyber risk system)
 */
export async function createUser(
  email: string,
  password: string,
  fullName: string,
  organizationId: string
): Promise<User> {
  const passwordHash = await hashPassword(password)
  const userId = crypto.randomUUID()

  await query`
    INSERT INTO neon_auth.user (
      id, email, email_verified, created_at, updated_at
    )
    VALUES (
      ${userId}, ${email}, false, NOW(), NOW()
    )
  `

  // Insert additional user profile in cyber_risk schema if needed
  // For now, the basic user is created in neon_auth

  return {
    id: userId,
    email,
    password_hash: passwordHash,
    full_name: fullName,
    created_at: new Date().toISOString(),
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await queryOne<User>`
    SELECT id, email, password_hash, full_name, created_at
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
    SELECT id, email, password_hash, full_name, created_at
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

  await query`
    INSERT INTO neon_auth.organization (
      id, name, created_at, updated_at
    )
    VALUES (
      ${orgId}, ${name}, NOW(), NOW()
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
    SELECT id, name, created_at
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
    INSERT INTO neon_auth.organization_user (
      organization_id, user_id, role, created_at
    )
    VALUES (
      ${organizationId}, ${userId}, ${role}, NOW()
    )
    ON CONFLICT (organization_id, user_id) DO UPDATE
    SET role = ${role}
  `
}

/**
 * Get user organizations
 */
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const orgs = await query<Organization>`
    SELECT o.id, o.name, o.created_at
    FROM neon_auth.organization o
    JOIN neon_auth.organization_user ou ON o.id = ou.organization_id
    WHERE ou.user_id = ${userId}
    ORDER BY o.created_at DESC
  `
  return orgs
}

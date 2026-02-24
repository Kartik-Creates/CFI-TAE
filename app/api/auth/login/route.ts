import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, getUserOrganizations } from '@/lib/auth'
import { createSession, getCurrentOrganizationId } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password, organizationId } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Get user
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password - Note: this is a placeholder
    // In production, you would store password hash and verify it
    const passwordMatch = await verifyPassword(password, user.password_hash || '')
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get user's organizations if not specified
    let selectedOrgId = organizationId
    if (!selectedOrgId) {
      const orgs = await getUserOrganizations(user.id)
      if (orgs.length > 0) {
        selectedOrgId = orgs[0].id
      }
    }

    // Create session
    await createSession(user.id, user.email, selectedOrgId)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
        },
        organizationId: selectedOrgId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

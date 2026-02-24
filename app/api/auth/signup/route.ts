import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createOrganization, linkUserToOrganization } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, organizationName } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser(email, password, fullName, '')

    // Create organization if provided
    let organizationId = ''
    if (organizationName) {
      const org = await createOrganization(organizationName, user.id)
      organizationId = org.id

      // Link user to organization
      await linkUserToOrganization(user.id, organizationId, 'owner')
    }

    // Create session
    await createSession(user.id, user.email, organizationId)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
        },
        organizationId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

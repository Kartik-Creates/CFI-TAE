import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getUserById } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    // Get current user details
    const user = await getUserById(session.userId)

    return NextResponse.json(
      {
        user: {
          id: session.userId,
          email: session.email,
          fullName: user?.name || '',
          organizationId: session.organizationId,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Session error:', error)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

async function checkAdminAccess(userId: string, organizationId: string) {
  const admins = await sql`
    SELECT id FROM neon_auth.user
    WHERE id = ${userId} AND organization_id = ${organizationId} AND role = 'admin'
  `;
  return admins.length > 0;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkAdminAccess(session.user.id, session.user.organizationId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const users = await sql`
      SELECT id, email, role, created_at, last_login
      FROM neon_auth.user
      WHERE organization_id = ${session.user.organizationId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total FROM neon_auth.user
      WHERE organization_id = ${session.user.organizationId}
    `;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: countResult[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkAdminAccess(session.user.id, session.user.organizationId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await sql`
      UPDATE neon_auth.user
      SET role = ${role}
      WHERE id = ${userId} AND organization_id = ${session.user.organizationId}
    `;

    // Log audit event
    await sql`
      INSERT INTO cyber_risk.audit_logs (
        organization_id, user_id, action, entity_type, entity_id, changes, timestamp
      )
      VALUES (
        ${session.user.organizationId}, ${session.user.id}, 'user_role_updated', 'user', ${userId},
        jsonb_build_object('new_role', ${role}), CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkAdminAccess(session.user.id, session.user.organizationId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await sql`
      DELETE FROM neon_auth.user
      WHERE id = ${userId} AND organization_id = ${session.user.organizationId}
    `;

    // Log audit event
    await sql`
      INSERT INTO cyber_risk.audit_logs (
        organization_id, user_id, action, entity_type, entity_id, timestamp
      )
      VALUES (
        ${session.user.organizationId}, ${session.user.id}, 'user_deleted', 'user', ${userId}, CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

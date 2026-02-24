import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const admins = await sql`
      SELECT id FROM neon_auth.user
      WHERE id = ${session.user.id} AND organization_id = ${session.user.organizationId} AND role = 'admin'
    `;

    if (admins.length === 0) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const limit = 50;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, user_id, action, entity_type, entity_id, changes, timestamp
      FROM cyber_risk.audit_logs
      WHERE organization_id = ${session.user.organizationId}
    `;

    if (action) {
      query += ` AND action = '${action}'`;
    }
    if (entityType) {
      query += ` AND entity_type = '${entityType}'`;
    }

    query += ` ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`;

    const logs = await sql(query);

    const countResult = await sql`
      SELECT COUNT(*) as total FROM cyber_risk.audit_logs
      WHERE organization_id = ${session.user.organizationId}
    `;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: countResult[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

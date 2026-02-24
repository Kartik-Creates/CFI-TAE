import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, assessment_name, industry, overall_risk_score, status, created_at
      FROM cyber_risk.assessments
      WHERE organization_id = '${session.user.organizationId}'
    `;

    if (status) {
      query += ` AND status = '${status}'`;
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const assessments = await sql(query);

    const countResult = await sql`
      SELECT COUNT(*) as total FROM cyber_risk.assessments
      WHERE organization_id = ${session.user.organizationId}
    `;

    return NextResponse.json({
      assessments,
      pagination: {
        page,
        limit,
        total: countResult[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

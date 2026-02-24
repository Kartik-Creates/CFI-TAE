import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentId = params.id;

    const assessments = await sql`
      SELECT id, assessment_name, industry, compliance_frameworks, overall_risk_score, status, created_at
      FROM cyber_risk.assessments
      WHERE id = ${assessmentId} AND organization_id = ${session.user.organizationId}
    `;

    if (assessments.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(assessments[0]);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
  }
}

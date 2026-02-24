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

    // Verify user has access to this assessment
    const assessments = await sql`
      SELECT id FROM cyber_risk.assessments
      WHERE id = ${assessmentId} AND organization_id = ${session.user.organizationId}
    `;

    if (assessments.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const riskScores = await sql`
      SELECT id, threat_id, threat_name, calculated_risk, risk_level, exposure_score, impact_score, likelihood_score, priority_rank
      FROM cyber_risk.risk_scores
      WHERE assessment_id = ${assessmentId}
      ORDER BY priority_rank ASC, calculated_risk DESC
    `;

    return NextResponse.json({ riskScores });
  } catch (error) {
    console.error('Error fetching risk scores:', error);
    return NextResponse.json({ error: 'Failed to fetch risk scores' }, { status: 500 });
  }
}

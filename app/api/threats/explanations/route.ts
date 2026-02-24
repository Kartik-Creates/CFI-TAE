import { NextRequest, NextResponse } from 'next/server';
import { generateThreatExplanation } from '@/lib/openai';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { riskScoreId, threatName, threatDescription, riskScore, industry, complianceFrameworks } = await request.json();

    if (!riskScoreId || !threatName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get assessment context for better explanations
    const riskScoreData = await sql`
      SELECT a.industry, a.compliance_frameworks, a.description
      FROM cyber_risk.risk_scores rs
      JOIN cyber_risk.assessments a ON rs.assessment_id = a.id
      WHERE rs.id = ${riskScoreId}
    `;

    const assessmentContext = riskScoreData[0]?.description || 'General organizational assessment';
    const frameworks = complianceFrameworks || riskScoreData[0]?.compliance_frameworks || [];
    const orgIndustry = industry || riskScoreData[0]?.industry || 'General';

    // Generate explanation
    const explanation = await generateThreatExplanation(
      threatName,
      threatDescription,
      riskScore,
      orgIndustry,
      frameworks,
      assessmentContext
    );

    // Store explanation in database
    await sql`
      INSERT INTO cyber_risk.threat_explanations (risk_score_id, explanation, relevance_reasoning, industry_context, created_by)
      VALUES (${riskScoreId}, ${explanation.explanation}, ${explanation.relevanceReasoning}, ${explanation.industryContext}, 'ai-assistant')
      ON CONFLICT (risk_score_id) DO UPDATE SET
        explanation = EXCLUDED.explanation,
        relevance_reasoning = EXCLUDED.relevance_reasoning,
        industry_context = EXCLUDED.industry_context,
        created_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const riskScoreId = searchParams.get('riskScoreId');

    if (!riskScoreId) {
      return NextResponse.json({ error: 'riskScoreId required' }, { status: 400 });
    }

    const explanations = await sql`
      SELECT explanation, relevance_reasoning, industry_context, created_at
      FROM cyber_risk.threat_explanations
      WHERE risk_score_id = ${riskScoreId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (explanations.length === 0) {
      return NextResponse.json({ explanation: null });
    }

    return NextResponse.json({ explanation: explanations[0] });
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch explanation' },
      { status: 500 }
    );
  }
}

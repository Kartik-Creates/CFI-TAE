import { getSession } from '@/lib/session';
import { sql } from '@neondatabase/serverless';
import { calculateThreatRelevance } from '@/lib/huggingface';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId, industry, size, techStack } = await request.json();

    // Get organization's threats
    const threatRows = await sql`
      SELECT id, name, description, category, severity_base_score
      FROM cyber_risk.threats
      LIMIT 100
    `;

    if (!threatRows || threatRows.length === 0) {
      return NextResponse.json({ relevanceScores: {} });
    }

    // Build org profile for embedding
    const orgProfile = `Organization in ${industry} industry with ${size} employees using ${techStack.join(', ')} technology stack`;

    // Calculate relevance for each threat
    const relevanceScores: Record<string, number> = {};

    for (const threat of threatRows) {
      const threatId = (threat as any).id;
      const threatDesc = (threat as any).description;

      const relevance = await calculateThreatRelevance(
        orgProfile,
        threatDesc
      );

      relevanceScores[threatId] = Math.max(0, Math.min(1, relevance));
    }

    return NextResponse.json({ relevanceScores });
  } catch (error) {
    console.error('Error calculating threat relevance:', error);
    return NextResponse.json(
      { error: 'Failed to calculate threat relevance' },
      { status: 500 }
    );
  }
}

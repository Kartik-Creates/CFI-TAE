import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface Threat {
  id: string
  threat_id: string
  name: string
  description: string
  category: string
  severity_base_score: number
  attack_vector: string
  affected_systems: string[]
  mitigation_recommendations: string[]
}

export async function GET(request: NextRequest) {
  try {
    const threats = await query<Threat>`
      SELECT 
        id,
        threat_id,
        name,
        description,
        category,
        severity_base_score,
        attack_vector,
        affected_systems,
        mitigation_recommendations
      FROM cyber_risk.threats
      ORDER BY severity_base_score DESC
    `

    return NextResponse.json({ threats }, { status: 200 })
  } catch (error) {
    console.error('[v0] Get threats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threats' },
      { status: 500 }
    )
  }
}

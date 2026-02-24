import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { query, queryOne } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, industry, complianceFrameworks, responses } =
      await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Assessment name is required' },
        { status: 400 }
      )
    }

    const orgId = session.organizationId || crypto.randomUUID()
    const assessmentId = crypto.randomUUID()

    // Create assessment
    await query`
      INSERT INTO cyber_risk.assessments (
        id,
        organization_id,
        assessment_name,
        description,
        created_by,
        status,
        compliance_frameworks,
        industry
      )
      VALUES (
        ${assessmentId},
        ${orgId},
        ${name},
        ${description || null},
        ${session.userId},
        'in_progress',
        ${complianceFrameworks ? JSON.stringify(complianceFrameworks) : null},
        ${industry || null}
      )
    `

    // Insert responses and calculate risk scores
    if (responses && Array.isArray(responses)) {
      for (const response of responses) {
        const { threat_id, response_value, evidence, mitigated_by } = response

        // Insert response
        await query`
          INSERT INTO cyber_risk.assessment_responses (
            id,
            assessment_id,
            threat_id,
            question_index,
            question,
            response_value,
            evidence,
            mitigated_by,
            risk_level
          )
          VALUES (
            ${crypto.randomUUID()},
            ${assessmentId},
            ${threat_id},
            0,
            'Threat Exposure Level',
            ${response_value},
            ${evidence || null},
            ${mitigated_by || null},
            ${getRiskLevel(response_value)}
          )
        `
      }
    }

    return NextResponse.json(
      {
        id: assessmentId,
        message: 'Assessment created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Create assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orgId = session.organizationId

    const assessments = await query`
      SELECT 
        id,
        assessment_name,
        description,
        created_at,
        completed_at,
        status,
        overall_risk_score,
        industry,
        compliance_frameworks
      FROM cyber_risk.assessments
      WHERE organization_id = ${orgId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ assessments }, { status: 200 })
  } catch (error) {
    console.error('[v0] Get assessments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

function getRiskLevel(value: number): string {
  if (value >= 4) return 'critical'
  if (value >= 3) return 'high'
  if (value >= 2) return 'medium'
  return 'low'
}

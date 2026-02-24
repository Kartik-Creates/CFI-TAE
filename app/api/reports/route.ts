import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';
import { fetchReportData, generateCSVReport, generateJSONReport, generateHTMLReport } from '@/lib/report-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId, reportType, fileFormat, scheduledGeneration, recurrence } = await request.json();

    if (!assessmentId || !reportType || !fileFormat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user has access to this assessment
    const assessments = await sql`
      SELECT id FROM cyber_risk.assessments
      WHERE id = ${assessmentId} AND organization_id = ${session.user.organizationId}
    `;

    if (assessments.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Fetch report data
    const reportData = await fetchReportData(assessmentId);

    // Generate report content based on format
    let content: string;
    const mimeType =
      fileFormat === 'csv' ? 'text/csv' : fileFormat === 'json' ? 'application/json' : 'text/html';

    if (fileFormat === 'csv') {
      content = generateCSVReport(reportData);
    } else if (fileFormat === 'json') {
      content = generateJSONReport(reportData);
    } else {
      content = generateHTMLReport(reportData);
    }

    const filename = `assessment_${reportData.assessmentName.replace(/\s+/g, '_')}_${Date.now()}.${fileFormat}`;

    // Store report record in database
    const nextScheduledDate = scheduledGeneration
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    await sql`
      INSERT INTO cyber_risk.reports (
        assessment_id, created_by, report_type, file_format, file_path, 
        scheduled_generation, next_scheduled_date, recurrence
      )
      VALUES (
        ${assessmentId}, ${session.user.id}, ${reportType}, ${fileFormat}, ${filename},
        ${scheduledGeneration || false}, ${nextScheduledDate}, ${recurrence || null}
      )
    `;

    // Log audit event
    await sql`
      INSERT INTO cyber_risk.audit_logs (
        organization_id, user_id, action, entity_type, entity_id, changes, timestamp
      )
      VALUES (
        ${session.user.organizationId}, ${session.user.id}, 'report_generated', 'report', ${assessmentId},
        jsonb_build_object('report_type', ${reportType}, 'file_format', ${fileFormat}), CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({
      success: true,
      report: {
        filename,
        content,
        mimeType,
        fileFormat,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ error: 'assessmentId required' }, { status: 400 });
    }

    const reports = await sql`
      SELECT id, report_type, file_format, generated_at, scheduled_generation, next_scheduled_date
      FROM cyber_risk.reports
      WHERE assessment_id = ${assessmentId}
      ORDER BY generated_at DESC
    `;

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

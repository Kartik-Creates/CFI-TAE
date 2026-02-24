import { sql } from '@/lib/db';

export interface ReportData {
  assessmentId: string;
  assessmentName: string;
  industry: string;
  complianceFrameworks: string[];
  overallRiskScore: number;
  threatSummary: any[];
  generatedAt: Date;
  createdBy: string;
}

export async function fetchReportData(assessmentId: string): Promise<ReportData> {
  const assessments = await sql`
    SELECT id, assessment_name, industry, compliance_frameworks, overall_risk_score, created_by
    FROM cyber_risk.assessments
    WHERE id = ${assessmentId}
  `;

  if (assessments.length === 0) {
    throw new Error('Assessment not found');
  }

  const assessment = assessments[0];

  const riskScores = await sql`
    SELECT threat_id, threat_name, calculated_risk, risk_level, exposure_score, impact_score, likelihood_score
    FROM cyber_risk.risk_scores
    WHERE assessment_id = ${assessmentId}
    ORDER BY calculated_risk DESC
  `;

  return {
    assessmentId,
    assessmentName: assessment.assessment_name,
    industry: assessment.industry,
    complianceFrameworks: assessment.compliance_frameworks || [],
    overallRiskScore: assessment.overall_risk_score,
    threatSummary: riskScores,
    generatedAt: new Date(),
    createdBy: assessment.created_by,
  };
}

export function generateCSVReport(data: ReportData): string {
  const headers = ['Threat Name', 'Risk Level', 'Risk Score', 'Exposure Score', 'Impact Score', 'Likelihood Score'];
  const rows = data.threatSummary.map((threat) => [
    threat.threat_name,
    threat.risk_level,
    threat.calculated_risk?.toFixed(2) || 'N/A',
    threat.exposure_score?.toFixed(2) || 'N/A',
    threat.impact_score?.toFixed(2) || 'N/A',
    threat.likelihood_score?.toFixed(2) || 'N/A',
  ]);

  const csvContent = [
    `Assessment: ${data.assessmentName}`,
    `Industry: ${data.industry}`,
    `Compliance Frameworks: ${data.complianceFrameworks.join(', ')}`,
    `Overall Risk Score: ${data.overallRiskScore?.toFixed(2) || 'N/A'}`,
    `Generated: ${data.generatedAt.toISOString()}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function generateJSONReport(data: ReportData): string {
  return JSON.stringify(
    {
      assessment: {
        id: data.assessmentId,
        name: data.assessmentName,
        industry: data.industry,
        complianceFrameworks: data.complianceFrameworks,
        overallRiskScore: data.overallRiskScore,
        createdBy: data.createdBy,
        generatedAt: data.generatedAt.toISOString(),
      },
      threats: data.threatSummary.map((threat) => ({
        threatId: threat.threat_id,
        threatName: threat.threat_name,
        riskLevel: threat.risk_level,
        riskScore: threat.calculated_risk,
        exposureScore: threat.exposure_score,
        impactScore: threat.impact_score,
        likelihoodScore: threat.likelihood_score,
      })),
    },
    null,
    2
  );
}

export function generateHTMLReport(data: ReportData): string {
  const threatRows = data.threatSummary
    .map(
      (threat) => `
    <tr>
      <td>${threat.threat_name}</td>
      <td><span class="risk-badge risk-${threat.risk_level.toLowerCase()}">${threat.risk_level}</span></td>
      <td>${threat.calculated_risk?.toFixed(2) || 'N/A'}</td>
      <td>${threat.exposure_score?.toFixed(2) || 'N/A'}</td>
      <td>${threat.impact_score?.toFixed(2) || 'N/A'}</td>
      <td>${threat.likelihood_score?.toFixed(2) || 'N/A'}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Risk Assessment Report - ${data.assessmentName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .metadata { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .metadata p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
    td { border-bottom: 1px solid #e5e7eb; padding: 12px; }
    tr:hover { background: #f9fafb; }
    .risk-critical { background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .risk-high { background: #ea580c; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .risk-medium { background: #ca8a04; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .risk-low { background: #16a34a; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .summary-card { background: #f3f4f6; padding: 15px; border-radius: 8px; }
    .summary-card h3 { margin: 0 0 10px 0; color: #374151; }
    .summary-card .value { font-size: 24px; font-weight: bold; color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Cyber Risk Assessment Report</h1>
  
  <div class="metadata">
    <p><strong>Assessment:</strong> ${data.assessmentName}</p>
    <p><strong>Industry:</strong> ${data.industry}</p>
    <p><strong>Compliance Frameworks:</strong> ${data.complianceFrameworks.join(', ')}</p>
    <p><strong>Generated:</strong> ${data.generatedAt.toISOString()}</p>
  </div>

  <div class="summary">
    <div class="summary-card">
      <h3>Overall Risk Score</h3>
      <div class="value">${data.overallRiskScore?.toFixed(1) || 'N/A'}/100</div>
    </div>
    <div class="summary-card">
      <h3>Threats Assessed</h3>
      <div class="value">${data.threatSummary.length}</div>
    </div>
  </div>

  <h2>Threat Risk Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Threat Name</th>
        <th>Risk Level</th>
        <th>Risk Score</th>
        <th>Exposure</th>
        <th>Impact</th>
        <th>Likelihood</th>
      </tr>
    </thead>
    <tbody>
      ${threatRows}
    </tbody>
  </table>

  <p style="color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
    Generated on ${new Date().toLocaleString()}
  </p>
</body>
</html>
  `;
}

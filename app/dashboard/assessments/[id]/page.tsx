'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Download, Loader2, FileText, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AssessmentData {
  id: string;
  assessment_name: string;
  industry: string;
  compliance_frameworks: string[];
  overall_risk_score: number;
  status: string;
  created_at: string;
}

interface RiskScore {
  id: string;
  threat_name: string;
  calculated_risk: number;
  risk_level: string;
  exposure_score: number;
  impact_score: number;
  likelihood_score: number;
  threat_id: string;
}

interface Explanation {
  explanation: string;
  relevance_reasoning: string;
  industry_context: string;
}

export default function AssessmentDetailsPage() {
  const params = useParams();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [explanations, setExplanations] = useState<Record<string, Explanation>>({});
  const [loading, setLoading] = useState(true);
  const [generatingExplanations, setGeneratingExplanations] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentRes, riskScoresRes] = await Promise.all([
          fetch(`/api/assessments/${assessmentId}`),
          fetch(`/api/assessments/${assessmentId}/risk-scores`),
        ]);

        if (assessmentRes.ok) {
          const data = await assessmentRes.json();
          setAssessment(data);
        }

        if (riskScoresRes.ok) {
          const data = await riskScoresRes.json();
          setRiskScores(data.riskScores || []);

          // Fetch explanations for each threat
          for (const score of data.riskScores || []) {
            const expRes = await fetch(`/api/threats/explanations?riskScoreId=${score.id}`);
            if (expRes.ok) {
              const exp = await expRes.json();
              if (exp.explanation) {
                setExplanations((prev) => ({
                  ...prev,
                  [score.id]: exp.explanation,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);

  const generateExplanations = async () => {
    setGeneratingExplanations(true);
    try {
      for (const score of riskScores) {
        await fetch('/api/threats/explanations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riskScoreId: score.id,
            threatName: score.threat_name,
            riskScore: score.calculated_risk,
            industry: assessment?.industry,
            complianceFrameworks: assessment?.compliance_frameworks,
          }),
        });
      }
      // Refresh explanations
      window.location.reload();
    } catch (error) {
      console.error('Error generating explanations:', error);
    } finally {
      setGeneratingExplanations(false);
    }
  };

  const generateReport = async (format: 'pdf' | 'csv' | 'json') => {
    setGeneratingReport(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          reportType: 'detailed',
          fileFormat: format,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([data.report.content], { type: data.report.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.report.filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading assessment...</div>;
  }

  if (!assessment) {
    return <div className="p-8">Assessment not found</div>;
  }

  const chartData = riskScores.map((score) => ({
    name: score.threat_name.substring(0, 15),
    risk: parseFloat(score.calculated_risk?.toFixed(2) || '0'),
    exposure: parseFloat(score.exposure_score?.toFixed(2) || '0'),
    impact: parseFloat(score.impact_score?.toFixed(2) || '0'),
  }));

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{assessment.assessment_name}</h1>
          <p className="text-muted-foreground mt-2">
            {assessment.industry} • {assessment.compliance_frameworks.join(', ')}
          </p>
        </div>
        <Badge className={`text-lg px-4 py-2`}>{assessment.status}</Badge>
      </div>

      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600">
                  {assessment.overall_risk_score?.toFixed(1) || 'N/A'}
                </div>
                <p className="text-muted-foreground mt-2">Overall Risk Score</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>Threats Assessed</span>
                <span className="font-bold text-xl">{riskScores.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>Critical Issues</span>
                <span className="font-bold text-xl text-red-600">
                  {riskScores.filter((s) => s.risk_level === 'Critical').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>High Risk</span>
                <span className="font-bold text-xl text-orange-600">
                  {riskScores.filter((s) => s.risk_level === 'High').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution Chart */}
      {riskScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="risk" fill="#3b82f6" name="Risk Score" />
                <Bar dataKey="exposure" fill="#f97316" name="Exposure" />
                <Bar dataKey="impact" fill="#ef4444" name="Impact" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Threats and Actions */}
      <Tabs defaultValue="threats" className="w-full">
        <TabsList>
          <TabsTrigger value="threats">Threat Details</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Assessed Threats</CardTitle>
              <CardDescription>Detailed risk scores and AI explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {riskScores.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No threats assessed</p>
                </div>
              ) : (
                riskScores.map((score) => (
                  <div key={score.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{score.threat_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Risk Level: <Badge className={getRiskColor(score.risk_level)}>{score.risk_level}</Badge>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {score.calculated_risk?.toFixed(1) || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-100 p-3 rounded">
                        <p className="text-muted-foreground">Exposure</p>
                        <p className="font-bold">{score.exposure_score?.toFixed(1) || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded">
                        <p className="text-muted-foreground">Impact</p>
                        <p className="font-bold">{score.impact_score?.toFixed(1) || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded">
                        <p className="text-muted-foreground">Likelihood</p>
                        <p className="font-bold">{score.likelihood_score?.toFixed(1) || 'N/A'}</p>
                      </div>
                    </div>

                    {explanations[score.id] && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          AI-Powered Analysis
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Explanation:</span> {explanations[score.id].explanation}
                          </p>
                          <p>
                            <span className="font-semibold">Relevance:</span> {explanations[score.id].relevance_reasoning}
                          </p>
                          <p>
                            <span className="font-semibold">Industry Context:</span> {explanations[score.id].industry_context}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Actions</CardTitle>
              <CardDescription>Generate reports and AI explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Generate AI Explanations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use OpenAI to generate detailed threat explanations and industry-specific context.
                </p>
                <Button onClick={generateExplanations} disabled={generatingExplanations}>
                  {generatingExplanations && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate Explanations
                </Button>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download assessment results in various formats.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => generateReport('csv')}
                    disabled={generatingReport}
                  >
                    {generatingReport && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateReport('json')}
                    disabled={generatingReport}
                  >
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateReport('pdf')}
                    disabled={generatingReport}
                  >
                    HTML
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

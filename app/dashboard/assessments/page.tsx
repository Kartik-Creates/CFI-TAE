'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, ArrowRight } from 'lucide-react';

interface Assessment {
  id: string;
  assessment_name: string;
  industry: string;
  overall_risk_score: number;
  status: string;
  created_at: string;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessments/list');
        if (response.ok) {
          const data = await response.json();
          setAssessments(data.assessments || []);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return <div className="p-8">Loading assessments...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Assessments</h1>
          <p className="text-muted-foreground mt-2">View and manage your security assessments</p>
        </div>
        <Link href="/dashboard/assessments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </Link>
      </div>

      {assessments.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">No assessments yet</h3>
                <p className="text-muted-foreground">
                  Create your first risk assessment to begin evaluating threats.
                </p>
              </div>
              <Link href="/dashboard/assessments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{assessment.assessment_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assessment.industry} • Created {formatDate(assessment.created_at)}
                    </p>
                  </div>
                  <Badge>{assessment.status}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                    <p className={`text-2xl font-bold ${getRiskColor(assessment.overall_risk_score)}`}>
                      {assessment.overall_risk_score?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <Link href={`/dashboard/assessments/${assessment.id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RiskCard } from '@/components/dashboard/risk-card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Plus, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()

        if (!data.user?.id) {
          router.push('/login')
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-32 bg-secondary rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Mock data
  const riskData = [
    {
      id: 'assessment-1',
      title: 'Enterprise Network Security',
      description: 'Latest quarterly assessment',
      score: 72,
      level: 'high' as const,
      threatCount: 14,
    },
    {
      id: 'assessment-2',
      title: 'Cloud Infrastructure',
      description: 'AWS and Azure services',
      score: 58,
      level: 'high' as const,
      threatCount: 23,
    },
    {
      id: 'assessment-3',
      title: 'Application Security',
      description: 'Internal web applications',
      score: 84,
      level: 'medium' as const,
      threatCount: 8,
    },
    {
      id: 'assessment-4',
      title: 'Data Protection',
      description: 'Database and storage systems',
      score: 45,
      level: 'critical' as const,
      threatCount: 31,
    },
  ]

  const riskTrendData = [
    { month: 'Jan', Critical: 2, High: 8, Medium: 12, Low: 5 },
    { month: 'Feb', Critical: 3, High: 10, Medium: 11, Low: 6 },
    { month: 'Mar', Critical: 2, High: 12, Medium: 14, Low: 7 },
    { month: 'Apr', Critical: 4, High: 11, Medium: 16, Low: 8 },
    { month: 'May', Critical: 3, High: 13, Medium: 15, Low: 9 },
    { month: 'Jun', Critical: 5, High: 15, Medium: 18, Low: 10 },
  ]

  const riskDistribution = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 15, color: '#f97316' },
    { name: 'Medium', value: 18, color: '#eab308' },
    { name: 'Low', value: 10, color: '#22c55e' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze cyber threats</p>
        </div>
        <Link href="/dashboard/assessments/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">76</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">5</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">In your organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">64.75</div>
            <p className="text-xs text-muted-foreground mt-1">Across all assessments</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Active Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {riskData.map((assessment) => (
            <RiskCard
              key={assessment.id}
              {...assessment}
              onClick={() => router.push(`/dashboard/assessments/${assessment.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Trends (Last 6 Months)</CardTitle>
              <CardDescription>
                Track the evolution of identified threats by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Bar dataKey="Critical" fill="#ef4444" />
                  <Bar dataKey="High" fill="#f97316" />
                  <Bar dataKey="Medium" fill="#eab308" />
                  <Bar dataKey="Low" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>
                Breakdown of current threats by severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StepIndicator } from '@/components/assessment/step-indicator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Threat {
  id: string
  name: string
  description: string
  category: string
  severity_base_score: number
  affected_systems: string[]
}

interface Response {
  threat_id: string
  response_value: number
  evidence: string
  mitigated_by: string
}

const steps = [
  { label: 'Details', description: 'Basic assessment info' },
  { label: 'Threats', description: 'Evaluate each threat' },
  { label: 'Review', description: 'Confirm and submit' },
]

const COMPLIANCE_FRAMEWORKS = ['ISO27001', 'NIST', 'SOC2', 'HIPAA', 'PCI-DSS', 'GDPR']
const INDUSTRIES = ['finance', 'healthcare', 'tech', 'government', 'retail', 'other']

export default function NewAssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [threats, setThreats] = useState<Threat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [frameworks, setFrameworks] = useState<string[]>([])
  const [responses, setResponses] = useState<Record<string, Response>>({})

  // Fetch threats on mount
  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch('/api/threats')
        const data = await res.json()
        setThreats(data.threats)
      } catch (err) {
        console.error('[v0] Error fetching threats:', err)
        setError('Failed to load threats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchThreats()
  }, [])

  const handleFrameworkToggle = (framework: string) => {
    setFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework]
    )
  }

  const handleThreatResponse = (threatId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [threatId]: {
        ...prev[threatId],
        threat_id: threatId,
        response_value: value,
      },
    }))
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError('')

    try {
      const payload = {
        name,
        description,
        industry,
        complianceFrameworks: frameworks,
        responses: Object.values(responses),
      }

      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create assessment')
      }

      const data = await res.json()
      router.push(`/dashboard/assessments/${data.id}`)
    } catch (err) {
      console.error('[v0] Submit error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 0) return name.trim() !== ''
    if (currentStep === 1) return Object.keys(responses).length > 0
    return true
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">New Assessment</h1>
        <p className="text-muted-foreground mt-1">Create a new cyber risk assessment</p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="min-h-96">
        <CardContent className="pt-6">
          {/* Step 1: Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base">
                  Assessment Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Q3 Security Assessment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Optional details about this assessment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base mb-3 block">Industry</Label>
                <RadioGroup value={industry} onValueChange={setIndustry}>
                  <div className="grid grid-cols-2 gap-4">
                    {INDUSTRIES.map((ind) => (
                      <div key={ind} className="flex items-center space-x-2">
                        <RadioGroupItem value={ind} id={ind} />
                        <Label htmlFor={ind} className="font-normal capitalize cursor-pointer">
                          {ind}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base mb-3 block">Compliance Frameworks</Label>
                <div className="space-y-2">
                  {COMPLIANCE_FRAMEWORKS.map((framework) => (
                    <div key={framework} className="flex items-center space-x-2">
                      <Checkbox
                        id={framework}
                        checked={frameworks.includes(framework)}
                        onCheckedChange={() => handleFrameworkToggle(framework)}
                      />
                      <Label htmlFor={framework} className="font-normal cursor-pointer">
                        {framework}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Threats */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">Loading threats...</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {threats.map((threat) => (
                    <Card key={threat.id} className="border">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{threat.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {threat.description}
                            </p>
                          </div>
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {threat.category}
                          </span>
                        </div>

                        <div className="mt-4">
                          <Label className="text-sm mb-2 block">
                            Exposure Level
                          </Label>
                          <RadioGroup
                            value={responses[threat.id]?.response_value?.toString() || '0'}
                            onValueChange={(val) =>
                              handleThreatResponse(threat.id, parseInt(val))
                            }
                          >
                            <div className="flex gap-4">
                              {[
                                { value: 0, label: 'None' },
                                { value: 1, label: 'Low' },
                                { value: 2, label: 'Medium' },
                                { value: 3, label: 'High' },
                                { value: 4, label: 'Critical' },
                              ].map(({ value, label }) => (
                                <div key={value} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={value.toString()}
                                    id={`${threat.id}-${value}`}
                                  />
                                  <Label
                                    htmlFor={`${threat.id}-${value}`}
                                    className="font-normal cursor-pointer"
                                  >
                                    {label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Assessment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  {industry && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="font-medium capitalize">{industry}</span>
                    </div>
                  )}
                  {frameworks.length > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Frameworks:</span>
                      <span className="font-medium">{frameworks.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Threats Assessed:</span>
                    <span className="font-medium">{Object.keys(responses).length}</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can modify or delete this assessment after creation. All data will be stored securely.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !canProceed()}
            className="gap-2"
          >
            {isSaving ? 'Creating...' : 'Create Assessment'}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

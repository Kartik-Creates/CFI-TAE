import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="py-8">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1"
          >
            <div className="flex items-center w-full mb-2">
              <div
                className={cn(
                  'h-10 w-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all',
                  index < currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : index === currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-secondary border-border text-muted-foreground'
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 transition-all',
                    index < currentStep
                      ? 'bg-primary'
                      : 'bg-border'
                  )}
                />
              )}
            </div>

            <div className="text-center">
              <p className="font-medium text-sm text-foreground">
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

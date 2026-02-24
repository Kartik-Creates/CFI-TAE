import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskCardProps {
  title: string
  description?: string
  score: number
  level: 'critical' | 'high' | 'medium' | 'low'
  threatCount?: number
  onClick?: () => void
}

const riskConfig = {
  critical: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    icon: AlertTriangle,
    badgeVariant: 'destructive' as const,
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: AlertTriangle,
    badgeVariant: 'secondary' as const,
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    icon: AlertCircle,
    badgeVariant: 'secondary' as const,
  },
  low: {
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    icon: CheckCircle2,
    badgeVariant: 'outline' as const,
  },
}

export function RiskCard({
  title,
  description,
  score,
  level,
  threatCount,
  onClick,
}: RiskCardProps) {
  const config = riskConfig[level]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg border',
        config.borderColor,
        config.bgColor,
        onClick && 'hover:scale-105'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <Icon className={cn('h-6 w-6 ml-2', config.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{score}</div>
            <Badge variant={config.badgeVariant} className="text-xs">
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
          </div>
          {threatCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {threatCount} threat{threatCount !== 1 ? 's' : ''} identified
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

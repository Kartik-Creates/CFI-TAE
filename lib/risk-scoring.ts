/**
 * Risk Scoring Algorithm
 * Calculates risk scores based on threat exposure and impact
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

interface RiskScores {
  exposureScore: number
  impactScore: number
  likelihoodScore: number
  riskScore: number
  riskLevel: RiskLevel
}

/**
 * Calculate risk level based on score (0-100)
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

/**
 * Calculate all risk scores for a threat assessment
 * @param exposureValue 0-5 scale from user input
 * @param severityScore 0-100 inherent threat severity
 * @param mitigationFactor 0-1 scale based on existing controls
 */
export function calculateRiskScores(
  exposureValue: number,
  severityScore: number,
  mitigationFactor: number = 0.5
): RiskScores {
  // Normalize exposure value to 0-100
  const exposureScore = (exposureValue / 5) * 100

  // Impact score is based on threat severity
  const impactScore = severityScore

  // Likelihood increases with exposure, decreases with mitigation
  const baseLikelihood = (exposureScore / 100) * 100
  const likelihoodScore = baseLikelihood * (1 - mitigationFactor * 0.5)

  // Overall risk = (Exposure * Impact * Likelihood) / 10000
  // Normalized to 0-100 scale
  const riskScore = Math.min(
    (exposureScore * impactScore * likelihoodScore) / 10000,
    100
  )

  return {
    exposureScore: Math.round(exposureScore),
    impactScore: Math.round(impactScore),
    likelihoodScore: Math.round(likelihoodScore),
    riskScore: Math.round(riskScore),
    riskLevel: getRiskLevel(riskScore),
  }
}

/**
 * Calculate overall assessment risk score from individual threat scores
 */
export function calculateOverallRiskScore(threatScores: number[]): number {
  if (threatScores.length === 0) return 0

  // Weighted average favoring higher scores (critical threats have more impact)
  const sorted = [...threatScores].sort((a, b) => b - a)
  const weighted = sorted.reduce((sum, score, idx) => {
    const weight = Math.pow(0.9, idx) // Decreasing weights
    return sum + score * weight
  }, 0)

  const totalWeight = sorted.reduce((sum, _, idx) => {
    return sum + Math.pow(0.9, idx)
  }, 0)

  return Math.round(weighted / totalWeight)
}

/**
 * Get risk score color for UI display
 */
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return '#ef4444' // red
    case 'high':
      return '#f97316' // orange
    case 'medium':
      return '#eab308' // yellow
    case 'low':
      return '#22c55e' // green
  }
}

/**
 * Get risk score text color for contrast
 */
export function getRiskTextColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'text-destructive'
    case 'high':
      return 'text-orange-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
  }
}

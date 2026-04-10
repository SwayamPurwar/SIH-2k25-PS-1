export function calculateRiskScore(ph, turbidity, coliform, chlorine) {
  let score = 0
  if (ph < 6.5 || ph > 8.5) score += 35
  else if (ph < 7.0 || ph > 8.0) score += 10
  
  if (turbidity > 10) score += 35
  else if (turbidity > 4) score += 15
  
  if (coliform > 100) score += 35
  else if (coliform > 20) score += 15
  
  if (chlorine < 0.2) score += 15
  
  return Math.min(score, 100)
}

export function getRiskLevel(score) {
  if (score >= 70) return 'danger'
  if (score >= 40) return 'warning'
  return 'safe'
}

export function getAlertLevel(score) {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  // FIXED: Ensure pristine water returns 'safe' to match the Zone schema
  if (score >= 15) return 'low' 
  return 'safe'
}
export function getRiskLevel(ph, turbidity, coliform) {
  let score = 0
  if (ph < 6.5 || ph > 8.5) score += 40
  else if (ph < 7.0 || ph > 8.0) score += 15
  if (turbidity > 10) score += 35
  else if (turbidity > 4) score += 15
  if (coliform > 100) score += 35
  else if (coliform > 20) score += 15
  if (score >= 60) return 'high'
  if (score >= 25) return 'medium'
  if (score >= 5)  return 'low'
  return 'safe'
}

export function getRiskScore(ph, turbidity, coliform) {
  let score = 0
  if (ph < 6.5 || ph > 8.5) score += 40
  else if (ph < 7.0 || ph > 8.0) score += 15
  if (turbidity > 10) score += 35
  else if (turbidity > 4) score += 15
  if (coliform > 100) score += 35
  else if (coliform > 20) score += 15
  return Math.min(score, 100)
}

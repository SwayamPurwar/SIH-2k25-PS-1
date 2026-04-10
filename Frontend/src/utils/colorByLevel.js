export const levelColors = {
  high:   { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
  medium: { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  low:    { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  safe:   { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500'  },
  danger: { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
  warning:{ bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
}

export function getLevelColor(level) {
  return levelColors[level] || levelColors.safe
}

export const levelLabels = {
  high:    { en: 'High Risk',    hi: 'उच्च जोखिम'    },
  medium:  { en: 'Medium Risk',  hi: 'मध्यम जोखिम'  },
  low:     { en: 'Low Risk',     hi: 'कम जोखिम'     },
  safe:    { en: 'Safe',         hi: 'सुरक्षित'     },
}

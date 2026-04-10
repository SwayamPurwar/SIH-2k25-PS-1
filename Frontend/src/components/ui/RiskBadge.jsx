import clsx from 'clsx'

const styles = {
  high:    'bg-red-100 text-red-700 border border-red-200',
  medium:  'bg-amber-100 text-amber-700 border border-amber-200',
  low:     'bg-blue-100 text-blue-700 border border-blue-200',
  safe:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  danger:  'bg-red-100 text-red-700 border border-red-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
}
const dots = {
  high: 'bg-red-500 animate-pulse', medium: 'bg-amber-500', low: 'bg-blue-500',
  safe: 'bg-emerald-500', danger: 'bg-red-500 animate-pulse', warning: 'bg-amber-500',
}
const labels = {
  high: 'High Risk', medium: 'Medium', low: 'Low Risk',
  safe: 'Safe', danger: 'Danger', warning: 'Warning',
}

export default function RiskBadge({ level, size = 'sm' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-semibold rounded-full',
      styles[level] || styles.safe,
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dots[level] || dots.safe)} />
      {labels[level] || level}
    </span>
  )
}

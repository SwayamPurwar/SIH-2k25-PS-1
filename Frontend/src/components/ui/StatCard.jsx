import clsx from 'clsx'

const accents = {
  teal:  { bar: 'bg-emerald-500', icon: 'bg-emerald-50 text-emerald-600', border: 'border-l-emerald-400' },
  red:   { bar: 'bg-red-500',     icon: 'bg-red-50 text-red-500',         border: 'border-l-red-400'    },
  amber: { bar: 'bg-amber-500',   icon: 'bg-amber-50 text-amber-600',     border: 'border-l-amber-400'  },
  blue:  { bar: 'bg-blue-500',    icon: 'bg-blue-50 text-blue-600',       border: 'border-l-blue-400'   },
}

export default function StatCard({ label, value, sub, accent = 'teal', icon, trend }) {
  const a = accents[accent] || accents.teal
  return (
    <div className={clsx('card-hover border-l-4', a.border)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
        {icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm', a.icon)}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {sub && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          {trend === 'up'   && <span className="text-red-500">↑</span>}
          {trend === 'down' && <span className="text-emerald-500">↓</span>}
          {sub}
        </p>
      )}
    </div>
  )
}

import { mockUser } from '../../data/mockData.js'

export default function PointsCard() {
  const u = mockUser
  const pct = Math.round((u.points / u.nextLevel) * 100)
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-sm font-bold text-white">
          {u.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{u.name}</p>
          <p className="text-xs text-gray-400">Zone {u.zone} · {u.city}</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Silver</span>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>XP Progress</span>
        <span className="font-semibold text-gray-600">{u.points} / {u.nextLevel}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Points',  value: u.points  },
          { label: 'Streak',  value: `${u.streak}d` },
          { label: 'Reports', value: u.reports },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-base font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

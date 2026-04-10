import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useTranslation } from 'react-i18next'
import { mockTrendData } from '../../data/mockData.js'

export default function TrendChart() {
  const { t } = useTranslation()
  return (
    <div className="card">
      <p className="text-sm font-semibold text-gray-800 mb-4">{t('dashboard.trend')}</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={mockTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v, n) => [v, n === 'risk' ? 'Risk Score' : 'Cases']}
          />
          <Area type="monotone" dataKey="risk" stroke="#1D9E75" strokeWidth={2} fill="url(#riskGrad)" dot={{ r: 3, fill: '#1D9E75' }} />
          <Line type="monotone" dataKey="cases" stroke="#E24B4A" strokeWidth={2} dot={{ r: 3, fill: '#E24B4A' }} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-4 h-0.5 bg-primary-400 inline-block" />Risk Score
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-4 h-0.5 bg-red-400 inline-block border-dashed" />Reported Cases
        </div>
      </div>
    </div>
  )
}

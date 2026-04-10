import { useTranslation } from 'react-i18next'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import StatCard from '../components/ui/StatCard.jsx'
import RiskBadge from '../components/ui/RiskBadge.jsx'
import PointsCard from '../components/gamification/PointsCard.jsx'
import Leaderboard from '../components/gamification/Leaderboard.jsx'
import { mockAlerts, mockTrendData } from '../data/mockData.js'
import { useState, useEffect } from 'react'
import api from '../services/api.js' 

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="p-3 text-xs bg-white border border-gray-100 shadow-lg rounded-xl">
      <p className="mb-1 font-semibold text-gray-700">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'risk' ? 'Risk Score' : 'Cases'}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  )
}
export default function Dashboard() {
  const { t } = useTranslation()
  const [alerts, setAlerts] = useState([])
  const [reportCount, setReportCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch Alerts and Reports simultaneously
        const [alertsRes, reportsRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/reports?limit=1') // We just need the total count
        ])
        
        setAlerts(alertsRes.data.data)
        setReportCount(reportsRes.data.total)
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (loading) return <div className="p-5 text-gray-500">Loading dashboard...</div>

  // Calculate dynamic stats
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.level === 'high' && a.status === 'active').length;

  return (
    <div className="space-y-5">
      {/* KPI cards updated with dynamic data */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="animate-slide-up stagger-1">
          <StatCard label="Active Alerts" value={activeAlerts} sub={`${criticalAlerts} critical zones`} accent="red" trend="up" icon="⚠" />
        </div>
        <div className="animate-slide-up stagger-2">
          <StatCard label="Safe Zones" value="7" sub="of 9 zones" accent="teal" trend="down" icon="✓" />
        </div>
        <div className="animate-slide-up stagger-3">
          <StatCard label="Total Reports" value={reportCount} sub="Submitted by community" accent="blue" trend="up" icon="📋" />
        </div>
        <div className="animate-slide-up stagger-4">
          <StatCard label="Overall Risk" value="64" sub="Moderate — rising" accent="amber" trend="up" icon="📈" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Trend chart ... (Keep as is) */}

          {/* Outbreak feed using REAL ALERTS */}
          <div className="card animate-fade-in stagger-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-800">Recent Alerts</p>
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? <p className="text-xs text-gray-400">No active alerts.</p> : null}
              {alerts.slice(0, 4).map((a, i) => (
                <div key={a._id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50 animate-fade-in stagger-${i+1}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.level==='high'?'bg-red-500 animate-pulse':a.level==='medium'?'bg-amber-500':'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Zone {a.zone} · {a.location}</p>
                  </div>
                  <RiskBadge level={a.level} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamification side panel */}
        <div className="space-y-5">
          <div className="animate-slide-up stagger-3"><PointsCard /></div>
          <div className="animate-slide-up stagger-4"><Leaderboard /></div>
        </div>
      </div>
    </div>
  )
}
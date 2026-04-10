import { useState, useEffect } from 'react' // Add useEffect
import api from '../services/api.js' // Import real API
import toast from 'react-hot-toast' // Add toast notifications
import RiskBadge from '../components/ui/RiskBadge.jsx'
import clsx from 'clsx'

const FILTERS = ['All', 'High', 'Medium', 'Low']

const borderColor = { high: 'border-l-red-400', medium: 'border-l-amber-400', low: 'border-l-blue-400' }
const bgHover     = { high: 'hover:bg-red-50',  medium: 'hover:bg-amber-50',  low: 'hover:bg-blue-50'  }

export default function AlertCentre() {
  const [filter, setFilter] = useState('All')
  const [alerts, setAlerts] = useState([]) // Use real state
  const [loading, setLoading] = useState(true)

  // Fetch active alerts on load
  useEffect(() => {
    fetchAlerts()
  }, [])

  async function fetchAlerts() {
    try {
      // Your backend defaults to status = 'active'
      const response = await api.get('/alerts')
      setAlerts(response.data.data)
    } catch (error) {
      console.error("Failed to load alerts", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle resolving an alert (Requires 'officer' role on backend)
  async function handleResolve(id) {
    try {
      await api.patch(`/alerts/${id}/resolve`)
      toast.success("Alert resolved successfully!")
      // Remove the resolved alert from the UI
      setAlerts(prev => prev.filter(a => a._id !== id))
    } catch (error) {
      // If the user is a citizen, the backend will return a 403 Forbidden
      toast.error(error.response?.data?.message || "Failed to resolve alert")
    }
  }

  if (loading) return <div className="p-5 text-gray-500">Loading Alert Centre...</div>

  const filtered = filter === 'All' 
    ? alerts 
    : alerts.filter(a => a.level === filter.toLowerCase())

  const criticalCount = alerts.filter(a => a.level === 'high').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-base font-bold text-gray-900">Alert Centre</h2>
          <p className="text-xs text-gray-400 mt-0.5">{alerts.length} active alerts requiring attention</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                filter===f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}>
              {f}
              {f !== 'All' && (
                <span className="ml-1 text-xs">
                  ({alerts.filter(a => a.level === f.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Critical banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-2xl animate-fade-in">
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-xl shrink-0">
            <span className="text-sm font-bold text-red-600">!</span>
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">
              {criticalCount} critical zone{criticalCount > 1 ? 's' : ''} require immediate action
            </p>
            <p className="text-xs text-red-500 mt-0.5">Please check high-risk zones and dispatch field workers.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <div key={alert._id}
            className={clsx(
              'card border-l-4 transition-all duration-200 animate-slide-up',
              `stagger-${(i % 5) + 1}`,
              borderColor[alert.level],
              bgHover[alert.level],
            )}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-900">{alert.title}</p>
                  <RiskBadge level={alert.level} />
                  {alert.cases > 0 && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {alert.cases} cases
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Zone {alert.zone} · {alert.location}
                </p>
                {alert.body && <p className="mt-2 text-xs text-gray-600">{alert.body}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleResolve(alert._id)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-white hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 animate-fade-in">
            <div className="mb-3 text-4xl">✓</div>
            <p className="font-semibold text-gray-600">All clear!</p>
            <p className="mt-1 text-sm">No active alerts in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
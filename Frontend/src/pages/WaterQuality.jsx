import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react' 
import api from '../services/api.js'
import { mockSensors } from '../data/mockData.js'
import RiskBadge from '../components/ui/RiskBadge.jsx'

function Gauge({ value, max, safe, warn }) {
  const pct = Math.min((value / max) * 100, 100)
  const color = value <= safe ? '#059669' : value <= warn ? '#d97706' : '#ef4444'
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs text-gray-400">
        <span>0</span><span>{max}</span>
      </div>
      <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
        <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function SensorCard({ sensor, idx }) {
  const metrics = [
    { label: 'pH Level',        value: sensor.ph,        unit: '',       safe: sensor.ph >= 6.5 && sensor.ph <= 8.5,  max: 14,   safeT: 8.5,  warnT: 9 },
    { label: 'Turbidity',       value: sensor.turbidity, unit: ' NTU',   safe: sensor.turbidity < 4,                  max: 30,   safeT: 4,    warnT: 10 },
    { label: 'Coliform',        value: sensor.coliform,  unit: ' CFU/ml',safe: sensor.coliform < 10,                  max: 500,  safeT: 10,   warnT: 100 },
    { label: 'Chlorine',        value: sensor.chlorine,  unit: ' mg/L',  safe: sensor.chlorine >= 0.2,                max: 1,    safeT: 0.8,  warnT: 0.9 },
  ]
  return (
    <div className={`card-hover animate-slide-up stagger-${idx+1}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-gray-900">{sensor.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Zone {sensor.zone} · Updated 5 min ago</p>
        </div>
        <RiskBadge level={sensor.status} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(m => (
          <div key={m.label} className={`p-3 rounded-xl ${m.safe ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className="mb-1 text-xs text-gray-500">{m.label}</p>
            <p className={`text-xl font-bold mb-2 ${m.safe ? 'text-emerald-700' : 'text-red-600'}`}>
              {m.value}<span className="text-xs font-normal ml-0.5">{m.unit}</span>
            </p>
            <Gauge value={m.value} max={m.max} safe={m.safeT} warn={m.warnT} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WaterQuality() {
  const [filter, setFilter] = useState('all')
  const [sensors, setSensors] = useState([]) // State for real data
  const [loading, setLoading] = useState(true)

  // Fetch real sensor data from backend
  useEffect(() => {
    async function fetchSensors() {
      try {
        const response = await api.get('/sensors')
        setSensors(response.data.data)
      } catch (error) {
        console.error("Error fetching sensors:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSensors()
  }, [])

  if (loading) return <div className="p-5 text-gray-500">Loading live sensor data...</div>

  // Filter based on real data
  const filtered = filter === 'all' ? sensors : sensors.filter(s => s.status === filter)

  return (
    <div className="space-y-5">
      {/* ... (Keep the header section) */}

      {/* Summary bar updated to use real 'sensors' state instead of mockSensors */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in">
        {[
          { label: 'Safe sensors',   value: sensors.filter(s=>s.status==='safe').length,    color: 'emerald' },
          { label: 'Warning',        value: sensors.filter(s=>s.status==='warning').length, color: 'amber'   },
          { label: 'Danger',         value: sensors.filter(s=>s.status==='danger').length,  color: 'red'     },
        ].map(s => (
          <div key={s.label} className={`card text-center py-3 border-t-4 border-t-${s.color}-400`}>
            <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
           <p className="col-span-2 text-sm text-gray-400">No sensors found for this filter.</p>
        ) : (
           filtered.map((s, i) => <SensorCard key={s._id || s.id} sensor={s} idx={i} />)
        )}
      </div>
    </div>
  )
}
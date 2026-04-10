import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import api from '../services/api.js'
import clsx from 'clsx'

function RiskMeter({ value }) {
  const color = value >= 70 ? '#ef4444' : value >= 45 ? '#f59e0b' : '#10b981'
  const label = value >= 70 ? 'High Risk' : value >= 45 ? 'Moderate' : 'Low Risk'
  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="46" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
          <circle cx="56" cy="56" r="46" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 46 * value / 100} ${2 * Math.PI * 46}`}
            strokeLinecap="round"
            transform="rotate(-90 56 56)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-gray-900" style={{ color }}>{value}</p>
          <p className="text-xs text-gray-400">/ 100</p>
        </div>
      </div>
      <p className="mt-1 text-sm font-bold" style={{ color }}>{label}</p>
    </div>
  )
}

export default function AIPredictor() {
  const [zones, setZones] = useState([])
  const [selected, setSelected] = useState(null)
  const [running,  setRunning]  = useState(false)
  const [ran,      setRan]      = useState(false)
  const [loading, setLoading]   = useState(true)

  // Fetch real zones from the backend
  useEffect(() => {
    async function loadZones() {
      try {
        const response = await api.get('/zones')
        const realZones = response.data.data.map(z => ({
          zone: z.zoneId,
          name: z.name,
          riskNow: z.riskScore,
          // Simulate AI prediction based on current risk
          risk24h: Math.min(100, z.riskScore + Math.floor(Math.random() * 10 - 2)),
          risk48h: Math.min(100, z.riskScore + Math.floor(Math.random() * 15 - 5)),
          risk72h: Math.max(0, Math.min(100, z.riskScore + Math.floor(Math.random() * 20 - 10))),
          disease: z.riskScore >= 70 ? 'Cholera / Typhoid' : z.riskScore >= 40 ? 'Dysentery' : 'Low Risk',
          factors: z.riskScore >= 70 
            ? ['High turbidity', 'Low chlorine', 'Cases reported'] 
            : ['Sensor normal', 'Recent maintenance']
        }))
        setZones(realZones)
        setSelected(realZones[0]) // Select first zone by default
      } catch (error) {
        console.error("Failed to load predictor zones", error)
      } finally {
        setLoading(false)
      }
    }
    loadZones()
  }, [])

async function runModel() {
    setRunning(true)
    try {
      // 1. Call your real AI backend engine!
      const response = await api.post(`/zones/${selected.zone}/predict`)
      const aiData = response.data.data;
      
      // 2. Update the UI with the real prediction!
      setSelected(prev => ({
        ...prev,
        riskNow: aiData.riskNow,
        risk24h: aiData.risk24h,
        risk48h: aiData.risk48h,
        risk72h: aiData.risk72h,
        disease: aiData.disease,
        factors: aiData.factors
      }))
      
      setRan(true)
    } catch (error) {
      console.error("AI Prediction Failed:", error)
    } finally {
      setRunning(false)
    }
  }

  if (loading) return <div className="p-5 text-gray-500">Initializing AI Model...</div>
  if (!selected) return <div className="p-5 text-gray-500">No zones available for analysis.</div>

  const forecast = [
    { time: 'Now',   risk: selected.riskNow  },
    { time: '+24h',  risk: selected.risk24h  },
    { time: '+48h',  risk: selected.risk48h  },
    { time: '+72h',  risk: selected.risk72h  },
  ]

  // Dynamic radar data based on the real riskScore
  const radarData = [
    { factor: 'pH',        value: selected.riskNow > 60 ? 80 : 30 },
    { factor: 'Turbidity', value: selected.riskNow > 60 ? 90 : 25 },
    { factor: 'Coliform',  value: selected.riskNow > 60 ? 85 : 20 },
    { factor: 'Rainfall',  value: 60 },
    { factor: 'Reports',   value: selected.riskNow > 60 ? 70 : 35 },
    { factor: 'Chlorine',  value: selected.riskNow > 60 ? 75 : 40 },
  ]

  return (
    <div className="space-y-5">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900">AI Outbreak Predictor</h2>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Beta</span>
        </div>
        <p className="text-xs text-gray-400">ML model using water quality + weather + reports to predict 72-hour outbreak risk</p>
      </div>

      {/* Zone selector */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 animate-fade-in stagger-1">
        {zones.slice(0, 8).map(z => (
          <button key={z.zone} onClick={() => { setSelected(z); setRan(false) }}
            className={clsx('p-3 rounded-xl border-2 text-left transition-all',
              selected.zone === z.zone
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            )}>
            <p className="text-xs font-bold text-gray-700">Zone {z.zone}</p>
            <p className="text-xs text-gray-400 truncate">{z.name}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full" style={{
                width: `${z.riskNow}%`,
                background: z.riskNow>=70?'#ef4444':z.riskNow>=45?'#f59e0b':'#10b981'
              }}/>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main prediction */}
        <div className="space-y-4 lg:col-span-2">
          <div className="card animate-fade-in stagger-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{selected.name} — Risk Forecast</p>
                <p className="text-xs text-gray-400">Primary disease risk: <b className="text-gray-600">{selected.disease}</b></p>
              </div>
              <button onClick={runModel} disabled={running}
                className={clsx('btn-primary text-xs px-4 py-2 flex items-center gap-2',
                  running && 'opacity-75 cursor-wait'
                )}>
                {running ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Running model...
                  </>
                ) : ran ? '↻ Re-run' : '▶ Run Prediction'}
              </button>
            </div>

            <div className="flex items-center gap-8 mb-5">
              <RiskMeter value={selected.riskNow} />
              <div className="flex-1">
                <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Contributing Factors</p>
                {selected.factors.map(f => (
                  <div key={f} className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"/>
                    <span className="text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {ran && (
              <div className="animate-fade-in">
                <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">72-Hour Forecast</p>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={forecast} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [`${v}%`, 'Risk Score']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2.5} fill="url(#fg)"
                      dot={{ r: 5, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 7 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Radar */}
        <div className="card animate-slide-up stagger-3">
          <p className="mb-1 text-sm font-bold text-gray-800">Risk Factor Analysis</p>
          <p className="mb-4 text-xs text-gray-400">Zone {selected.zone} · {selected.name}</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="pt-3 mt-3 border-t border-gray-50">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">Model confidence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '84%' }} />
              </div>
              <span className="text-xs font-bold text-emerald-600">84%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
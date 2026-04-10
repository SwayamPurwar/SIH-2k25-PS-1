import { useState, useEffect } from 'react' // Add useEffect
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import api from '../services/api.js' // Import real API
import RiskBadge from '../components/ui/RiskBadge.jsx'
import clsx from 'clsx'

const riskColors  = { high:'#ef4444', medium:'#f59e0b', low:'#3b82f6', safe:'#10b981' }
const riskRadius  = { high: 900, medium: 700, low: 500, safe: 400 }

export default function DiseaseMap() {
  const [active, setActive] = useState(null)
  const [zones, setZones] = useState([]) // State for real zones
  const [loading, setLoading] = useState(true)

  // Fetch real zone data from the backend
  useEffect(() => {
    async function loadZones() {
      try {
        const response = await api.get('/zones')
        setZones(response.data.data)
      } catch (error) {
        console.error("Failed to load map zones:", error)
      } finally {
        setLoading(false)
      }
    }
    loadZones()
  }, [])

  if (loading) return <div className="p-5 text-gray-500">Loading map data...</div>

  return (
    <div className="space-y-4">
      {/* Header (Keep as is) */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-base font-bold text-gray-900">Disease Risk Map</h2>
          <p className="text-xs text-gray-400 mt-0.5">Click a zone circle for details</p>
        </div>
        <div className="flex gap-3">
          {Object.entries(riskColors).map(([level, color]) => (
            <span key={level} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {level.charAt(0).toUpperCase()+level.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Map */}
        <div className="p-0 overflow-hidden lg:col-span-3 card animate-fade-in">
          <MapContainer center={[22.7196, 75.8577]} zoom={13}
            style={{ height: '460px', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Map over REAL zones instead of mockMapZones */}
            {zones.map(zone => (
              <Circle key={zone._id || zone.zoneId}
                center={[zone.lat, zone.lng]}
                radius={riskRadius[zone.riskLevel] || 400} // Use riskLevel from DB
                pathOptions={{
                  color: riskColors[zone.riskLevel] || '#10b981', 
                  fillColor: riskColors[zone.riskLevel] || '#10b981',
                  fillOpacity: 0.25, weight: 2,
                }}
                eventHandlers={{ click: () => setActive(zone) }}>
                <Popup>
                  <div className="p-1">
                    <p className="mb-1 text-sm font-bold text-gray-900">{zone.name}</p>
                    <p className="mb-2 text-xs text-gray-500">Zone {zone.zoneId}</p>
                    <RiskBadge level={zone.riskLevel} />
                    {zone.cases > 0 && <p className="mt-2 text-xs font-semibold text-red-600">{zone.cases} confirmed cases</p>}
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Zone panel list */}
        <div className="space-y-2 animate-slide-up stagger-2 overflow-y-auto max-h-[460px] pr-2">
          <p className="px-1 text-xs font-bold tracking-wider text-gray-400 uppercase">Zones</p>
          {zones.map((z) => (
            <div key={z._id || z.zoneId}
              onClick={() => setActive(z)}
              className={clsx(
                'p-3 rounded-xl border-2 cursor-pointer transition-all duration-150',
                active?.zoneId === z.zoneId
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
              )}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-gray-800">Zone {z.zoneId}</p>
                <RiskBadge level={z.riskLevel} />
              </div>
              <p className="text-xs text-gray-400 truncate">{z.name}</p>
              {z.cases > 0 && (
                <p className="mt-1 text-xs font-semibold text-red-500">{z.cases} cases</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
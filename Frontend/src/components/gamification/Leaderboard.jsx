import { useState, useEffect } from 'react' // Added hooks
import { useTranslation } from 'react-i18next'
import api from '../../services/api.js' // Added API

const rankColors = ['text-amber-500', 'text-gray-400', 'text-orange-500']
const levelPill = {
  Gold:   'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Bronze: 'bg-orange-100 text-orange-700',
}

export default function Leaderboard() {
  const { t } = useTranslation()
  const [leaders, setLeaders] = useState([])
  
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await api.get('/users/leaderboard?limit=5')
        setLeaders(response.data.data)
      } catch (error) {
        console.error("Failed to load leaderboard", error)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="card">
      <p className="mb-3 text-sm font-semibold text-gray-800">{t('gamification.leaderboard')}</p>
      
      {leaders.length === 0 ? (
        <p className="text-xs text-gray-400">Loading top citizens...</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {leaders.map((u, index) => {
            const rank = index + 1; // Backend returns sorted data, so index+1 is rank
            return (
              <div key={u._id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className={`w-5 text-sm font-bold ${rankColors[rank - 1] || 'text-gray-400'}`}>{rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">Zone {u.zone}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelPill[u.level] || levelPill.Bronze}`}>{u.level}</span>
                <span className="text-sm font-semibold text-gray-700 min-w-[42px] text-right">{u.points}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { mockLeaderboard } from '../data/mockData.js' // We completely removed mockUser!
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../services/api.js'
import { useUser } from '../store/userStore' // 1. Hooking into the global app state

const ACTIONS = [
  { key: 'report',   pts: 50, label: 'Submit water report',      icon: '📋', color: 'emerald' },
  { key: 'checkin',  pts: 10, label: 'Daily check-in',           icon: '📅', color: 'blue'    },
  { key: 'quiz',     pts: 30, label: 'Complete health quiz',     icon: '🧠', color: 'purple'  },
  { key: 'share',    pts: 25, label: 'Share alert to community', icon: '📢', color: 'amber'   },
]

const rankMedal = ['🥇','🥈','🥉']
const levelThresholds = { Bronze: [0,500], Silver: [500,2000], Gold: [2000,Infinity] }
const levelStyle = {
  Gold:   'bg-amber-100 text-amber-700 border border-amber-200',
  Silver: 'bg-slate-100 text-slate-600 border border-slate-200',
  Bronze: 'bg-orange-100 text-orange-700 border border-orange-200',
}

export default function GamificationProfile() {
  // 2. We now use the REAL logged-in user from your store!
  const { user, login } = useUser(); 
  const [claimed, setClaimed] = useState([]);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        try {
          const res = await api.get('/users/profile');
          login(res.data.data, localStorage.getItem('token'));
        } catch (err) {
          toast.error("Please log in to view your real profile");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, login]);

  async function earn(action) {
    if (claimed.includes(action.key)) {
      toast.error('Already claimed today!'); return;
    }
    
    try {
      // 3. Save points to the MongoDB Database
      const res = await api.post('/users/claim-points', { 
        action: action.key, 
        points: action.pts 
      });
      
      // 4. Update the global store so Navbar updates instantly
      login(res.data.data, localStorage.getItem('token')); 
      setClaimed(c => [...c, action.key]);
      toast.success(`+${action.pts} pts — ${action.label}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to connect to database');
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  if (!user) return <div className="p-10 text-center text-gray-500">Please log in to see your profile.</div>;

  // Real Dynamic Stats
  const pts = user.points || 0;
  const reports = user.reports || 0;
  const level = pts >= 2000 ? 'Gold' : (pts >= 500 ? 'Silver' : 'Bronze');
  const pct = level === 'Gold' ? 100 : Math.round((pts / levelThresholds[level][1]) * 100);
  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : '??';
  
  // We provide some empty default badges if the user is new
  const badges = user.badges?.length > 0 ? user.badges : [
    { id: 'b1', name: 'Water Guardian',   earned: false, desc: 'Submit 10 reports', progress: reports, target: 10 },
    { id: 'b2', name: 'Community Hero',   earned: false, desc: 'Reach 2000 points', progress: pts, target: 2000 }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">

        <div className="text-white border-0 card animate-fade-in bg-gradient-to-br from-emerald-600 to-teal-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-2xl bg-white/20">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <span className={clsx('text-xs px-2.5 py-0.5 rounded-full font-bold', levelStyle[level])}>{level}</span>
              </div>
              <p className="text-sm text-emerald-100">Zone {user.zone || '1'} · {user.city || 'Indore'}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{pts}</p>
              <p className="text-xs text-emerald-100">total points</p>
            </div>
          </div>

          <div className="flex justify-between mb-1 text-xs text-emerald-100">
            <span>Progress to {level === 'Silver' ? 'Gold' : level === 'Bronze' ? 'Silver' : 'Max'}</span>
            <span>{pts} / {level === 'Gold' ? '∞' : levelThresholds[level][1]} XP</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-700 bg-white rounded-full" style={{ width: `${pct}%` }} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Total Points', value: pts },
              { label: `${user.streak || 0}d Streak`, value: `${user.streak || 0}🔥` },
              { label: 'Reports', value: reports },
            ].map(s => (
              <div key={s.label} className="p-3 text-center bg-white/10 rounded-xl">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-emerald-100 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in stagger-2">
          <p className="mb-4 text-sm font-bold text-gray-800">Earn Points Today</p>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map(a => (
              <button key={a.key} onClick={() => earn(a)}
                disabled={claimed.includes(a.key)}
                className={clsx(
                  'p-4 rounded-xl border-2 text-left transition-all duration-150 group',
                  claimed.includes(a.key)
                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 active:scale-98'
                )}>
                <div className="mb-2 text-2xl">{a.icon}</div>
                <p className="text-sm font-semibold leading-tight text-gray-800">{a.label}</p>
                <p className={`text-sm font-bold mt-1 text-emerald-600`}>
                  {claimed.includes(a.key) ? '✓ Claimed' : `+${a.pts} pts`}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in stagger-3">
          <p className="mb-4 text-sm font-bold text-gray-800">Badges & Achievements</p>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b, i) => (
              <div key={b.id || i} className={clsx(
                'p-4 rounded-xl border-2 transition-all',
                b.earned ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                    b.earned ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-200 text-gray-400'
                  )}>{b.earned ? '★' : '○'}</div>
                  <div>
                    <p className={clsx('text-xs font-bold', b.earned ? 'text-emerald-800' : 'text-gray-400')}>{b.name}</p>
                    <p className="text-xs text-gray-400">{b.desc}</p>
                  </div>
                </div>
                {!b.earned && b.target && (
                  <>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div className="h-full transition-all duration-700 rounded-full bg-emerald-400"
                        style={{ width: `${Math.min(100, Math.round(((b.progress||0) / b.target) * 100))}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{b.progress||0} / {b.target}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-slide-up stagger-2">
        <div className="card">
          <p className="mb-4 text-sm font-bold text-gray-800">Zone Leaderboard</p>
          <div className="space-y-2">
            {mockLeaderboard.map((u, i) => (
              <div key={u.rank}
                className={clsx('flex items-center gap-3 p-3 rounded-xl transition-colors',
                  u.name === user?.name ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50'
                )}>
                <span className="text-lg text-center w-7">{rankMedal[i] || `${u.rank}`}</span>
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-sm font-semibold truncate', u.name === user?.name ? 'text-emerald-700' : 'text-gray-800')}>{u.name}</p>
                  <p className="text-xs text-gray-400">Zone {u.zone} · {u.reports || 0} reports</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{u.points}</p>
                  <p className="text-xs text-gray-400">{u.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
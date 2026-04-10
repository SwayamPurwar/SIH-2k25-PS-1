import { useLocation } from 'react-router-dom'
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx'
import { useUser } from '../../store/userStore' // NEW: Import the global user store

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',            sub: 'Live community health overview'  },
  '/map':       { title: 'Disease Map',           sub: 'Zone-wise risk heatmap'          },
  '/water':     { title: 'Water Quality',         sub: 'Sensor readings across zones'    },
  '/alerts':    { title: 'Alert Centre',          sub: 'Active warnings & responses'     },
  '/ai':        { title: 'AI Outbreak Predictor', sub: '72-hour risk forecast'           },
  '/report':    { title: 'Submit Report',         sub: 'Report water issues & earn pts'  },
  '/profile':   { title: 'My Profile',            sub: 'Points, badges & leaderboard'   },
}

export default function Navbar({ onMenuClick }) {
  const loc  = useLocation()
  const page = PAGE_TITLES[loc.pathname] || PAGE_TITLES['/dashboard']
  
  // NEW: Grab the user from your global context
  const { user } = useUser() 
  
  // NEW: Safely get the first two letters of their name, or default to '??'
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : '??'

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-100 md:px-6 shrink-0">

      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center text-gray-500 transition-colors lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="animate-fade-in">
          <h1 className="text-sm font-bold leading-tight text-gray-900">{page.title}</h1>
          <p className="hidden text-xs text-gray-400 sm:block">{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Language switcher — hidden on very small screens */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Alert bell */}
        <div className="relative">
          <button className="flex items-center justify-center text-red-500 transition-colors bg-red-50 w-9 h-9 rounded-xl hover:bg-red-100">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse -top-1 -right-1">
            2
          </span>
        </div>

        {/* Avatar - FIXED to use dynamic initials */}
        <div className="flex items-center justify-center text-xs font-bold text-white transition-colors cursor-pointer w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700">
          {userInitials}
        </div>
      </div>
    </header>
  )
}
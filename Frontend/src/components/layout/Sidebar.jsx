import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useUser } from '../../store/userStore' // NEW: Use your global user store!

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { to: '/map', label: 'Disease Map', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> },
  { to: '/water', label: 'Water Quality', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> },
  { to: '/alerts', label: 'Alerts', badge: 2, icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { to: '/ai', label: 'AI Predictor', isNew: true, icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg> },
  { to: '/report', label: 'Submit Report', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { to: '/profile', label: 'My Profile', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function Sidebar({ isOpen, onClose }) {
  // NEW: Pull the user and your built-in logout function from context
  const { user, logout } = useUser();

  return (
    <>
      <aside className={clsx(
        'bg-white border-r border-gray-100 flex flex-col py-5 px-3 shadow-sm z-30 transition-transform duration-300 ease-in-out',
        'lg:relative lg:translate-x-0 lg:w-60 lg:shrink-0 lg:min-h-screen',
        'fixed inset-y-0 left-0 w-72',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>

        {/* Logo + close button */}
        <div className="flex items-center justify-between px-2 mb-7">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shadow-sm w-9 h-9 rounded-xl bg-emerald-600 shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C16 4 6 14 6 20a10 10 0 0020 0C26 14 16 4 16 4z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-gray-900">AquaGuard</p>
              <p className="mt-0.5 text-xs text-gray-400">Indore, MP</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-lg lg:hidden hover:bg-gray-100">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col flex-1 overflow-y-auto gap-0.5">
          <p className="px-3 mb-2 text-xs font-semibold tracking-widest text-gray-300 uppercase">Menu</p>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{item.badge}</span>}
              {item.isNew && <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">New</span>}
            </NavLink>
          ))}
        </nav>

        {/* User card at bottom - FIXED to map seamlessly to userStore */}
        <div 
          className="relative p-3 mx-1 mt-4 border border-gray-100 cursor-pointer rounded-xl bg-gray-50 group hover:border-red-100" 
          onClick={logout} 
          title="Click to Logout"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white uppercase rounded-full bg-emerald-600 shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : '??'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user ? user.name : 'Guest'}</p>
              <p className="text-xs text-gray-400">{user ? `${user.points || 0} pts` : 'No points yet'}</p>
            </div>
            <div className="flex items-center justify-center w-6 h-6 text-gray-400 transition-colors rounded group-hover:bg-red-100 group-hover:text-red-500">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>

      </aside>
    </>
  )
}
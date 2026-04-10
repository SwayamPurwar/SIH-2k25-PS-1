import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx'
import api from '../services/api.js'
import toast from 'react-hot-toast'
import { useUser } from '../store/userStore' // 1. NEW: Import the store!

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [pass, setPass]   = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useUser() // 2. NEW: Extract the login function

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const isEmail = phone.includes('@');
      const response = await api.post('/auth/login', {
        email: isEmail ? phone : undefined,
        phone: !isEmail ? phone : undefined,
        password: pass
      })
      
      toast.success('Welcome back!')
      
      // 3. FIXED: Use your store's login function instead of manually setting localStorage.
      // This saves the token AND updates the global state simultaneously!
      login(response.data.data.user, response.data.data.token) 
      
      navigate('/dashboard')
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">AquaGuard</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="border-0 shadow-lg card">
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone / Email</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-2 text-sm btn-primary">
              {loading ? 'Signing in...' : 'Sign in to AquaGuard'}
            </button>
          </form>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              New user? <Link to="/register" className="font-medium text-emerald-600 hover:underline">Register here</Link>
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
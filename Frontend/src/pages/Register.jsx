import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx'
import api from '../services/api.js'
import toast from 'react-hot-toast'

const ROLES = [
  { key: 'citizen',     label: 'Community Member', icon: '👤', desc: 'Report & earn points' },
  { key: 'officer',     label: 'Health Officer',   icon: '🏥', desc: 'Monitor & respond'    },
  { key: 'fieldworker', label: 'Field Worker',     icon: '🔬', desc: 'Test & verify data'   },
]

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole]   = useState('citizen')
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [pass, setPass]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Figure out if they typed an email or a phone number
      const isEmail = phone.includes('@');
      
      // Build a clean payload
      const payload = {
        name: name,
        password: pass,
        role: role,
        zone: '1' // Defaulting to zone 1
      };

      // Only attach the one they actually provided
      if (isEmail) {
        payload.email = phone;
      } else {
        payload.phone = phone;
      }
      
      // Send it to the backend
      const response = await api.post('/auth/register', payload)
      
      toast.success('Account created successfully!')
      localStorage.setItem('token', response.data.data.token) // Save login token
      navigate('/dashboard') // Send to dashboard
      
   } catch (error) {
  // This will pull the exact error message sent by the backend!
  const errorMessage = error.response?.data?.message || error.message;
  console.error("Exact Signup Error:", errorMessage);
  
  // If you use toast notifications:
  // toast.error(errorMessage);
} finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">AquaGuard</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new account</p>
        </div>

        <div className="border-0 shadow-lg card">
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">I am a...</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button key={r.key} type="button" onClick={() => setRole(r.key)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    role === r.key ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'
                  }`}>
                  <div className="mb-1 text-xl">{r.icon}</div>
                  <p className={`text-xs font-semibold leading-tight ${role === r.key ? 'text-emerald-700' : 'text-gray-700'}`}>{r.label}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone / Email</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-2 text-sm btn-primary">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Already have an account? <Link to="/login" className="font-medium text-emerald-600 hover:underline">Sign in</Link>
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
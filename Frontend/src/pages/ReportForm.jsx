import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import api from '../services/api.js'

const SYMPTOMS = [
  'Diarrhoea','Vomiting','Stomach cramps',
  'Nausea','Fever','Jaundice',
  'Skin rash','Unusual water colour','Bad odour',
]

export default function ReportForm() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [desc, setDesc]         = useState('')
  const [zone, setZone]         = useState('')
  const [submitting, setSubmitting] = useState(false)

  // --- NEW: OFFLINE SYNC LOGIC ---
  useEffect(() => {
    // This function runs automatically when the phone reconnects to the internet
    async function syncOfflineReports() {
      const offlineData = JSON.parse(localStorage.getItem('offline_reports') || '[]');
      
      if (offlineData.length > 0) {
        toast.loading(`Syncing ${offlineData.length} offline reports...`, { id: 'sync' });
        
        let successCount = 0;
        for (const report of offlineData) {
          try {
            await api.post('/reports', report);
            successCount++;
          } catch (error) {
            console.error("Failed to sync a report:", error);
          }
        }
        
        // Clear the memory once synced!
        localStorage.setItem('offline_reports', JSON.stringify([]));
        toast.success(`Successfully synced ${successCount} reports to the cloud!`, { id: 'sync' });
      }
    }

    // Listen for the browser's native 'online' event
    window.addEventListener('online', syncOfflineReports);
    
    // Attempt a sync right when the component loads, just in case they just opened the app
    if (navigator.onLine) syncOfflineReports();

    return () => window.removeEventListener('online', syncOfflineReports);
  }, []);
  // ------------------------------

  function toggleSymptom(s) {
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

 async function handleSubmit(e) {
    e.preventDefault()
    if (!zone) { toast.error('Please select a zone'); return }
    setSubmitting(true)
    
    const payload = { zone, symptoms: selected, description: desc };

    try {
      // If we are currently offline, SKIP the API call and go straight to catch block
      if (!navigator.onLine) throw new Error("Offline");

      // Make real API request to the backend
      await api.post('/reports', payload)
      toast.success(t('report.success'))
      
    } catch (error) {
      // --- NEW: SAVE TO PHONE STORAGE IF OFFLINE ---
      if (!navigator.onLine || error.message === "Network Error") {
        const existingReports = JSON.parse(localStorage.getItem('offline_reports') || '[]');
        existingReports.push(payload);
        localStorage.setItem('offline_reports', JSON.stringify(existingReports));
        
        toast.success('No internet. Report saved to phone and will sync later!', {
          icon: '📶',
          duration: 4000
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit report')
      }
    } finally {
      setSelected([]); setDesc(''); setZone('');
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-bold text-gray-900">{t('report.title')}</h2>
        <p className="text-xs text-gray-400 mt-0.5">Submit observations to earn +50 points</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card">
          <label className="block mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
            {t('report.location')}
          </label>
          <select value={zone} onChange={e => setZone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">Select your zone...</option>
            {Array.from({length:12},(_,i)=>i+1).map(z=>(
              <option key={z} value={z}>Zone {z} — Indore</option>
            ))}
          </select>
        </div>

        <div className="card">
          <label className="block mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
            {t('report.symptoms')}
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button key={s} type="button" onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selected.includes(s)
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <label className="block mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
            {t('report.description')}
          </label>
          <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Describe what you observed about the water or symptoms..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
        </div>

        <div className="flex items-center justify-between p-4 border bg-emerald-50 rounded-xl border-emerald-100">
          <div>
            <p className="text-sm font-bold text-emerald-700">Earn points for reporting</p>
            <p className="text-xs text-emerald-600 mt-0.5">+50 pts · +20 bonus if verified</p>
          </div>
          <span className="text-3xl font-black text-emerald-500">+50</span>
        </div>

        <button type="submit" disabled={submitting}
          className="flex items-center justify-center w-full gap-2 py-3 text-sm btn-primary disabled:opacity-60">
          {submitting ? 'Submitting...' : t('report.submit')}
        </button>
      </form>
    </div>
  )
}
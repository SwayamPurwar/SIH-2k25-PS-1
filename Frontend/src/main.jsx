import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './i18n.js'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { UserProvider } from './store/userStore' // Your correct import!
import 'virtual:pwa-register'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
})

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#fff1f1', minHeight: '100vh' }}>
          <h2 style={{ color: '#c00', marginBottom: '1rem' }}>App Error — check this:</h2>
          <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <p style={{ marginTop: '1rem', color: '#555' }}>Share this error message and it will be fixed immediately.</p>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* WE WRAPPED YOUR APP IN THE PROVIDER HERE 👇 */}
        <UserProvider> 
          <BrowserRouter>
            <App />
            <Toaster position="top-right" />
          </BrowserRouter>
        </UserProvider>
        {/* 👆 AND CLOSED IT HERE */}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
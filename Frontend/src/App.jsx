import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import WaterQuality from './pages/WaterQuality.jsx'
import AlertCentre from './pages/AlertCentre.jsx'
import DiseaseMap from './pages/DiseaseMap.jsx'
import ReportForm from './pages/ReportForm.jsx'
import GamificationProfile from './pages/GamificationProfile.jsx'
import AIPredictor from './pages/AIPredictor.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import { UserProvider } from './store/userStore'
// 1. Create a ProtectedRoute component
function ProtectedRoute({ children }) {
  // Check if the user has a token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // If they have a token, let them access the route
  return children;
}

export default function App() {
  return (
    <UserProvider>
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes wrapped in ProtectedRoute */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map"       element={<DiseaseMap />} />
        <Route path="water"     element={<WaterQuality />} />
        <Route path="alerts"    element={<AlertCentre />} />
        <Route path="ai"        element={<AIPredictor />} />
        <Route path="report"    element={<ReportForm />} />
        <Route path="profile"   element={<GamificationProfile />} />
      </Route>
    </Routes>
    </UserProvider>
  )
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './store/storage'
import CustomCursor from './components/ui/CustomCursor'
import XPNotification from './components/ui/XPNotification'
import AppLayout from './components/layout/AppLayout'

import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import HabitsPage from './pages/HabitsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import RewardsPage from './pages/RewardsPage'

function ProtectedRoute({ children }) {
  const user = getUser()
  if (!user) return <Navigate to="/" replace />
  return <AppLayout>{children}</AppLayout>
}

function PublicRoute({ children }) {
  const user = getUser()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <XPNotification />
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

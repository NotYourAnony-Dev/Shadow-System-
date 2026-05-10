import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUser } from '../../store/storage'
import RankBadge from '../ui/RankBadge'

const NAV_ITEMS = [
  { path: '/dashboard', icon: '⚡', label: 'Dashboard' },
  { path: '/habits', icon: '🎯', label: 'Habits' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/rewards', icon: '🏆', label: 'Rewards' },
]

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen flex aurora-bg">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 z-40 flex-shrink-0
          flex flex-col
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: 'rgba(6, 0, 15, 0.95)',
          borderRight: '1px solid rgba(139,92,246,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-purple-600/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)', boxShadow: '0 0 15px rgba(139,92,246,0.5)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-widest text-white">SHADOW</div>
              <div className="font-display font-bold text-sm tracking-widest neon-text-purple">SYSTEM</div>
            </div>
          </div>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-purple-600/10">
          <div
            className="p-3 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 15px rgba(139,92,246,0.3)',
              }}
            >
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-sm text-white truncate">{user.username}</div>
              <RankBadge rank={user.rank} level={user.level} size="xs" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
              className={`sidebar-link w-full text-left ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8B5CF6]" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-purple-600/10 space-y-2">
          {/* Streak display */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.2)' }}
          >
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-xs text-orange-400/60 font-mono">STREAK</div>
              <div className="font-display font-bold text-orange-400 text-sm">{user.streak} days</div>
            </div>
          </div>

          <button
            onClick={() => { navigate('/'); localStorage.removeItem('shadow_user') }}
            className="w-full text-left px-3 py-2 rounded-lg text-white/20 hover:text-red-400 text-xs font-mono tracking-wider transition-colors"
          >
            ⏻ EXIT SYSTEM
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 border-b border-purple-600/15 sticky top-0 z-20"
          style={{ background: 'rgba(6,0,15,0.95)', backdropFilter: 'blur(20px)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-white/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="font-display font-bold text-sm tracking-widest text-white">
            SHADOW<span className="neon-text-purple">SYSTEM</span>
          </span>
          <div className="text-xl">{user.avatar}</div>
        </div>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

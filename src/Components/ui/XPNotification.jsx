import { useState, useEffect, useCallback } from 'react'

let notifyFn = null

export const showXPGain = (amount, label = '') => {
  if (notifyFn) notifyFn(amount, label)
}

export default function XPNotification() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    notifyFn = (amount, label) => {
      const id = Date.now()
      const isPositive = amount > 0
      setNotifications(prev => [...prev, { id, amount, label, isPositive }])
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 2000)
    }
    return () => { notifyFn = null }
  }, [])

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-lg animate-bounce"
          style={{
            background: n.isPositive ? 'rgba(139,92,246,0.9)' : 'rgba(239,68,68,0.8)',
            boxShadow: n.isPositive ? '0 0 20px #8B5CF6' : '0 0 20px #ef4444',
            border: `1px solid ${n.isPositive ? '#8B5CF6' : '#ef4444'}`,
            animation: 'xpGain 1.8s ease-out forwards',
          }}
        >
          <span>{n.isPositive ? '⚡' : '💔'}</span>
          <span style={{ color: '#fff' }}>
            {n.isPositive ? '+' : ''}{n.amount} XP
          </span>
          {n.label && <span className="text-sm opacity-70">{n.label}</span>}
        </div>
      ))}
    </div>
  )
}

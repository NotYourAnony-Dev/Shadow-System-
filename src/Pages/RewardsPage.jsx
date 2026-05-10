import { useState } from 'react'
import { getUser, saveUser, getUnlockedAchievements, ALL_ACHIEVEMENTS } from '../store/storage'

const THEMES = [
  { id: 'default', name: 'Shadow Core', desc: 'Purple & cyan darkness', icon: '🌑', cost: 0, color: '#8B5CF6' },
  { id: 'crimson', name: 'Blood Moon', desc: 'Red & orange inferno', icon: '🔴', cost: 500, color: '#ef4444' },
  { id: 'emerald', name: 'Phantom Green', desc: 'Emerald & teal matrix', icon: '💚', cost: 500, color: '#10b981' },
  { id: 'gold', name: 'Monarch Gold', desc: 'Gold & amber royalty', icon: '👑', cost: 2000, color: '#f59e0b' },
  { id: 'ice', name: 'Void Ice', desc: 'Icy blue & white frost', icon: '🧊', cost: 1000, color: '#60a5fa' },
  { id: 'neon', name: 'Neon Abyss', desc: 'Hot pink & electric', icon: '⚡', cost: 1500, color: '#ec4899' },
]

const BADGES = [
  { id: 'badge_flame', name: 'Flame Keeper', icon: '🔥', desc: 'Maintain a 7-day streak', cost: 0, achievementRequired: 'streak_7' },
  { id: 'badge_shadow', name: 'Shadow Walker', icon: '🌑', desc: 'Reach Silver rank', cost: 200, level: 10 },
  { id: 'badge_diamond', name: 'Diamond Mind', icon: '💎', desc: 'Reach Diamond rank', cost: 1000, level: 35 },
  { id: 'badge_monarch', name: 'Monarch Crown', icon: '👑', desc: 'Reach Monarch rank', cost: 5000, level: 100 },
  { id: 'badge_ghost', name: 'Ghost Protocol', icon: '👻', desc: 'Complete 50 habits total', cost: 300, totalCompletions: 50 },
  { id: 'badge_dragon', name: 'Dragon Ascent', icon: '🐉', desc: 'Reach Level 20', cost: 500, level: 20 },
]

const XP_BOOSTS = [
  { id: 'boost_1h', name: '1-Hour Boost', desc: '+25% XP for 1 hour', icon: '⚡', cost: 100, multiplier: 1.25, duration: 60 },
  { id: 'boost_24h', name: 'Day Surge', desc: '+50% XP for 24 hours', icon: '🚀', cost: 300, multiplier: 1.5, duration: 1440 },
  { id: 'boost_week', name: 'Shadow Week', desc: '+100% XP for 7 days', icon: '💜', cost: 1000, multiplier: 2.0, duration: 10080 },
]

const FRAMES = [
  { id: 'frame_default', name: 'Basic Frame', icon: '⬜', desc: 'Simple border', cost: 0 },
  { id: 'frame_neon', name: 'Neon Pulse', icon: '🟣', desc: 'Glowing purple border', cost: 200 },
  { id: 'frame_gold', name: 'Gold Edge', icon: '🟡', desc: 'Royal golden frame', cost: 500 },
  { id: 'frame_cyber', name: 'Cyber Grid', icon: '🔷', desc: 'Cyberpunk grid frame', cost: 800 },
]

export default function RewardsPage() {
  const [user, setUser] = useState(getUser())
  const [activeTab, setActiveTab] = useState('themes')
  const [notification, setNotification] = useState(null)
  const unlockedAchievements = getUnlockedAchievements()

  const totalXP = user?.totalXp || 0
  const spentXP = user?.spentXp || 0
  const availableXP = Math.max(0, totalXP - spentXP)

  const ownedThemes = user?.ownedThemes || ['default']
  const ownedBadges = user?.ownedBadges || []
  const ownedFrames = user?.ownedFrames || ['frame_default']
  const activeTheme = user?.theme || 'default'
  const activeFrame = user?.frame || 'frame_default'

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const purchase = (item, category) => {
    if (availableXP < item.cost) {
      notify('Not enough XP!', 'error')
      return
    }

    const updates = {
      spentXp: (user.spentXp || 0) + item.cost,
    }

    if (category === 'theme') updates.ownedThemes = [...ownedThemes, item.id]
    if (category === 'badge') updates.ownedBadges = [...ownedBadges, item.id]
    if (category === 'frame') updates.ownedFrames = [...ownedFrames, item.id]

    const updated = { ...user, ...updates }
    saveUser(updated)
    setUser(updated)
    notify(`🎉 ${item.name} unlocked!`)
  }

  const activate = (item, type) => {
    const updates = {}
    if (type === 'theme') updates.theme = item.id
    if (type === 'frame') updates.frame = item.id
    const updated = { ...user, ...updates }
    saveUser(updated)
    setUser(updated)
    notify(`✅ ${item.name} activated!`)
  }

  const canAfford = (cost) => availableXP >= cost

  if (!user) return null

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">

      {/* Notification */}
      {notification && (
        <div
          className="fixed top-20 right-6 z-50 px-6 py-3 rounded-xl font-display font-bold text-white text-sm"
          style={{
            background: notification.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(139,92,246,0.9)',
            border: `1px solid ${notification.type === 'error' ? '#ef4444' : '#8B5CF6'}`,
            boxShadow: `0 0 20px ${notification.type === 'error' ? '#ef444480' : '#8B5CF680'}`,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Shadow Rewards</h1>
          <p className="text-white/30 text-sm font-mono mt-1">Spend XP to unlock exclusive cosmetics</p>
        </div>
        {/* XP balance */}
        <div
          className="glass rounded-2xl px-6 py-4 flex items-center gap-4"
          style={{ borderColor: 'rgba(139,92,246,0.3)' }}
        >
          <div className="text-3xl">⚡</div>
          <div>
            <div className="font-mono font-bold text-2xl neon-text-purple">{availableXP.toLocaleString()}</div>
            <div className="text-xs text-white/30 font-mono">Available XP</div>
          </div>
          <div className="ml-4 pl-4 border-l border-purple-600/20">
            <div className="font-mono text-white/40 text-sm">{totalXP.toLocaleString()}</div>
            <div className="text-xs text-white/20 font-mono">Total earned</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'themes', label: 'Themes', icon: '🎨' },
          { id: 'badges', label: 'Badges', icon: '🏅' },
          { id: 'frames', label: 'Frames', icon: '🖼️' },
          { id: 'boosts', label: 'XP Boosts', icon: '🚀' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2 rounded-xl text-sm font-display font-semibold tracking-wide transition-all"
            style={{
              background: activeTab === tab.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeTab === tab.id ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
              color: activeTab === tab.id ? '#c084fc' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === tab.id ? '0 0 15px rgba(139,92,246,0.2)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* THEMES */}
      {activeTab === 'themes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {THEMES.map(theme => {
            const owned = ownedThemes.includes(theme.id)
            const isActive = activeTheme === theme.id
            const affordable = canAfford(theme.cost)
            return (
              <RewardCard
                key={theme.id}
                item={theme}
                owned={owned}
                active={isActive}
                affordable={affordable}
                color={theme.color}
                onPurchase={() => purchase(theme, 'theme')}
                onActivate={() => activate(theme, 'theme')}
                actionLabel={isActive ? '✓ ACTIVE' : owned ? 'ACTIVATE' : `${theme.cost} XP`}
              />
            )
          })}
        </div>
      )}

      {/* BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map(badge => {
            const owned = ownedBadges.includes(badge.id)
            const achRequired = badge.achievementRequired ? unlockedAchievements.includes(badge.achievementRequired) : true
            const levelOk = badge.level ? (user.level >= badge.level) : true
            const canUnlock = achRequired && levelOk
            const affordable = canAfford(badge.cost)
            return (
              <RewardCard
                key={badge.id}
                item={badge}
                owned={owned}
                affordable={affordable && canUnlock}
                color="#8B5CF6"
                onPurchase={() => badge.cost === 0 || canUnlock ? purchase(badge, 'badge') : null}
                actionLabel={owned ? '✓ OWNED' : !canUnlock ? '🔒 LOCKED' : badge.cost === 0 ? 'FREE' : `${badge.cost} XP`}
                locked={!canUnlock && !owned}
              />
            )
          })}
        </div>
      )}

      {/* FRAMES */}
      {activeTab === 'frames' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FRAMES.map(frame => {
            const owned = ownedFrames.includes(frame.id)
            const isActive = activeFrame === frame.id
            const affordable = canAfford(frame.cost)
            return (
              <RewardCard
                key={frame.id}
                item={frame}
                owned={owned}
                active={isActive}
                affordable={affordable}
                color="#22D3EE"
                onPurchase={() => purchase(frame, 'frame')}
                onActivate={() => activate(frame, 'frame')}
                actionLabel={isActive ? '✓ ACTIVE' : owned ? 'ACTIVATE' : frame.cost === 0 ? 'FREE' : `${frame.cost} XP`}
              />
            )
          })}
        </div>
      )}

      {/* BOOSTS */}
      {activeTab === 'boosts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {XP_BOOSTS.map(boost => {
            const affordable = canAfford(boost.cost)
            return (
              <div
                key={boost.id}
                className="glass rounded-2xl p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: affordable ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)',
                  boxShadow: affordable ? '0 8px 32px rgba(139,92,246,0.1)' : 'none',
                }}
              >
                <div className="text-4xl text-center">{boost.icon}</div>
                <div className="text-center">
                  <div className="font-display font-bold text-white text-lg">{boost.name}</div>
                  <div className="text-white/40 text-sm mt-1">{boost.desc}</div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mt-2"
                    style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}
                  >
                    ×{boost.multiplier} XP MULTIPLIER
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!affordable) { notify('Not enough XP!', 'error'); return }
                    const updates = { spentXp: (user.spentXp || 0) + boost.cost }
                    const updated = { ...user, ...updates }
                    saveUser(updated)
                    setUser(updated)
                    notify(`🚀 ${boost.name} activated!`)
                  }}
                  className="w-full py-2.5 rounded-xl font-display font-bold text-sm tracking-widest transition-all"
                  style={{
                    background: affordable
                      ? 'linear-gradient(135deg, #8B5CF6, #6d28d9)'
                      : 'rgba(255,255,255,0.05)',
                    color: affordable ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: affordable ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
                    cursor: affordable ? 'pointer' : 'not-allowed',
                  }}
                >
                  {affordable ? `⚡ ${boost.cost} XP` : `🔒 Need ${boost.cost} XP`}
                </button>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

function RewardCard({ item, owned, active, affordable, color, onPurchase, onActivate, actionLabel, locked }) {
  return (
    <div
      className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] space-y-4"
      style={{
        borderColor: active ? `${color}60` : owned ? `${color}25` : locked ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.1)',
        background: active ? `${color}10` : undefined,
        boxShadow: active ? `0 0 25px ${color}20` : 'none',
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
            boxShadow: active ? `0 0 15px ${color}40` : 'none',
          }}
        >
          {item.icon}
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-white text-sm">{item.name}</div>
          <div className="text-white/30 text-xs mt-0.5">{item.desc}</div>
          {active && (
            <span
              className="inline-block text-xs font-mono px-2 py-0.5 rounded mt-1"
              style={{ background: `${color}20`, color }}
            >
              ACTIVE
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          if (active) return
          if (owned && onActivate) onActivate()
          else if (!owned) onPurchase()
        }}
        disabled={active || locked || (!owned && !affordable)}
        className="w-full py-2 rounded-xl font-display font-semibold text-sm tracking-widest transition-all"
        style={{
          background: active
            ? `${color}20`
            : owned
              ? `${color}15`
              : affordable && !locked
                ? `linear-gradient(135deg, ${color}40, transparent)`
                : 'rgba(255,255,255,0.03)',
          border: `1px solid ${active ? color + '60' : owned ? color + '30' : affordable && !locked ? color + '30' : 'rgba(255,255,255,0.08)'}`,
          color: active
            ? color
            : owned
              ? color
              : affordable && !locked
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(255,255,255,0.2)',
          cursor: active || locked || (!owned && !affordable) ? 'not-allowed' : 'pointer',
          boxShadow: (active || owned) ? `0 0 10px ${color}20` : 'none',
        }}
      >
        {actionLabel}
      </button>
    </div>
  )
}

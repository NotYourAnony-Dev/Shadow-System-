import { useState } from 'react'
import { getUser, saveUser, getHabits, ALL_ACHIEVEMENTS, getUnlockedAchievements, getRankForLevel, RANKS } from '../store/storage'
import RankBadge, { RankProgress } from '../components/ui/RankBadge'

const AVATAR_OPTIONS = ['🌑', '🔮', '⚔️', '🌀', '🦅', '🔱', '👁️', '💀', '🐉', '⚡', '🌟', '🔥']

export default function ProfilePage() {
  const [user, setUser] = useState(getUser())
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...user })
  const habits = getHabits()
  const unlockedIds = getUnlockedAchievements()

  const totalHabits = habits.length
  const totalCompletions = habits.reduce((s, h) => s + h.totalCompletions, 0)
  const rankConfig = getRankForLevel(user.level)

  const handleSave = () => {
    const updated = { ...user, ...form }
    saveUser(updated)
    setUser(updated)
    setEditing(false)
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (!user) return null

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">

      {/* Header card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(6,0,15,0.8)',
          border: `1px solid ${rankConfig.color}30`,
          boxShadow: `0 0 60px ${rankConfig.color}15`,
        }}
      >
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            backgroundImage: `url('https://i.ibb.co/xq8zPCRY/tmpcm200qq9.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(135deg, ${rankConfig.color}30, rgba(34,211,238,0.1))`,
          }}
        />

        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative"
              style={{
                background: `linear-gradient(135deg, ${rankConfig.color}30, rgba(6,0,15,0.8))`,
                border: `2px solid ${rankConfig.color}60`,
                boxShadow: `0 0 30px ${rankConfig.color}50`,
              }}
            >
              {user.avatar}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: rankConfig.color, boxShadow: `0 0 8px ${rankConfig.color}` }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div className="pb-1">
              <div className="font-display font-bold text-2xl text-white">{user.username}</div>
              <div className="text-white/40 text-sm font-body">{user.fullName}</div>
            </div>
            <div className="ml-auto pb-1">
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-xl text-xs font-mono tracking-widest transition-all"
                style={{
                  background: editing ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${editing ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`,
                  color: editing ? '#c084fc' : 'rgba(255,255,255,0.5)',
                }}
              >
                {editing ? '✕ CANCEL' : '✏ EDIT'}
              </button>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="mb-6 p-5 rounded-2xl space-y-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <h3 className="font-display font-bold text-white text-sm tracking-widest">EDIT PROFILE</h3>
              
              {/* Avatar picker */}
              <div>
                <label className="text-xs font-mono text-purple-400 mb-2 block">AVATAR</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      onClick={() => set('avatar', av)}
                      className="w-10 h-10 text-xl rounded-lg transition-all"
                      style={{
                        background: form.avatar === av ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.avatar === av ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'fullName', label: 'Full Name' },
                  { key: 'username', label: 'Username' },
                  { key: 'goal', label: 'Goal' },
                  { key: 'age', label: 'Age', type: 'number' },
                  { key: 'height', label: 'Height (cm)', type: 'number' },
                  { key: 'weight', label: 'Weight (kg)', type: 'number' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-mono text-purple-400 mb-1 block">{field.label.toUpperCase()}</label>
                    <input
                      type={field.type || 'text'}
                      value={form[field.key] || ''}
                      onChange={e => set(field.key, e.target.value)}
                      className="w-full glass rounded-lg px-3 py-2 text-white text-sm outline-none"
                      style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-xl font-display font-bold text-sm tracking-widest"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
              >
                SAVE CHANGES
              </button>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Level', value: user.level, icon: '⚡', color: rankConfig.color },
              { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: '#f97316' },
              { label: 'Completions', value: totalCompletions, icon: '✅', color: '#22D3EE' },
              { label: 'Habits', value: totalHabits, icon: '🎯', color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-3 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="font-mono font-bold text-lg mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-white/30 font-mono">{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <RankProgress level={user.level} xp={user.xp} xpToNext={user.xpToNext} rank={user.rank} />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Personal Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">Operator Profile</h3>
          {[
            { label: 'Mission', value: user.goal },
            { label: 'Age', value: `${user.age} years` },
            { label: 'Height', value: `${user.height} cm` },
            { label: 'Weight', value: `${user.weight} kg` },
            { label: 'Joined', value: new Date(user.joinedAt || user.createdAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) },
            { label: 'Total XP', value: (user.totalXp || 0).toLocaleString() },
            { label: 'Best Streak', value: `${user.longestStreak || 0} days` },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-1 border-b border-purple-600/10">
              <span className="text-xs font-mono text-white/30 tracking-widest">{item.label.toUpperCase()}</span>
              <span className="text-sm font-display text-white/70">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Rank progression */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">Rank Progression</h3>
          <div className="space-y-3">
            {RANKS.map(rank => {
              const isActive = user.rank === rank.name
              const isPassed = user.level > rank.maxLevel
              return (
                <div
                  key={rank.name}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: isActive ? `${rank.color}15` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? rank.color + '50' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? `0 0 15px ${rank.color}20` : 'none',
                    opacity: (!isActive && !isPassed) ? 0.4 : 1,
                  }}
                >
                  <div className="w-8 text-center">
                    {isPassed ? '✓' : isActive ? '▶' : '○'}
                  </div>
                  <span className="font-display font-bold text-sm tracking-widest" style={{ color: rank.color }}>
                    {rank.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/30 ml-auto">LVL {rank.minLevel}–{rank.maxLevel}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: rank.color }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-white text-lg">Achievements</h3>
          <span className="text-xs font-mono text-white/30">{unlockedIds.length}/{ALL_ACHIEVEMENTS.length} unlocked</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_ACHIEVEMENTS.map(ach => {
            const unlocked = unlockedIds.includes(ach.id)
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl flex items-start gap-3 transition-all duration-300 ${unlocked ? 'hover:scale-[1.02]' : 'achievement-locked'}`}
                style={{
                  background: unlocked ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${unlocked ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: unlocked ? '0 0 15px rgba(139,92,246,0.15)' : 'none',
                }}
              >
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <div className="font-display font-bold text-sm text-white">{ach.name}</div>
                  <div className="text-xs text-white/30 mt-0.5">{ach.desc}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: unlocked ? '#8B5CF6' : 'rgba(255,255,255,0.2)' }}>
                    +{ach.xp} XP {unlocked ? '✓' : '🔒'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  getHabits, addHabit, updateHabit, deleteHabit,
  toggleHabitComplete, addXP, getTodayStr, getDifficultyXP
} from '../store/storage'
import { showXPGain } from '../components/ui/XPNotification'

const CATEGORIES = ['General', 'Health', 'Fitness', 'Mind', 'Work', 'Learning', 'Social', 'Finance', 'Spiritual', 'Sleep']
const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', xp: 20, color: '#10b981' },
  { value: 'medium', label: 'Medium', xp: 50, color: '#f59e0b' },
  { value: 'hard', label: 'Hard', xp: 100, color: '#ef4444' },
  { value: 'legendary', label: 'Legendary', xp: 200, color: '#8B5CF6' },
]
const ICONS = ['⚡', '🎯', '🧘', '💪', '📚', '🏃', '🥗', '💧', '🧠', '✍️', '🎵', '🌅', '💤', '🧊', '🔥', '⚔️', '🌙', '🏋️', '🚴', '🎨']
const COLORS = ['#8B5CF6', '#22D3EE', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#84cc16']

export default function HabitsPage() {
  const [habits, setHabits] = useState(getHabits())
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const todayStr = getTodayStr()

  const refreshHabits = () => setHabits(getHabits())

  const handleToggle = (id) => {
    const { gained } = toggleHabitComplete(id)
    refreshHabits()
    if (gained > 0) {
      addXP(gained)
      showXPGain(gained)
    }
  }

  const handleSubmit = (formData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, { ...formData, xpReward: getDifficultyXP(formData.difficulty) })
    } else {
      addHabit(formData)
    }
    refreshHabits()
    setShowForm(false)
    setEditingHabit(null)
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    deleteHabit(id)
    refreshHabits()
    setDeleteConfirm(null)
  }

  const filtered = habits.filter(h => {
    if (filter === 'completed') return h.completedDates.includes(todayStr)
    if (filter === 'pending') return !h.completedDates.includes(todayStr)
    if (filter !== 'all') return h.category === filter
    if (searchQuery) return h.name.toLowerCase().includes(searchQuery.toLowerCase())
    return true
  })

  const completedCount = habits.filter(h => h.completedDates.includes(todayStr)).length

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Habit Protocols</h1>
          <p className="text-white/30 text-sm font-mono mt-1">
            {completedCount}/{habits.length} completed today
          </p>
        </div>
        <button
          onClick={() => { setEditingHabit(null); setShowForm(true) }}
          className="btn-primary text-sm px-6 py-2"
        >
          + NEW HABIT
        </button>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-white/40">
            <span>Daily completion</span>
            <span>{Math.round((completedCount / habits.length) * 100)}%</span>
          </div>
          <div className="progress-bar h-3">
            <div
              className="progress-fill"
              style={{
                width: `${habits.length > 0 ? (completedCount / habits.length) * 100 : 0}%`,
                boxShadow: '0 0 15px rgba(139,92,246,0.8)',
              }}
            />
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search habits..."
            className="w-full glass rounded-xl px-4 py-3 text-white/80 font-body text-sm outline-none focus:border-purple-600/50 transition-colors"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
          />
          <svg className="absolute right-3 top-3.5 w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all"
              style={{
                background: filter === f ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filter === f ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`,
                color: filter === f ? '#c084fc' : 'rgba(255,255,255,0.4)',
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Habits grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🌑</div>
          <p className="font-display text-white/40 text-lg">No habits found</p>
          <button
            onClick={() => { setEditingHabit(null); setShowForm(true) }}
            className="btn-primary mt-6 text-sm"
          >
            CREATE HABIT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(habit => {
            const done = habit.completedDates.includes(todayStr)
            const completionPct = habit.totalCompletions > 0
              ? Math.min(100, Math.round((habit.completedDates.length / Math.max(1, getDaysSince(habit.createdAt))) * 100))
              : 0

            return (
              <div
                key={habit.id}
                className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: done ? `${habit.color}40` : 'rgba(139,92,246,0.1)',
                  background: done ? `${habit.color}08` : undefined,
                }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300"
                    style={{
                      background: done ? `${habit.color}25` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${done ? habit.color + '60' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: done ? `0 0 15px ${habit.color}50` : 'none',
                    }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-white text-sm">{habit.name}</div>
                    {habit.description && (
                      <div className="text-xs text-white/30 mt-0.5 truncate">{habit.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{ background: habit.color + '15', color: habit.color }}
                      >
                        {habit.category}
                      </span>
                      <DifficultyBadge difficulty={habit.difficulty} />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(habit.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStat label="Streak" value={`🔥 ${habit.streak}d`} />
                  <MiniStat label="Total" value={habit.totalCompletions} />
                  <MiniStat label="Rate" value={`${completionPct}%`} />
                </div>

                {/* Completion bar */}
                <div className="progress-bar mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${completionPct}%`,
                      background: `linear-gradient(90deg, ${habit.color}, #22D3EE)`,
                      boxShadow: `0 0 8px ${habit.color}`,
                    }}
                  />
                </div>

                {/* Complete button */}
                <button
                  onClick={() => handleToggle(habit.id)}
                  className="w-full py-2.5 rounded-xl font-display font-semibold text-sm tracking-widest transition-all duration-300"
                  style={{
                    background: done
                      ? `${habit.color}20`
                      : `linear-gradient(135deg, ${habit.color}30, transparent)`,
                    border: `1px solid ${done ? habit.color + '50' : habit.color + '30'}`,
                    color: done ? habit.color : 'rgba(255,255,255,0.5)',
                    boxShadow: done ? `0 0 15px ${habit.color}30` : 'none',
                  }}
                >
                  {done ? `✓ COMPLETED · +${habit.xpReward}XP` : `MARK COMPLETE · +${habit.xpReward}XP`}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)} />
          <div
            className="relative glass-strong rounded-2xl p-6 w-full max-w-sm text-center space-y-4"
            style={{ boxShadow: '0 0 40px rgba(239,68,68,0.3)' }}
          >
            <div className="text-4xl">⚠️</div>
            <h3 className="font-display font-bold text-xl text-white">Delete Habit?</h3>
            <p className="text-white/40 text-sm">This will permanently remove the habit and all its data.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-colors font-display text-sm"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 rounded-xl font-display text-sm font-bold"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444' }}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingHabit(null) }}
        />
      )}
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-mono font-bold text-xs text-white/60">{value}</div>
      <div className="text-xs text-white/20 font-mono">{label}</div>
    </div>
  )
}

function DifficultyBadge({ difficulty }) {
  const config = DIFFICULTIES.find(d => d.value === difficulty) || DIFFICULTIES[1]
  return (
    <span
      className="text-xs font-mono px-2 py-0.5 rounded"
      style={{ color: config.color, background: config.color + '15' }}
    >
      {config.label}
    </span>
  )
}

function getDaysSince(dateStr) {
  const created = new Date(dateStr)
  const now = new Date()
  return Math.max(1, Math.ceil((now - created) / (1000 * 60 * 60 * 24)))
}

function HabitForm({ habit, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    category: habit?.category || 'General',
    difficulty: habit?.difficulty || 'medium',
    icon: habit?.icon || '⚡',
    color: habit?.color || '#8B5CF6',
    frequency: habit?.frequency || 'daily',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div
        className="relative glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-5"
        style={{ boxShadow: '0 0 60px rgba(139,92,246,0.3)' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-white">
            {habit ? 'Edit Habit' : 'New Habit Protocol'}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">HABIT NAME</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Morning Meditation"
            className="w-full glass rounded-xl px-4 py-3 text-white font-body text-sm outline-none transition-all"
            style={{ border: '1px solid rgba(139,92,246,0.3)' }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">DESCRIPTION (OPTIONAL)</label>
          <input
            type="text"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Brief description..."
            className="w-full glass rounded-xl px-4 py-3 text-white font-body text-sm outline-none transition-all"
            style={{ border: '1px solid rgba(139,92,246,0.15)' }}
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">ICON</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => set('icon', ic)}
                className="w-10 h-10 text-xl rounded-lg transition-all"
                style={{
                  background: form.icon === ic ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.icon === ic ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">COLOR</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => set('color', c)}
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  background: c,
                  outline: form.color === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '2px',
                  boxShadow: form.color === c ? `0 0 15px ${c}80` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">CATEGORY</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => set('category', cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: form.category === cat ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.category === cat ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                  color: form.category === cat ? '#c084fc' : 'rgba(255,255,255,0.4)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-xs font-mono text-purple-400 tracking-widest mb-2 block">DIFFICULTY</label>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => set('difficulty', d.value)}
                className="py-2.5 rounded-xl text-sm font-display font-semibold transition-all"
                style={{
                  background: form.difficulty === d.value ? `${d.color}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.difficulty === d.value ? d.color : 'rgba(255,255,255,0.1)'}`,
                  color: form.difficulty === d.value ? d.color : 'rgba(255,255,255,0.4)',
                  boxShadow: form.difficulty === d.value ? `0 0 15px ${d.color}30` : 'none',
                }}
              >
                {d.label} · {d.xp}XP
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => {
            if (!form.name.trim()) return
            onSubmit(form)
          }}
          className="w-full py-3 rounded-xl font-display font-bold text-white tracking-widest transition-all"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
            boxShadow: '0 0 30px rgba(139,92,246,0.4)',
          }}
        >
          {habit ? 'SAVE CHANGES' : '⚡ CREATE HABIT'}
        </button>
      </div>
    </div>
  )
}

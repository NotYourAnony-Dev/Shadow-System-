import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getUser, getHabits, getTodayStr, addXP, updateStreak,
  generateDailyQuests, updateDailyQuests, toggleHabitComplete,
  getWeeklyStats, ALL_ACHIEVEMENTS, getUnlockedAchievements, unlockAchievement,
  addLog, getRankForLevel
} from '../store/storage'
import { showXPGain } from '../components/ui/XPNotification'
import RankBadge, { RankProgress } from '../components/ui/RankBadge'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())
  const [habits, setHabits] = useState(getHabits())
  const [quests, setQuests] = useState(generateDailyQuests())
  const [weeklyStats, setWeeklyStats] = useState(getWeeklyStats(habits))
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 5) setGreeting('DEEP IN THE NIGHT')
    else if (h < 12) setGreeting('GOOD MORNING')
    else if (h < 17) setGreeting('GOOD AFTERNOON')
    else if (h < 21) setGreeting('GOOD EVENING')
    else setGreeting('LATE NIGHT GRIND')
  }, [])

  const todayStr = getTodayStr()
  const todayHabits = habits
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr))
  const completionRate = habits.length > 0 ? Math.round((completedToday.length / habits.length) * 100) : 0

  const handleComplete = (habitId) => {
    const { habit, gained } = toggleHabitComplete(habitId)
    const freshHabits = getHabits()
    setHabits(freshHabits)
    setWeeklyStats(getWeeklyStats(freshHabits))

    if (gained > 0) {
      const updatedUser = addXP(gained)
      const streakUser = updateStreak()
      setUser(getUser())
      showXPGain(gained)
      addLog({ type: 'habit_complete', habitName: habit.name, xp: gained })

      // Check achievements
      checkAchievements()
      // Update quests
      updateQuests(freshHabits)
    }
  }

  const checkAchievements = () => {
    const u = getUser()
    const h = getHabits()
    const unlocked = getUnlockedAchievements()

    const checks = [
      { id: 'first_habit', condition: h.some(x => x.completedDates.length > 0) },
      { id: 'streak_3', condition: u.streak >= 3 },
      { id: 'streak_7', condition: u.streak >= 7 },
      { id: 'streak_30', condition: u.streak >= 30 },
      { id: 'habits_5', condition: h.length >= 5 },
      { id: 'habits_10', condition: h.length >= 10 },
      { id: 'level_5', condition: u.level >= 5 },
      { id: 'level_10', condition: u.level >= 10 },
      { id: 'xp_1000', condition: u.totalXp >= 1000 },
    ]

    checks.forEach(c => {
      if (c.condition && !unlocked.includes(c.id)) {
        if (unlockAchievement(c.id)) {
          const ach = ALL_ACHIEVEMENTS.find(a => a.id === c.id)
          if (ach) {
            addXP(ach.xp)
            showXPGain(ach.xp, `🏆 ${ach.name}`)
          }
        }
      }
    })
  }

  const updateQuests = (currentHabits) => {
    const completedCount = currentHabits.filter(h => h.completedDates.includes(todayStr)).length
    const updated = quests.map(q => {
      let completed = q.completed
      if (q.type === 'habits_today' && completedCount >= q.target) completed = true
      if (q.type === 'all_habits' && completedCount === currentHabits.length && currentHabits.length > 0) completed = true
      return { ...q, completed }
    })
    setQuests(updated)
    updateDailyQuests(updated)
  }

  const completeQuest = (quest) => {
    if (quest.completed) return
    const updated = quests.map(q => q.id === quest.id ? { ...q, completed: true } : q)
    setQuests(updated)
    updateDailyQuests(updated)
    addXP(quest.xp)
    setUser(getUser())
    showXPGain(quest.xp, `⚔️ ${quest.name}`)
  }

  if (!user) return null

  const rankConfig = getRankForLevel(user.level)

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-white/30 tracking-widest">{greeting}, OPERATOR</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white">
            {user.avatar} <span className="neon-text-purple">{user.username.toUpperCase()}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <RankBadge rank={user.rank} level={user.level} size="sm" />
            <span className="text-white/30 text-xs font-mono">•</span>
            <span className="text-xs font-mono text-white/40">🔥 {user.streak} day streak</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/habits')}
            className="btn-secondary text-sm px-5 py-2"
          >
            + ADD HABIT
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="⚡"
          label="Total XP"
          value={user.totalXp?.toLocaleString() || '0'}
          color="#8B5CF6"
          sub="lifetime"
        />
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={`${user.streak} days`}
          color="#f97316"
          sub={`best: ${user.longestStreak || 0}d`}
        />
        <StatCard
          icon="✅"
          label="Today"
          value={`${completedToday.length}/${habits.length}`}
          color="#22D3EE"
          sub={`${completionRate}% done`}
        />
        <StatCard
          icon="🏆"
          label="Level"
          value={user.level}
          color={rankConfig.color}
          sub={user.rank}
        />
      </div>

      {/* XP Progress */}
      <div
        className="glass rounded-2xl p-6"
        style={{ border: `1px solid ${rankConfig.color}30` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">XP Progression</h3>
            <p className="text-xs text-white/30 font-mono">Level {user.level} → {user.level + 1}</p>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg" style={{ color: rankConfig.color }}>
              {user.xp} <span className="text-white/30">/ {user.xpToNext} XP</span>
            </div>
          </div>
        </div>
        <RankProgress level={user.level} xp={user.xp} xpToNext={user.xpToNext} rank={user.rank} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TODAY'S HABITS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">Today's Protocols</h2>
            <span className="text-xs font-mono text-white/30">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          {habits.length === 0 ? (
            <div
              className="glass rounded-2xl p-12 text-center border-dashed"
              style={{ borderColor: 'rgba(139,92,246,0.3)' }}
            >
              <div className="text-5xl mb-4">🌑</div>
              <p className="font-display font-bold text-white/60 text-lg">No habits initialized</p>
              <p className="text-white/30 text-sm font-mono mt-2">Build your shadow system</p>
              <button
                onClick={() => navigate('/habits')}
                className="btn-primary mt-6 text-sm px-6 py-2"
              >
                + CREATE FIRST HABIT
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map(habit => {
                const done = habit.completedDates.includes(todayStr)
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleComplete(habit.id)}
                    className="habit-card flex items-center gap-4"
                    style={{
                      borderColor: done ? `${habit.color}40` : 'rgba(139,92,246,0.1)',
                      background: done ? `${habit.color}10` : 'rgba(139,92,246,0.04)',
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: done ? habit.color : 'transparent',
                        border: `2px solid ${done ? habit.color : 'rgba(255,255,255,0.15)'}`,
                        boxShadow: done ? `0 0 12px ${habit.color}80` : 'none',
                      }}
                    >
                      {done && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="text-2xl">{habit.icon}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-display font-semibold text-sm ${done ? 'line-through text-white/40' : 'text-white'}`}>
                        {habit.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-white/30">{habit.category}</span>
                        {habit.streak > 0 && (
                          <span className="text-xs font-mono text-orange-400">🔥 {habit.streak}</span>
                        )}
                      </div>
                    </div>

                    {/* XP badge */}
                    <div
                      className="px-2 py-1 rounded text-xs font-mono font-bold flex-shrink-0"
                      style={{
                        color: done ? habit.color : 'rgba(255,255,255,0.2)',
                        background: done ? `${habit.color}20` : 'transparent',
                      }}
                    >
                      {done ? '+' : ''}{habit.xpReward} XP
                    </div>

                    {/* Difficulty dot */}
                    <DifficultyDot difficulty={habit.difficulty} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* Daily Quests */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-3">Daily Quests</h2>
            <div className="space-y-3">
              {quests.map(quest => (
                <div
                  key={quest.id}
                  onClick={() => completeQuest(quest)}
                  className="glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    borderColor: quest.completed ? 'rgba(34,211,238,0.3)' : 'rgba(139,92,246,0.15)',
                    background: quest.completed ? 'rgba(34,211,238,0.08)' : undefined,
                    opacity: quest.completed ? 0.7 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{quest.icon}</span>
                    <div className="flex-1">
                      <div className={`font-display font-semibold text-sm ${quest.completed ? 'line-through text-white/40' : 'text-white'}`}>
                        {quest.name}
                      </div>
                      <div className="text-xs text-white/30 font-mono mt-0.5">{quest.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-bold" style={{ color: quest.completed ? '#22D3EE' : '#8B5CF6' }}>
                      +{quest.xp}XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly chart */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-3">This Week</h2>
            <div className="glass rounded-xl p-4">
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={weeklyStats}>
                  <defs>
                    <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(13,0,32,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8 }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#8B5CF6" fill="url(#wg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Streak Freeze */}
          <div
            className="glass rounded-xl p-4"
            style={{ borderColor: 'rgba(34,211,238,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧊</span>
              <div>
                <div className="font-display font-bold text-sm text-white">Streak Freeze</div>
                <div className="text-xs text-white/30 font-mono">{user.streakFreezes || 0} available</div>
              </div>
              <div className="ml-auto flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded"
                    style={{
                      background: i < (user.streakFreezes || 0) ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${i < (user.streakFreezes || 0) ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-white">Recent Achievements</h2>
          <button onClick={() => navigate('/profile')} className="text-xs font-mono text-purple-400 hover:text-purple-300">
            View all →
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          {ALL_ACHIEVEMENTS.slice(0, 6).map(ach => {
            const unlocked = getUnlockedAchievements().includes(ach.id)
            return (
              <div
                key={ach.id}
                className={`glass rounded-xl p-3 flex items-center gap-2 transition-all duration-200 ${!unlocked ? 'achievement-locked' : 'hover:scale-105'}`}
                title={ach.desc}
                style={{ borderColor: unlocked ? 'rgba(139,92,246,0.3)' : undefined }}
              >
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <div className="text-xs font-display font-semibold text-white">{ach.name}</div>
                  <div className="text-xs font-mono text-white/30">+{ach.xp}XP</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div
      className="stat-card"
      style={{ borderColor: `${color}20` }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}, transparent)`, transform: 'translate(30%, -30%)' }}
      />
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-mono font-bold text-2xl" style={{ color }}>{value}</div>
      <div className="text-xs text-white/40 font-display tracking-wider mt-1">{label}</div>
      <div className="text-xs text-white/20 font-mono mt-0.5">{sub}</div>
    </div>
  )
}

function DifficultyDot({ difficulty }) {
  const colors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444', legendary: '#8B5CF6' }
  const color = colors[difficulty] || colors.medium
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      title={difficulty}
    />
  )
}

import { useState, useMemo } from 'react'
import { getHabits, getUser, getWeeklyStats, getHeatmapData, getLogs } from '../store/storage'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'

export default function AnalyticsPage() {
  const user = getUser()
  const habits = getHabits()
  const weeklyStats = getWeeklyStats(habits)
  const heatmapData = getHeatmapData(habits, 84) // 12 weeks

  // Monthly stats (last 30 days)
  const monthlyData = useMemo(() => {
    const result = []
    for (let i = 29; i >= 0; i -= 3) {
      const start = i
      const days = Array.from({ length: 3 }, (_, j) => {
        const d = new Date()
        d.setDate(d.getDate() - (start - j))
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      })
      let completed = 0
      days.forEach(day => {
        habits.forEach(h => { if (h.completedDates.includes(day)) completed++ })
      })
      const d = new Date()
      d.setDate(d.getDate() - start)
      result.push({
        date: `${d.getMonth()+1}/${d.getDate()}`,
        completed,
        possible: habits.length * 3,
        rate: habits.length > 0 ? Math.round((completed / (habits.length * 3)) * 100) : 0,
      })
    }
    return result
  }, [habits])

  // Per-habit stats
  const habitStats = habits.map(h => ({
    name: h.name.length > 12 ? h.name.slice(0,12) + '…' : h.name,
    full: h.name,
    icon: h.icon,
    completions: h.totalCompletions,
    streak: h.streak,
    longestStreak: h.longestStreak,
    color: h.color,
    rate: Math.min(100, Math.round((h.completedDates.length / Math.max(1, daysSince(h.createdAt))) * 100)),
  })).sort((a, b) => b.completions - a.completions)

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {}
    habits.forEach(h => {
      if (!map[h.category]) map[h.category] = { name: h.category, total: 0, completed: 0 }
      map[h.category].total += h.completedDates.length + (30 - h.completedDates.length)
      map[h.category].completed += h.totalCompletions
    })
    return Object.values(map).map(c => ({
      ...c,
      rate: c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0,
    }))
  }, [habits])

  // XP growth simulation
  const xpGrowth = useMemo(() => {
    const logs = getLogs().filter(l => l.type === 'habit_complete')
    const byDate = {}
    logs.forEach(l => {
      const date = l.timestamp?.slice(0, 10)
      if (date) byDate[date] = (byDate[date] || 0) + (l.xp || 0)
    })

    let cumulative = 0
    return weeklyStats.map(s => {
      cumulative += byDate[s.date] || 0
      return { day: s.day, xp: byDate[s.date] || 0, total: cumulative }
    })
  }, [weeklyStats])

  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)
  const avgStreakLength = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
    : 0
  const bestHabit = habitStats[0]

  const TOOLTIP_STYLE = {
    contentStyle: {
      background: 'rgba(6,0,15,0.95)',
      border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: 8,
      color: 'white',
    },
    labelStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Analytics Matrix</h1>
        <p className="text-white/30 text-sm font-mono mt-1">Performance data and progression insights</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Completions', value: totalCompletions, icon: '✅', color: '#10b981' },
          { label: 'Avg Streak', value: `${avgStreakLength}d`, icon: '🔥', color: '#f97316' },
          { label: 'Best Habit', value: bestHabit?.icon || '—', icon: '🏆', sub: bestHabit?.full || 'None', color: '#f59e0b' },
          { label: 'Habits Active', value: habits.length, icon: '⚡', color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderColor: s.color + '25' }}>
            <div className="text-2xl">{s.icon}</div>
            <div className="font-mono font-bold text-2xl mt-2" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/40 font-display tracking-wider mt-1">{s.label}</div>
            {s.sub && <div className="text-xs text-white/20 font-mono truncate">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Weekly bars + Area chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly completions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-white mb-4">Weekly Completions</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="completed" fill="#8B5CF6" radius={[4,4,0,0]}
                style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.8))' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion rate trend */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-white mb-4">30-Day Completion Rate</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.08)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Rate']} />
              <Area type="monotone" dataKey="rate" stroke="#22D3EE" fill="url(#ag)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold text-white mb-4">Activity Heatmap (12 Weeks)</h3>
        <HeatmapGrid data={heatmapData} />
        <div className="flex items-center gap-3 mt-4 justify-end">
          <span className="text-xs text-white/30 font-mono">Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map(v => (
            <div
              key={v}
              className="w-4 h-4 rounded-sm"
              style={{ background: v === 0 ? 'rgba(139,92,246,0.05)' : `rgba(139,92,246,${v})` }}
            />
          ))}
          <span className="text-xs text-white/30 font-mono">More</span>
        </div>
      </div>

      {/* Per-habit performance */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold text-white mb-6">Habit Performance</h3>
        {habitStats.length === 0 ? (
          <p className="text-white/30 text-center py-8 font-mono text-sm">No habits tracked yet</p>
        ) : (
          <div className="space-y-4">
            {habitStats.map(h => (
              <div key={h.full} className="flex items-center gap-4">
                <span className="text-xl w-8 text-center">{h.icon}</span>
                <div className="w-28 font-display text-sm text-white/70 truncate">{h.full}</div>
                <div className="flex-1">
                  <div className="progress-bar">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${h.rate}%`,
                        background: `linear-gradient(90deg, ${h.color}, #22D3EE)`,
                        boxShadow: `0 0 8px ${h.color}80`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 w-32 justify-end text-xs font-mono text-white/40">
                  <span>🔥{h.streak}d</span>
                  <span style={{ color: h.color }}>{h.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* XP Growth */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold text-white mb-4">XP Growth This Week</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={xpGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="xp" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.8))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

function HeatmapGrid({ data }) {
  // Group into weeks (7 days each)
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125"
                style={{
                  background: day.ratio === 0
                    ? 'rgba(139,92,246,0.08)'
                    : `rgba(139,92,246,${0.2 + day.ratio * 0.8})`,
                  boxShadow: day.ratio > 0.5 ? `0 0 4px rgba(139,92,246,${day.ratio})` : 'none',
                }}
                title={`${day.date}: ${day.completed}/${day.total}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function daysSince(dateStr) {
  return Math.max(1, Math.ceil((Date.now() - new Date(dateStr)) / 86400000))
}

import { RANKS, getRankForLevel } from '../../store/storage'

const RANK_CONFIG = {
  Bronze: { icon: '🥉', gradient: 'from-amber-700 to-amber-500', color: '#cd7f32' },
  Silver: { icon: '🥈', gradient: 'from-gray-400 to-gray-200', color: '#c0c0c0' },
  Gold: { icon: '🥇', gradient: 'from-yellow-500 to-yellow-300', color: '#ffd700' },
  Diamond: { icon: '💎', gradient: 'from-cyan-300 to-blue-200', color: '#b9f2ff' },
  Elite: { icon: '⚡', gradient: 'from-purple-500 to-purple-300', color: '#8B5CF6' },
  Shadow: { icon: '🌑', gradient: 'from-cyan-400 to-cyan-200', color: '#22D3EE' },
  Monarch: { icon: '👑', gradient: 'from-amber-400 to-yellow-200', color: '#f59e0b' },
}

export default function RankBadge({ rank, level, size = 'sm' }) {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.Bronze

  const sizes = {
    xs: 'text-xs px-2 py-0.5 gap-1',
    sm: 'text-sm px-3 py-1 gap-1.5',
    md: 'text-base px-4 py-1.5 gap-2',
    lg: 'text-lg px-5 py-2 gap-2',
  }

  return (
    <span
      className={`rank-badge ${sizes[size]}`}
      style={{
        color: config.color,
        borderColor: config.color + '60',
        background: config.color + '15',
        boxShadow: `0 0 10px ${config.color}30`,
      }}
    >
      <span>{config.icon}</span>
      <span className="font-mono tracking-widest">{rank.toUpperCase()}</span>
      {level && <span className="opacity-60">LVL {level}</span>}
    </span>
  )
}

export function RankProgress({ level, xp, xpToNext, rank }) {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.Bronze
  const progress = (xp / xpToNext) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span style={{ color: config.color }}>LVL {level}</span>
        <span className="text-white/40">{xp} / {xpToNext} XP</span>
        <span style={{ color: config.color }}>LVL {level + 1}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${config.color}, #22D3EE)`,
            boxShadow: `0 0 10px ${config.color}`,
          }}
        />
      </div>
      <p className="text-center text-xs text-white/30 font-mono">{Math.round(progress)}% to next level</p>
    </div>
  )
}

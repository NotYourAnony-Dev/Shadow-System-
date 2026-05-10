import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../components/ui/ParticleField'

const FEATURES = [
  { icon: '⚡', title: 'XP System', desc: 'Gain experience points for every habit completed and level up your Shadow rank.' },
  { icon: '🔥', title: 'Streak Engine', desc: 'Build unbreakable streaks with visual flame animations and streak freeze insurance.' },
  { icon: '🏆', title: 'Achievements', desc: 'Unlock elite badges and rewards as you dominate your goals with consistency.' },
  { icon: '📊', title: 'Analytics', desc: 'Visual heatmaps, progress charts, and weekly stats to track your ascension.' },
  { icon: '🎯', title: 'Daily Quests', desc: 'Complete generated challenges each day for bonus XP and exclusive rewards.' },
  { icon: '👑', title: '7 Ranks', desc: 'Rise from Bronze to Monarch through consistent discipline and dedication.' },
]

const IMAGES = [
  'https://i.ibb.co/230PMWtV/tmp0b3wj047.jpg',
  'https://i.ibb.co/mCSr1MH8/tmpqiztph7a.jpg',
  'https://i.ibb.co/xq8zPCRY/tmpcm200qq9.jpg',
  'https://i.ibb.co/XxG8trz8/tmp4a5rsnek.jpg',
  'https://i.ibb.co/LhdZrS9z/tmpyzglm5nz.jpg',
  'https://i.ibb.co/JFsSbb4B/tmp5agfhrhe.jpg',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [counter, setCounter] = useState({ streak: 0, xp: 0, users: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Animate counters
  useEffect(() => {
    const targets = { streak: 247, xp: 18500, users: 1337 }
    const duration = 2500
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCounter({
        streak: Math.floor(ease * targets.streak),
        xp: Math.floor(ease * targets.xp),
        users: Math.floor(ease * targets.users),
      })
      if (progress < 1) requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => requestAnimationFrame(tick), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen aurora-bg overflow-hidden">
      {/* Scanline effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center" ref={heroRef}>
        <div className="absolute inset-0">
          <ParticleField count={60} />
          {/* Grid bg */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          {/* Aurora gradients */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139,92,246,0.18) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 80% 60%, rgba(34,211,238,0.12) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                boxShadow: '0 0 20px #8B5CF680',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-widest text-white">SHADOW<span className="neon-text-purple">SYSTEM</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-sm px-6 py-2"
            >
              Enter System
            </button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              {/* Status chip */}
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-mono tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400">SYSTEM ONLINE</span>
                <span className="text-white/30">v2.0.26</span>
              </div>

              <div>
                <h1 className="font-display font-bold leading-none tracking-tight mb-4">
                  <span className="block text-5xl md:text-7xl text-white" style={{ textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
                    BUILD
                  </span>
                  <span className="block text-5xl md:text-7xl neon-text-purple">
                    DISCIPLINE.
                  </span>
                  <span className="block text-3xl md:text-4xl text-white/60 mt-2 font-light tracking-widest">
                    ENTER THE SHADOW SYSTEM.
                  </span>
                </h1>

                <p className="text-lg text-white/50 font-body max-w-md leading-relaxed">
                  Track habits, gain XP, level up yourself and dominate your goals. Your shadow self awaits activation.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                >
                  <span className="relative z-10">⚡ Enter System</span>
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-secondary"
                >
                  Start Journey
                </button>
              </div>

              {/* Live counters */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { label: 'Longest Streak', value: counter.streak, suffix: ' days' },
                  { label: 'XP Earned', value: counter.xp.toLocaleString(), suffix: '' },
                  { label: 'Systems Active', value: counter.users, suffix: '' },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-xl p-3 text-center">
                    <div className="font-mono font-bold text-2xl neon-text-purple">{stat.value}{stat.suffix}</div>
                    <div className="text-xs text-white/40 font-display tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(13,0,32,0.8)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  boxShadow: '0 0 60px rgba(139,92,246,0.2), inset 0 0 60px rgba(139,92,246,0.05)',
                  transform: `translateY(${scrollY * -0.05}px)`,
                }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-600/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 mx-4 bg-purple-900/30 rounded px-3 py-1 text-xs font-mono text-white/30">
                    shadow-system.app/dashboard
                  </div>
                </div>

                {/* Preview content */}
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40 font-mono">WELCOME BACK, SHADOW</div>
                      <div className="font-display font-bold text-lg neon-text-purple">Level 12 Operator</div>
                    </div>
                    <div className="text-3xl">🌑</div>
                  </div>

                  {/* XP Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-white/40">
                      <span>XP Progress</span>
                      <span>3,420 / 5,000</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '68%' }} />
                    </div>
                  </div>

                  {/* Habits preview */}
                  <div className="space-y-2">
                    {[
                      { name: 'Morning Meditation', icon: '🧘', done: true, xp: 50 },
                      { name: 'Workout Protocol', icon: '💪', done: true, xp: 100 },
                      { name: 'Deep Work Session', icon: '🎯', done: false, xp: 100 },
                      { name: 'Reading Protocol', icon: '📚', done: false, xp: 50 },
                    ].map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{
                          background: h.done ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${h.done ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <span>{h.icon}</span>
                        <span className={`flex-1 text-sm font-display ${h.done ? 'text-white/80 line-through' : 'text-white/50'}`}>
                          {h.name}
                        </span>
                        {h.done ? (
                          <span className="text-xs font-mono text-green-400">✓ +{h.xp}XP</span>
                        ) : (
                          <span className="text-xs font-mono text-white/20">+{h.xp}XP</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Streak */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.2), rgba(239,68,68,0.1))', border: '1px solid rgba(234,88,12,0.3)' }}
                  >
                    <div>
                      <div className="text-xs text-orange-400/60 font-mono">CURRENT STREAK</div>
                      <div className="font-display font-bold text-2xl text-orange-400">🔥 21 Days</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40">Rank</div>
                      <div className="font-display font-bold text-yellow-400">GOLD</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div
                className="absolute -top-4 -right-4 glass rounded-xl p-3 text-sm font-display animate-float"
                style={{ boxShadow: '0 0 20px rgba(34,211,238,0.3)', animationDelay: '0s' }}
              >
                <div className="text-white/40 text-xs">XP GAINED</div>
                <div className="neon-text-cyan font-bold text-lg">+150 XP ⚡</div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 glass rounded-xl p-3 text-sm font-display animate-float"
                style={{ boxShadow: '0 0 20px rgba(139,92,246,0.3)', animationDelay: '2s' }}
              >
                <div className="text-white/40 text-xs">ACHIEVEMENT</div>
                <div className="neon-text-purple font-bold">🏆 UNLOCKED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs font-mono text-white/30 tracking-widest">SCROLL TO EXPLORE</span>
          <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 10l5 5 5-5"/>
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block font-mono text-xs tracking-widest text-purple-400 px-4 py-1 rounded-full border border-purple-600/30">
              SYSTEM CAPABILITIES
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Engineered for <span className="neon-text-purple">Elite</span> Performance
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Every feature designed to maximize your discipline and reward your consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="stat-card group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', transform: 'translate(25%, -25%)' }}
                />
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 container mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center text-white mb-12">
            The <span className="neon-text-cyan">Shadow</span> Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {IMAGES.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl aspect-video group"
                style={{
                  border: '1px solid rgba(139,92,246,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={img}
                  alt={`Shadow System Preview ${i+1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RANKS SECTION */}
      <section className="relative py-20 px-6 md:px-12">
        <div className="relative z-10 container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-white">Ascend the <span className="neon-text-purple">Ranks</span></h2>
            <p className="text-white/40 mt-3">Seven tiers of shadow power. Where will you rise?</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'BRONZE', icon: '🥉', color: '#cd7f32', levels: '1-9' },
              { name: 'SILVER', icon: '🥈', color: '#c0c0c0', levels: '10-19' },
              { name: 'GOLD', icon: '🥇', color: '#ffd700', levels: '20-34' },
              { name: 'DIAMOND', icon: '💎', color: '#b9f2ff', levels: '35-49' },
              { name: 'ELITE', icon: '⚡', color: '#8B5CF6', levels: '50-74' },
              { name: 'SHADOW', icon: '🌑', color: '#22D3EE', levels: '75-99' },
              { name: 'MONARCH', icon: '👑', color: '#f59e0b', levels: '100+' },
            ].map((r, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: `${r.color}10`,
                  border: `1px solid ${r.color}40`,
                  boxShadow: `0 0 20px ${r.color}20`,
                }}
              >
                <span className="text-3xl">{r.icon}</span>
                <span className="font-display font-bold tracking-widest text-sm" style={{ color: r.color }}>{r.name}</span>
                <span className="font-mono text-xs text-white/30">LVL {r.levels}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://i.ibb.co/230PMWtV/tmp0b3wj047.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.15)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #020008, transparent, #020008)' }}
        />
        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-bold text-5xl md:text-7xl text-white leading-none">
            YOUR SHADOW SELF<br />
            <span className="neon-text-purple">AWAITS.</span>
          </h2>
          <p className="text-white/50 text-xl max-w-md mx-auto">
            Stop dreaming. Start building. The system is ready when you are.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-xl px-12 py-4 mx-auto block mt-8"
            style={{ boxShadow: '0 0 60px rgba(139,92,246,0.5)' }}
          >
            ⚡ ACTIVATE SYSTEM
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-600/10 py-10 px-6 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold tracking-widest text-white/60">SHADOW SYSTEM</span>
          </div>

          <p className="text-white/30 text-sm font-mono">© 2026 Claimed by Aryan</p>

          <a
            href="https://www.instagram.com/notyouranonymous_?igsh=MWM3bGprZGE3MnY1Yw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-pink-400 transition-colors text-sm font-mono"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @notyouranonymous_
          </a>
        </div>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../store/storage'
import ParticleField from '../components/ui/ParticleField'

const STEPS = [
  { id: 1, title: 'Identity', subtitle: 'Who are you, Shadow?' },
  { id: 2, title: 'Mission', subtitle: 'Define your purpose.' },
  { id: 3, title: 'Physical', subtitle: 'Body metrics initialized.' },
  { id: 4, title: 'Activate', subtitle: 'System ready.' },
]

const AVATAR_OPTIONS = ['🌑', '🔮', '⚔️', '🌀', '🦅', '🔱', '👁️', '💀', '🐉', '⚡', '🌟', '🔥']

const GOAL_OPTIONS = [
  'Build Consistent Habits',
  'Improve Fitness',
  'Mental Discipline',
  'Career & Productivity',
  'Academic Excellence',
  'Health & Wellness',
  'Financial Discipline',
  'Personal Mastery',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    goal: '',
    age: '',
    height: '',
    weight: '',
    avatar: '🌑',
  })
  const [errors, setErrors] = useState({})
  const [animating, setAnimating] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name required'
      if (!form.username.trim() || form.username.length < 3) errs.username = 'Min 3 characters'
      if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Letters, numbers, underscore only'
    }
    if (step === 2) {
      if (!form.goal) errs.goal = 'Select a goal'
    }
    if (step === 3) {
      if (!form.age || form.age < 10 || form.age > 100) errs.age = 'Enter valid age'
      if (!form.height || form.height < 50) errs.height = 'Enter valid height (cm)'
      if (!form.weight || form.weight < 20) errs.weight = 'Enter valid weight (kg)'
    }
    return errs
  }

  const nextStep = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (step < 4) {
      setAnimating(true)
      setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 200)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setAnimating(true)
      setTimeout(() => { setStep(s => s - 1); setAnimating(false) }, 200)
    }
  }

  const handleActivate = () => {
    createUser(form)
    navigate('/dashboard')
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: '#020008' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <ParticleField count={30} />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://i.ibb.co/mCSr1MH8/tmpqiztph7a.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.08)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.2) 0%, transparent 60%)' }}
        />
      </div>

      {/* Back to home */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors font-mono text-sm"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        BACK
      </button>

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.2s' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display font-bold text-2xl tracking-widest text-white">
            SHADOW<span className="neon-text-purple">SYSTEM</span>
          </div>
          <div className="text-white/30 text-xs font-mono mt-1 tracking-widest">INITIALIZATION PROTOCOL</div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-500"
                  style={{
                    background: step >= s.id
                      ? 'linear-gradient(135deg, #8B5CF6, #22D3EE)'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${step >= s.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: step >= s.id ? '0 0 15px rgba(139,92,246,0.5)' : 'none',
                    color: step >= s.id ? 'white' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className="text-xs font-mono text-white/30 hidden md:block">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="progress-bar h-1">
            <div className="progress-fill" style={{ width: `${progress}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Form card */}
        <div
          className="glass-strong rounded-2xl p-8 space-y-6"
          style={{ boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}
        >
          <div>
            <h2 className="font-display font-bold text-2xl text-white">{STEPS[step-1].title}</h2>
            <p className="text-white/40 text-sm font-mono mt-1">{STEPS[step-1].subtitle}</p>
          </div>

          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <FloatInput
                label="FULL NAME"
                value={form.fullName}
                onChange={v => handleChange('fullName', v)}
                error={errors.fullName}
                placeholder=" "
              />
              <FloatInput
                label="USERNAME"
                value={form.username}
                onChange={v => handleChange('username', v.toLowerCase())}
                error={errors.username}
                placeholder=" "
              />

              {/* Avatar picker */}
              <div>
                <label className="text-xs font-mono text-purple-400 tracking-widest mb-3 block">CHOOSE AVATAR</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      onClick={() => handleChange('avatar', av)}
                      className="text-2xl h-12 rounded-lg transition-all duration-200 flex items-center justify-center"
                      style={{
                        background: form.avatar === av ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.avatar === av ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: form.avatar === av ? '0 0 15px rgba(139,92,246,0.4)' : 'none',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goal */}
          {step === 2 && (
            <div className="space-y-3">
              <label className="text-xs font-mono text-purple-400 tracking-widest block">SELECT YOUR PRIMARY MISSION</label>
              {GOAL_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => handleChange('goal', g)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-display text-sm"
                  style={{
                    background: form.goal === g ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.goal === g ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                    color: form.goal === g ? '#c084fc' : 'rgba(255,255,255,0.5)',
                    boxShadow: form.goal === g ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                  }}
                >
                  {form.goal === g ? '⚡ ' : '○ '}{g}
                </button>
              ))}
              {errors.goal && <p className="text-red-400 text-xs font-mono">{errors.goal}</p>}
            </div>
          )}

          {/* STEP 3: Physical */}
          {step === 3 && (
            <div className="space-y-6">
              <FloatInput
                label="AGE"
                value={form.age}
                onChange={v => handleChange('age', v)}
                error={errors.age}
                type="number"
                placeholder=" "
                suffix="years"
              />
              <FloatInput
                label="HEIGHT"
                value={form.height}
                onChange={v => handleChange('height', v)}
                error={errors.height}
                type="number"
                placeholder=" "
                suffix="cm"
              />
              <FloatInput
                label="WEIGHT"
                value={form.weight}
                onChange={v => handleChange('weight', v)}
                error={errors.weight}
                type="number"
                placeholder=" "
                suffix="kg"
              />
              <div
                className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)' }}
              >
                <p className="text-xs font-mono text-cyan-400/60">Metrics are used for personalization only. All data stays local.</p>
              </div>
            </div>
          )}

          {/* STEP 4: Activate */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="space-y-3">
                {[
                  { label: 'OPERATOR', value: `${form.avatar} ${form.username}` },
                  { label: 'FULL NAME', value: form.fullName },
                  { label: 'MISSION', value: form.goal },
                  { label: 'METRICS', value: `${form.age}y · ${form.height}cm · ${form.weight}kg` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-purple-600/10">
                    <span className="text-xs font-mono text-white/30 tracking-widest">{item.label}</span>
                    <span className="text-sm font-display text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl text-center space-y-2"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}
              >
                <div className="text-4xl">🌑</div>
                <p className="font-display font-bold text-purple-400 tracking-wider">READY TO ASCEND</p>
                <p className="text-xs text-white/30 font-mono">Starting Rank: BRONZE · Level 1</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl font-display font-semibold text-sm tracking-widest border border-purple-600/30 text-white/50 hover:border-purple-600/60 hover:text-white/80 transition-all"
              >
                ← BACK
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="flex-1 btn-primary py-3 text-sm"
              >
                CONTINUE →
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="flex-1 py-3 rounded-xl font-display font-bold text-lg tracking-widest text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(34,211,238,0.3)',
                }}
              >
                ⚡ ACTIVATE SYSTEM
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-white/20 text-xs font-mono mt-6">
          All data stored locally on your device. No account needed.
        </p>
      </div>
    </div>
  )
}

function FloatInput({ label, value, onChange, error, type = 'text', placeholder, suffix }) {
  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || ' '}
          className="input-field pr-16 peer"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px 8px 0 0',
          }}
        />
        <label className="input-label">{label}</label>
        {suffix && (
          <span className="absolute right-4 top-3 text-xs font-mono text-white/30">{suffix}</span>
        )}
      </div>
      {error && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{error}</p>}
    </div>
  )
}

// Shadow System - Local Storage Management

export const STORAGE_KEYS = {
  USER: 'shadow_user',
  HABITS: 'shadow_habits',
  LOGS: 'shadow_logs',
  ACHIEVEMENTS: 'shadow_achievements',
  REWARDS: 'shadow_rewards',
  QUESTS: 'shadow_quests',
  SETTINGS: 'shadow_settings',
}

// ---------- USER ----------
export const getUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const createUser = (formData) => {
  const user = {
    id: Date.now().toString(),
    fullName: formData.fullName,
    username: formData.username,
    goal: formData.goal,
    age: parseInt(formData.age),
    height: parseFloat(formData.height),
    weight: parseFloat(formData.weight),
    avatar: formData.avatar || getRandomAvatar(),
    frame: 'default',
    level: 1,
    xp: 0,
    xpToNext: 500,
    totalXp: 0,
    rank: 'Bronze',
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakFreezes: 2,
    joinedAt: new Date().toISOString(),
    theme: 'default',
    badges: [],
    createdAt: new Date().toISOString(),
  }
  saveUser(user)
  return user
}

export const updateUser = (updates) => {
  const user = getUser()
  if (!user) return null
  const updated = { ...user, ...updates }
  saveUser(updated)
  return updated
}

// ---------- HABITS ----------
export const getHabits = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export const saveHabits = (habits) => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
}

export const addHabit = (habitData) => {
  const habits = getHabits()
  const habit = {
    id: Date.now().toString(),
    name: habitData.name,
    description: habitData.description || '',
    category: habitData.category || 'General',
    difficulty: habitData.difficulty || 'medium',
    icon: habitData.icon || '⚡',
    color: habitData.color || '#8B5CF6',
    frequency: habitData.frequency || 'daily',
    xpReward: getDifficultyXP(habitData.difficulty || 'medium'),
    completedDates: [],
    streak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    createdAt: new Date().toISOString(),
  }
  habits.push(habit)
  saveHabits(habits)
  return habit
}

export const updateHabit = (id, updates) => {
  const habits = getHabits()
  const idx = habits.findIndex(h => h.id === id)
  if (idx === -1) return null
  habits[idx] = { ...habits[idx], ...updates }
  saveHabits(habits)
  return habits[idx]
}

export const deleteHabit = (id) => {
  const habits = getHabits().filter(h => h.id !== id)
  saveHabits(habits)
}

export const toggleHabitComplete = (id) => {
  const habits = getHabits()
  const idx = habits.findIndex(h => h.id === id)
  if (idx === -1) return { habit: null, gained: 0, alreadyDone: false }
  
  const today = getTodayStr()
  const habit = habits[idx]
  const alreadyDone = habit.completedDates.includes(today)
  
  if (alreadyDone) {
    habit.completedDates = habit.completedDates.filter(d => d !== today)
    habit.totalCompletions = Math.max(0, habit.totalCompletions - 1)
    habits[idx] = habit
    saveHabits(habits)
    return { habit, gained: -habit.xpReward, alreadyDone: true }
  } else {
    habit.completedDates.push(today)
    habit.totalCompletions += 1
    // Update streak
    const yesterday = getYesterdayStr()
    if (habit.completedDates.includes(yesterday)) {
      habit.streak += 1
    } else {
      habit.streak = 1
    }
    habit.longestStreak = Math.max(habit.longestStreak, habit.streak)
    habits[idx] = habit
    saveHabits(habits)
    return { habit, gained: habit.xpReward, alreadyDone: false }
  }
}

// ---------- LOGS ----------
export const getLogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export const addLog = (entry) => {
  const logs = getLogs()
  logs.push({ ...entry, timestamp: new Date().toISOString() })
  // Keep last 500 logs
  if (logs.length > 500) logs.splice(0, logs.length - 500)
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
}

// ---------- ACHIEVEMENTS ----------
export const ALL_ACHIEVEMENTS = [
  { id: 'first_habit', name: 'Shadow Initiate', desc: 'Complete your first habit', icon: '🌑', xp: 50 },
  { id: 'streak_3', name: 'Consistent Ghost', desc: 'Maintain a 3-day streak', icon: '👻', xp: 100 },
  { id: 'streak_7', name: 'Shadow Walker', desc: 'Maintain a 7-day streak', icon: '🔥', xp: 250 },
  { id: 'streak_30', name: 'Obsidian Force', desc: 'Maintain a 30-day streak', icon: '💎', xp: 1000 },
  { id: 'habits_5', name: 'System Builder', desc: 'Add 5 habits', icon: '⚙️', xp: 150 },
  { id: 'habits_10', name: 'Architect', desc: 'Add 10 habits', icon: '🏛️', xp: 300 },
  { id: 'level_5', name: 'Rising Shadow', desc: 'Reach Level 5', icon: '🌙', xp: 200 },
  { id: 'level_10', name: 'Dark Ascendant', desc: 'Reach Level 10', icon: '🌟', xp: 500 },
  { id: 'level_25', name: 'Void Master', desc: 'Reach Level 25', icon: '🔮', xp: 1500 },
  { id: 'xp_1000', name: 'Energy Absorber', desc: 'Gain 1000 total XP', icon: '⚡', xp: 100 },
  { id: 'xp_10000', name: 'Shadow Conduit', desc: 'Gain 10,000 total XP', icon: '🌀', xp: 500 },
  { id: 'perfect_week', name: 'Flawless Week', desc: 'Complete all habits 7 days in a row', icon: '🏆', xp: 750 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Complete habits after midnight', icon: '🦉', xp: 75 },
  { id: 'early_riser', name: 'Dawn Striker', desc: 'Complete habits before 7am', icon: '🌅', xp: 75 },
]

export const getUnlockedAchievements = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export const unlockAchievement = (id) => {
  const unlocked = getUnlockedAchievements()
  if (unlocked.includes(id)) return false
  unlocked.push(id)
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlocked))
  return true
}

// ---------- XP / LEVELS ----------
export const RANKS = [
  { name: 'Bronze', minLevel: 1, maxLevel: 9, color: '#cd7f32', glow: '#cd7f3280' },
  { name: 'Silver', minLevel: 10, maxLevel: 19, color: '#c0c0c0', glow: '#c0c0c080' },
  { name: 'Gold', minLevel: 20, maxLevel: 34, color: '#ffd700', glow: '#ffd70080' },
  { name: 'Diamond', minLevel: 35, maxLevel: 49, color: '#b9f2ff', glow: '#b9f2ff80' },
  { name: 'Elite', minLevel: 50, maxLevel: 74, color: '#8B5CF6', glow: '#8B5CF680' },
  { name: 'Shadow', minLevel: 75, maxLevel: 99, color: '#22D3EE', glow: '#22D3EE80' },
  { name: 'Monarch', minLevel: 100, maxLevel: 999, color: '#f59e0b', glow: '#f59e0b80' },
]

export const getRankForLevel = (level) => {
  return RANKS.find(r => level >= r.minLevel && level <= r.maxLevel) || RANKS[0]
}

export const getXPForLevel = (level) => Math.floor(500 * Math.pow(1.15, level - 1))

export const addXP = (amount) => {
  const user = getUser()
  if (!user) return user
  
  user.xp += amount
  user.totalXp += amount
  
  // Level up check
  while (user.xp >= user.xpToNext) {
    user.xp -= user.xpToNext
    user.level += 1
    user.xpToNext = getXPForLevel(user.level)
  }
  
  // Update rank
  user.rank = getRankForLevel(user.level).name
  saveUser(user)
  return user
}

export const updateStreak = () => {
  const user = getUser()
  if (!user) return user
  
  const today = getTodayStr()
  const yesterday = getYesterdayStr()
  
  if (user.lastActiveDate === today) return user // already counted
  
  if (user.lastActiveDate === yesterday) {
    user.streak += 1
    user.longestStreak = Math.max(user.longestStreak, user.streak)
  } else if (user.lastActiveDate !== today) {
    // Check for streak freeze
    if (user.streakFreezes > 0 && user.lastActiveDate) {
      user.streakFreezes -= 1
    } else {
      user.streak = 1
    }
  }
  
  user.lastActiveDate = today
  saveUser(user)
  return user
}

// ---------- QUESTS ----------
export const generateDailyQuests = () => {
  const today = getTodayStr()
  const questsKey = `shadow_quests_${today}`
  const cached = localStorage.getItem(questsKey)
  if (cached) return JSON.parse(cached)
  
  const quests = [
    { id: `q1_${today}`, name: 'Shadow Protocol', desc: 'Complete 3 habits today', target: 3, type: 'habits_today', xp: 150, completed: false, icon: '⚔️' },
    { id: `q2_${today}`, name: 'Consistency Engine', desc: 'Maintain any streak for today', target: 1, type: 'maintain_streak', xp: 100, completed: false, icon: '🔗' },
    { id: `q3_${today}`, name: 'Perfect Execution', desc: 'Complete all your habits today', target: null, type: 'all_habits', xp: 300, completed: false, icon: '🏆' },
  ]
  
  localStorage.setItem(questsKey, JSON.stringify(quests))
  return quests
}

export const updateDailyQuests = (quests) => {
  const today = getTodayStr()
  localStorage.setItem(`shadow_quests_${today}`, JSON.stringify(quests))
}

// ---------- HELPERS ----------
export const getTodayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const getYesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const getDifficultyXP = (difficulty) => {
  const map = { easy: 20, medium: 50, hard: 100, legendary: 200 }
  return map[difficulty] || 50
}

export const getRandomAvatar = () => {
  const avatars = ['shadow', 'void', 'eclipse', 'phantom', 'cipher']
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export const getHeatmapData = (habits, days = 90) => {
  const result = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    
    let completed = 0
    let total = habits.length
    
    habits.forEach(h => {
      if (h.completedDates.includes(dateStr)) completed++
    })
    
    result.push({
      date: dateStr,
      completed,
      total,
      ratio: total > 0 ? completed / total : 0,
    })
  }
  
  return result
}

export const getWeeklyStats = (habits) => {
  const stats = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const dayName = d.toLocaleDateString('en', { weekday: 'short' })
    
    let completed = 0
    habits.forEach(h => {
      if (h.completedDates.includes(dateStr)) completed++
    })
    
    stats.push({ day: dayName, completed, total: habits.length, date: dateStr })
  }
  
  return stats
}

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
}

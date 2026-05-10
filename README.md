# 🌑 SHADOW SYSTEM

> Build Discipline. Enter The Shadow System.

A futuristic, cyberpunk-themed habit tracking web app with XP progression, streak system, achievements, and analytics — fully static, no backend required.

---

## ✨ Features

- **7-Rank Progression** — Bronze → Silver → Gold → Diamond → Elite → Shadow → Monarch
- **XP & Level System** — Gain XP from habits, streaks, quests
- **Streak Engine** — Fire animations, streak freeze insurance, milestone badges
- **Daily Quests** — Generated challenges for bonus XP
- **Analytics Dashboard** — Heatmaps, charts, weekly stats
- **Rewards Shop** — Themes, badges, frames, XP boosts (spend XP)
- **14 Achievements** — Unlock by completing milestones
- **100% Local Storage** — No backend, no account, works on any device
- **Premium Cyberpunk UI** — Glassmorphism, neon glows, particles, custom cursor

---

## 🚀 Quick Deploy (GitHub Pages)

### Method 1: GitHub Actions (Automatic)

1. Fork or push this repo to GitHub
2. Go to **Settings → Pages → Source** → select `GitHub Actions`
3. Push to `main` branch — the workflow auto-deploys

### Method 2: Manual Deploy

```bash
npm install
npm run build
# Upload the /dist folder to any static host
```

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion / CSS |
| Charts | Recharts |
| Storage | LocalStorage |
| Fonts | Rajdhani, Exo 2, Share Tech Mono |

---

## 📁 Folder Structure

```
shadow-system/
├── src/
│   ├── components/
│   │   ├── layout/        # AppLayout, Sidebar
│   │   └── ui/            # CustomCursor, ParticleField, RankBadge, XPNotification
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── HabitsPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── RewardsPage.jsx
│   ├── store/
│   │   └── storage.js     # All LocalStorage logic
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
└── .github/workflows/deploy.yml
```

---

## 🎨 Design System

- **Primary**: `#8B5CF6` (Neon Purple)
- **Accent**: `#22D3EE` (Cyan)
- **Background**: `#020008` (Deep Black)
- **Fonts**: Rajdhani (display), Exo 2 (body), Share Tech Mono (code)

---

## 👤 Credits

© 2026 Claimed by Aryan  
Instagram: [@notyouranonymous_](https://www.instagram.com/notyouranonymous_)

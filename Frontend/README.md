# AquaGuard — Smart Community Health Monitoring System

A React + Vite + TailwindCSS frontend for water-borne disease early warning.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:5173
```

## Project Structure

```
src/
├── components/
│   ├── layout/         Sidebar, Navbar, MainLayout
│   ├── ui/             RiskBadge, StatCard, LanguageSwitcher
│   ├── dashboard/      TrendChart, OutbreakFeed
│   └── gamification/   PointsCard, Leaderboard
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── DiseaseMap.jsx
│   ├── WaterQuality.jsx
│   ├── AlertCentre.jsx
│   ├── ReportForm.jsx
│   └── GamificationProfile.jsx
├── data/
│   └── mockData.js     All mock data (replace with real APIs)
├── locales/
│   ├── en.json         English
│   ├── hi.json         Hindi
│   └── mr.json         Marathi
├── hooks/              useAlerts, useSensorData
├── store/              userStore (Context API)
└── utils/              riskCalculator, colorByLevel
```

## Features Built
- Dashboard with KPI cards, trend chart, outbreak feed
- Interactive disease map (Leaflet.js) with risk zones
- Water quality sensor monitoring with live threshold badges
- Alert centre with severity filtering
- Community report submission form (+50 pts on submit)
- Gamification profile: XP bar, badges, leaderboard
- Multilingual: Hindi / English / Marathi switcher

## Next Steps (Backend)
- Replace mockData.js with real Axios API calls
- Connect to Node.js + Express backend
- Add MongoDB for reports, alerts, sensor logs
- Add Socket.io for real-time dashboard updates
- Integrate Twilio SMS alerts

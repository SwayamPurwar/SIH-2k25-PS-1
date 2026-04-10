# AquaGuard Backend API

Node.js + Express + MongoDB Atlas REST API.

## Setup

```bash
# 1. Install packages
npm install

# 2. Create .env from template
cp .env.example .env
# → Fill in MONGODB_URI with your Atlas connection string

# 3. Seed initial data (zones + sensors)
node src/utils/seedData.js

# 4. Start dev server
npm run dev
```

## API Endpoints

| Method | Route                        | Auth     | Description             |
|--------|------------------------------|----------|-------------------------|
| POST   | /api/auth/register           | Public   | Register new user       |
| POST   | /api/auth/login              | Public   | Login + get JWT token   |
| GET    | /api/auth/me                 | JWT      | Get current user        |
| GET    | /api/alerts                  | Public   | Get active alerts       |
| POST   | /api/alerts                  | Officer  | Create new alert        |
| PATCH  | /api/alerts/:id/resolve      | Officer  | Resolve an alert        |
| GET    | /api/reports                 | JWT      | Get all reports         |
| POST   | /api/reports                 | JWT      | Submit report (+50 pts) |
| PATCH  | /api/reports/:id/verify      | Officer  | Verify report (+20 pts) |
| GET    | /api/sensors                 | Public   | Get sensor readings     |
| POST   | /api/sensors/:id/reading     | Officer  | Push new reading        |
| GET    | /api/zones                   | Public   | Get all zones           |
| GET    | /api/users/leaderboard       | Public   | Points leaderboard      |
| GET    | /api/users/profile           | JWT      | Get user profile        |
| GET    | /api/health                  | Public   | Health check            |

## Connecting to Frontend

In your frontend `src/services/api.js`, set:
```js
const BASE_URL = 'http://localhost:5000/api'
```
Then replace all mock data calls with Axios requests to these endpoints.

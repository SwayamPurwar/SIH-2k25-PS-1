import express    from 'express'
import dotenv     from 'dotenv'
import cors       from 'cors'
import helmet     from 'helmet'
import morgan     from 'morgan'
import rateLimit  from 'express-rate-limit'
import { connectDB } from './config/db.js'

import authRoutes    from './routes/auth.js'
import alertRoutes   from './routes/alerts.js'
import reportRoutes  from './routes/reports.js'
import sensorRoutes  from './routes/sensors.js'
import userRoutes    from './routes/users.js'
import zoneRoutes    from './routes/zones.js'

dotenv.config()
connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

// NEW: Trust proxy if behind a load balancer/reverse proxy
// This ensures IP rate limiting works correctly in production
app.set('trust proxy', 1) 

// ── Security & Middleware ────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 2. Be explicit with your CORS origins (include both localhost and 127.0.0.1)
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  credentials: true 
}));
app.use(express.json())
// NEW: Parse urlencoded payloads
app.use(express.urlencoded({ extended: true })) 
app.use(morgan('dev'))

// Rate limiter — 100 requests per 15 min per IP
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }))

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api/alerts',  alertRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/users',   userRoutes)
app.use('/api/zones',   zoneRoutes)

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AquaGuard API is running', timestamp: new Date() })
})

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  // FIXED: Fallback to err.statusCode in case err.status is undefined
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 AquaGuard API running on http://localhost:${PORT}`)
})

export default app
import { Router } from 'express'
import { getLeaderboard, getProfile, claimPoints } from '../controllers/userController.js' // <-- Add claimPoints
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/leaderboard', getLeaderboard)
router.get('/profile',     protect, getProfile)
router.post('/claim-points', protect, claimPoints)

export default router
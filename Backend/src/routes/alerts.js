import { Router } from 'express'
import { getAlerts, createAlert, resolveAlert } from '../controllers/alertController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',              getAlerts)
router.post('/',             protect, authorize('officer','fieldworker'), createAlert)
router.patch('/:id/resolve', protect, authorize('officer'), resolveAlert)
export default router

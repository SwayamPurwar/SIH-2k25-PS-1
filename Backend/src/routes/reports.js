import { Router } from 'express'
import { createReport, getReports, verifyReport } from '../controllers/reportController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',            protect, getReports)
router.post('/',           protect, createReport)
router.patch('/:id/verify',protect, authorize('officer','fieldworker'), verifyReport)
export default router

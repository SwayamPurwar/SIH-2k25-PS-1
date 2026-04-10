import { Router } from 'express'
import { getSensors, addReading, createSensor } from '../controllers/sensorController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',               getSensors)
router.post('/',              protect, authorize('officer'), createSensor)
router.post('/:id/reading',   protect, authorize('officer','fieldworker'), addReading)
export default router

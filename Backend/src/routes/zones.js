import { Router } from 'express'
import { getZones, getZone, runAIPrediction } from '../controllers/zoneController.js'

const router = Router()

router.get('/', getZones)
router.get('/:id', getZone)
router.post('/:id/predict', runAIPrediction) // <-- We just added this!

export default router
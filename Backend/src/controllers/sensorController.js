import Sensor from '../models/Sensor.js'
import Zone   from '../models/Zone.js'
import { calculateRiskScore, getRiskLevel, getAlertLevel } from '../utils/riskCalculator.js'

// @GET /api/sensors
export async function getSensors(req, res) {
  const { zone } = req.query
  const filter = { active: true }
  if (zone) filter.zone = zone
  try {
    const sensors = await Sensor.find(filter).sort('zone')
    res.json({ success: true, count: sensors.length, data: sensors })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/sensors/:id/reading — submit new sensor reading
export async function addReading(req, res) {
  const { ph, turbidity, coliform, chlorine } = req.body
  try {
    const reading = { ph, turbidity, coliform, chlorine, recordedAt: new Date() }
    const score   = calculateRiskScore(ph, turbidity, coliform, chlorine)
    const status  = getRiskLevel(score)
    const sensor  = await Sensor.findByIdAndUpdate(
      req.params.id,
      {
        latest: reading, status,
        $push: { history: { $each: [reading], $slice: -100 } }
      },
      { new: true }
    )
    if (!sensor) return res.status(404).json({ success: false, message: 'Sensor not found' })
    // Update zone risk
    await Zone.findOneAndUpdate(
      { zoneId: sensor.zone },
      { riskScore: score, riskLevel: getAlertLevel(score) }
    )
    res.json({ success: true, data: sensor, riskScore: score, status })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/sensors — create sensor
export async function createSensor(req, res) {
  try {
    const sensor = await Sensor.create(req.body)
    res.status(201).json({ success: true, data: sensor })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

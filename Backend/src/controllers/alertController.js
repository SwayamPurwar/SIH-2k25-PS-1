import Alert from '../models/Alert.js'

export async function getAlerts(req, res) {
  const { zone, level, status = 'active', limit = 20 } = req.query
  const filter = { status }
  if (zone)  filter.zone  = zone
  if (level) filter.level = level
  
  // FIXED: Parse limit securely
  const parsedLimit = Math.max(1, parseInt(limit) || 20)
  
  try {
    const alerts = await Alert.find(filter)
      .populate('createdBy', 'name role')
      .sort('-createdAt')
      .limit(parsedLimit)
    res.json({ success: true, count: alerts.length, data: alerts })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/alerts
export async function createAlert(req, res) {
  const { title, body, zone, location, level, disease, cases } = req.body
  try {
    const alert = await Alert.create({
      title, body, zone, location, level, disease, cases,
      createdBy: req.user._id,
    })
    res.status(201).json({ success: true, data: alert })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @PATCH /api/alerts/:id/resolve
export async function resolveAlert(req, res) {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id, { status: 'resolved' }, { new: true }
    )
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' })
    res.json({ success: true, data: alert })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

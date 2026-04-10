import Report from '../models/Report.js'
import User   from '../models/User.js'

// @POST /api/reports
export async function createReport(req, res) {
  const { zone, location, symptoms, description, severity } = req.body
  try {
    const report = await Report.create({
      user: req.user._id, zone, location, symptoms, description, severity,
    })
    
    // FIXED: Fetch user and use .save() to trigger the level calculation hook
    const user = await User.findById(req.user._id)
    if (user) {
      user.points += 50
      
      const reportCount = await Report.countDocuments({ user: req.user._id })
      
      // FIXED: More resilient badge logic (using >= and checking if already owned)
      if (reportCount >= 10 && !user.badges.some(b => b.name === 'Water Guardian')) {
        user.badges.push({ name: 'Water Guardian', earnedAt: new Date() })
      }
      if (reportCount >= 30 && !user.badges.some(b => b.name === 'Disease Detector')) {
        user.badges.push({ name: 'Disease Detector', earnedAt: new Date() })
      }
      
      await user.save() // This will now properly update Bronze -> Silver -> Gold
    }

    res.status(201).json({ success: true, data: report, pointsEarned: 50 })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @GET /api/reports
export async function getReports(req, res) {
  const { zone, status, limit = 20, page = 1 } = req.query
  const filter = {}
  if (zone)   filter.zone   = zone
  if (status) filter.status = status
  
  // FIXED: Ensure page and limit are strictly valid integers to prevent NaN DB crashes
  const parsedLimit = Math.max(1, parseInt(limit) || 20)
  const parsedPage = Math.max(1, parseInt(page) || 1)

  try {
    const reports = await Report.find(filter)
      .populate('user', 'name zone')
      .sort('-createdAt')
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      
    const total = await Report.countDocuments(filter)
    res.json({ success: true, count: reports.length, total, data: reports })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @PATCH /api/reports/:id/verify
export async function verifyReport(req, res) {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'verified', verifiedBy: req.user._id },
      { new: true }
    )
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })
    
    // FIXED: Use .save() for bonus points to ensure user Level updates dynamically
    const reporter = await User.findById(report.user)
    if (reporter) {
      reporter.points += 20
      await reporter.save()
    }

    res.json({ success: true, data: report })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
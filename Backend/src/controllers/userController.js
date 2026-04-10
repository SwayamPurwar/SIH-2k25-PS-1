import User   from '../models/User.js'
import Report from '../models/Report.js'

// @GET /api/users/leaderboard
export async function getLeaderboard(req, res) {
  const { zone, limit = 10 } = req.query
  const filter = {}
  if (zone) filter.zone = zone
  
  // FIXED: Safely parse limit to prevent NaN server crashes
  const parsedLimit = Math.max(1, parseInt(limit) || 10)
  
  try {
    const users = await User.find(filter)
      .select('name zone points level streak badges')
      .sort('-points')
      .limit(parsedLimit)
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @GET /api/users/profile
export async function getProfile(req, res) {
  try {
    const user        = await User.findById(req.user._id).select('-password')
    const reportCount = await Report.countDocuments({ user: req.user._id })
    res.json({ success: true, data: { ...user.toObject(), totalReports: reportCount } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/users/claim-points
export async function claimPoints(req, res) {
  const { action, points } = req.body;
  
  // FIXED: Add a sanity check to prevent malicious point spoofing
  const claimedPoints = Number(points);
  if (isNaN(claimedPoints) || claimedPoints <= 0 || claimedPoints > 100) {
    return res.status(400).json({ success: false, message: 'Invalid point value' });
  }
  
  try {
    // FIXED: Use findById and .save() to trigger the Bronze/Silver/Gold level-up hook
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.points += claimedPoints;
    await user.save();
    
    // Omit password from the response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ success: true, data: userResponse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
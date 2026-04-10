import User          from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

// @POST /api/auth/register
export async function register(req, res) {
  let { name, phone, email, password, role, zone } = req.body
  
  // NEW: Convert empty strings to undefined so Mongoose 'sparse' works properly
  if (!phone) phone = undefined;
  if (!email) email = undefined;

  try {
    const query = []
    if (email) query.push({ email })
    if (phone) query.push({ phone })

    if (query.length > 0) {
      const exists = await User.findOne({ $or: query })
      if (exists) {
        return res.status(400).json({ success: false, message: 'Account already exists with this phone/email' })
      }
    }

    const user = await User.create({ name, phone, email, password, role, zone })
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, zone: user.zone, points: user.points, level: user.level,
        token: generateToken(user._id),
      }
    })
  } catch (err) {
    // This logs the exact error to your VS Code terminal to help you debug!
    console.error("REGISTER ERROR:", err.message); 
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/auth/login
export async function login(req, res) {
  const { email, phone, password } = req.body
  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    
    const now = new Date()
    
    // FIXED: Evaluate streak BEFORE updating lastLogin
    if (user.lastLogin) {
      const yesterday = new Date(now.getTime() - 86400000)
      
      // If last login was strictly before today, but within the last 24-48 hours
      if (user.lastLogin > yesterday && user.lastLogin.toDateString() !== now.toDateString()) {
        user.streak += 1
      } else if (user.lastLogin.toDateString() !== now.toDateString()) {
        // Missed a day, reset streak
        user.streak = 1
      }
      // If they log in multiple times on the SAME day, streak remains unchanged
    } else {
      user.streak = 1
    }

    // Now update last login
    user.lastLogin = now
    
    // Streak bonus points
    if (user.streak > 0 && user.streak % 7 === 0 && user.lastLogin.toDateString() !== now.toDateString()) {
        user.points += 50
    }
    user.points += 10
    
    await user.save()
    
    res.json({
      success: true,
      data: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, zone: user.zone, points: user.points,
        level: user.level, streak: user.streak, badges: user.badges,
        token: generateToken(user._id),
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @GET /api/auth/me
export async function getMe(req, res) {
  const user = await User.findById(req.user._id).select('-password')
  res.json({ success: true, data: user })
}
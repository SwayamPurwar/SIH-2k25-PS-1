import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  
  // ADDED unique and sparse to both phone and email
  phone:    { type: String, trim: true, unique: true, sparse: true },
  email:    { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['citizen','officer','fieldworker'], default: 'citizen' },
  zone:     { type: String, default: '1' },
  city:     { type: String, default: 'Indore' },
  language: { type: String, enum: ['hi','en','mr'], default: 'hi' },
  points:   { type: Number, default: 0 },
  level:    { type: String, enum: ['Bronze','Silver','Gold'], default: 'Bronze' },
  streak:   { type: Number, default: 0 },
  lastLogin:{ type: Date },
  badges:   [{ name: String, earnedAt: Date }],
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// Auto-update level based on points
userSchema.pre('save', function(next) {
  if (this.points >= 2000)      this.level = 'Gold'
  else if (this.points >= 500)  this.level = 'Silver'
  else                          this.level = 'Bronze'
  next()
})

export default mongoose.model('User', userSchema)
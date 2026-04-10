import mongoose from 'mongoose'

const zoneSchema = new mongoose.Schema({
  zoneId:    { type: String, required: true, unique: true },
  name:      { type: String, required: true },
  lat:       { type: Number },
  lng:       { type: Number },
  riskLevel: { type: String, enum: ['safe','low','medium','high'], default: 'safe' },
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  cases:     { type: Number, default: 0 },
  population:{ type: Number },
}, { timestamps: true })

export default mongoose.model('Zone', zoneSchema)

import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  body:     { type: String },
  zone:     { type: String, required: true },
  location: { type: String },
  level:    { type: String, enum: ['low','medium','high'], required: true },
  disease:  { type: String },
  cases:    { type: Number, default: 0 },
  status:   { type: String, enum: ['active','resolved'], default: 'active' },
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.model('Alert', alertSchema)

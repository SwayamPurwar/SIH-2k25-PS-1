import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zone:      { type: String, required: true },
  location:  {
    name: { type: String },
    lat:  { type: Number },
    lng:  { type: Number },
  },
  symptoms:  [{ type: String }],
  description: { type: String },
  severity:  { type: String, enum: ['low','medium','high'], default: 'low' },
  status:    { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  pointsAwarded: { type: Number, default: 50 },
  verifiedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)

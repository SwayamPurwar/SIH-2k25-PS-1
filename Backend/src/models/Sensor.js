import mongoose from 'mongoose'

const readingSchema = new mongoose.Schema({
  ph:        { type: Number, required: true },
  turbidity: { type: Number, required: true },
  coliform:  { type: Number, required: true },
  chlorine:  { type: Number, required: true },
  recordedAt:{ type: Date, default: Date.now },
})

const sensorSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  zone:     { type: String, required: true },
  location: { lat: Number, lng: Number },
  status:   { type: String, enum: ['safe','warning','danger'], default: 'safe' },
  active:   { type: Boolean, default: true },
  latest:   readingSchema,
  history:  [readingSchema],
}, { timestamps: true })

export default mongoose.model('Sensor', sensorSchema)

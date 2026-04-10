// Run: node src/utils/seedData.js
// Seeds the database with initial zones + sensors

import dotenv   from 'dotenv'
import mongoose from 'mongoose'
import Zone     from '../models/Zone.js'
import Sensor   from '../models/Sensor.js'

dotenv.config()
await mongoose.connect(process.env.MONGODB_URI)

const zones = [
  { zoneId:'1', name:'Khajrana',       lat:22.6965, lng:75.8731, riskLevel:'high',   riskScore:74, cases:8,  population:42000 },
  { zoneId:'2', name:'Palasia',        lat:22.7231, lng:75.8743, riskLevel:'medium', riskScore:30, cases:5,  population:38000 },
  { zoneId:'3', name:'MG Road',        lat:22.7190, lng:75.8680, riskLevel:'safe',   riskScore:12, cases:0,  population:29000 },
  { zoneId:'4', name:'Rajendra Nagar', lat:22.7196, lng:75.8577, riskLevel:'high',   riskScore:82, cases:12, population:51000 },
  { zoneId:'5', name:'Bhanwarkuan',    lat:22.7100, lng:75.8600, riskLevel:'safe',   riskScore:18, cases:0,  population:33000 },
  { zoneId:'6', name:'Annapurna',      lat:22.6900, lng:75.8650, riskLevel:'low',    riskScore:22, cases:1,  population:45000 },
  { zoneId:'7', name:'Vijay Nagar',    lat:22.7543, lng:75.8789, riskLevel:'medium', riskScore:45, cases:3,  population:62000 },
  { zoneId:'8', name:'Sudama Nagar',   lat:22.7300, lng:75.8900, riskLevel:'safe',   riskScore:15, cases:0,  population:28000 },
  { zoneId:'9', name:'Scheme No. 54',  lat:22.7381, lng:75.8850, riskLevel:'safe',   riskScore:10, cases:0,  population:19000 },
]

const sensors = [
  { name:'Rajendra Nagar Tank',  zone:'4', location:{lat:22.7196,lng:75.8577}, status:'danger',
    latest:{ ph:5.2, turbidity:18.4, coliform:340, chlorine:0.1, recordedAt:new Date() } },
  { name:'Vijay Nagar Supply',   zone:'7', location:{lat:22.7543,lng:75.8789}, status:'warning',
    latest:{ ph:6.8, turbidity:4.2,  coliform:45,  chlorine:0.4, recordedAt:new Date() } },
  { name:'Palasia Main Line',    zone:'2', location:{lat:22.7231,lng:75.8743}, status:'safe',
    latest:{ ph:7.1, turbidity:2.1,  coliform:10,  chlorine:0.5, recordedAt:new Date() } },
  { name:'Scheme 54 Reservoir',  zone:'9', location:{lat:22.7381,lng:75.8850}, status:'safe',
    latest:{ ph:7.4, turbidity:1.8,  coliform:5,   chlorine:0.6, recordedAt:new Date() } },
  { name:'Khajrana Water Point', zone:'1', location:{lat:22.6965,lng:75.8731}, status:'danger',
    latest:{ ph:5.8, turbidity:14.2, coliform:280, chlorine:0.1, recordedAt:new Date() } },
]

await Zone.deleteMany({})
await Sensor.deleteMany({})
await Zone.insertMany(zones)
await Sensor.insertMany(sensors)

console.log('✅ Seed data inserted — Zones:', zones.length, '| Sensors:', sensors.length)
await mongoose.disconnect()

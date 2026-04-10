import Zone from '../models/Zone.js'
import Report from '../models/Report.js'
import Sensor from '../models/Sensor.js'

// @GET /api/zones
export async function getZones(req, res) {
  try {
    const zones = await Zone.find().sort('zoneId')
    res.json({ success: true, count: zones.length, data: zones })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @GET /api/zones/:id
export async function getZone(req, res) {
  try {
    const zone = await Zone.findOne({ zoneId: req.params.id })
    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' })
    res.json({ success: true, data: zone })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @POST /api/zones/:id/predict (NEW AI ENGINE)
export async function runAIPrediction(req, res) {
  try {
    const zoneId = req.params.id
    
    // 1. Get the Zone
    const zone = await Zone.findOne({ zoneId })
    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' })

    // 2. Fetch reports from the last 72 hours for this zone
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const recentReports = await Report.find({ 
      zone: zoneId, 
      createdAt: { $gte: threeDaysAgo } 
    })

    // 3. Fetch latest Sensor Data
    const sensor = await Sensor.findOne({ zone: zoneId })
    
    // --- THE ML / AI RISK ALGORITHM ---
    let aiRiskScore = sensor ? sensor.latest.turbidity * 2 : 10; // Base risk from water
    let diseaseType = 'Low Risk';
    let highRiskFactors = [];

    // Analyze health symptoms
    let diarrheaCount = 0;
    recentReports.forEach(report => {
      if (report.symptoms.includes('Diarrhoea') || report.symptoms.includes('Vomiting')) {
        diarrheaCount++;
        aiRiskScore += 15; // Severe penalty for gastrointestinal symptoms
      }
      if (report.symptoms.includes('Fever')) aiRiskScore += 5;
    })

    // Cap at 100
    aiRiskScore = Math.min(100, Math.round(aiRiskScore));

    // Determine Disease Profile
    if (aiRiskScore >= 75) {
      diseaseType = diarrheaCount > 3 ? 'Cholera Outbreak Likely' : 'Severe Typhoid Risk';
      highRiskFactors.push('Multiple Diarrhoea cases reported', 'Poor Water Quality');
    } else if (aiRiskScore >= 45) {
      diseaseType = 'Dysentery / Viral Fever';
      highRiskFactors.push('Moderate contamination', 'Isolated cases');
    } else {
      highRiskFactors.push('Sensor normal', 'No recent outbreaks');
    }

    // Generate the 72-hour forecast timeline
    const forecast = {
      riskNow: aiRiskScore,
      risk24h: Math.min(100, aiRiskScore + (diarrheaCount * 5)), // Spikes if cases are spreading
      risk48h: Math.min(100, aiRiskScore + (diarrheaCount * 8)),
      risk72h: Math.min(100, aiRiskScore + (diarrheaCount * 12)),
      disease: diseaseType,
      factors: highRiskFactors
    }

    // Save the new AI score back to the database!
    zone.riskScore = aiRiskScore;
    zone.riskLevel = aiRiskScore >= 75 ? 'high' : aiRiskScore >= 45 ? 'medium' : 'safe';
    await zone.save();

    res.json({ success: true, data: forecast })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
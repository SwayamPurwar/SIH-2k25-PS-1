export const mockAlerts = [
  { id: 1, zone: '4', title: 'Cholera risk detected', level: 'high',   location: 'Rajendra Nagar', time: '2h', cases: 12 },
  { id: 2, zone: '7', title: 'Turbidity spike',       level: 'medium', location: 'Vijay Nagar',    time: '4h', cases: 3  },
  { id: 3, zone: '2', title: 'pH imbalance alert',    level: 'medium', location: 'Palasia',        time: '6h', cases: 5  },
  { id: 4, zone: '9', title: 'Water supply restored', level: 'low',    location: 'Scheme No. 54',  time: '8h', cases: 0  },
  { id: 5, zone: '1', title: 'Coliform count high',   level: 'high',   location: 'Khajrana',       time: '1h', cases: 8  },
]

export const mockSensors = [
  { id: 's1', zone: '4', name: 'Rajendra Nagar Tank',  ph: 5.2, turbidity: 18.4, coliform: 340, chlorine: 0.1, status: 'danger'  },
  { id: 's2', zone: '7', name: 'Vijay Nagar Supply',   ph: 6.8, turbidity: 4.2,  coliform: 45,  chlorine: 0.4, status: 'warning' },
  { id: 's3', zone: '2', name: 'Palasia Main Line',    ph: 7.1, turbidity: 2.1,  coliform: 10,  chlorine: 0.5, status: 'safe'    },
  { id: 's4', zone: '9', name: 'Scheme 54 Reservoir',  ph: 7.4, turbidity: 1.8,  coliform: 5,   chlorine: 0.6, status: 'safe'    },
]

export const mockTrendData = [
  { day: 'Mon', cases: 4,  risk: 32 },
  { day: 'Tue', cases: 6,  risk: 45 },
  { day: 'Wed', cases: 12, risk: 68 },
  { day: 'Thu', cases: 9,  risk: 55 },
  { day: 'Fri', cases: 15, risk: 74 },
  { day: 'Sat', cases: 11, risk: 62 },
  { day: 'Sun', cases: 8,  risk: 50 },
]

export const mockLeaderboard = [
  { rank: 1, name: 'Priya S.',  zone: '3', points: 3120, level: 'Gold',   reports: 62 },
  { rank: 2, name: 'Rahul K.',  zone: '4', points: 1240, level: 'Silver', reports: 24 },
  { rank: 3, name: 'Anita M.',  zone: '7', points: 980,  level: 'Bronze', reports: 19 },
  { rank: 4, name: 'Dev P.',    zone: '2', points: 740,  level: 'Bronze', reports: 14 },
  { rank: 5, name: 'Sunita R.', zone: '9', points: 620,  level: 'Bronze', reports: 12 },
]

export const mockUser = {
  name: 'Rahul Kumar',
  zone: '4',
  city: 'Indore',
  points: 1280,
  level: 'Silver',
  streak: 7,
  reports: 24,
  nextLevel: 2000,
  badges: [
    { id: 'b1', name: 'Water Guardian',   earned: true,  desc: 'Submit 10 reports' },
    { id: 'b2', name: 'First Responder',  earned: true,  desc: 'Share first alert'  },
    { id: 'b3', name: '7-Day Streak',     earned: true,  desc: 'Check in 7 days'   },
    { id: 'b4', name: 'Disease Detector', earned: false, desc: 'Submit 30 reports', progress: 24, target: 30 },
    { id: 'b5', name: 'Community Hero',   earned: false, desc: 'Reach 2000 points', progress: 1240, target: 2000 },
  ],
}

export const mockMapZones = [
  { id: 'z1', zone: '4', lat: 22.7196, lng: 75.8577, risk: 'high',   cases: 12, name: 'Rajendra Nagar' },
  { id: 'z2', zone: '7', lat: 22.7543, lng: 75.8789, risk: 'medium', cases: 3,  name: 'Vijay Nagar'    },
  { id: 'z3', zone: '2', lat: 22.7231, lng: 75.8743, risk: 'medium', cases: 5,  name: 'Palasia'        },
  { id: 'z4', zone: '9', lat: 22.7381, lng: 75.8850, risk: 'low',    cases: 0,  name: 'Scheme No. 54'  },
  { id: 'z5', zone: '1', lat: 22.6965, lng: 75.8731, risk: 'high',   cases: 8,  name: 'Khajrana'       },
]

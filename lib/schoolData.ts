export type SchoolScheduleGame = {
  date: string
  opponent: string
  location: "Home" | "Away" | "Neutral"
  result: string
  
}

export type SchoolData = {
  id: string
  name: string
  city: string
  state: string
  mascot: string
  rank?: number
  record?: string
  rating?: number
  strength?: number
classification?: string
movement?: number
sports?: {
  football?: {
    rank: number
    record: string
    rating: number
    strength: number
  }
  basketball?: {
    rank: number
    record: string
    rating: number
    strength: number
  }
  baseball?: {
    rank: number
    record: string
    rating: number
    strength: number
  }
  soccer?: {
    rank: number
    record: string
    rating: number
    strength: number
  }
  volleyball?: {
    rank: number
    record: string
    rating: number
    strength: number
  }
}
  schedule: SchoolScheduleGame[]
}

export const schools: Record<string, SchoolData> = {
  "cherry-creek": {
    id: "cherry-creek",
    name: "Cherry Creek",
    city: "Greenwood Village",
    state: "CO",
    mascot: "Bruins",
    rank: 1,
record: "2-0",
rating: 96.3,
strength: 34.0,
sports: {
  football: {
  rank: 1,
  record: "2-0",
  rating: 96.3,
  strength: 34.0,
},
basketball: {
  rank: 2,
  record: "12-2",
  rating: 91.4,
  strength: 42.8,
},
baseball: {
  rank: 1,
  record: "16-3",
  rating: 94.8,
  strength: 44.2,
},
soccer: {
  rank: 1,
  record: "9-1",
  rating: 93.6,
  strength: 43.1,
},
volleyball: {
  rank: 1,
  record: "18-2",
  rating: 95.1,
  strength: 45.0,
},
},
classification: "5A",
movement: 0,
    schedule: [
      {
        date: "Aug 20",
        opponent: "Chatfield",
        location: "Away",
        result: "W 28-15",
      },
      {
        date: "Sep 4",
        opponent: "Ralston Valley",
        location: "Home",
        result: "W 38-7",
      },
      {
        date: "Sep 10",
        opponent: "Legend",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Sep 18",
        opponent: "Valor Christian",
        location: "Away",
        result: "7:00 PM",
      },
      {
        date: "Sep 24",
        opponent: "Cherokee Trail",
        location: "Away",
        result: "7:00 PM",
      },
      {
        date: "Oct 2",
        opponent: "Arapahoe",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 8",
        opponent: "Northfield",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 16",
        opponent: "Eaglecrest",
        location: "Away",
        result: "7:00 PM",
      },
      {
        date: "Oct 23",
        opponent: "Mullen",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 30",
        opponent: "Grandview",
        location: "Away",
        result: "7:00 PM",
      },
    ],
  },
    "valor-christian": {
    id: "valor-christian",
    name: "Valor Christian",
    city: "Highlands Ranch",
    state: "CO",
    mascot: "Eagles",
    rank: 2,
record: "2-1",
rating: 89.11,
strength: 48.6,
sports: {
  football: {
    rank: 2,
    record: "2-1",
    rating: 89.11,
    strength: 48.6,
  },
  basketball: {
    rank: 1,
    record: "14-1",
    rating: 95.2,
    strength: 46.1,
  },
  baseball: {
  rank: 2,
  record: "15-4",
  rating: 92.6,
  strength: 41.9,
},
soccer: {
  rank: 2,
  record: "11-2-1",
  rating: 92.1,
  strength: 41.8,
},
volleyball: {
  rank: 18,
  record: "2-3",
  rating: 11.64,
  strength: 14.9,
},
},
classification: "5A",
movement: 1,
    schedule: [
      {
        date: "Aug 21",
        opponent: "Kinkaid",
        location: "Home",
        result: "W 38-22",
      },
      {
        date: "Aug 28",
        opponent: "Faith Lutheran",
        location: "Home",
        result: "W 46-9",
      },
      {
        date: "Sep 4",
        opponent: "Mater Dei",
        location: "Away",
        result: "L 38-22",
      },
      {
        date: "Sep 18",
        opponent: "Cherry Creek",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Sep 25",
        opponent: "Castle View",
        location: "Away",
        result: "6:30 PM",
      },
      {
        date: "Oct 2",
        opponent: "Legend",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 9",
        opponent: "Heritage",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 15",
        opponent: "Pine Creek",
        location: "Away",
        result: "6:00 PM",
      },
      {
        date: "Oct 23",
        opponent: "Fountain-Fort Carson",
        location: "Home",
        result: "7:00 PM",
      },
      {
        date: "Oct 30",
        opponent: "Regis Jesuit",
        location: "Away",
        result: "6:30 PM",
      },
    ],
      },

  "ralston-valley": {
    id: "ralston-valley",
    name: "Ralston Valley",
    city: "Arvada",
    state: "CO",
    mascot: "Mustangs",
    rank: 3,
    record: "1-1",
    rating: 75.4,
    strength: 39.1,
sports: {
  football: {
    rank: 3,
    record: "1-1",
    rating: 75.4,
    strength: 39.1,
  },
  basketball: {
    rank: 4,
    record: "11-3",
    rating: 86.7,
    strength: 39.4,
  },
baseball: {
  rank: 4,
  record: "13-6",
  rating: 88.4,
  strength: 38.9,
},
volleyball: {
  rank: 20,
  record: "2-3",
  rating: 10.8,
  strength: 13.7,
},
},
    classification: "5A",
movement: -1,
    schedule: [],
  },
  "mountain-vista": {
  id: "mountain-vista",
  name: "Mountain Vista",
  city: "Highlands Ranch",
  state: "CO",
  mascot: "Golden Eagles",
  rank: 4,
  record: "1-1",
  rating: 73.7,
  strength: 43.5,
  sports: {
  football: {
    rank: 4,
    record: "1-1",
    rating: 73.7,
    strength: 43.5,
  },
  basketball: {
    rank: 3,
    record: "13-2",
    rating: 88.9,
    strength: 41.7,
  },
  baseball: {
  rank: 3,
  record: "14-5",
  rating: 90.7,
  strength: 40.6,
},
soccer: {
  rank: 3,
  record: "10-2-2",
  rating: 90.4,
  strength: 40.5,
},
volleyball: {
  rank: 1,
  record: "5-0",
  rating: 23.27,
  strength: 13.2,
},
},
  classification: "5A",
movement: -1,
  schedule: [],
},

"grandview": {
  id: "grandview",
  name: "Grandview",
  city: "Aurora",
  state: "CO",
  mascot: "Wolves",
  rank: 5,
  record: "3-0",
  rating: 70.43,
  strength: 27.5,
  sports: {
  football: {
    rank: 5,
    record: "3-0",
    rating: 70.43,
    strength: 27.5,
  },
  basketball: {
    rank: 5,
    record: "10-4",
    rating: 84.2,
    strength: 37.6,
  },
  baseball: {
  rank: 5,
  record: "12-6",
  rating: 86.1,
  strength: 37.4,
},
soccer: {
  rank: 4,
  record: "9-3-2",
  rating: 88.7,
  strength: 39.1,
},
volleyball: {
  rank: 19,
  record: "3-5",
  rating: 6.95,
  strength: 14.6,
},
},
  classification: "5A",
movement: 0,
  schedule: [],
},

"arapahoe": {
  id: "arapahoe",
  name: "Arapahoe",
  city: "Centennial",
  state: "CO",
  mascot: "Warriors",
  rank: 6,
  record: "1-1",
  rating: 70.36,
  strength: 37.1,
 sports: {
  football: {
    rank: 6,
    record: "1-1",
    rating: 70.36,
    strength: 37.1,
  },
  basketball: {
    rank: 6,
    record: "9-5",
    rating: 81.6,
    strength: 35.2,
  },
  baseball: {
  rank: 6,
  record: "11-7",
  rating: 83.7,
  strength: 35.9,
},
soccer: {
  rank: 5,
  record: "9-4-1",
  rating: 86.9,
  strength: 37.8,
},
volleyball: {
  rank: 211,
  record: "2-6",
  rating: -4.55,
  strength: 4.4,
},
},
  classification: "5A",
movement: -2,
  schedule: [],
},
"eaglecrest": {
  id: "eaglecrest",
  name: "Eaglecrest",
  city: "Centennial",
  state: "CO",
  mascot: "Raptors",
  rank: 7,
  record: "3-0",
  rating: 65.4,
  strength: 29.3,
  sports: {
  football: {
    rank: 7,
    record: "3-0",
    rating: 65.4,
    strength: 29.3,
  },
  basketball: {
    rank: 7,
    record: "9-6",
    rating: 79.8,
    strength: 34.1,
  },
  baseball: {
  rank: 7,
  record: "10-8",
  rating: 81.9,
  strength: 34.6,
},
soccer: {
  rank: 6,
  record: "8-4-2",
  rating: 84.8,
  strength: 36.4,
},
volleyball: {
  rank: 29,
  record: "2-4",
  rating: -1.55,
  strength: 8.5,
},
},
  classification: "5A",
movement: 1,
  schedule: [],
},

"legend": {
  id: "legend",
  name: "Legend",
  city: "Parker",
  state: "CO",
  mascot: "Titans",
  rank: 8,
  record: "1-1",
  rating: 64.74,
  strength: 26.3,
  sports: {
  football: {
    rank: 8,
    record: "1-1",
    rating: 64.74,
    strength: 26.3,
  },
  basketball: {
    rank: 8,
    record: "8-6",
    rating: 77.9,
    strength: 33.5,
  },
  baseball: {
  rank: 8,
  record: "9-8",
  rating: 79.6,
  strength: 33.2,
},
volleyball: {
  rank: 7,
  record: "6-2",
  rating: 15.0,
  strength: 12.0,
},
},
  classification: "5A",
movement: 0,
  schedule: [],
},

"palmer-ridge": {
  id: "palmer-ridge",
  name: "Palmer Ridge",
  city: "Monument",
  state: "CO",
  mascot: "Bears",
  rank: 9,
  record: "3-0",
  rating: 63.09,
  strength: 28.4,
  sports: {
  football: {
    rank: 9,
    record: "3-0",
rating: 63.09,
strength: 28.4,
  },
  basketball: {
    rank: 9,
    record: "8-7",
    rating: 75.6,
    strength: 31.8,
  },
  baseball: {
  rank: 9,
  record: "8-9",
  rating: 77.8,
  strength: 31.4,
},
volleyball: {
  rank: 23,
  record: "3-2",
  rating: 4.92,
  strength: 2.8,
},
},
  classification: "4A",
movement: 1,
  schedule: [],
},

"regis-jesuit": {
  id: "regis-jesuit",
  name: "Regis Jesuit",
  city: "Aurora",
  state: "CO",
  mascot: "Raiders",
  rank: 10,
  record: "1-1",
  rating: 62.86,
  strength: 32.9,
  sports: {
  football: {
    rank: 10,
    record: "1-1",
    rating: 62.86,
    strength: 32.9,
  },
  basketball: {
    rank: 10,
    record: "7-7",
    rating: 73.4,
    strength: 30.9,
  },
  baseball: {
  rank: 10,
  record: "8-10",
  rating: 75.9,
  strength: 30.7,
},
volleyball: {
  rank: 8,
  record: "7-2",
  rating: 14.08,
  strength: 5.8,
},
},
  classification: "5A",
movement: -1,
  schedule: [],
},
}
// Texas football rankings from your uploaded 2026 table.
// This is a saved snapshot, not a live rankings feed.
const texasFootballRows: Array<
  [string, string, string, string, number, number]
> = [
  ["Allen", "Allen", "Eagles", "2-0", 99.16, 58.1],
  ["Duncanville", "Duncanville", "Panthers and Pantherettes", "1-1", 97.69, 51.6],
  ["North Shore", "Houston", "Mustangs", "2-0", 95.20, 43.9],
  ["North Crowley", "Fort Worth", "Panthers", "2-0", 94.78, 51.8],
  ["Waxahachie", "Waxahachie", "Indians", "2-0", 93.47, 43.0],
  ["Randle", "Richmond", "Lions", "2-0", 92.97, 43.8],
  ["South Oak Cliff", "Dallas", "Golden Bears", "0-1", 92.88, 51.9],
  ["Guyer", "Denton", "Wildcats", "2-0", 92.60, 43.9],
  ["Southlake Carroll", "Southlake", "Dragons", "1-1", 92.23, 55.8],
  ["DeSoto", "DeSoto", "Fighting Eagles", "0-2", 90.00, 70.6],
  ["Cypress Ranch", "Houston", "Mustangs", "2-0", 89.73, 38.9],
  ["King", "Houston", "Panthers", "1-1", 89.53, 37.1],
  ["Coppell", "Coppell", "Cowboys", "1-1", 88.72, 45.7],
  ["Prosper", "Prosper", "Eagles", "2-0", 86.12, 43.2],
  ["Midway", "Waco", "Panthers", "2-0", 85.77, 41.3],
  ["Aledo", "Aledo", "Bearcats", "0-2", 85.75, 54.9],
  ["Westlake", "Austin", "Chaparrals", "2-0", 85.74, 43.7],
  ["Longview", "Longview", "Lobos", "2-0", 85.54, 30.1],
  ["Stephenville", "Stephenville", "Yellowjackets", "2-0", 81.63, 34.6],
  ["Celina", "Celina", "Bobcats", "2-0", 81.30, 39.8],
  ["Lake Travis", "Austin", "Cavaliers", "1-0", 79.11, 39.3],
  ["Katy", "Katy", "Tigers", "2-0", 78.92, 45.0],
  ["Atascocita", "Humble", "Eagles", "1-1", 78.85, 45.6],
  ["Argyle", "Argyle", "Eagles", "1-1", 78.84, 41.3],
  ["Anna", "Anna", "Coyotes", "2-0", 78.46, 38.7],
]

texasFootballRows.forEach(
  ([name, city, mascot, record, rating, strength], index) => {
    const id = `tx-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...schools[id],
      id,
      name,
      city,
      state: "TX",
      mascot,
      ...football,
      sports: {
        ...schools[id]?.sports,
        football,
      },
      schedule: schools[id]?.schedule ?? [],
    }
  }
)
// California football: supplied 2026 rankings snapshot.
// Cities and mascots are left blank because they were not supplied.
const californiaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Santa Margarita", "3-0", 105.21, 45.9],
  ["Centennial", "1-1", 104.66, 60.0],
  ["St. John Bosco", "2-1", 102.92, 56.1],
  ["Mater Dei", "3-0", 101.40, 50.0],
  ["Sierra Canyon", "2-0", 101.23, 56.1],
  ["Folsom", "2-0", 94.76, 50.4],
  ["Mission Viejo", "2-1", 94.38, 46.2],
  ["De La Salle", "2-0", 93.86, 46.7],
  ["Orange Lutheran", "2-1", 93.36, 55.8],
  ["Central East", "2-0", 91.80, 46.7],
  ["San Clemente", "3-0", 90.05, 39.8],
  ["Mission Hills", "3-0", 89.37, 33.9],
  ["Carlsbad", "3-0", 88.48, 36.3],
  ["Yorba Linda", "3-0", 88.36, 35.5],
  ["Servite", "1-2", 87.87, 53.4],
  ["Bishop Amat", "3-0", 87.71, 38.3],
  ["JSerra Catholic", "2-1", 86.79, 44.7],
  ["Pittsburg", "1-1", 86.45, 52.8],
  ["Rancho Cucamonga", "2-1", 85.72, 40.8],
  ["Norco", "3-0", 85.59, 23.9],
  ["Bakersfield", "2-0", 85.50, 38.3],
  ["Clovis", "2-1", 85.37, 35.3],
  ["Oak Ridge", "1-1", 85.35, 52.7],
  ["Buchanan", "2-1", 84.73, 28.5],
]

californiaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ca-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "CA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Florida football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const floridaFootballRows: Array<
  [string, string, number, number]
> = [
  ["St. Thomas Aquinas", "3-0", 107.19, 52.3],
  ["IMG Academy", "3-0", 104.53, 41.9],
  ["West Boca Raton", "2-0", 96.72, 44.4],
  ["Chaminade-Madonna", "2-1", 95.49, 55.6],
  ["Columbus", "2-1", 94.82, 60.5],
  ["American Heritage", "1-2", 94.42, 60.8],
  ["Central", "2-0", 93.45, 35.9],
  ["Cardinal Newman", "3-0", 93.13, 41.0],
  ["Cardinal Mooney", "2-1", 92.97, 42.3],
  ["Carol City", "2-1", 92.32, 45.0],
  ["DeLand", "1-1", 91.56, 60.4],
  ["The First Academy", "3-0", 90.62, 37.7],
  ["Vero Beach", "2-1", 90.58, 50.0],
  ["Venice", "3-0", 89.36, 33.7],
  ["Lakeland", "1-1", 89.28, 30.1],
  ["Buchholz", "3-0", 85.85, 28.0],
  ["Columbia", "3-0", 85.60, 39.3],
  ["Bolles", "1-1", 85.59, 45.2],
  ["Raines", "3-0", 84.41, 30.0],
  ["Lake Wales", "2-1", 84.15, 38.1],
  ["Palmetto", "3-0", 84.00, 30.8],
  ["Mandarin", "2-0", 83.74, 19.6],
  ["Armwood", "2-1", 82.98, 42.8],
  ["Jones", "1-1", 81.68, 52.4],
  ["Northwestern", "3-0", 80.22, 21.9],
]

floridaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `fl-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "FL",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Georgia football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const georgiaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Buford", "2-0", 102.32, 51.7],
  ["Carrollton", "3-0", 98.11, 39.4],
  ["Thomas County Central", "2-0", 96.79, 38.1],
  ["Creekside", "1-1", 95.04, 55.4],
  ["Lee County", "3-0", 94.19, 46.4],
  ["North Gwinnett", "3-0", 93.77, 43.5],
  ["Newton", "3-0", 92.88, 40.1],
  ["Gainesville", "0-2", 92.25, 64.5],
  ["Lowndes", "3-0", 90.97, 33.3],
  ["Blessed Trinity", "3-0", 90.79, 36.1],
  ["Milton", "2-1", 90.67, 40.3],
  ["Sandy Creek", "3-0", 89.87, 42.9],
  ["McEachern", "2-1", 89.05, 41.5],
  ["Grayson", "1-2", 88.63, 53.1],
  ["Langston Hughes", "1-1", 86.67, 42.6],
  ["Douglas County", "1-2", 85.02, 49.0],
  ["Houston County", "2-0", 84.36, 28.5],
  ["Coffee", "3-0", 84.22, 33.1],
  ["Roswell", "2-1", 84.07, 42.5],
  ["Valdosta", "3-0", 84.05, 23.2],
  ["Sequoyah", "2-1", 83.80, 41.9],
  ["North Oconee", "3-0", 83.27, 36.1],
  ["Toombs County", "3-0", 81.61, 33.3],
  ["Benedictine", "2-1", 81.59, 45.1],
  ["North Cobb", "2-1", 81.53, 43.0],
]

georgiaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ga-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "GA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Oklahoma football: supplied 2026 rankings snapshot.
const oklahomaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Bixby", "Bixby", "2-0", 93.20, 42.6],
  ["Owasso", "Owasso", "0-1", 81.43, 57.9],
  ["Jenks", "Jenks", "1-1", 74.81, 43.9],
  ["Broken Arrow", "Broken Arrow", "2-0", 70.48, 32.8],
  ["Edmond Memorial", "Edmond", "2-0", 62.12, 18.9],
  ["Norman North", "Norman", "1-0", 61.92, 28.8],
  ["Tuttle", "Tuttle", "2-0", 61.69, 30.3],
  ["Yukon", "Yukon", "2-0", 61.67, 29.1],
  ["Mustang", "Mustang", "1-1", 61.66, 31.3],
  ["Deer Creek", "Edmond", "2-0", 60.19, 29.0],
  ["Union", "Tulsa", "0-2", 59.54, 47.4],
  ["Carl Albert", "Midwest City", "2-0", 57.35, 30.1],
  ["Newcastle", "Newcastle", "0-2", 55.81, 46.4],
  ["Lincoln Christian", "Tulsa", "2-0", 55.60, 36.3],
  ["Heritage Hall", "Oklahoma City", "0-2", 55.60, 47.1],
  ["Sulphur", "Sulphur", "1-0", 55.59, 37.5],
  ["Elgin", "Elgin", "2-0", 55.48, 21.2],
  ["Bishop McGuinness", "Oklahoma City", "2-0", 55.05, 19.7],
  ["Stillwater", "Stillwater", "1-1", 53.98, 44.7],
  ["Norman", "Norman", "1-1", 53.75, 23.7],
  ["Holdenville", "Holdenville", "2-0", 53.52, 24.4],
  ["Edmond North", "Edmond", "1-1", 52.47, 26.2],
  ["Marlow", "Marlow", "2-0", 52.43, 19.2],
  ["Broken Bow", "Broken Bow", "2-0", 52.42, 20.2],
  ["Washington", "Washington", "1-1", 51.99, 30.0],
]

oklahomaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `ok-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "OK",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Louisiana football: supplied 2026 rankings snapshot.
const louisianaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Edna Karr", "New Orleans", "1-0", 86.21, 24.6],
  ["St. Augustine", "New Orleans", "1-0", 81.85, 21.7],
  ["Ruston", "Ruston", "1-0", 74.59, 39.1],
  ["Catholic", "Baton Rouge", "0-1", 74.05, 63.7],
  ["Alexandria", "Alexandria", "1-0", 74.04, 44.8],
  ["John Curtis Christian", "River Ridge", "0-1", 72.88, 61.0],
  ["Archbishop Rummel", "Metairie", "1-0", 70.44, 36.9],
  ["Lafayette Christian Academy", "Lafayette", "1-0", 69.85, 32.3],
  ["West Monroe", "West Monroe", "1-0", 69.61, 37.8],
  ["Plaquemine", "Plaquemine", "1-0", 69.27, 38.0],
  ["Zachary", "Zachary", "0-1", 69.26, 35.5],
  ["Destrehan", "Destrehan", "1-0", 69.24, 31.5],
  ["St. Charles Catholic", "Laplace", "1-0", 68.29, 37.8],
  ["Brother Martin", "New Orleans", "1-0", 67.61, 33.5],
  ["Neville", "Monroe", "0-1", 66.38, 50.2],
  ["Ouachita Parish", "Monroe", "1-0", 66.08, 25.4],
  ["Evangel Christian Academy", "Shreveport", "0-1", 65.57, 43.4],
  ["St. Thomas More", "Lafayette", "1-0", 65.39, 32.8],
  ["Acadiana", "Lafayette", "1-0", 64.35, 36.7],
  ["Central", "Baton Rouge", "0-1", 64.34, 41.6],
  ["Northshore", "Slidell", "2-0", 61.73, 29.1],
  ["Jesuit", "New Orleans", "1-1", 61.73, 30.6],
  ["Archbishop Shaw", "Marrero", "1-0", 61.67, 30.9],
  ["Southside", "Youngsville", "0-1", 61.62, 43.0],
  ["Slidell", "Slidell", "1-0", 61.57, 33.2],
]

louisianaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `la-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "LA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Arizona football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const arizonaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Hamilton", "2-0", 97.22, 43.1],
  ["Basha", "1-1", 97.17, 59.3],
  ["Liberty", "2-0", 95.43, 48.3],
  ["Chandler", "1-1", 93.81, 55.4],
  ["Centennial", "2-0", 87.94, 44.7],
  ["Desert Mountain", "2-0", 83.83, 35.4],
  ["Desert Edge", "2-0", 81.72, 26.1],
  ["Mountain View", "2-0", 78.93, 32.4],
  ["ALA - Gilbert North", "2-0", 76.88, 27.0],
  ["Williams Field", "2-0", 74.75, 37.0],
  ["Brophy College Prep", "1-1", 74.02, 46.2],
  ["Horizon", "2-0", 71.11, 16.9],
  ["Perry", "2-0", 70.49, 23.0],
  ["Red Mountain", "2-0", 70.15, 31.2],
  ["Pinnacle", "1-1", 70.14, 44.9],
  ["Salpointe Catholic", "2-0", 69.99, 30.0],
  ["Higley", "1-1", 68.20, 35.6],
  ["Casteel", "0-2", 67.58, 44.6],
  ["Highland", "1-1", 67.41, 37.7],
  ["Notre Dame Prep", "2-0", 65.88, 34.0],
  ["Queen Creek", "1-1", 65.79, 45.3],
  ["Saguaro", "0-1", 64.50, 49.6],
  ["ALA - Queen Creek", "0-2", 64.33, 48.2],
  ["Canyon View", "2-0", 62.82, 24.6],
  ["Mesa", "1-1", 61.88, 48.5],
]

arizonaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `az-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "AZ",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Arkansas football: supplied 2026 rankings snapshot.
const arkansasFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Shiloh Christian", "Springdale", "2-0", 81.44, 35.2],
  ["Bentonville", "Bentonville", "2-0", 77.28, 38.3],
  ["Benton", "Benton", "1-0", 74.04, 44.8],
  ["Bryant", "Bryant", "0-2", 74.03, 44.6],
  ["Conway", "Conway", "1-1", 70.91, 35.6],
  ["Bentonville West", "Centerton", "2-0", 69.34, 32.6],
  ["Greenwood", "Greenwood", "0-2", 69.30, 37.2],
  ["North Little Rock", "North Little Rock", "2-0", 60.34, 32.4],
  ["Rogers", "Rogers", "0-2", 60.34, 43.6],
  ["Farmington", "Farmington", "2-0", 56.91, 26.1],
  ["Mountain Home", "Mountain Home", "1-1", 56.91, 30.2],
  ["Pulaski Academy", "Little Rock", "1-1", 55.97, 41.6],
  ["Har-Ber", "Springdale", "1-1", 55.84, 32.6],
  ["Fayetteville", "Fayetteville", "1-1", 55.73, 23.3],
  ["Jonesboro", "Jonesboro", "2-0", 55.55, 29.3],
  ["Little Rock Christian Academy", "Little Rock", "1-1", 55.48, 30.6],
  ["Parkview", "Little Rock", "1-1", 55.05, 31.1],
  ["El Dorado", "El Dorado", "2-0", 54.92, 26.7],
  ["Robinson", "Little Rock", "2-0", 54.63, 20.4],
  ["Lakeside", "Hot Springs", "1-1", 54.62, 28.2],
  ["Cabot", "Cabot", "0-2", 54.47, 36.5],
  ["Gravette", "Gravette", "2-0", 53.63, 24.7],
  ["Searcy", "Searcy", "2-0", 52.16, 21.4],
  ["Nashville", "Nashville", "2-0", 51.79, 24.3],
  ["Elkins", "Elkins", "2-0", 51.76, 26.9],
]

arkansasFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `ar-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "AR",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Kansas football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const kansasFootballRows: Array<
  [string, string, number, number]
> = [
  ["St. James Academy", "1-0", 66.77, 36.8],
  ["Saint Thomas Aquinas", "0-1", 66.35, 39.9],
  ["Mill Valley", "1-0", 61.69, 26.8],
  ["Blue Valley", "1-0", 60.69, 27.5],
  ["Hays", "1-0", 58.32, 24.1],
  ["Manhattan", "0-1", 58.11, 36.4],
  ["Bishop Miege", "1-0", 57.36, 26.5],
  ["Olathe West", "1-0", 53.58, 15.7],
  ["Cheney", "1-0", 53.51, 27.2],
  ["Derby", "1-0", 52.45, 18.6],
  ["Andale", "1-0", 52.43, 19.0],
  ["Gardner-Edgerton", "1-0", 51.76, 25.6],
  ["Eudora", "1-0", 51.65, 31.4],
  ["Hayden", "0-1", 51.65, 29.2],
  ["Blue Valley Northwest", "0-1", 51.63, 38.5],
  ["Great Bend", "1-0", 51.61, 22.0],
  ["Shawnee Mission Northwest", "0-1", 51.44, 39.5],
  ["Olathe Northwest", "1-0", 50.91, 19.8],
  ["Kapaun Mt. Carmel", "1-0", 50.85, 21.1],
  ["Bishop Carroll", "1-0", 50.65, 30.3],
  ["Northwest", "0-1", 50.65, 29.7],
  ["Shawnee Mission East", "1-0", 49.62, 19.5],
  ["Blue Valley West", "0-1", 49.60, 37.7],
  ["Lawrence", "0-1", 49.32, 31.7],
  ["Sabetha", "1-0", 49.24, 20.4],
]

kansasFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ks-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "KS",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Alabama football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const alabamaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Thompson", "3-0", 99.28, 53.7],
  ["Central", "2-1", 89.74, 36.5],
  ["Vestavia Hills", "2-1", 87.84, 49.6],
  ["Hillcrest", "3-0", 86.10, 29.1],
  ["Hewitt-Trussville", "2-1", 85.95, 47.1],
  ["Clay-Chalkville", "2-1", 83.97, 46.9],
  ["Hoover", "2-1", 81.76, 43.5],
  ["Auburn", "2-1", 81.45, 42.5],
  ["Prattville", "3-0", 78.27, 22.5],
  ["Opelika", "1-1", 76.75, 42.8],
  ["Gulf Shores", "3-0", 74.14, 37.6],
  ["Saraland", "1-1", 74.14, 36.8],
  ["Spain Park", "3-0", 73.07, 32.5],
  ["Parker", "2-1", 69.66, 37.0],
  ["Enterprise", "2-1", 67.52, 35.9],
  ["Oxford", "3-0", 65.84, 30.1],
  ["Dothan", "2-1", 64.30, 26.7],
  ["Carver Montgomery", "1-2", 64.05, 32.5],
  ["Florence", "3-0", 63.43, 27.9],
  ["Muscle Shoals", "0-2", 63.22, 43.1],
  ["Daphne", "2-1", 60.90, 28.5],
  ["Williamson", "2-0", 60.36, 24.5],
  ["Baker", "2-1", 60.36, 30.1],
  ["Benjamin Russell", "1-1", 58.72, 34.1],
  ["Pike Road", "2-1", 58.40, 25.7],
]

alabamaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `al-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "AL",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Michigan football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const michiganFootballRows: Array<
  [string, string, number, number]
> = [
  ["Catholic Central", "2-0", 93.15, 23.3],
  ["Clarkston", "2-0", 76.73, 34.3],
  ["East Kentwood", "2-0", 76.15, 31.2],
  ["King", "2-0", 74.13, 39.3],
  ["St. Mary's Prep", "1-1", 74.13, 39.4],
  ["Cass Tech", "2-0", 71.05, 25.9],
  ["Saline", "2-0", 69.75, 29.9],
  ["Rockford", "1-1", 69.67, 38.5],
  ["Brother Rice", "2-0", 67.43, 28.4],
  ["De La Salle Collegiate", "2-0", 66.33, 10.5],
  ["Romeo", "2-0", 65.85, 27.3],
  ["Adams", "1-1", 65.82, 35.5],
  ["Hudsonville", "1-1", 65.80, 27.7],
  ["Byron Center", "1-1", 64.30, 42.5],
  ["Mason", "2-0", 64.12, 30.9],
  ["DeWitt", "1-1", 64.11, 36.7],
  ["Caledonia", "1-0", 60.77, 15.6],
  ["Oxford", "2-0", 60.34, 20.9],
  ["Coopersville", "2-0", 58.15, 29.7],
  ["Stoney Creek", "1-1", 58.13, 39.7],
  ["South Christian", "2-0", 58.10, 25.7],
  ["Grandville", "1-1", 58.07, 41.8],
  ["Muskegon", "0-2", 56.53, 36.8],
  ["Mona Shores", "1-1", 56.53, 29.9],
  ["Divine Child", "2-0", 56.46, 25.6],
]

michiganFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `mi-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MI",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Mississippi football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const mississippiFootballRows: Array<
  [string, string, number, number]
> = [
  ["Tupelo", "2-0", 87.01, 38.4],
  ["Gulfport", "1-0", 76.78, 32.3],
  ["Starkville", "2-0", 76.77, 41.9],
  ["Jackson Academy", "4-0", 76.17, 31.6],
  ["Germantown", "1-1", 74.71, 41.5],
  ["Oak Grove", "1-1", 74.51, 47.7],
  ["Oxford", "2-0", 72.77, 34.9],
  ["Warren Central", "2-0", 71.96, 31.4],
  ["D'Iberville", "2-0", 70.31, 31.4],
  ["Jackson Prep", "3-0", 70.26, 33.6],
  ["Brandon", "1-1", 70.21, 46.8],
  ["Louisville", "2-0", 70.10, 34.1],
  ["Madison-Ridgeland Academy", "2-1", 69.81, 36.2],
  ["West Point", "0-2", 69.78, 47.6],
  ["Madison Central", "1-1", 68.43, 36.6],
  ["Petal", "2-0", 68.07, 33.5],
  ["Hartfield Academy", "2-1", 67.48, 33.2],
  ["Northwest Rankin", "1-1", 64.07, 39.6],
  ["South Panola", "0-2", 61.85, 39.0],
  ["Grenada", "1-0", 60.90, 21.4],
  ["Poplarville", "2-0", 60.87, 28.2],
  ["Clinton", "0-2", 60.81, 40.3],
  ["Picayune", "0-2", 59.40, 49.1],
  ["Hattiesburg", "1-1", 58.39, 36.8],
  ["Lake Cormorant", "2-0", 58.36, 27.3],
]

mississippiFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ms-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MS",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Minnesota football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const minnesotaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Alexandria", "1-0", 63.93, 36.6],
  ["Chanhassen", "0-1", 63.92, 37.9],
  ["Elk River", "1-0", 60.35, 28.1],
  ["Monticello", "1-0", 54.71, 17.8],
  ["Bemidji", "0-1", 54.53, 39.7],
  ["Moorhead", "1-0", 54.11, 19.3],
  ["Marshall", "1-0", 53.89, 15.6],
  ["Minnetonka", "1-0", 53.55, 22.0],
  ["Orono", "1-0", 52.26, 25.6],
  ["Maple Grove", "1-0", 51.91, 19.7],
  ["Cretin-Derham Hall", "1-0", 51.10, 29.0],
  ["St. Thomas Academy", "0-1", 51.09, 30.0],
  ["Edina", "1-0", 50.29, 15.6],
  ["Byron", "1-0", 50.26, 17.9],
  ["Totino-Grace", "1-0", 50.25, 27.1],
  ["Rocori", "0-1", 50.25, 30.3],
  ["Jackson County Central", "1-0", 49.18, 20.5],
  ["Two Rivers", "1-0", 49.04, 28.1],
  ["Spring Lake Park", "0-1", 49.04, 27.5],
  ["Becker", "0-1", 48.99, 32.9],
  ["Hutchinson", "1-0", 48.50, 16.7],
  ["Springfield/Comfrey", "1-0", 48.26, 13.8],
  ["Stewartville", "1-0", 48.18, 16.5],
  ["Minneota", "1-0", 48.18, 15.5],
  ["Dilworth-Glyndon-Felton", "1-0", 48.12, 16.0],
]

minnesotaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `mn-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MN",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Missouri football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const missouriFootballRows: Array<
  [string, string, number, number]
> = [
  ["Christian Brothers College", "1-1", 74.07, 48.0],
  ["Lee's Summit North", "1-1", 67.78, 39.0],
  ["Blue Springs South", "1-1", 65.85, 40.4],
  ["Lee's Summit", "1-1", 64.06, 43.1],
  ["De Smet Jesuit", "2-0", 61.69, 37.3],
  ["Cardinal Ritter College Prep", "1-1", 61.69, 32.8],
  ["Liberty North", "2-0", 61.64, 27.4],
  ["Raymore-Peculiar", "2-0", 59.52, 33.0],
  ["Blue Springs", "1-1", 59.48, 32.9],
  ["St. Pius X", "2-0", 58.15, 24.9],
  ["Rockhurst", "1-1", 58.15, 37.0],
  ["Lift for Life Academy", "1-1", 55.75, 33.4],
  ["Jackson", "2-0", 55.69, 26.7],
  ["Kearney", "2-0", 55.39, 19.4],
  ["Platte County", "1-1", 55.24, 29.1],
  ["Lamar", "2-0", 55.10, 24.1],
  ["Seneca", "1-1", 55.10, 27.2],
  ["Helias", "2-0", 54.65, 30.4],
  ["Hannibal", "1-1", 54.65, 36.9],
  ["Lee's Summit West", "2-0", 54.50, 26.8],
  ["Valle Catholic", "2-0", 54.18, 22.6],
  ["Savannah", "2-0", 53.51, 21.4],
  ["Nixa", "2-0", 52.52, 28.5],
  ["Maryville", "2-0", 52.36, 25.5],
  ["Blair Oaks", "1-1", 52.36, 30.7],
]

missouriFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `mo-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MO",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Nebraska football: supplied 2026 rankings snapshot.
const nebraskaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Millard South", "Omaha", "2-0", 67.78, 38.9],
  ["Omaha Westside", "Omaha", "2-0", 64.06, 33.3],
  ["Waverly", "Waverly", "2-0", 57.33, 21.0],
  ["Gretna", "Gretna", "2-0", 55.55, 27.0],
  ["Bennington", "Bennington", "2-0", 55.50, 28.7],
  ["Aurora", "Aurora", "2-0", 55.44, 24.9],
  ["Ashland-Greenwood", "Ashland", "2-0", 55.28, 23.4],
  ["Wahoo", "Wahoo", "1-1", 54.66, 26.0],
  ["Skutt Catholic", "Omaha", "1-1", 54.55, 31.1],
  ["Millard North", "Omaha", "1-1", 53.44, 35.3],
  ["Gretna East", "Gretna", "2-0", 53.37, 20.3],
  ["Lakeview", "Columbus", "2-0", 51.86, 16.4],
  ["Papillion-LaVista South", "Papillion", "2-0", 51.37, 29.9],
  ["Elkhorn South", "Omaha", "1-1", 51.19, 30.1],
  ["Sidney", "Sidney", "2-0", 50.88, 16.4],
  ["Scottsbluff", "Scottsbluff", "2-0", 49.37, 24.1],
  ["Norris", "Firth", "0-2", 49.37, 33.7],
  ["Elkhorn North", "Elkhorn", "1-1", 49.28, 31.1],
  ["Pierce", "Pierce", "2-0", 48.39, 16.5],
  ["Syracuse", "Syracuse", "1-1", 48.28, 36.7],
  ["Grand Island Central Catholic", "Grand Island", "2-0", 47.90, 12.4],
  ["Chadron", "Chadron", "2-0", 47.80, 19.0],
  ["Creighton Prep", "Omaha", "1-1", 47.65, 31.0],
  ["Bergan Catholic", "Fremont", "2-0", 46.96, 10.1],
  ["Omaha North", "Omaha", "2-0", 46.87, 17.5],
]

nebraskaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `ne-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "NE",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// North Carolina football: supplied 2026 rankings snapshot.
// Rank 11 belongs to a Georgia school in the supplied table.
const northCarolinaFootballRows: Array<
  [number, string, string, string, number, number]
> = [
  [1, "Hough", "Cornelius", "3-0", 97.86, 53.3],
  [2, "Grimsley", "Greensboro", "3-0", 94.26, 44.8],
  [3, "Providence Day", "Charlotte", "2-1", 92.08, 47.8],
  [4, "Weddington", "Matthews", "3-0", 91.59, 38.1],
  [5, "Cardinal Gibbons", "Raleigh", "2-1", 83.53, 45.5],
  [6, "Mallard Creek", "Charlotte", "2-1", 76.68, 51.7],
  [7, "West Forsyth", "Clemmons", "2-1", 74.64, 40.1],
  [8, "West Charlotte", "Charlotte", "2-1", 74.42, 47.1],
  [9, "Chambers", "Charlotte", "3-0", 74.24, 35.2],
  [10, "Cleveland", "Clayton", "3-0", 73.65, 28.3],
  [12, "Reagan", "Pfafftown", "3-0", 71.17, 31.1],
  [13, "Clayton", "Clayton", "3-0", 71.01, 26.9],
  [14, "Hoggard", "Wilmington", "2-1", 70.21, 33.6],
  [15, "Millbrook", "Raleigh", "3-0", 70.11, 29.6],
  [16, "Lake Norman", "Mooresville", "3-0", 69.56, 24.7],
  [17, "Myers Park", "Charlotte", "1-2", 69.28, 45.8],
  [18, "Rolesville", "Rolesville", "0-2", 69.26, 51.0],
  [19, "East Forsyth", "Kernersville", "2-1", 69.23, 37.4],
  [20, "Cannon [Cannon/Concord Academy]", "Concord", "3-0", 68.05, 30.5],
  [21, "Crest", "Shelby", "3-0", 67.86, 30.2],
  [22, "New Bern", "New Bern", "3-0", 65.76, 26.1],
  [23, "A.L. Brown", "Kannapolis", "3-0", 64.15, 25.8],
  [24, "Mooresville", "Mooresville", "0-3", 64.15, 43.0],
  [25, "Southeast Raleigh", "Raleigh", "3-0", 64.03, 24.6],
]

northCarolinaFootballRows.forEach(
  ([rank, name, city, record, rating, strength]) => {
    const id = `nc-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "NC",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Ohio football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const ohioFootballRows: Array<
  [string, string, number, number]
> = [
  ["Elder", "3-0", 95.12, 42.3],
  ["Washington", "3-0", 93.90, 41.1],
  ["Walsh Jesuit", "3-0", 92.28, 41.6],
  ["Bishop Watterson", "3-0", 91.65, 32.8],
  ["Glenville", "2-1", 89.78, 50.3],
  ["Princeton", "3-0", 89.16, 38.2],
  ["Anderson", "2-1", 88.93, 38.5],
  ["St. Edward", "3-0", 88.77, 37.9],
  ["Lakota West", "3-0", 87.97, 36.2],
  ["Upper Arlington", "3-0", 86.63, 37.9],
  ["Central Catholic", "2-1", 85.86, 44.1],
  ["Big Walnut", "3-0", 84.86, 26.9],
  ["Archbishop Moeller", "1-2", 82.61, 48.3],
  ["Steubenville", "3-0", 77.40, 24.6],
  ["Olentangy Orange", "2-1", 74.56, 34.1],
  ["Lincoln", "3-0", 74.48, 39.4],
  ["Avon", "1-2", 74.13, 49.3],
  ["Pickerington North", "2-1", 74.01, 37.3],
  ["St. Ignatius", "2-1", 73.68, 42.6],
  ["McKinley", "2-1", 70.63, 31.8],
  ["St. Xavier", "1-2", 70.58, 41.3],
  ["Archbishop Hoban", "0-3", 70.18, 43.0],
  ["Trotwood-Madison", "2-1", 70.17, 40.5],
  ["Olentangy Liberty", "0-3", 70.17, 50.5],
  ["Olentangy Berlin", "2-1", 70.13, 41.3],
]

ohioFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `oh-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "OH",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Oregon football: supplied 2026 rankings snapshot.
const oregonFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["West Linn", "West Linn", "1-0", 77.02, 38.4],
  ["Lake Oswego", "Lake Oswego", "2-0", 75.35, 31.4],
  ["Central Catholic", "Portland", "0-1", 67.68, 51.3],
  ["Tualatin", "Tualatin", "2-0", 62.23, 24.8],
  ["Lakeridge", "Lake Oswego", "1-1", 62.16, 24.5],
  ["Grants Pass", "Grants Pass", "2-0", 58.16, 27.0],
  ["Nelson", "Happy Valley", "1-1", 58.16, 29.4],
  ["Silverton", "Silverton", "1-1", 57.36, 33.0],
  ["Summit", "Bend", "0-1", 54.43, 39.2],
  ["Mountain View", "Bend", "2-0", 52.42, 32.0],
  ["West Albany", "Albany", "1-1", 51.75, 29.0],
  ["Cascade Christian", "Medford", "1-0", 51.62, 24.1],
  ["Dallas", "Dallas", "1-0", 49.85, 20.1],
  ["Banks", "Banks", "2-0", 49.01, 9.4],
  ["Cascade", "Turner", "1-0", 48.73, 13.8],
  ["Mountainside", "Beaverton", "1-1", 48.06, 30.0],
  ["Tigard", "Tigard", "1-0", 47.95, 13.8],
  ["Wilsonville", "Wilsonville", "1-0", 47.87, 16.1],
  ["Vale", "Vale", "2-0", 47.24, 20.0],
  ["Estacada", "Estacada", "1-1", 47.24, 26.4],
  ["Sprague", "Salem", "1-0", 46.95, 18.1],
  ["Ridgeview", "Redmond", "2-0", 46.93, 17.1],
  ["Sherwood", "Sherwood", "0-1", 46.58, 41.1],
  ["Oregon City", "Oregon City", "2-0", 46.50, 15.4],
  ["North Medford", "Medford", "1-1", 45.51, 34.5],
]

oregonFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `or-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "OR",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Pennsylvania football: supplied 2026 rankings snapshot.
const pennsylvaniaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["St. Joseph's Prep", "Philadelphia", "1-0", 96.46, 59.9],
  ["Central Catholic", "Pittsburgh", "2-0", 86.84, 41.9],
  ["Bishop McDevitt", "Harrisburg", "2-0", 77.03, 30.5],
  ["Harrisburg", "Harrisburg", "2-0", 76.57, 21.7],
  ["Malvern Prep", "Malvern", "1-0", 76.54, 42.0],
  ["Roman Catholic", "Philadelphia", "0-2", 75.72, 67.4],
  ["Pine-Richland", "Gibsonia", "2-0", 75.12, 33.1],
  ["Monsignor Bonner/Archbishop Prendergast Catholic", "Drexel Hill", "1-1", 71.99, 32.4],
  ["La Salle College", "Wyndmoor", "0-2", 71.39, 47.7],
  ["Central Bucks West", "Doylestown", "2-0", 69.38, 36.2],
  ["Easton Area", "Easton", "1-1", 69.23, 34.2],
  ["Imhotep Charter", "Philadelphia", "1-1", 67.70, 47.0],
  ["Upper St. Clair", "Upper St. Clair", "2-0", 66.13, 29.3],
  ["Hopewell", "Aliquippa", "2-0", 66.10, 31.3],
  ["Avonworth", "Pittsburgh", "1-1", 66.08, 35.6],
  ["Montour", "McKees Rocks", "2-0", 63.99, 34.6],
  ["Moon Area", "Moon Township", "0-1", 63.99, 37.6],
  ["State College", "State College", "2-0", 63.64, 26.6],
  ["Central York", "York", "1-1", 63.56, 38.3],
  ["North Penn", "Lansdale", "1-1", 62.79, 27.9],
  ["South Fayette", "McDonald", "2-0", 62.48, 29.8],
  ["Peters Township", "McMurray", "0-2", 62.48, 38.5],
  ["Springside Chestnut Hill Academy", "Philadelphia", "0-1", 61.91, 46.0],
  ["Aliquippa", "Aliquippa", "1-0", 60.88, 26.2],
  ["Trinity", "Washington", "2-0", 60.78, 30.0],
]

pennsylvaniaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `pa-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "PA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// South Carolina football: supplied 2026 rankings snapshot.
const southCarolinaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Northwestern", "Rock Hill", "2-1", 91.82, 43.2],
  ["Dutch Fork", "Irmo", "2-0", 89.24, 35.7],
  ["South Pointe", "Rock Hill", "2-0", 81.57, 16.0],
  ["James Island", "Charleston", "3-0", 77.12, 38.7],
  ["Rock Hill", "Rock Hill", "3-0", 75.08, 35.0],
  ["Irmo", "Columbia", "2-1", 74.87, 22.3],
  ["Dorman", "Roebuck", "2-0", 73.98, 36.2],
  ["Summerville", "Summerville", "2-1", 73.60, 38.6],
  ["James F. Byrnes", "Duncan", "1-1", 70.27, 40.3],
  ["Oceanside Collegiate Academy", "Mt. Pleasant", "1-2", 68.04, 42.4],
  ["Ridge View", "Columbia", "0-2", 64.48, 48.4],
  ["Gray Collegiate Academy", "West Columbia", "1-2", 64.03, 42.5],
  ["South Florence", "Florence", "1-2", 64.00, 37.3],
  ["Lugoff-Elgin", "Lugoff", "3-0", 63.98, 29.0],
  ["Camden", "Camden", "2-1", 63.98, 31.9],
  ["Indian Land", "Fort Mill", "2-1", 63.84, 35.7],
  ["Fort Mill", "Fort Mill", "2-0", 61.62, 28.5],
  ["Sumter", "Sumter", "2-1", 60.89, 35.3],
  ["Gaffney", "Gaffney", "3-0", 60.29, 25.3],
  ["Spartanburg", "Spartanburg", "1-2", 60.28, 40.9],
  ["Strom Thurmond", "Johnston", "2-0", 59.99, 33.5],
  ["North Augusta", "North Augusta", "2-1", 59.87, 33.8],
  ["T.L. Hanna", "Anderson", "3-0", 58.12, 27.5],
  ["Berkeley", "Moncks Corner", "3-0", 58.06, 20.9],
  ["White Knoll", "Lexington", "0-3", 56.02, 34.0],
]

southCarolinaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `sc-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "SC",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Tennessee football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const tennesseeFootballRows: Array<
  [string, string, number, number]
> = [
  ["Baylor", "3-0", 101.05, 43.4],
  ["Brentwood Academy", "1-2", 95.93, 55.2],
  ["McCallie", "3-0", 87.27, 33.0],
  ["Oakland", "2-1", 86.98, 33.8],
  ["Page", "3-0", 78.34, 34.4],
  ["Briarcrest Christian", "3-0", 75.24, 31.4],
  ["Ensworth", "2-1", 75.23, 41.3],
  ["Knoxville Catholic", "3-0", 73.98, 39.8],
  ["Riverdale", "2-1", 73.96, 35.8],
  ["Ravenwood", "1-2", 70.92, 42.2],
  ["Lipscomb Academy", "1-2", 70.52, 46.6],
  ["Whitehaven", "2-1", 65.81, 34.1],
  ["Montgomery Bell Academy", "3-0", 65.80, 25.5],
  ["Alcoa", "3-0", 64.55, 28.4],
  ["Maryville", "2-1", 64.54, 28.7],
  ["Battle Ground Academy", "3-0", 64.30, 26.7],
  ["Smyrna", "1-2", 64.18, 40.5],
  ["Green Hill", "2-1", 63.65, 45.0],
  ["Brentwood", "2-1", 63.54, 41.9],
  ["Beech", "2-1", 62.09, 31.0],
  ["Southwind", "3-0", 60.30, 23.6],
  ["Houston", "1-2", 60.30, 34.9],
  ["Collierville", "1-2", 60.25, 35.5],
  ["Sevier County", "2-0", 58.25, 19.2],
  ["Christ Presbyterian Academy", "0-3", 58.16, 45.6],
]

tennesseeFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `tn-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "TN",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Utah football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const utahFootballRows: Array<
  [string, string, number, number]
> = [
  ["Corner Canyon", "3-1", 95.26, 47.5],
  ["Mountain Ridge", "4-0", 95.18, 42.3],
  ["Ridgeline", "4-0", 91.75, 31.9],
  ["Orem", "2-2", 89.67, 48.4],
  ["Crimson Cliffs", "3-1", 87.80, 33.1],
  ["Skyridge", "3-1", 85.06, 48.4],
  ["Lone Peak", "2-2", 84.40, 54.0],
  ["Davis", "2-2", 82.42, 47.2],
  ["Timpview", "2-2", 81.61, 39.4],
  ["American Fork", "3-1", 78.65, 44.4],
  ["West", "4-0", 77.78, 27.4],
  ["Herriman", "4-0", 74.39, 28.8],
  ["Lehi", "2-2", 70.25, 43.3],
  ["Morgan", "3-1", 69.10, 35.1],
  ["Hurricane", "4-0", 64.11, 24.1],
  ["Pleasant Grove", "3-1", 64.06, 34.9],
  ["Olympus", "2-2", 62.17, 31.3],
  ["Fremont", "2-2", 61.64, 38.1],
  ["Westlake", "3-1", 60.94, 33.8],
  ["Springville", "2-2", 60.91, 34.6],
  ["Bountiful", "2-2", 60.33, 38.0],
  ["Alta", "3-1", 57.35, 30.5],
  ["Stansbury", "3-1", 56.69, 33.4],
  ["Syracuse", "1-3", 56.17, 28.2],
  ["Pine View", "3-1", 55.54, 29.0],
]

utahFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ut-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "UT",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Virginia football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const virginiaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Varina", "2-0", 83.46, 39.8],
  ["Benedictine", "1-1", 71.93, 30.5],
  ["Maury", "0-2", 71.28, 48.9],
  ["Huguenot", "1-0", 69.82, 39.6],
  ["Highland Springs", "1-1", 69.81, 32.2],
  ["Oscar Smith", "1-0", 65.86, 30.3],
  ["St. Michael the Archangel", "2-0", 63.66, 25.1],
  ["Liberty Christian", "1-0", 63.50, 30.3],
  ["Stone Bridge", "2-0", 62.95, 32.2],
  ["James Madison", "1-1", 61.99, 31.9],
  ["St. Christopher's", "1-0", 60.51, 18.9],
  ["Roanoke Catholic", "1-0", 60.24, 39.0],
  ["Trinity Episcopal", "1-1", 60.23, 38.2],
  ["King's Fork", "0-0", 59.47, 0.0],
  ["Indian River", "0-0", 56.54, 0.0],
  ["Woodberry Forest", "1-0", 55.65, 21.3],
  ["Jefferson Forest", "2-0", 55.45, 18.4],
  ["Battlefield", "2-0", 55.24, 25.9],
  ["North Stafford", "0-1", 55.24, 38.6],
  ["Colonial Forge", "2-0", 54.89, 16.7],
  ["Heritage", "1-0", 54.80, 27.5],
  ["Dinwiddie", "2-0", 54.79, 20.3],
  ["Thomas Dale", "2-0", 54.66, 22.6],
  ["George Washington", "2-0", 53.59, 23.3],
  ["Riverbend", "2-0", 52.43, 15.0],
]

virginiaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `va-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "VA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Washington football: supplied 2026 rankings snapshot.
const washingtonFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Bellevue", "Bellevue", "1-0", 78.17, 34.4],
  ["Puyallup", "Puyallup", "1-0", 74.11, 40.4],
  ["Sumner", "Sumner", "1-0", 72.78, 36.5],
  ["Lake Stevens", "Lake Stevens", "1-0", 71.74, 44.8],
  ["Graham-Kapowsin", "Graham", "0-1", 71.72, 47.0],
  ["Bothell", "Bothell", "1-0", 60.28, 30.7],
  ["O'Dea", "Seattle", "1-0", 58.86, 18.7],
  ["Mount Tahoma", "Tacoma", "0-1", 58.73, 42.7],
  ["Skyline", "Sammamish", "1-0", 56.00, 21.8],
  ["Eastside Catholic", "Sammamish", "1-0", 54.97, 19.1],
  ["Archbishop Murphy", "Everett", "1-0", 54.68, 18.6],
  ["Chiawana", "Pasco", "1-0", 54.43, 29.5],
  ["Camas", "Camas", "0-1", 54.42, 37.4],
  ["Lincoln", "Tacoma", "1-0", 53.39, 14.6],
  ["Curtis", "University Place", "1-0", 53.26, 17.2],
  ["Mount Si", "Snoqualmie", "1-0", 51.56, 19.8],
  ["Kennedy Catholic", "Burien", "0-1", 51.46, 46.6],
  ["Tumwater", "Tumwater", "1-0", 50.78, 21.9],
  ["Tahoma", "Maple Valley", "1-0", 50.66, 26.4],
  ["Skyview", "Vancouver", "1-0", 49.63, 28.4],
  ["Lynden Christian", "Lynden", "1-0", 49.61, 22.6],
  ["Rainier Beach", "Seattle", "1-0", 49.58, 16.9],
  ["Royal", "Royal City", "1-0", 49.51, 17.6],
  ["Sedro-Woolley", "Sedro-Woolley", "1-0", 49.01, 17.1],
  ["Anacortes", "Anacortes", "1-0", 48.98, 20.4],
]

washingtonFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `wa-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "WA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Wisconsin football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const wisconsinFootballRows: Array<
  [string, string, number, number]
> = [
  ["Muskego", "3-0", 87.54, 34.4],
  ["Arrowhead", "3-0", 85.91, 37.2],
  ["Bay Port", "3-0", 81.51, 31.9],
  ["Hamilton", "3-0", 79.30, 38.9],
  ["West De Pere", "3-0", 78.50, 35.6],
  ["Waunakee", "2-1", 71.44, 40.8],
  ["Oconomowoc", "2-1", 67.79, 31.9],
  ["Notre Dame Academy", "3-0", 64.12, 27.5],
  ["Neenah", "1-2", 64.12, 36.9],
  ["Kimberly", "0-3", 63.19, 44.1],
  ["Appleton North", "2-1", 61.75, 35.6],
  ["Mukwonago", "1-2", 60.94, 32.5],
  ["Franklin", "1-2", 60.85, 38.4],
  ["Marquette University", "2-1", 60.27, 36.6],
  ["Brookfield East", "2-1", 58.32, 25.9],
  ["Kaukauna", "2-1", 58.20, 26.4],
  ["Racine Case", "2-1", 58.14, 35.0],
  ["De Pere", "2-1", 57.35, 30.4],
  ["Darlington", "3-0", 56.09, 27.3],
  ["Homestead", "3-0", 55.65, 21.0],
  ["Pewaukee", "3-0", 55.64, 20.8],
  ["Little Chute", "3-0", 55.53, 27.1],
  ["Fond du Lac", "2-1", 55.49, 23.6],
  ["Catholic Memorial", "2-1", 55.09, 28.7],
  ["Monona Grove", "3-0", 54.63, 14.7],
]

wisconsinFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `wi-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "WI",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Illinois football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const illinoisFootballRows: Array<
  [string, string, number, number]
> = [
  ["East St. Louis", "2-1", 93.33, 56.6],
  ["Chicago Mt. Carmel", "2-1", 91.60, 51.8],
  ["Lincoln-Way East", "3-0", 87.23, 42.6],
  ["Brother Rice", "2-1", 87.04, 36.4],
  ["Loyola Academy", "3-0", 85.60, 36.0],
  ["Fenwick", "3-0", 77.66, 30.6],
  ["IC Catholic Prep", "3-0", 76.63, 38.3],
  ["Downers Grove North", "3-0", 76.20, 35.6],
  ["Oswego", "3-0", 74.29, 36.1],
  ["Geneva", "2-1", 74.27, 37.2],
  ["Providence Catholic", "3-0", 74.21, 36.0],
  ["Rochester", "3-0", 73.72, 29.1],
  ["Batavia", "2-1", 73.66, 40.6],
  ["Nazareth Academy", "1-2", 70.20, 45.6],
  ["Sandburg", "3-0", 70.06, 31.4],
  ["St. Rita", "1-2", 69.36, 45.5],
  ["Saint Ignatius College Prep", "2-1", 68.27, 29.1],
  ["Lyons", "3-0", 68.10, 26.1],
  ["Wheaton-Warrenville South", "2-1", 68.08, 33.3],
  ["Homewood-Flossmoor", "2-1", 67.72, 36.7],
  ["Marist", "2-1", 67.55, 29.6],
  ["Morris", "3-0", 65.83, 26.4],
  ["Glenbard West", "2-1", 65.75, 31.6],
  ["Montini Catholic", "2-1", 65.18, 27.4],
  ["St. Francis", "1-2", 64.23, 34.7],
]

illinoisFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `il-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "IL",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Indiana football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const indianaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Brownsburg", "3-0", 97.72, 45.7],
  ["Westfield", "3-0", 90.82, 43.0],
  ["Carmel", "1-2", 86.31, 47.0],
  ["Lawrence North", "2-1", 84.51, 45.1],
  ["Warren Central", "3-0", 84.50, 36.5],
  ["Center Grove", "2-1", 84.42, 46.9],
  ["Avon", "3-0", 83.82, 41.0],
  ["New Palestine", "2-1", 83.65, 40.0],
  ["Indianapolis Bishop Chatard", "3-0", 80.13, 37.2],
  ["Cathedral", "1-2", 75.16, 46.0],
  ["East Central", "2-1", 70.22, 46.8],
  ["Ben Davis", "2-1", 70.18, 41.2],
  ["Carroll", "2-1", 70.00, 32.5],
  ["Fort Wayne Bishop Dwenger", "3-0", 69.85, 27.8],
  ["Roncalli", "1-2", 69.84, 45.0],
  ["Decatur Central", "2-1", 69.25, 29.6],
  ["Zionsville", "2-1", 67.86, 40.2],
  ["Franklin Central", "1-2", 67.65, 47.1],
  ["Hamilton Southeastern", "1-2", 66.01, 41.8],
  ["Crown Point", "3-0", 65.79, 29.7],
  ["Lawrence Central", "1-2", 62.56, 34.6],
  ["Homestead", "2-1", 61.62, 35.3],
  ["Merrillville", "2-1", 61.45, 35.5],
  ["Fishers", "0-3", 60.93, 44.1],
  ["Penn", "3-0", 59.47, 28.1],
]

indianaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `in-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "IN",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Iowa football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const iowaFootballRows: Array<
  [string, string, number, number]
> = [
  ["Dowling Catholic", "2-0", 73.94, 38.7],
  ["Xavier", "2-0", 70.16, 34.8],
  ["Southeast Polk", "2-0", 64.47, 32.6],
  ["Johnston", "1-1", 64.15, 37.2],
  ["Valley", "1-1", 63.98, 37.8],
  ["Liberty", "1-1", 58.18, 33.6],
  ["Western Dubuque", "1-1", 58.05, 38.9],
  ["Ankeny", "2-0", 56.06, 28.2],
  ["Sergeant Bluff-Luton", "2-0", 55.69, 33.7],
  ["Bishop Heelan Catholic", "1-1", 55.69, 31.4],
  ["North Polk", "1-1", 55.47, 29.6],
  ["Northwest", "0-2", 55.18, 36.0],
  ["Waukee", "0-2", 54.72, 37.9],
  ["Lewis Central", "1-1", 54.67, 35.7],
  ["Regina", "2-0", 54.64, 23.3],
  ["Kuemper", "2-0", 54.54, 22.1],
  ["Clear Lake", "2-0", 53.95, 18.4],
  ["Solon", "2-0", 53.94, 22.5],
  ["Waverly-Shell Rock", "2-0", 52.68, 24.8],
  ["Pella", "1-1", 52.67, 26.8],
  ["Ankeny Centennial", "1-1", 52.54, 33.5],
  ["Crestwood", "2-0", 52.45, 25.7],
  ["Woodbury Central", "2-0", 51.59, 20.3],
  ["Clarinda", "2-0", 51.35, 24.2],
  ["Sioux Center", "2-0", 51.23, 16.4],
]

iowaFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `ia-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "IA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Idaho football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const idahoFootballRows: Array<
  [string, string, number, number]
> = [
  ["Mountain View", "2-0", 70.27, 35.8],
  ["Rigby", "3-0", 70.23, 26.9],
  ["Coeur d'Alene", "3-0", 69.46, 25.6],
  ["Rocky Mountain", "1-1", 67.97, 39.1],
  ["Homedale", "3-0", 67.85, 33.6],
  ["Madison", "3-0", 62.56, 27.5],
  ["Bishop Kelly", "2-0", 60.24, 32.8],
  ["Eagle", "2-1", 60.21, 35.5],
  ["Middleton", "0-2", 57.34, 43.7],
  ["Fruitland", "2-0", 55.57, 27.6],
  ["Highland", "0-2", 55.42, 37.6],
  ["Boise", "3-0", 54.23, 24.6],
  ["Timberline", "0-2", 54.23, 32.8],
  ["Sugar-Salem", "2-1", 53.25, 27.3],
  ["Weiser", "2-1", 51.79, 25.3],
  ["Hillcrest", "2-0", 51.77, 19.2],
  ["Lewiston", "2-1", 49.74, 27.1],
  ["West Side", "3-0", 49.43, 18.8],
  ["Kimberly", "1-2", 49.23, 30.0],
  ["Emmett", "3-0", 47.85, 16.1],
  ["Melba", "2-0", 46.82, 11.7],
  ["Meridian", "2-0", 46.71, 12.0],
  ["Declo", "3-0", 46.58, 19.3],
  ["Skyline", "2-0", 46.25, 13.7],
  ["Lakeland", "0-3", 45.38, 34.3],
]

idahoFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `id-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "ID",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Maryland football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const marylandFootballRows: Array<
  [string, string, number, number]
> = [
  ["St. Frances Academy", "2-0", 103.35, 53.1],
  ["DeMatha", "2-0", 93.80, 46.9],
  ["Archbishop Spalding", "0-2", 74.65, 53.7],
  ["Our Lady of Good Counsel", "1-1", 72.50, 49.4],
  ["McDonogh", "2-0", 70.27, 31.8],
  ["Bishop McNamara", "2-0", 69.64, 26.4],
  ["Calvert Hall", "0-1", 67.73, 45.9],
  ["Loyola Blakefield", "1-0", 65.76, 33.7],
  ["Mount St. Joseph", "2-0", 64.33, 31.2],
  ["Quince Orchard", "1-0", 61.76, 24.6],
  ["Wise", "0-0", 60.95, 0.0],
  ["Linganore", "1-0", 60.93, 35.7],
  ["Broadneck", "1-0", 60.20, 33.5],
  ["St. Mary's", "0-1", 60.19, 32.8],
  ["Concordia Prep", "1-0", 57.41, 9.8],
  ["Georgetown Prep", "1-0", 57.36, 20.8],
  ["Flowers", "0-0", 57.04, 0.0],
  ["Bullis", "2-0", 54.33, 27.6],
  ["Gilman", "0-2", 54.33, 36.5],
  ["North Point", "1-0", 53.26, 16.7],
  ["Dunbar", "1-0", 52.25, 28.4],
  ["Mergenthaler Vo-Tech", "0-1", 52.19, 42.3],
  ["St. Mary's Ryken", "0-2", 51.57, 45.7],
  ["Milford Mill Academy", "0-1", 50.65, 39.1],
  ["St. Charles", "1-0", 49.83, 18.4],
]

marylandFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `md-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MD",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// New Jersey football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const newJerseyFootballRows: Array<
  [string, string, number, number]
> = [
  ["Don Bosco Prep", "2-0", 96.66, 46.8],
  ["St. Joseph Regional", "0-2", 88.82, 57.9],
  ["Bergen Catholic", "0-2", 84.87, 50.0],
  ["St. Peter's Prep", "2-0", 84.72, 36.0],
  ["DePaul Catholic", "2-0", 76.98, 37.0],
  ["St. Augustine Prep", "2-0", 72.11, 36.4],
  ["Paramus Catholic", "1-1", 71.93, 45.9],
  ["Delbarton", "2-0", 71.74, 29.0],
  ["Winslow Township", "2-0", 71.71, 26.7],
  ["Washington Township", "2-0", 70.04, 35.1],
  ["NV - Old Tappan", "1-0", 67.82, 39.4],
  ["Ramapo", "1-1", 67.80, 39.4],
  ["Wayne Hills", "2-0", 66.30, 36.7],
  ["Toms River North", "2-0", 66.30, 29.7],
  ["Northern Highlands", "0-2", 66.28, 38.9],
  ["Rancocas Valley", "2-0", 66.16, 27.9],
  ["Millville", "1-1", 63.97, 38.5],
  ["Camden", "1-1", 61.69, 37.3],
  ["Phillipsburg", "2-0", 60.38, 31.9],
  ["Brick Memorial", "2-0", 60.32, 24.4],
  ["Shabazz", "2-0", 60.25, 33.3],
  ["Atlantic City", "0-2", 60.24, 42.1],
  ["Seton Hall Prep", "0-2", 58.37, 43.4],
  ["Glassboro", "2-0", 58.16, 30.5],
  ["Mainland Regional", "1-1", 58.15, 34.5],
]

newJerseyFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `nj-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "NJ",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Nevada football: supplied 2026 rankings snapshot.
// Truckee (#25) is located in California and is excluded here.
const nevadaFootballRows: Array<
  [string, string, string, number, number]
> = [
  ["Bishop Gorman", "Las Vegas", "3-1", 105.62, 51.0],
  ["Liberty", "Henderson", "1-2", 76.27, 40.5],
  ["Foothill", "Henderson", "2-1", 68.00, 38.6],
  ["Spanish Springs", "Sparks", "1-2", 67.98, 36.0],
  ["Arbor View", "Las Vegas", "0-3", 67.73, 53.8],
  ["Mater Academy East Las Vegas", "Las Vegas", "3-0", 64.34, 35.1],
  ["Faith Lutheran", "Las Vegas", "2-2", 64.33, 45.4],
  ["Coronado", "Henderson", "2-1", 58.70, 25.4],
  ["Centennial", "Las Vegas", "2-2", 55.57, 34.2],
  ["Pinecrest Academy Sloan Canyon", "Henderson", "3-0", 53.33, 26.6],
  ["Churchill County", "Fallon", "4-0", 53.33, 25.0],
  ["Reed", "Sparks", "1-2", 53.32, 28.9],
  ["Spring Creek", "Spring Creek", "3-0", 51.81, 15.3],
  ["Palo Verde", "Las Vegas", "3-0", 51.26, 26.6],
  ["Legacy", "North Las Vegas", "2-1", 51.26, 26.3],
  ["Reno", "Reno", "2-1", 49.83, 24.3],
  ["Bishop Manogue", "Reno", "0-4", 47.41, 41.7],
  ["Damonte Ranch", "Reno", "3-0", 46.71, 11.3],
  ["McQueen", "Reno", "2-1", 46.70, 15.7],
  ["Shadow Ridge", "Las Vegas", "1-2", 45.53, 26.4],
  ["Moapa Valley", "Overton", "3-1", 45.46, 22.0],
  ["Desert Pines", "Las Vegas", "2-1", 44.72, 21.3],
  ["Elko", "Elko", "2-1", 44.14, 17.9],
  ["Clark", "Las Vegas", "3-0", 43.76, 17.1],
]

nevadaFootballRows.forEach(
  ([name, city, record, rating, strength], index) => {
    const id = `nv-${city}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city,
      state: "NV",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Washington, D.C. football: supplied 2026 rankings snapshot.
const dcFootballRows: Array<
  [string, string, number, number]
> = [
  ["St. John's", "2-0", 74.70, 35.4],
  ["Gonzaga", "2-0", 69.63, 33.5],
  ["Friendship Collegiate Academy", "1-1", 48.29, 28.4],
  ["Digital Pioneers Academy", "2-0", 46.59, 14.2],
  ["Roosevelt", "1-0", 45.54, 17.9],
  ["Eastern", "1-0", 45.48, 17.1],
  ["St. Albans", "1-0", 44.16, 21.9],
  ["Coolidge", "1-1", 43.02, 30.6],
  ["Maret", "1-0", 42.64, 22.5],
  ["Dunbar", "0-1", 41.67, 22.4],
  ["Phelps Architecture, Construction & Engineering", "1-0", 37.14, 9.3],
  ["Archbishop Carroll", "0-1", 34.25, 33.6],
  ["McKinley Tech", "1-1", 31.46, 13.2],
  ["Bell", "0-1", 31.33, 40.1],
  ["KIPP DC Legacy College Prep", "1-1", 30.59, 23.1],
  ["KIPP College Prep", "1-1", 30.45, 19.1],
  ["Ron Brown", "1-1", 27.97, 12.2],
  ["Sidwell Friends", "0-1", 23.57, 14.5],
  ["Ballou", "1-1", 23.53, 18.7],
  ["Anacostia", "0-2", 22.86, 23.4],
  ["Jackson-Reed", "0-1", 19.04, 18.8],
  ["Woodson", "0-1", 16.39, 17.8],
  ["Richard Wright Public Charter School", "0-0", 5.99, 0.0],
  ["Cardozo", "0-0", -7.13, 0.0],
  ["St. John's Gray", "1-1", -25.33, 0.0],
]

dcFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `dc-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: "Washington",
      state: "DC",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Wyoming football: supplied 2026 rankings snapshot.
// Cities and mascots were not supplied.
const wyomingFootballRows: Array<
  [string, string, number, number]
> = [
  ["Big Horn", "1-0", 52.32, 0.0],
  ["Star Valley", "1-0", 52.31, 31.8],
  ["Mountain View", "1-0", 50.29, 0.0],
  ["Cody", "1-0", 47.03, 16.4],
  ["Natrona County", "2-0", 44.15, 17.2],
  ["Sheridan", "2-0", 44.14, 5.5],
  ["Central", "2-0", 43.79, 15.7],
  ["Riverton", "1-1", 43.56, 17.1],
  ["Evanston", "2-0", 41.06, 9.4],
  ["Campbell County", "1-1", 40.29, 20.6],
  ["Green River", "1-0", 39.61, 17.0],
  ["Hot Springs County", "2-0", 39.46, 5.6],
  ["Jackson Hole", "2-0", 38.56, 13.9],
  ["Kemmerer", "2-0", 36.71, 8.7],
  ["Lander Valley", "0-1", 36.37, 23.7],
  ["East", "1-1", 35.77, 18.8],
  ["Lovell", "1-0", 33.54, 10.7],
  ["Cokeville", "0-1", 33.06, 19.5],
  ["Lyman", "1-0", 31.45, 7.0],
  ["Pinedale", "2-0", 30.39, 11.5],
  ["Glenrock", "0-1", 30.39, 19.6],
  ["Torrington", "1-1", 30.18, 24.4],
  ["Buffalo", "0-1", 29.76, 33.9],
  ["Powell", "1-1", 28.62, 17.0],
  ["Laramie", "1-1", 28.26, 18.6],
]

wyomingFootballRows.forEach(
  ([name, record, rating, strength], index) => {
    const id = `wy-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "WY",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
// Supplied 2026 football rankings snapshots.
// Cities and mascots were not supplied.
const rhodeIslandFootballRows: Array<
  [string, string, number, number]
> = [
  ["La Salle Academy", "1-0", 62.44, 30.1],
  ["Bishop Hendricken", "0-1", 60.80, 27.9],
  ["North Kingstown", "0-1", 55.43, 40.7],
  ["Central", "0-0", 51.38, 0.0],
  ["Westerly", "0-0", 51.00, 0.0],
  ["Cranston West", "1-0", 49.29, 14.3],
  ["St. Raphael Academy", "0-0", 49.24, 0.0],
  ["Portsmouth", "1-0", 47.01, 18.1],
  ["Barrington", "1-0", 46.19, 20.2],
  ["South Kingstown", "0-0", 45.80, 0.0],
  ["Cumberland", "1-0", 45.07, 20.4],
  ["Classical", "0-0", 44.95, 0.0],
  ["Tolman", "1-0", 37.38, 16.0],
  ["Cranston East", "1-0", 36.90, 10.9],
  ["Scituate", "1-0", 36.57, 11.7],
  ["East Providence", "0-1", 36.39, 24.7],
  ["West Warwick", "0-1", 36.30, 24.8],
  ["Mt. Hope", "0-0", 35.29, 0.0],
  ["Burrillville", "0-0", 34.04, 0.0],
  ["Middletown", "1-0", 33.97, 9.5],
  ["Johnston", "0-0", 31.87, 0.0],
  ["Woonsocket", "0-0", 31.65, 0.0],
  ["Ponaganset", "0-0", 31.45, 0.0],
  ["Narragansett", "0-0", 30.25, 0.0],
  ["Davies Career & Tech", "0-1", 28.59, 20.8],
]

const newMexicoFootballRows: Array<
  [string, string, number, number]
> = [
  ["Cleveland", "3-0", 79.45, 32.1],
  ["Las Cruces", "3-0", 55.61, 20.6],
  ["Centennial", "1-2", 53.48, 33.9],
  ["Volcano Vista", "3-0", 52.47, 17.3],
  ["Gadsden", "3-0", 51.34, 11.7],
  ["Piedra Vista", "2-1", 50.92, 27.7],
  ["La Cueva", "1-2", 50.24, 31.6],
  ["Moriarty", "3-0", 49.19, 18.6],
  ["Carlsbad", "3-0", 49.00, 20.7],
  ["St. Michael's", "3-0", 48.28, 14.8],
  ["Texico", "3-0", 48.27, 19.6],
  ["Rio Rancho", "1-2", 47.42, 27.2],
  ["Hobbs", "2-1", 47.22, 25.1],
  ["Roswell", "2-1", 46.75, 29.7],
  ["Artesia", "0-3", 45.52, 29.6],
  ["Organ Mountain", "3-0", 45.08, 13.5],
  ["Kirtland Central", "2-0", 44.34, 7.5],
  ["West Las Vegas", "3-0", 44.27, 18.0],
  ["Portales", "2-1", 44.25, 17.0],
  ["Sandia", "3-0", 44.15, 12.5],
  ["Eunice", "2-1", 42.10, 19.2],
  ["Belen", "3-0", 42.08, 12.4],
  ["Hope Christian", "3-0", 41.35, 8.0],
  ["Dexter", "2-1", 40.96, 12.2],
  ["St. Pius X", "2-1", 40.81, 20.3],
]

const riNmFootballImports: Array<{
  state: string
  rows: Array<[string, string, number, number]>
}> = [
  { state: "RI", rows: rhodeIslandFootballRows },
  { state: "NM", rows: newMexicoFootballRows },
]

riNmFootballImports.forEach(({ state, rows }) => {
  rows.forEach(([name, record, rating, strength], index) => {
    const id = `${state}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state,
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  })
})
// Massachusetts football: supplied 2026 rankings snapshot.
// Strength, cities, and mascots were not supplied.
const massachusettsFootballRows: Array<
  [string, string, number]
> = [
  ["Xaverian Brothers", "0-0", 77.08],
  ["Catholic Memorial", "0-0", 76.30],
  ["St. John's Prep", "0-0", 74.82],
  ["King Philip Regional", "0-0", 74.25],
  ["Central", "0-0", 72.45],
  ["Central Catholic", "0-0", 68.32],
  ["Scituate", "0-0", 66.14],
  ["North Attleborough", "0-0", 65.87],
  ["Marshfield", "0-0", 65.23],
  ["Milton", "0-0", 64.55],
  ["Mansfield", "0-0", 64.51],
  ["Tewksbury Memorial", "0-0", 64.43],
  ["Natick", "0-0", 64.35],
  ["Duxbury", "0-0", 64.08],
  ["Bishop Feehan", "0-0", 62.76],
  ["Andover", "0-0", 62.25],
  ["Milford", "0-0", 61.71],
  ["Hingham", "0-0", 61.00],
  ["Methuen", "0-0", 60.90],
  ["Walpole", "0-0", 60.76],
  ["Malden Catholic", "0-0", 60.43],
  ["Tabor Academy", "0-0", 60.01],
  ["St. John's", "0-0", 59.57],
  ["Canton", "0-0", 58.76],
  ["Boston College High", "0-0", 58.74],
]

massachusettsFootballRows.forEach(
  ([name, record, rating], index) => {
    const id = `ma-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const existing = schools[id]

    const football = {
      rank: index + 1,
      record,
      rating,
      strength: existing?.sports?.football?.strength ?? 0,
    }

    schools[id] = {
      ...existing,
      id,
      name,
      city: existing?.city ?? "",
      state: "MA",
      mascot: existing?.mascot ?? "",
      ...football,
      sports: {
        ...existing?.sports,
        football,
      },
      schedule: existing?.schedule ?? [],
    }
  }
)
  
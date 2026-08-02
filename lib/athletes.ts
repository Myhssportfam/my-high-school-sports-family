export type Athlete = {
  id: string
  firstName: string
  lastName: string
  stateId: string
  city: string
  school: string
  sport: string
  position: string
  graduationYear: number
  statLabel: string
  statValue: string
}

export const athletes: Athlete[] = [
  {
    id: 'jordan-williams',
    firstName: 'Jordan',
    lastName: 'Williams',
    stateId: 'texas',
    city: 'Dallas',
    school: 'Dallas Central High School',
    sport: 'Football',
    position: 'Wide Receiver',
    graduationYear: 2027,
    statLabel: 'Receiving yards',
    statValue: '1,124',
  },
  {
    id: 'avery-johnson',
    firstName: 'Avery',
    lastName: 'Johnson',
    stateId: 'texas',
    city: 'Houston',
    school: 'Houston North Academy',
    sport: 'Basketball',
    position: 'Point Guard',
    graduationYear: 2026,
    statLabel: 'Points per game',
    statValue: '21.4',
  },
  {
    id: 'micah-thompson',
    firstName: 'Micah',
    lastName: 'Thompson',
    stateId: 'texas',
    city: 'Austin',
    school: 'Austin West High School',
    sport: 'Baseball',
    position: 'Center Field',
    graduationYear: 2027,
    statLabel: 'Batting average',
    statValue: '.421',
  },
]

export function getAthletesByState(stateId: string) {
  return athletes.filter(
    (athlete) => athlete.stateId.toLowerCase() === stateId.toLowerCase()
  )
}
export type ArenaRoom = {
  id: string
  ownerId?: string
state?: string
stateId?: string
joinedUserIds?: string[]
entryType?: string
participants?: {
  userId: string
  displayName: string
  state: string
  playstationId?: string
  xboxGamertag?: string
  eaId?: string
}[]

  title: string
  game: string
  matchup: string
  host: string
  hostUid?: string 
  hostState: string
  creatorPlaystationId?: string
creatorXboxGamertag?: string
creatorEaId?: string
  platform: string
  status: "live" | "open" | "scheduled"
  players: number
  maxPlayers: number
  teamOneScore?: number
teamTwoScore?: number
  viewers: number
  entry: string
  streamPlatform: "Twitch" | "YouTube" | "None"
  streamUrl?: string
  emoji: string
}

export const arenaRooms: ArenaRoom[] = [
  {
    id: "college-football-27-dynasty",
    title: "College Football 27 National Dynasty",
    game: "EA Sports College Football 27",
    matchup: "National vs. 32-Team Online Dynasty",
    host: "MHSSFDynastyCommissioner",
    hostUid: "YOUR_FIREBASE_UID",
    hostState: "National",
    platform: "Cross-platform",
    status: "open",
    players: 8,
    maxPlayers: 32,
    viewers: 0,
    entry: "Online Dynasty",
    streamPlatform: "Twitch",
    emoji: "🏈",
  },
  {
    id: "texas-florida-showdown",
    title: "State Rivalry Showdown",
    game: "EA Sports College Football",
    matchup: "Texas vs. Florida",
    host: "LoneStarQB",
    hostState: "Texas",
    platform: "PlayStation 5",
    status: "live",
    players: 2,
    maxPlayers: 2,
    viewers: 1240,
    entry: "Free match",
    streamPlatform: "Twitch",
    streamUrl: "https://www.twitch.tv/",
    emoji: "🏈",
  },
  {
    id: "friday-night-2k",
    title: "Friday Night 2K Run",
    game: "NBA 2K",
    matchup: "California vs. Open Challenge",
    host: "WestCoastBuckets",
    hostState: "California",
    platform: "Xbox Series X|S",
    status: "open",
    players: 3,
    maxPlayers: 10,
    viewers: 0,
    entry: "Open lobby",
    streamPlatform: "YouTube",
    emoji: "🏀",
  },
  {
  id: "madden-nfl",
  title: "Madden NFL State Arena",
  game: "Madden NFL",
  matchup: "State vs. Open Challenge",
  host: "MHSFArena",
  hostState: "National",
  platform: "Cross-platform",
  status: "open",
  players: 0,
  maxPlayers: 8,
  viewers: 0,
  entry: "Open lobby",
  streamPlatform: "Twitch",
  streamUrl: "https://www.twitch.tv/",
  emoji: "🏈",
},
{
  id: "nba-2k",
  title: "NBA 2K State Arena",
  game: "NBA 2K",
  matchup: "State vs. Open Challenge",
  host: "MHSFArena",
  hostState: "National",
  platform: "Cross-platform",
  status: "open",
  players: 0,
  maxPlayers: 10,
  viewers: 0,
  entry: "Open lobby",
  streamPlatform: "YouTube",
  streamUrl: "",
  emoji: "🏀",
},
{
  id: "mlb-the-show",
  title: "MLB The Show State Arena",
  game: "MLB The Show",
  matchup: "State vs. Open Challenge",
  host: "MHSFArena",
  hostState: "National",
  platform: "Cross-platform",
  status: "open",
  players: 0,
  maxPlayers: 8,
  viewers: 0,
  entry: "Open lobby",
  streamPlatform: "Twitch",
  streamUrl: "https://www.twitch.tv/",
  emoji: "⚾",
},
{
  id: "ea-sports-fc",
  title: "EA Sports FC State Arena",
  game: "EA Sports FC",
  matchup: "State vs. Open Challenge",
  host: "MHSFArena",
  hostState: "National",
  platform: "Cross-platform",
  status: "open",
  players: 0,
  maxPlayers: 22,
  viewers: 0,
  entry: "Open lobby",
  streamPlatform: "Twitch",
  streamUrl: "https://www.twitch.tv/",
  emoji: "⚽",
},
{
  id: "nhl",
  title: "NHL State Arena",
  game: "NHL",
  matchup: "State vs. Open Challenge",
  host: "MHSFArena",
  hostState: "National",
  platform: "Cross-platform",
  status: "open",
  players: 0,
  maxPlayers: 12,
  viewers: 0,
  entry: "Open lobby",
  streamPlatform: "Twitch",
  streamUrl: "https://www.twitch.tv/",
  emoji: "🏒",
},
]
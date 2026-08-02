import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import StateMembershipGate from '../components/arena/StateMembershipGate'
import TournamentCard from '../components/arena/TournamentCard'
import ArenaRoomCard from '../components/arena/ArenaRoomCard'
import ChampionshipLobby from '../components/ChampionshipLobby'
import LiveChampionshipLobby from '../components/LiveChampionshipLobby'
import InteractiveUSMap from '../components/InteractiveUSMap'
type RoomStatus = 'live' | 'open' | 'scheduled' | 'full'

type ArenaRoom = {
  
  id: string
  title: string
  game: string
  console: string
  host: string
  hostState: string
  opponentState: string
  status: RoomStatus
  players: number
  maxPlayers: number
  viewers?: number
  scheduledTime?: string
  platform?: string
  entryType: string
  icon: string
}

const games = [
  'EA Sports College Football 27',
  'Madden NFL',
  'NBA 2K',
  'MLB The Show',
  'EA Sports FC',
  'NHL',
]

const states = [
  'Texas',
  'Florida',
  'California',
  'Georgia',
  'Ohio',
  'Colorado',
  'Michigan',
  'New York',
]

const startingRooms: ArenaRoom[] = [
  
  
  {
    id: 'college-football-27-dynasty',
    title: 'College Football 27 National Dynasty',
    game: 'EA Sports College Football 27',
    console: 'Cross-platform',
    host: 'MHSSFDynastyCommissioner',
    hostState: 'National',
    opponentState: '32-Team Online Dynasty',
    status: 'open',
    players: 8,
    maxPlayers: 32,
    scheduledTime: 'Dynasty begins August 1',
    platform: 'Twitch',
    entryType: 'Online Dynasty',
    icon: '🏈',
  },
  {
  
    id: 'college-football-live',
    title: 'State Rivalry Showdown',
    game: 'EA Sports College Football',
    console: 'PlayStation 5',
    host: 'LoneStarQB',
    hostState: 'Texas',
    opponentState: 'Florida',
    status: 'live',
    players: 2,
    maxPlayers: 2,
    viewers: 1240,
    platform: 'Twitch',
    entryType: 'Free match',
    icon: '🏈',
  },
  {
    id: 'nba-open-run',
    title: 'Friday Night 2K Run',
    game: 'NBA 2K',
    console: 'Xbox Series X|S',
    host: 'WestCoastBuckets',
    hostState: 'California',
    opponentState: 'Open challenge',
    status: 'open',
    players: 3,
    maxPlayers: 10,
    platform: 'YouTube',
    entryType: 'Open lobby',
    icon: '🏀',
  },
  {
    id: 'baseball-scheduled',
    title: 'Diamond State Challenge',
    game: 'MLB The Show',
    console: 'PlayStation 5',
    host: 'PeachStateSlugger',
    hostState: 'Georgia',
    opponentState: 'Colorado',
    status: 'scheduled',
    players: 2,
    maxPlayers: 2,
    scheduledTime: 'Saturday at 8:00 PM',
    platform: 'Twitch',
    entryType: 'Ranked match',
    icon: '⚾',
  },
  {
    id: 'madden-full',
    title: 'Sunday Madden Tournament',
    game: 'Madden NFL',
    console: 'Xbox Series X|S',
    host: 'BuckeyeKing',
    hostState: 'Ohio',
    opponentState: 'National tournament',
    status: 'full',
    players: 16,
    maxPlayers: 32,
    scheduledTime: 'Sunday at 6:30 PM',
    platform: 'MHSSF Arena',
    entryType: 'Tournament',
    icon: '🏈',
  },
  {
    id: 'soccer-open',
    title: 'National FC Clubs Room',
    game: 'EA Sports FC',
    console: 'Cross-platform',
    host: 'EmpireStriker',
    hostState: 'New York',
    opponentState: 'Open challenge',
    status: 'open',
    players: 7,
    maxPlayers: 22,
    entryType: 'Open lobby',
    icon: '⚽',
  },
  {
    id: 'hockey-scheduled',
    title: 'Northern Ice Challenge',
    game: 'NHL',
    console: 'PlayStation 5',
    host: 'GreatLakesSniper',
    hostState: 'Michigan',
    opponentState: 'New York',
    status: 'scheduled',
    players: 4,
    maxPlayers: 12,
    scheduledTime: 'Monday at 7:00 PM',
    platform: 'YouTube',
    entryType: 'Team match',
    icon: '🏒',
  },
]

const leaderboard = [
  { rank: 1, state: 'Texas', wins: 384, points: 12840 },
  { rank: 2, state: 'Florida', wins: 342, points: 11420 },
  { rank: 3, state: 'California', wins: 327, points: 10990 },
  { rank: 4, state: 'Georgia', wins: 251, points: 8350 },
  { rank: 5, state: 'Ohio', wins: 239, points: 7990 },
]

export default function ArenaPage() {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'live' | 'open' | 'scheduled'
  >('all')
  const [rooms, setRooms] = useState(startingRooms)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID

  const twitchUrl = useMemo(() => {
    if (!clientId || typeof window === 'undefined') {
      return ''
    }

    const redirect = encodeURIComponent(`${window.location.origin}/arena`)

    return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=user:read:email`
  }, [clientId])

  const filteredRooms = useMemo(() => {
    if (activeFilter === 'all') {
      return rooms
    }

    return rooms.filter((room) => room.status === activeFilter)
  }, [activeFilter, rooms])

  function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)

    const title = String(form.get('title') || '').trim()
    const game = String(form.get('game') || '').trim()
    const consoleName = String(form.get('console') || '').trim()
    const gamerTag = String(form.get('gamerTag') || '').trim()
    const hostState = String(form.get('hostState') || '').trim()
    const opponentState = String(form.get('opponentState') || '').trim()
    const roomType = String(form.get('roomType') || '').trim()
    const scheduledTime = String(form.get('scheduledTime') || '').trim()
    const platform = String(form.get('platform') || '').trim()

    if (!title || !game || !consoleName || !gamerTag || !hostState) {
      return
    }

    const newRoom: ArenaRoom = {
      id: `arena-room-${Date.now()}`,
      title,
      game,
      console: consoleName,
      host: gamerTag,
      hostState,
      opponentState: opponentState || 'Open challenge',
      status: scheduledTime ? 'scheduled' : 'open',
      players: 1,
      maxPlayers: roomType === 'Tournament' ? 16 : 2,
      scheduledTime: scheduledTime || undefined,
      platform: platform || undefined,
      entryType: roomType || 'Free match',
      icon: getGameIcon(game),
    }

    setRooms((current) => [newRoom, ...current])
    setNotice(
      'Your gaming room was created on this page. Firebase saving and invitations will be connected next.',
    )
    setIsCreateOpen(false)
    event.currentTarget.reset()
  }

  function getGameIcon(game: string) {
    if (game.includes('Basketball') || game.includes('2K')) return '🏀'
    if (game.includes('Baseball') || game.includes('Show')) return '⚾'
    if (game.includes('FC')) return '⚽'
    if (game.includes('NHL')) return '🏒'
    return '🏈'
  }

  function handleRoomAction(room: ArenaRoom) {
    if (room.status === 'live') {
      setNotice(`Opening the live ${room.title} stream.`)
      return
    }

    if (room.status === 'full') {
      setNotice(`${room.title} is currently full.`)
      return
    }

    if (room.status === 'scheduled') {
      setNotice(`Reminder set for ${room.title}.`)
      return
    }

    setNotice(`You requested to join ${room.title}.`)
  }

  return (
    <>
      <Head>
        <title>Video Game Arena | My High School Sports Family</title>
        <meta
          name="description"
          content="Challenge sports gamers, represent your state, create rooms, stream matches, and climb the MHSSF leaderboard."
        />
      </Head>

      <main className="arenaPage">
        <section className="hero">
          <div className="heroGrid" />

          <div className="heroContent">
            <div className="eyebrow lightEyebrow">
              <span className="liveDot" />
              MHSSF VIDEO GAME ARENA
            </div>

            <h1>
              Represent your state.
              <span> Play for your family.</span>
            </h1>

            <p>
              Challenge sports gamers across America, create competitive rooms,
              stream your gameplay, climb state leaderboards, and qualify for
              future MHSSF championships.
            </p>

            <div className="heroButtons">
              <button
                type="button"
                className="primaryButton"
                onClick={() => setIsCreateOpen(true)}
              >
                ＋ Create a gaming room
              </button>

              {twitchUrl ? (
                <a className="twitchButton" href={twitchUrl}>
                  Twitch Sign In
                </a>
              ) : (
                <button
                  type="button"
                  className="twitchButton"
                  onClick={() =>
                    setNotice(
                      'Add NEXT_PUBLIC_TWITCH_CLIENT_ID to .env.local to activate Twitch sign-in.',
                    )
                  }
                >
                  Twitch Sign In
                </button>
              )}

              <a href="#rooms" className="browseButton">
                Browse rooms
              </a>
            </div>

            <div className="heroStats">
              <div>
                <strong>128</strong>
                <span>Open rooms</span>
              </div>

              <div>
                <strong>4.2K</strong>
                <span>Gamers online</span>
              </div>

              <div>
                <strong>50</strong>
                <span>States represented</span>
              </div>
            </div>
          </div>

          <div className="heroConsole">
            <div className="screen">
              <span className="screenLive">LIVE MATCH</span>
              <div className="versus">
                <div>
                  <strong>TX</strong>
                  <span>LoneStarQB</span>
                </div>

                <b>VS</b>

                <div>
                  <strong>FL</strong>
                  <span>SunshineAce</span>
                </div>
              </div>

              <p>EA Sports College Football</p>
              <small>1,240 watching</small>
            </div>

            <div className="controller">
              <span className="leftStick" />
              <span className="rightStick" />
              <span className="dPad">＋</span>
              <span className="buttonA">A</span>
              <span className="buttonB">B</span>
              <span className="buttonX">X</span>
              <span className="buttonY">Y</span>
            </div>
          </div>
        </section>

        <div className="container">
  <StateMembershipGate
    defaultState="Texas"
    onJoin={(state) => {
      console.log(`Joined ${state} Sports Family`)
    }}
  />
</div>
<div className="container">
  <div className="sectionHeading">
    <div>
      <p className="eyebrow">Featured State Tournament</p>
      <h2>Texas vs. Florida</h2>
      <p>
        Join your state family, earn a roster spot, and represent your state
        in College Football 27.
      </p>
    </div>
  </div>

  <TournamentCard
    title="The Southern State Showdown"
    game="College Football 27"
    homeState="Texas"
    awayState="Florida"
    date="Saturday, August 8"
    time="7:00 PM"
    registered={24}
    capacity={32}
    status="registration"
    onJoin={() => {
      setNotice('Texas tournament registration selected.')
    }}
    onWatch={() => {
      setNotice('Opening the Texas vs. Florida tournament details.')
    }}
  />
</div>
<div className="container">
  <div className="sectionHeading">
    <div>
      <p className="eyebrow">Featured Gaming Room</p>
      <h2>College Football 27 Dynasty Room</h2>
      <p>
        Build your dynasty, represent your state, talk with teammates, and
        compete in State vs. State matchups.
      </p>
    </div>
  </div>

  <ArenaRoomCard
    title="College Football 27 Dynasty Room"
    game="College Football 27"
    homeState="Texas"
    awayState="Florida"
    players={14}
    capacity={16}
    viewers={1248}
    host="LoneStarQB"
    startTime="7:00 PM"
    status="open"
    voiceChat={true}
    stateMember={true}
    onEnter={() => {
  window.location.href = '/arena/dynasty-room'
}}
onWatch={() => {
  setNotice('Opening the live Dynasty Room broadcast.')
}}
  />
</div>
<div className="container">
          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')}>
                ×
              </button>
            </div>
          )}

          <section className="featuredSection">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">LIVE IN THE ARENA</p>
                <h2>Featured state match</h2>
              </div>

              <span className="liveCount">● 3 matches live</span>
            </div>

            <div className="featuredMatch">
              <div className="featuredPreview">
                <div className="previewTop">
                  <span className="liveBadge">● LIVE</span>
                  <span className="viewers">◉ 1.2K watching</span>
                </div>

                <button
                  type="button"
                  className="playButton"
                  aria-label="Watch live gaming match"
                  onClick={() =>
                    setNotice('Opening the Texas vs. Florida live match.')
                  }
                >
                  ▶
                </button>

                <div className="matchScore">
                  <div>
                    <span>TEXAS</span>
                    <strong>21</strong>
                  </div>

                  <b>3RD QTR</b>

                  <div>
                    <strong>17</strong>
                    <span>FLORIDA</span>
                  </div>
                </div>
              </div>

              <div className="featuredDetails">
                <span className="gamePill">
                  EA SPORTS COLLEGE FOOTBALL
                </span>

                <h2>Texas vs. Florida State Rivalry</h2>

                <p>
                  LoneStarQB takes on SunshineAce in a ranked national arena
                  matchup streamed live through Twitch.
                </p>

                <div className="playerRow">
                  <div className="player">
                    <div className="avatar">LQ</div>
                    <div>
                      <strong>LoneStarQB</strong>
                      <span>Texas • PlayStation 5</span>
                    </div>
                  </div>

                  <strong className="versusText">VS</strong>

                  <div className="player">
                    <div className="avatar floridaAvatar">SA</div>
                    <div>
                      <strong>SunshineAce</strong>
                      <span>Florida • PlayStation 5</span>
                    </div>
                  </div>
                </div>

                <div className="matchInformation">
                  <div>
                    <span>Room type</span>
                    <strong>Ranked match</strong>
                  </div>

                  <div>
                    <span>Streaming on</span>
                    <strong>Twitch</strong>
                  </div>

                  <div>
                    <span>Winner earns</span>
                    <strong>250 arena points</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="watchMatchButton"
                  onClick={() =>
                    setNotice('Opening the featured live gaming match.')
                  }
                >
                  ▶ Watch match
                </button>
              </div>
            </div>
          </section>

          <section className="roomsSection" id="rooms">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">MATCHMAKING</p>
                <h2>Gaming rooms and challenges</h2>
              </div>

              <button
                type="button"
                className="createButton"
                onClick={() => setIsCreateOpen(true)}
              >
                ＋ Create room
              </button>
            </div>

            <div className="filters">
              {(['all', 'live', 'open', 'scheduled'] as const).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={activeFilter === filter ? 'activeFilter' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all'
                    ? 'All rooms'
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="roomGrid">
              {filteredRooms.map((room, index) => (
                <article className="roomCard" key={room.id}>
                  <div
                    className={`roomPreview preview${(index % 4) + 1}`}
                  >
                    <span className="gameIcon">{room.icon}</span>

                    <span
                      className={`statusBadge status${room.status
                        .charAt(0)
                        .toUpperCase()}${room.status.slice(1)}`}
                    >
                      {room.status === 'live'
                        ? '● LIVE'
                        : room.status.toUpperCase()}
                    </span>

                    {room.viewers !== undefined && (
                      <span className="roomViewers">
                        {room.viewers.toLocaleString()} watching
                      </span>
                    )}
                  </div>

                  <div className="roomBody">
                    <div className="gameLine">
                      <span>{room.game}</span>
                      <small>{room.console}</small>
                    </div>

                    <h3>{room.title}</h3>

                    <p className="challenge">
                      {room.hostState} vs. {room.opponentState}
                    </p>

                    <div className="hostRow">
                      <div className="smallAvatar">
                        {room.host
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .join('')
                          .slice(0, 2)}
                      </div>

                      <div>
                        <strong>{room.host}</strong>
                        <span>{room.hostState}</span>
                      </div>
                    </div>

                    <div className="roomDetails">
                      <div>
                        <span>Players</span>
                        <strong>
                          {room.players}/{room.maxPlayers}
                        </strong>
                      </div>

                      <div>
                        <span>Entry</span>
                        <strong>{room.entryType}</strong>
                      </div>

                      {room.platform && (
                        <div>
                          <span>Stream</span>
                          <strong>{room.platform}</strong>
                        </div>
                      )}
                    </div>

                    {room.scheduledTime && (
                      <div className="scheduledTime">
                        ◷ {room.scheduledTime}
                      </div>
                    )}

                    <button
                      type="button"
                      className="roomAction"
                      disabled={room.status === 'full'}
                      onClick={() => handleRoomAction(room)}
                    >
                      {room.status === 'live'
                        ? 'Watch live'
                        : room.status === 'open'
                          ? 'Join room'
                          : room.status === 'scheduled'
                            ? 'Set reminder'
                            : 'Room full'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="leaderboardSection">
            <div className="leaderboardCard">
              <div className="sectionHeader">
                <div>
                  <p className="eyebrow">NATIONAL LEADERBOARD</p>
                  <h2>Top state families</h2>
                </div>

                <Link href="/states" className="textLink">
                  View all states →
                </Link>
              </div>

              <div className="leaderboard">
                {leaderboard.map((entry) => (
                  <div className="leaderboardRow" key={entry.state}>
                    <b>{entry.rank}</b>

                    <div className="stateLogo">
                      {entry.state.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="stateName">
                      <strong>{entry.state}</strong>
                      <span>{entry.wins} arena wins</span>
                    </div>

                    <strong>{entry.points.toLocaleString()} pts</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="championshipCard">
              <p className="eyebrow lightEyebrow">MHSSF CHAMPIONSHIPS</p>
              <h2>Compete for your state</h2>

              <p>
                Future seasonal tournaments will feature state qualifiers,
                national brackets, live championship streams, awards, and
                verified athlete gaming profiles.
              </p>

              <div className="championshipStats">
                <div>
                  <strong>50</strong>
                  <span>State teams</span>
                </div>

                <div>
                  <strong>6</strong>
                  <span>Sports games</span>
                </div>

                <div>
                  <strong>1</strong>
                  <span>National champion</span>
                </div>
              </div>

              <button
                type="button"
                className="championshipButton"
                onClick={() =>
                  setNotice(
                    'Tournament registration will be connected after Firebase accounts are ready.',
                  )
                }
              >
                Join tournament waitlist
              </button>
            </div>
          </section>

          <section className="safetySection">
            <div className="shield">🛡️</div>

            <div>
              <h2>Built for a safer youth sports community</h2>
              <p>
                Profiles, chat, gaming rooms, tournaments, and streaming will
                include reporting tools, moderation, privacy controls,
                age-aware access, and parent or guardian protections before the
                public launch.
              </p>
            </div>
          </section>
        </div>
        <ChampionshipLobby
  onCreateRoom={() => setIsCreateOpen(true)}
/>
<LiveChampionshipLobby />
<InteractiveUSMap />
      </main>

      {isCreateOpen && (
        <div
          className="modalBackdrop"
          role="presentation"
          onMouseDown={() => setIsCreateOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-room-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <p className="eyebrow">MATCHMAKING</p>
                <h2 id="create-room-title">Create a gaming room</h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRoom}>
              <label>
                Room title
                <input
                  name="title"
                  placeholder="Friday Night Madden Challenge"
                  required
                />
              </label>

              <div className="formGrid">
                <label>
                  Sports game
                  <select name="game" defaultValue="" required>
                    <option value="" disabled>
                      Select game
                    </option>

                    {games.map((game) => (
                      <option key={game}>{game}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Console
                  <select name="console" defaultValue="" required>
                    <option value="" disabled>
                      Select console
                    </option>
                    <option>PlayStation 5</option>
                    <option>Xbox Series X|S</option>
                    <option>PC</option>
                    <option>Nintendo Switch</option>
                    <option>Cross-platform</option>
                  </select>
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Gamer tag
                  <input
                    name="gamerTag"
                    placeholder="LoneStarQB"
                    required
                  />
                </label>

                <label>
                  State represented
                  <select name="hostState" defaultValue="" required>
                    <option value="" disabled>
                      Select state
                    </option>

                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Opponent state
                  <select name="opponentState" defaultValue="">
                    <option value="">Open challenge</option>

                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Room type
                  <select name="roomType" defaultValue="Free match">
                    <option>Free match</option>
                    <option>Ranked match</option>
                    <option>Open lobby</option>
                    <option>Team match</option>
                    <option>Tournament</option>
                  </select>
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Scheduled time
                  <input
                    name="scheduledTime"
                    placeholder="Saturday at 8:00 PM"
                  />
                </label>

                <label>
                  Streaming platform
                  <select name="platform" defaultValue="">
                    <option value="">No stream</option>
                    <option>Twitch</option>
                    <option>YouTube</option>
                    <option>MHSSF Arena</option>
                  </select>
                </label>
              </div>

              <label>
                Stream URL
                <input
                  name="streamUrl"
                  type="url"
                  placeholder="https://twitch.tv/yourchannel"
                />
              </label>

              <p className="formNote">
                This version creates the room on the page for design testing.
                We will connect permanent rooms, invitations, chat, scores, and
                rankings to Firebase later.
              </p>

              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="submitButton">
                  Create gaming room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f4f6fa;
          color: #111827;
          font-family:
            Inter, Arial, Helvetica, system-ui, -apple-system, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .arenaPage {
          min-height: 100vh;
        }

        .hero {
          min-height: 560px;
          padding: 70px max(6%, calc((100% - 1180px) / 2));
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(350px, 0.85fr);
          align-items: center;
          gap: 55px;
          background:
            radial-gradient(
              circle at 84% 20%,
              rgba(37, 99, 235, 0.38),
              transparent 27%
            ),
            radial-gradient(
              circle at 75% 95%,
              rgba(220, 38, 38, 0.28),
              transparent 30%
            ),
            linear-gradient(120deg, #050914, #101d38 53%, #3f0b19);
          color: white;
        }

        .heroGrid {
          position: absolute;
          inset: 0;
          opacity: 0.25;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.055) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(to right, black, transparent);
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .lightEyebrow {
          color: #fca5a5;
        }

        .liveDot {
          width: 8px;
          height: 8px;
          margin-right: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.18);
        }

        .hero h1 {
          max-width: 780px;
          margin: 22px 0 18px;
          font-size: clamp(45px, 6vw, 74px);
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          background: linear-gradient(90deg, #60a5fa, #ffffff, #f87171);
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroContent > p {
          max-width: 680px;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroButtons {
          margin-top: 31px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .twitchButton,
        .browseButton {
          min-height: 49px;
          padding: 0 20px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 850;
        }

        .primaryButton {
          border: 0;
          background: #d73b26;
          color: white;
          box-shadow: 0 14px 34px rgba(215, 59, 38, 0.27);
        }

        .twitchButton {
          border: 1px solid #8b5cf6;
          background: #6d28d9;
          color: white;
        }

        .browseButton {
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.07);
          color: white;
        }

        .heroStats {
          margin-top: 37px;
          display: flex;
          gap: 45px;
          flex-wrap: wrap;
        }

        .heroStats div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .heroStats strong {
          font-size: 27px;
        }

        .heroStats span {
          color: #94a3b8;
          font-size: 12px;
        }

        .heroConsole {
          min-height: 430px;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
        }

        .screen {
          width: min(385px, 100%);
          min-height: 245px;
          padding: 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 22px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background:
            linear-gradient(rgba(8, 15, 31, 0.15), rgba(8, 15, 31, 0.84)),
            linear-gradient(145deg, #1d4ed8, #111827 52%, #991b1b);
          box-shadow:
            0 34px 80px rgba(0, 0, 0, 0.45),
            0 0 80px rgba(37, 99, 235, 0.2);
          transform: rotate(2deg);
        }

        .screenLive {
          position: absolute;
          top: 18px;
          left: 18px;
          padding: 6px 9px;
          border-radius: 6px;
          background: #dc2626;
          font-size: 9px;
          font-weight: 900;
        }

        .versus {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          text-align: center;
        }

        .versus div {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .versus strong {
          font-size: 43px;
        }

        .versus span {
          color: #cbd5e1;
          font-size: 12px;
        }

        .screen > p {
          margin: 28px 0 3px;
          text-align: center;
          font-weight: 850;
        }

        .screen > small {
          color: #cbd5e1;
          text-align: center;
        }

        .controller {
          width: 300px;
          height: 150px;
          margin-top: -18px;
          border: 2px solid rgba(255, 255, 255, 0.22);
          border-radius: 70px 70px 95px 95px;
          position: relative;
          background: linear-gradient(145deg, #e5e7eb, #64748b);
          box-shadow: 0 28px 50px rgba(0, 0, 0, 0.35);
        }

        .leftStick,
        .rightStick {
          width: 35px;
          height: 35px;
          position: absolute;
          bottom: 33px;
          border: 7px solid #111827;
          border-radius: 50%;
          background: #334155;
        }

        .leftStick {
          left: 95px;
        }

        .rightStick {
          right: 95px;
        }

        .dPad {
          position: absolute;
          top: 43px;
          left: 45px;
          color: #111827;
          font-size: 40px;
          font-weight: 900;
        }

        .buttonA,
        .buttonB,
        .buttonX,
        .buttonY {
          width: 25px;
          height: 25px;
          position: absolute;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #111827;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .buttonY {
          top: 27px;
          right: 51px;
        }

        .buttonA {
          top: 78px;
          right: 51px;
        }

        .buttonX {
          top: 53px;
          right: 77px;
        }

        .buttonB {
          top: 53px;
          right: 25px;
        }

        .container {
          width: min(1180px, calc(100% - 30px));
          margin: 0 auto;
          padding: 34px 0 75px;
        }

        .notice {
          margin-bottom: 22px;
          padding: 14px 17px;
          border: 1px solid #bfdbfe;
          border-radius: 13px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          background: #eff6ff;
          color: #1e3a8a;
          font-weight: 750;
        }

        .notice button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
        }

        .featuredSection,
        .roomsSection,
        .leaderboardCard,
        .championshipCard,
        .safetySection {
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: white;
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.055);
        }

        .featuredSection,
        .roomsSection {
          padding: 30px;
        }

        .sectionHeader {
          margin-bottom: 23px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .sectionHeader h2,
        .championshipCard h2,
        .safetySection h2 {
          margin: 0;
          font-size: clamp(25px, 4vw, 35px);
          letter-spacing: -0.035em;
        }

        .liveCount {
          padding: 8px 12px;
          border-radius: 999px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 900;
        }

        .featuredMatch {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
          gap: 25px;
        }

        .featuredPreview {
          min-height: 420px;
          padding: 18px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.1),
              transparent 24%
            ),
            linear-gradient(135deg, #1d4ed8, #111827 52%, #991b1b);
        }

        .previewTop {
          position: absolute;
          top: 17px;
          left: 17px;
          right: 17px;
          display: flex;
          justify-content: space-between;
        }

        .liveBadge,
        .viewers {
          padding: 7px 10px;
          border-radius: 7px;
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .liveBadge {
          background: #dc2626;
        }

        .viewers {
          background: rgba(15, 23, 42, 0.72);
        }

        .playButton {
          width: 74px;
          height: 74px;
          border: 0;
          border-radius: 50%;
          background: white;
          color: #b91c1c;
          cursor: pointer;
          font-size: 26px;
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.3);
        }

        .matchScore {
          min-width: 330px;
          padding: 14px 19px;
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 13px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 15px;
          background: rgba(8, 15, 31, 0.85);
          color: white;
        }

        .matchScore div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .matchScore div:last-child {
          flex-direction: row-reverse;
        }

        .matchScore span,
        .matchScore b {
          font-size: 10px;
        }

        .matchScore strong {
          font-size: 23px;
        }

        .featuredDetails {
          display: flex;
          flex-direction: column;
        }

        .gamePill {
          width: fit-content;
          padding: 6px 9px;
          border-radius: 7px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 9px;
          font-weight: 900;
        }

        .featuredDetails h2 {
          margin: 17px 0 10px;
          font-size: 29px;
          line-height: 1.16;
        }

        .featuredDetails > p {
          margin: 0 0 20px;
          color: #64748b;
          line-height: 1.6;
        }

        .playerRow {
          padding: 17px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 10px;
        }

        .player {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .avatar,
        .smallAvatar {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(145deg, #111827, #1d4ed8);
          color: white;
          font-weight: 900;
        }

        .avatar {
          width: 43px;
          height: 43px;
          font-size: 11px;
        }

        .floridaAvatar {
          background: linear-gradient(145deg, #111827, #b91c1c);
        }

        .player div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .player strong {
          font-size: 11px;
        }

        .player span {
          color: #64748b;
          font-size: 9px;
        }

        .versusText {
          color: #94a3b8;
          font-size: 10px;
        }

        .matchInformation {
          margin: 14px 0;
        }

        .matchInformation div {
          padding: 9px 0;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .matchInformation span {
          color: #64748b;
          font-size: 11px;
        }

        .matchInformation strong {
          font-size: 11px;
        }

        .watchMatchButton,
        .createButton,
        .championshipButton,
        .submitButton {
          border: 0;
          background: #b91c1c;
          color: white;
          cursor: pointer;
          font-weight: 850;
        }

        .watchMatchButton {
          min-height: 45px;
          margin-top: auto;
          border-radius: 11px;
        }

        .roomsSection {
          margin-top: 24px;
        }

        .createButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 10px;
        }

        .filters {
          width: fit-content;
          margin-bottom: 23px;
          padding: 5px;
          border-radius: 11px;
          display: flex;
          gap: 4px;
          background: #f1f5f9;
        }

        .filters button {
          padding: 9px 14px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .filters .activeFilter {
          background: white;
          color: #111827;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
        }

        .roomGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .roomCard {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: white;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .roomCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.1);
        }

        .roomPreview {
          min-height: 180px;
          padding: 13px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .preview1 {
          background: linear-gradient(145deg, #164e63, #172554, #7f1d1d);
        }

        .preview2 {
          background: linear-gradient(145deg, #78350f, #991b1b);
        }

        .preview3 {
          background: linear-gradient(145deg, #052e16, #1d4ed8);
        }

        .preview4 {
          background: linear-gradient(145deg, #312e81, #111827);
        }

        .gameIcon {
          font-size: 55px;
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.25));
        }

        .statusBadge {
          padding: 5px 8px;
          position: absolute;
          top: 12px;
          left: 12px;
          border-radius: 6px;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .statusLive {
          background: #dc2626;
        }

        .statusOpen {
          background: #15803d;
        }

        .statusScheduled {
          background: #1d4ed8;
        }

        .statusFull {
          background: #475569;
        }

        .roomViewers {
          padding: 5px 8px;
          position: absolute;
          top: 12px;
          right: 12px;
          border-radius: 6px;
          background: rgba(15, 23, 42, 0.72);
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .roomBody {
          padding: 16px;
        }

        .gameLine {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #b91c1c;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gameLine small {
          color: #64748b;
          text-transform: none;
        }

        .roomBody h3 {
          margin: 12px 0 6px;
          font-size: 17px;
        }

        .challenge {
          margin: 0 0 14px;
          color: #64748b;
          font-size: 12px;
        }

        .hostRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .smallAvatar {
          width: 38px;
          height: 38px;
          font-size: 10px;
        }

        .hostRow div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hostRow strong {
          font-size: 12px;
        }

        .hostRow span {
          color: #64748b;
          font-size: 10px;
        }

        .roomDetails {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .roomDetails div {
          padding: 5px 0;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .roomDetails span {
          color: #64748b;
          font-size: 10px;
        }

        .roomDetails strong {
          font-size: 10px;
        }

        .scheduledTime {
          margin-top: 11px;
          padding: 9px;
          border-radius: 8px;
          background: #f8fafc;
          color: #475569;
          font-size: 10px;
          font-weight: 750;
        }

        .roomAction {
          width: 100%;
          min-height: 40px;
          margin-top: 13px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: white;
          cursor: pointer;
          font-weight: 850;
        }

        .roomAction:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .leaderboardSection {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
        }

        .leaderboardCard,
        .championshipCard {
          padding: 28px;
        }

        .textLink {
          color: #b91c1c;
          font-size: 12px;
          font-weight: 850;
        }

        .leaderboardRow {
          padding: 13px 0;
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 30px 42px 1fr auto;
          align-items: center;
          gap: 11px;
        }

        .leaderboardRow:last-child {
          border-bottom: 0;
        }

        .leaderboardRow > b {
          color: #64748b;
        }

        .stateLogo {
          width: 39px;
          height: 39px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #1d4ed8, #b91c1c);
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .stateName {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .stateName span {
          color: #64748b;
          font-size: 10px;
        }

        .leaderboardRow > strong {
          font-size: 12px;
        }

        .championshipCard {
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(37, 99, 235, 0.35),
              transparent 32%
            ),
            linear-gradient(130deg, #08101e, #19284d 58%, #570e1a);
          color: white;
        }

        .championshipCard > p:not(.eyebrow) {
          color: #cbd5e1;
          line-height: 1.65;
        }

        .championshipStats {
          margin: 24px 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .championshipStats div {
          padding: 13px 8px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .championshipStats strong {
          font-size: 23px;
        }

        .championshipStats span {
          color: #cbd5e1;
          font-size: 9px;
        }

        .championshipButton {
          width: 100%;
          min-height: 43px;
          border-radius: 10px;
        }

        .safetySection {
          margin-top: 24px;
          padding: 27px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .shield {
          width: 60px;
          height: 60px;
          flex: 0 0 auto;
          border-radius: 17px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          font-size: 28px;
        }

        .safetySection h2 {
          font-size: 23px;
        }

        .safetySection p {
          margin: 7px 0 0;
          color: #64748b;
          line-height: 1.6;
        }

        .modalBackdrop {
          padding: 20px;
          position: fixed;
          z-index: 100;
          inset: 0;
          overflow-y: auto;
          display: grid;
          place-items: center;
          background: rgba(3, 7, 18, 0.74);
          backdrop-filter: blur(7px);
        }

        .modal {
          width: min(700px, 100%);
          padding: 27px;
          border-radius: 22px;
          background: white;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
        }

        .modalHeader {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
        }

        .modalHeader h2 {
          margin: 0;
        }

        .closeButton {
          width: 37px;
          height: 37px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
          font-size: 20px;
        }

        form {
          display: grid;
          gap: 15px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        label {
          display: grid;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        input,
        select {
          width: 100%;
          min-height: 44px;
          padding: 0 13px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          outline: none;
          background: white;
        }

        input:focus,
        select:focus {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
        }

        .formNote {
          margin: 0;
          padding: 12px;
          border-radius: 9px;
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancelButton,
        .submitButton {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 850;
        }

        .cancelButton {
          border: 1px solid #cbd5e1;
          background: white;
        }

        @media (max-width: 970px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .heroContent {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .heroConsole {
            display: none;
          }

          .featuredMatch,
          .leaderboardSection {
            grid-template-columns: 1fr;
          }

          .roomGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .hero {
            min-height: 530px;
            padding: 55px 18px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .heroContent > p {
            font-size: 15px;
          }

          .heroButtons {
            width: 100%;
          }

          .primaryButton,
          .twitchButton,
          .browseButton {
            width: 100%;
          }

          .heroStats {
            justify-content: center;
            gap: 23px;
          }

          .container {
            width: min(100% - 18px, 1180px);
            padding-top: 14px;
          }

          .featuredSection,
          .roomsSection,
          .leaderboardCard,
          .championshipCard {
            padding: 18px;
            border-radius: 18px;
          }

          .sectionHeader {
            display: block;
          }

          .liveCount,
          .createButton,
          .textLink {
            margin-top: 13px;
            display: inline-flex;
          }

          .featuredPreview {
            min-height: 300px;
          }

          .matchScore {
            min-width: calc(100% - 24px);
          }

          .playerRow {
            grid-template-columns: 1fr;
          }

          .versusText {
            text-align: center;
          }

          .filters {
            width: 100%;
            overflow-x: auto;
          }

          .filters button {
            flex: 0 0 auto;
          }

          .roomGrid {
            grid-template-columns: 1fr;
          }

          .safetySection {
            align-items: flex-start;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 20px;
          }
        }
      `}</style>
    </>
  )
}
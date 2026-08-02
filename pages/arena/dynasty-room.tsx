import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'

type ChatMessage = {
  id: number
  user: string
  state: string
  message: string
}

const startingPlayers = [
  { name: 'LoneStarQB', state: 'Texas', status: 'Ready', captain: true },
  { name: 'FridayNightKing', state: 'Texas', status: 'Ready', captain: false },
  { name: 'TexasDynasty22', state: 'Texas', status: 'Waiting', captain: false },
  { name: 'SunshineAce', state: 'Florida', status: 'Ready', captain: true },
  { name: 'GatorZone', state: 'Florida', status: 'Ready', captain: false },
  { name: 'SouthBeachQB', state: 'Florida', status: 'Waiting', captain: false },
]

const startingMessages: ChatMessage[] = [
  {
    id: 1,
    user: 'ArenaBot',
    state: 'MHSSF',
    message: 'Welcome to the College Football 27 Dynasty Room.',
  },
  {
    id: 2,
    user: 'LoneStarQB',
    state: 'Texas',
    message: 'Texas team, ready up. We are setting the lineup now.',
  },
  {
    id: 3,
    user: 'SunshineAce',
    state: 'Florida',
    message: 'Florida is ready. Let’s make this a great matchup.',
  },
]

export default function DynastyRoomPage() {
  const [messages, setMessages] = useState(startingMessages)
  const [message, setMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [joinedTeam, setJoinedTeam] = useState<'Texas' | 'Florida' | null>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [activeTab, setActiveTab] = useState<'chat' | 'players' | 'rules'>('chat')
  const [notice, setNotice] = useState('')

  const readyPlayers = useMemo(
    () => startingPlayers.filter((player) => player.status === 'Ready').length,
    [],
  )

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanMessage = message.trim()

    if (!cleanMessage) {
      return
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        user: 'You',
        state: joinedTeam ?? 'Spectator',
        message: cleanMessage,
      },
    ])

    setMessage('')
  }

  function joinTeam(state: 'Texas' | 'Florida') {
    setJoinedTeam(state)
    setNotice(`You joined the ${state} Dynasty team lobby.`)
  }

  function handleReadyUp() {
    if (!joinedTeam) {
      setNotice('Join Texas or Florida before readying up.')
      return
    }

    setIsReady((current) => !current)
    setNotice(
      isReady
        ? 'You are no longer marked ready.'
        : `You are ready to represent ${joinedTeam}.`,
    )
  }

  return (
    <>
      <Head>
        <title>College Football 27 Dynasty Room | MHSSF</title>
        <meta
          name="description"
          content="State vs. State College Football 27 Dynasty gaming room."
        />
      </Head>

      <main className="roomPage">
        <header className="roomHeader">
          <div className="headerInner">
            <Link href="/arena" className="backLink">
              ← Back to Arena
            </Link>

            <div className="liveBadge">
              <span className="liveDot" />
              Room Open
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="container heroGrid">
            <div>
              <p className="eyebrow">MHSSF State vs. State Arena</p>
              <h1>College Football 27 Dynasty Room</h1>
              <p className="heroText">
                Join your state team, ready up, talk strategy, watch the live
                matchup, and compete for state ranking points.
              </p>

              <div className="heroButtons">
                <button
                  type="button"
                  className="primaryButton"
                  onClick={() => joinTeam('Texas')}
                >
                  Join Texas Team
                </button>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => joinTeam('Florida')}
                >
                  Join Florida Team
                </button>
              </div>
            </div>

            <div className="matchupCard">
              <div className="statePanel">
                <p className="stateLabel">Home</p>
                <h2>Texas</h2>
                <div className="score">{homeScore}</div>
                <button
                  type="button"
                  onClick={() => setHomeScore((score) => score + 1)}
                >
                  Add Point
                </button>
              </div>

              <div className="versus">VS</div>

              <div className="statePanel">
                <p className="stateLabel">Away</p>
                <h2>Florida</h2>
                <div className="score">{awayScore}</div>
                <button
                  type="button"
                  onClick={() => setAwayScore((score) => score + 1)}
                >
                  Add Point
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="container roomStats">
          <div className="statCard">
            <span>Players</span>
            <strong>14 / 16</strong>
          </div>

          <div className="statCard">
            <span>Watching</span>
            <strong>1,248</strong>
          </div>

          <div className="statCard">
            <span>Ready</span>
            <strong>{readyPlayers} players</strong>
          </div>

          <div className="statCard">
            <span>Your Team</span>
            <strong>{joinedTeam ?? 'Spectator'}</strong>
          </div>
        </section>

        {notice && (
          <div className="container">
            <div className="notice">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')}>
                ×
              </button>
            </div>
          </div>
        )}

        <section className="container broadcastLayout">
          <div className="broadcastPanel">
            <div className="broadcastTop">
              <div>
                <p className="eyebrow">Live Broadcast</p>
                <h2>Texas vs. Florida</h2>
              </div>

              <span className="viewerBadge">1,248 watching</span>
            </div>

            <div className="videoPlaceholder">
              <div className="playButton">▶</div>
              <h3>Live gameplay will appear here</h3>
              <p>
                Connect your Twitch, YouTube, or streaming provider later.
              </p>
            </div>

            <div className="broadcastControls">
              <button
                type="button"
                className={isReady ? 'readyButton active' : 'readyButton'}
                onClick={handleReadyUp}
              >
                {isReady ? '✓ Ready' : 'Ready Up'}
              </button>

              <button
                type="button"
                onClick={() => setNotice('Voice chat controls opened.')}
              >
                🎙 Voice Chat
              </button>

              <button
                type="button"
                onClick={() => setNotice('Match rules opened.')}
              >
                View Rules
              </button>
            </div>
          </div>

          <aside className="roomSidebar">
            <div className="tabs">
              <button
                type="button"
                className={activeTab === 'chat' ? 'active' : ''}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>

              <button
                type="button"
                className={activeTab === 'players' ? 'active' : ''}
                onClick={() => setActiveTab('players')}
              >
                Players
              </button>

              <button
                type="button"
                className={activeTab === 'rules' ? 'active' : ''}
                onClick={() => setActiveTab('rules')}
              >
                Rules
              </button>
            </div>

            {activeTab === 'chat' && (
              <div className="chatPanel">
                <div className="messages">
                  {messages.map((chatMessage) => (
                    <div key={chatMessage.id} className="message">
                      <div className="messageTop">
                        <strong>{chatMessage.user}</strong>
                        <span>{chatMessage.state}</span>
                      </div>
                      <p>{chatMessage.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="chatForm">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Message the room..."
                  />

                  <button type="submit">Send</button>
                </form>
              </div>
            )}

            {activeTab === 'players' && (
              <div className="playersList">
                {startingPlayers.map((player) => (
                  <div key={player.name} className="playerRow">
                    <div>
                      <strong>{player.name}</strong>
                      <span>{player.state}</span>
                    </div>

                    <div className="playerStatus">
                      {player.captain && <span className="captain">Captain</span>}
                      <span>{player.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="rulesPanel">
                <h3>Room Rules</h3>
                <p>Players must represent the state family they joined.</p>
                <p>Captains confirm lineups before the match begins.</p>
                <p>No harassment, cheating, stream sniping, or false scores.</p>
                <p>Moderators may remove players who violate Arena rules.</p>
              </div>
            )}
          </aside>
        </section>

        <section className="container teamGrid">
          <div className="teamCard texas">
            <p className="eyebrow">Texas Team</p>
            <h2>Lone Star Dynasty</h2>
            <p>Captain: LoneStarQB</p>
            <p>Roster: 7 / 8 players</p>

            <button type="button" onClick={() => joinTeam('Texas')}>
              Join Texas
            </button>
          </div>

          <div className="teamCard florida">
            <p className="eyebrow">Florida Team</p>
            <h2>Sunshine Dynasty</h2>
            <p>Captain: SunshineAce</p>
            <p>Roster: 7 / 8 players</p>

            <button type="button" onClick={() => joinTeam('Florida')}>
              Join Florida
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .roomPage {
          min-height: 100vh;
          background: #07101f;
          color: white;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          padding-bottom: 70px;
        }

        .container,
        .headerInner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .roomHeader {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(3, 9, 20, 0.95);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .headerInner {
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .backLink {
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        .liveBadge,
        .viewerBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 13px;
          font-weight: 800;
        }

        .liveDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.15);
        }

        .hero {
          padding: 56px 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(29, 78, 216, 0.32), transparent 32%),
            radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.28), transparent 30%),
            linear-gradient(135deg, #030712, #0b1b3b);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 34px;
          align-items: center;
        }

        .eyebrow {
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 12px;
          font-weight: 900;
          color: #93c5fd;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 760px;
          margin-bottom: 16px;
          font-size: clamp(38px, 6vw, 70px);
          line-height: 0.98;
        }

        .heroText {
          max-width: 700px;
          color: #cbd5e1;
          line-height: 1.75;
          font-size: 17px;
        }

        .heroButtons,
        .broadcastControls {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        button {
          border: 0;
          border-radius: 14px;
          padding: 13px 18px;
          cursor: pointer;
          font-weight: 900;
        }

        .primaryButton {
          background: #dc2626;
          color: white;
        }

        .secondaryButton {
          background: white;
          color: #0f172a;
        }

        .matchupCard {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 14px;
          align-items: center;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.06);
        }

        .statePanel {
          text-align: center;
          padding: 20px 12px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.07);
        }

        .statePanel button {
          width: 100%;
          margin-top: 10px;
        }

        .stateLabel {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .score {
          margin: 12px 0;
          font-size: 48px;
          font-weight: 950;
        }

        .versus {
          font-weight: 950;
          color: #f87171;
        }

        .roomStats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 28px;
        }

        .statCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: #0d192b;
        }

        .statCard span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .statCard strong {
          display: block;
          margin-top: 8px;
          font-size: 20px;
        }

        .notice {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 16px;
          border: 1px solid #60a5fa;
          border-radius: 16px;
          background: #10284b;
        }

        .notice button {
          padding: 5px 10px;
          color: white;
          background: transparent;
          font-size: 22px;
        }

        .broadcastLayout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 24px;
          margin-top: 28px;
        }

        .broadcastPanel,
        .roomSidebar,
        .teamCard {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          background: #0d192b;
          overflow: hidden;
        }

        .broadcastTop {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 22px;
        }

        .videoPlaceholder {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px;
          background:
            linear-gradient(rgba(3, 7, 18, 0.7), rgba(3, 7, 18, 0.9)),
            radial-gradient(circle, #1d4ed8, #020617 65%);
        }

        .playButton {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #dc2626;
          font-size: 28px;
        }

        .videoPlaceholder h3 {
          margin: 20px 0 8px;
          font-size: 24px;
        }

        .videoPlaceholder p {
          color: #94a3b8;
        }

        .broadcastControls {
          margin: 0;
          padding: 20px;
        }

        .broadcastControls button {
          background: #172640;
          color: white;
        }

        .readyButton {
          background: #dc2626 !important;
        }

        .readyButton.active {
          background: #15803d !important;
        }

        .tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tabs button {
          border-radius: 0;
          background: transparent;
          color: #94a3b8;
        }

        .tabs button.active {
          color: white;
          background: #152642;
        }

        .chatPanel {
          display: flex;
          flex-direction: column;
          min-height: 520px;
        }

        .messages {
          flex: 1;
          padding: 18px;
        }

        .message {
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .messageTop,
        .playerRow,
        .playerStatus {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .messageTop span,
        .playerRow span {
          color: #93c5fd;
          font-size: 12px;
          font-weight: 800;
        }

        .message p {
          margin: 7px 0 0;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .chatForm {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chatForm input {
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 13px;
          background: #07101f;
          color: white;
        }

        .chatForm button {
          background: #2563eb;
          color: white;
        }

        .playersList,
        .rulesPanel {
          padding: 18px;
        }

        .playerRow {
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .playerRow > div:first-child span {
          display: block;
          margin-top: 5px;
        }

        .captain {
          padding: 4px 7px;
          border-radius: 999px;
          background: #7c3aed;
          color: white !important;
        }

        .rulesPanel p {
          color: #cbd5e1;
          line-height: 1.6;
        }

        .teamGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 28px;
        }

        .teamCard {
          padding: 26px;
        }

        .teamCard p {
          color: #cbd5e1;
        }

        .teamCard button {
          margin-top: 12px;
          color: white;
        }

        .texas button {
          background: #2563eb;
        }

        .florida button {
          background: #dc2626;
        }

        @media (max-width: 900px) {
          .heroGrid,
          .broadcastLayout {
            grid-template-columns: 1fr;
          }

          .roomStats {
            grid-template-columns: repeat(2, 1fr);
          }

          .roomSidebar {
            min-height: auto;
          }
        }

        @media (max-width: 620px) {
          .matchupCard {
            grid-template-columns: 1fr;
          }

          .versus {
            text-align: center;
          }

          .roomStats,
          .teamGrid {
            grid-template-columns: 1fr;
          }

          .broadcastTop {
            flex-direction: column;
          }

          .videoPlaceholder {
            min-height: 320px;
          }
        }
      `}</style>
    </>
  )
}
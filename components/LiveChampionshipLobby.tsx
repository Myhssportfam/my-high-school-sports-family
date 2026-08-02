import { useMemo, useState } from 'react'

type LiveMatch = {
  id: string
  game: string
  homeState: string
  awayState: string
  homePlayer: string
  awayPlayer: string
  viewers: number
  status: 'LIVE' | 'OPEN' | 'STARTING'
  streamPlatform: string
  score: string
}

const liveMatches: LiveMatch[] = [
  {
    id: 'college-football-colorado-texas',
    game: 'EA Sports College Football 27',
    homeState: 'Colorado',
    awayState: 'Texas',
    homePlayer: 'MileHighQB',
    awayPlayer: 'LoneStarQB',
    viewers: 1248,
    status: 'LIVE',
    streamPlatform: 'Twitch',
    score: '21 - 17',
  },
  {
    id: 'madden-ohio-michigan',
    game: 'Madden NFL',
    homeState: 'Ohio',
    awayState: 'Michigan',
    homePlayer: 'BuckeyeKing',
    awayPlayer: 'WolverineElite',
    viewers: 692,
    status: 'OPEN',
    streamPlatform: 'YouTube Live',
    score: 'Waiting',
  },
  {
    id: 'nba2k-california-arizona',
    game: 'NBA 2K',
    homeState: 'California',
    awayState: 'Arizona',
    homePlayer: 'WestCoastBuckets',
    awayPlayer: 'DesertHandles',
    viewers: 531,
    status: 'STARTING',
    streamPlatform: 'Twitch',
    score: '0 - 0',
  },
  {
    id: 'mlb-georgia-florida',
    game: 'MLB The Show',
    homeState: 'Georgia',
    awayState: 'Florida',
    homePlayer: 'PeachStateSlugger',
    awayPlayer: 'SunshineAce',
    viewers: 403,
    status: 'LIVE',
    streamPlatform: 'Kick',
    score: '4 - 3',
  },
]

const gameFilters = [
  'All Games',
  'EA Sports College Football 27',
  'Madden NFL',
  'NBA 2K',
  'MLB The Show',
]

export default function LiveChampionshipLobby() {
  const [selectedGame, setSelectedGame] = useState('All Games')

  const filteredMatches = useMemo(() => {
    if (selectedGame === 'All Games') {
      return liveMatches
    }

    return liveMatches.filter((match) => match.game === selectedGame)
  }, [selectedGame])

  const totalViewers = liveMatches.reduce(
    (total, match) => total + match.viewers,
    0
  )

  return (
    <section className="liveChampionshipSection">
      <div className="liveChampionshipHeader">
        <div>
          <p className="liveChampionshipEyebrow">
            Live Championship Lobby
          </p>

          <h2>Watch live state rivalries</h2>

          <p className="liveChampionshipDescription">
            Join open rooms, watch live streams, follow scores, and support
            players representing their states.
          </p>
        </div>

        <div className="liveChampionshipStats">
          <div>
            <strong>{liveMatches.length}</strong>
            <span>Active matches</span>
          </div>

          <div>
            <strong>{totalViewers.toLocaleString()}</strong>
            <span>Watching now</span>
          </div>
        </div>
      </div>

      <div className="liveGameFilters">
        {gameFilters.map((game) => (
          <button
            key={game}
            type="button"
            className={selectedGame === game ? 'activeFilter' : ''}
            onClick={() => setSelectedGame(game)}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="liveMatchGrid">
        {filteredMatches.map((match) => (
          <article key={match.id} className="liveMatchCard">
            <div className="liveMatchTop">
              <span className={`matchStatus ${match.status.toLowerCase()}`}>
                {match.status}
              </span>

              <span className="streamPlatform">
                {match.streamPlatform}
              </span>
            </div>

            <p className="matchGame">{match.game}</p>

            <div className="stateMatchup">
              <div>
                <strong>{match.homeState}</strong>
                <span>{match.homePlayer}</span>
              </div>

              <div className="versusBlock">
                <span>{match.score}</span>
                <small>VS</small>
              </div>

              <div>
                <strong>{match.awayState}</strong>
                <span>{match.awayPlayer}</span>
              </div>
            </div>

            <div className="matchFooter">
              <span>{match.viewers.toLocaleString()} watching</span>

              <div>
                <button type="button" className="secondaryMatchButton">
                  View Room
                </button>

                <button type="button" className="primaryMatchButton">
                  {match.status === 'OPEN' ? 'Join Match' : 'Watch Live'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .liveChampionshipSection {
          margin-top: 48px;
          padding: 42px;
          border-radius: 28px;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.3),
              transparent 38%
            ),
            linear-gradient(135deg, #071225, #101d3e 55%, #25122f);
          color: white;
        }

        .liveChampionshipHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
        }

        .liveChampionshipEyebrow {
          margin: 0 0 10px;
          color: #fb7185;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1;
        }

        .liveChampionshipDescription {
          max-width: 680px;
          margin: 18px 0 0;
          color: #cbd5e1;
          font-size: 16px;
          line-height: 1.7;
        }

        .liveChampionshipStats {
          display: flex;
          gap: 14px;
        }

        .liveChampionshipStats div {
          min-width: 140px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.06);
        }

        .liveChampionshipStats strong,
        .liveChampionshipStats span {
          display: block;
        }

        .liveChampionshipStats strong {
          font-size: 25px;
        }

        .liveChampionshipStats span {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 12px;
        }

        .liveGameFilters {
          display: flex;
          gap: 10px;
          margin-top: 32px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .liveGameFilters button {
          flex: 0 0 auto;
          padding: 11px 15px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          cursor: pointer;
        }

        .liveGameFilters button.activeFilter {
          border-color: #fb7185;
          background: #fb7185;
          color: #111827;
          font-weight: 800;
        }

        .liveMatchGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .liveMatchCard {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          background: rgba(8, 17, 39, 0.76);
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.25);
        }

        .liveMatchTop,
        .matchFooter,
        .stateMatchup {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .matchStatus,
        .streamPlatform {
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .matchStatus.live {
          background: #ef4444;
        }

        .matchStatus.open {
          background: #34d399;
          color: #052e24;
        }

        .matchStatus.starting {
          background: #f59e0b;
          color: #422006;
        }

        .streamPlatform {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
        }

        .matchGame {
          margin: 20px 0;
          color: #93c5fd;
          font-weight: 800;
        }

        .stateMatchup {
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stateMatchup > div:first-child,
        .stateMatchup > div:last-child {
          width: 34%;
        }

        .stateMatchup > div:last-child {
          text-align: right;
        }

        .stateMatchup strong,
        .stateMatchup span {
          display: block;
        }

        .stateMatchup strong {
          font-size: 19px;
        }

        .stateMatchup span {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 13px;
        }

        .versusBlock {
          text-align: center;
        }

        .versusBlock span {
          color: white;
          font-size: 18px;
          font-weight: 900;
        }

        .versusBlock small {
          display: block;
          margin-top: 4px;
          color: #64748b;
        }

        .matchFooter {
          margin-top: 18px;
        }

        .matchFooter > span {
          color: #94a3b8;
          font-size: 13px;
        }

        .matchFooter > div {
          display: flex;
          gap: 9px;
        }

        .primaryMatchButton,
        .secondaryMatchButton {
          padding: 10px 13px;
          border-radius: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .secondaryMatchButton {
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: transparent;
          color: white;
        }

        .primaryMatchButton {
          border: none;
          background: linear-gradient(135deg, #2563eb, #fb7185);
          color: white;
        }

        @media (max-width: 850px) {
          .liveChampionshipSection {
            padding: 26px 18px;
          }

          .liveChampionshipHeader {
            flex-direction: column;
          }

          .liveChampionshipStats {
            width: 100%;
          }

          .liveChampionshipStats div {
            flex: 1;
            min-width: 0;
          }

          .liveMatchGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .stateMatchup {
            align-items: stretch;
          }

          .matchFooter {
            align-items: flex-start;
            flex-direction: column;
          }

          .matchFooter > div {
            width: 100%;
          }

          .primaryMatchButton,
          .secondaryMatchButton {
            flex: 1;
          }
        }
      `}</style>
    </section>
  )
}
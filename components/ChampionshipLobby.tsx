import Link from 'next/link'

type ChampionshipLobbyProps = {
  onCreateRoom: () => void
}
const championshipRooms = [
  {
    title: 'College Football 27 Dynasty',
    game: 'EA Sports College Football',
    matchup: 'Colorado vs Texas',
    players: '12 / 32',
    viewers: '1,248',
    status: 'LIVE',
    icon: '🏈',
    href: '/arena/dynasty-room',
  },
  {
    title: 'Road to Glory State Clash',
    game: 'EA Sports College Football',
    matchup: 'Florida vs Georgia',
    players: '8 / 16',
    viewers: '864',
    status: 'LIVE',
    icon: '⭐',
    href: '/arena/dynasty-room',
  },
  {
    title: 'Madden State Championship',
    game: 'Madden NFL',
    matchup: 'Ohio vs Michigan',
    players: '18 / 24',
    viewers: '692',
    status: 'OPEN',
    icon: '🏟️',
    href: '/arena',
  },
  {
    title: 'NBA 2K State Runs',
    game: 'NBA 2K',
    matchup: 'California vs Arizona',
    players: '20 / 30',
    viewers: '531',
    status: 'OPEN',
    icon: '🏀',
    href: '/arena',
  },
  {
    title: 'Diamond Dynasty Room',
    game: 'MLB The Show',
    matchup: 'New York vs Colorado',
    players: '10 / 20',
    viewers: '388',
    status: 'LIVE',
    icon: '⚾',
    href: '/arena',
  },
  {
    title: 'EA Sports FC Club Battle',
    game: 'EA Sports FC',
    matchup: 'Texas vs California',
    players: '14 / 22',
    viewers: '447',
    status: 'OPEN',
    icon: '⚽',
    href: '/arena',
  },
]

const rankings = [
  { rank: 1, state: 'Texas', points: '18,240 pts' },
  { rank: 2, state: 'Florida', points: '16,880 pts' },
  { rank: 3, state: 'California', points: '15,910 pts' },
  { rank: 4, state: 'Colorado', points: '14,420 pts' },
]

export default function ChampionshipLobby({
  onCreateRoom,
}: ChampionshipLobbyProps) {
  return (
  <section className="championshipLobby">
    
      <div className="championshipInner">
        <div className="championshipHeader">
          <div>
            <p className="championshipEyebrow">
              National Championship Lobby
            </p>

            <h2>
              Join a room. Watch a rivalry. Represent your state.
            </h2>

            <p className="championshipDescription">
              Challenge players from across the country, enter state battles,
              watch live matches, and climb the national arena rankings.
            </p>
          </div>

          <button
  type="button"
  className="createChampionshipRoom"
  onClick={onCreateRoom}
>
            + Create Room
          </button>
        </div>

        <div className="championshipRoomGrid">
          {championshipRooms.map((room) => (
            <article className="championshipRoomCard" key={room.title}>
              <div className="roomCardTop">
                <div className="roomIcon">{room.icon}</div>

                <span
                  className={
                    room.status === 'LIVE'
                      ? 'roomStatus liveStatus'
                      : 'roomStatus openStatus'
                  }
                >
                  {room.status}
                </span>

                <h3>{room.title}</h3>
                <p>{room.game}</p>
              </div>

              <div className="roomCardBody">
                <div className="featuredMatchup">
                  <span>Featured Matchup</span>
                  <strong>{room.matchup}</strong>
                </div>

                <div className="roomStats">
                  <div>
                    <span>Players</span>
                    <strong>{room.players}</strong>
                  </div>

                  <div>
                    <span>Watching</span>
                    <strong>{room.viewers}</strong>
                  </div>
                </div>

                <div className="roomActions">
                  <Link href={room.href} className="joinRoomButton">
                    Join Room
                  </Link>

                  <button type="button" className="watchRoomButton">
                    Watch Live
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="championshipBottomGrid">
          <article className="championshipPanel">
            <p className="panelEyebrow redText">State Rankings</p>
            <h3>Top Arena States</h3>

            <div className="rankingList">
              {rankings.map((item) => (
                <div className="rankingRow" key={item.state}>
                  <div>
                    <span className="rankNumber">{item.rank}</span>
                    <strong>{item.state}</strong>
                  </div>

                  <span>{item.points}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="championshipPanel">
            <p className="panelEyebrow blueText">Upcoming Battle</p>
            <h3>Colorado vs Texas</h3>

            <p className="panelDescription">
              College Football 27 State Championship qualifier.
            </p>

            <div className="countdownBox">
              <span>Starts in</span>
              <strong>01:42:18</strong>
            </div>

            <button type="button" className="panelPrimaryButton">
              Set Reminder
            </button>
          </article>

          <article className="championshipPanel">
            <p className="panelEyebrow greenText">Arena Season</p>
            <h3>Season One</h3>

            <p className="panelDescription">
              Earn points in rooms, climb the leaderboard, and qualify for the
              national championship.
            </p>

            <div className="seasonProgressHeader">
              <span>Season progress</span>
              <span>62%</span>
            </div>

            <div className="seasonProgressTrack">
              <div className="seasonProgressFill" />
            </div>

            <button type="button" className="panelSecondaryButton">
              View Season Details
            </button>
          </article>
        </div>
      </div>

      <style jsx>{`
        .championshipLobby {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.2), transparent 35%),
            radial-gradient(circle at bottom right, rgba(220, 38, 38, 0.18), transparent 35%),
            #020617;
          color: white;
          padding: 72px 24px;
        }

        .championshipInner {
          max-width: 1240px;
          margin: 0 auto;
        }

        .championshipHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .championshipEyebrow,
        .panelEyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 12px;
          font-weight: 900;
        }

        .championshipEyebrow,
        .redText {
          color: #f87171;
        }

        .blueText {
          color: #60a5fa;
        }

        .greenText {
          color: #34d399;
        }

        .championshipHeader h2 {
          max-width: 850px;
          margin: 14px 0 0;
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1.05;
        }

        .championshipDescription,
        .panelDescription {
          color: #cbd5e1;
          line-height: 1.7;
        }

        .championshipDescription {
          max-width: 760px;
          margin: 18px 0 0;
        }

        .createChampionshipRoom,
        .panelPrimaryButton,
        .panelSecondaryButton,
        .watchRoomButton {
          cursor: pointer;
          font: inherit;
          font-weight: 800;
        }

        .createChampionshipRoom {
          flex: 0 0 auto;
          border: 0;
          border-radius: 16px;
          background: #dc2626;
          color: white;
          padding: 15px 22px;
        }

        .championshipRoomGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 42px;
        }

        .championshipRoomCard,
        .championshipPanel {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
        }

        .championshipRoomCard {
          overflow: hidden;
          border-radius: 28px;
        }

        .roomCardTop {
          position: relative;
          padding: 26px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.5),
              rgba(15, 23, 42, 0.95),
              rgba(185, 28, 28, 0.35)
            );
        }

        .roomIcon {
          display: flex;
          width: 58px;
          height: 58px;
          align-items: center;
          justify-content: center;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 30px;
        }

        .roomStatus {
          position: absolute;
          top: 26px;
          right: 26px;
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 11px;
          font-weight: 900;
        }

        .liveStatus {
          background: #dc2626;
        }

        .openStatus {
          background: #34d399;
          color: #052e16;
        }

        .roomCardTop h3 {
          margin: 24px 0 7px;
          font-size: 23px;
        }

        .roomCardTop p {
          margin: 0;
          color: #bfdbfe;
          font-size: 14px;
          font-weight: 700;
        }

        .roomCardBody {
          padding: 24px;
        }

        .featuredMatchup {
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.22);
          padding: 16px;
          text-align: center;
        }

        .featuredMatchup span,
        .roomStats span,
        .countdownBox span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
        }

        .featuredMatchup strong {
          display: block;
          margin-top: 7px;
          font-size: 17px;
        }

        .roomStats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .roomStats div {
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          padding: 14px;
        }

        .roomStats strong {
          display: block;
          margin-top: 5px;
        }

        .roomActions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .joinRoomButton,
        .watchRoomButton {
          border-radius: 13px;
          padding: 13px;
          text-align: center;
          text-decoration: none;
        }

        .joinRoomButton {
          background: white;
          color: #020617;
          font-weight: 900;
        }

        .watchRoomButton {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: transparent;
          color: white;
        }

        .championshipBottomGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 28px;
        }

        .championshipPanel {
          border-radius: 26px;
          padding: 26px;
        }

        .championshipPanel h3 {
          margin: 10px 0 0;
          font-size: 25px;
        }

        .rankingList {
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }

        .rankingRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 14px;
        }

        .rankingRow > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rankingRow > span {
          color: #cbd5e1;
          font-size: 13px;
        }

        .rankNumber {
          display: flex;
          width: 31px;
          height: 31px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 900;
        }

        .countdownBox {
          margin-top: 22px;
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.22);
          padding: 20px;
          text-align: center;
        }

        .countdownBox strong {
          display: block;
          margin-top: 7px;
          font-size: 34px;
        }

        .panelPrimaryButton,
        .panelSecondaryButton {
          width: 100%;
          margin-top: 20px;
          border-radius: 13px;
          padding: 13px;
          color: white;
        }

        .panelPrimaryButton {
          border: 0;
          background: #2563eb;
        }

        .panelSecondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: transparent;
        }

        .seasonProgressHeader {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          font-size: 13px;
        }

        .seasonProgressTrack {
          height: 11px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
        }

        .seasonProgressFill {
          width: 62%;
          height: 100%;
          border-radius: inherit;
          background: #10b981;
        }

        @media (max-width: 980px) {
          .championshipRoomGrid,
          .championshipBottomGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .championshipHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .championshipLobby {
            padding: 56px 16px;
          }

          .championshipRoomGrid,
          .championshipBottomGrid {
            grid-template-columns: 1fr;
          }

          .createChampionshipRoom {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
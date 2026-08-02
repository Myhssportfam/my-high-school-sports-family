import { useRouter } from "next/router";

const games = [
  {
    sportIcon: "🏈",
    state: "TEXAS",
    status: "2ND QUARTER",
    matchup: "North Shore vs. Westfield",
    score: "14 – 10",
    viewers: "2.4K watching",
    sport: "Football",
  },
  {
    sportIcon: "🏀",
    state: "FLORIDA",
    status: "HALFTIME",
    matchup: "Central vs. Lakewood",
    score: "38 – 35",
    viewers: "1.8K watching",
    sport: "Basketball",
  },
  {
    sportIcon: "⚾",
    state: "COLORADO",
    status: "TOP 5TH",
    matchup: "Pueblo East vs. Central",
    score: "4 – 3",
    viewers: "980 watching",
    sport: "Baseball",
  },
  {
    sportIcon: "🏐",
    state: "CALIFORNIA",
    status: "1ST SET",
    matchup: "Mater Dei vs. Sierra Canyon",
    score: "0 – 0",
    viewers: "1.2K watching",
    sport: "Volleyball",
  },
];

export default function LiveGamesPanel() {
  const router = useRouter();

  return (
    <aside className="panel">
      <div className="panelHeader">
        <div className="liveTitle">
          <span className="liveDot" />
          LIVE NOW
        </div>

        <button type="button" onClick={() => router.push("/live")}>
          View All
        </button>
      </div>

      <div className="gameList">
        {games.map((game) => (
          <button
            type="button"
            className="gameCard"
            key={`${game.state}-${game.matchup}`}
            onClick={() => router.push("/live")}
          >
            <div className="sportIcon">{game.sportIcon}</div>

            <div className="gameInfo">
              <div className="gameMeta">
                {game.state} · {game.status}
              </div>

              <div className="matchup">{game.matchup}</div>

              <div className="viewers">◉ {game.viewers}</div>
            </div>

            <div className="gameRight">
              <div className="score">{game.score}</div>
              <div className="sportName">{game.sport}</div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="openLiveButton"
        onClick={() => router.push("/live")}
      >
        Open Live Center
        <span>◉</span>
      </button>

      <style jsx>{`
        .panel {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 15px;
          overflow: hidden;
          background: rgba(5, 18, 32, 0.92);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(14px);
        }

        .panelHeader {
          min-height: 50px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .liveTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 14px;
          font-weight: 900;
        }

        .liveDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ef233c;
          box-shadow: 0 0 12px rgba(239, 35, 60, 0.85);
          animation: pulse 1.4s infinite;
        }

        .panelHeader button {
          border: 0;
          color: #cbd5e1;
          background: transparent;
          font-size: 12px;
          cursor: pointer;
        }

        .panelHeader button:hover {
          color: white;
        }

        .gameList {
          padding: 0 14px;
        }

        .gameCard {
          width: 100%;
          min-height: 96px;
          padding: 14px 0;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          color: white;
          text-align: left;
          background: transparent;
          cursor: pointer;
        }

        .gameCard:hover .matchup {
          color: #60a5fa;
        }

        .sportIcon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.08);
          font-size: 25px;
        }

        .gameInfo {
          min-width: 0;
        }

        .gameMeta {
          margin-bottom: 5px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .matchup {
          overflow: hidden;
          color: #f8fafc;
          font-size: 14px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .viewers {
          margin-top: 9px;
          color: #cbd5e1;
          font-size: 11px;
        }

        .gameRight {
          min-width: 76px;
          text-align: right;
        }

        .score {
          color: white;
          font-size: 20px;
          font-weight: 900;
          white-space: nowrap;
        }

        .sportName {
          margin-top: 10px;
          color: #fb923c;
          font-size: 11px;
        }

        .gameCard:nth-child(3) .sportName {
          color: #38bdf8;
        }

        .gameCard:nth-child(4) .sportName {
          color: #d946ef;
        }

        .openLiveButton {
          width: calc(100% - 28px);
          min-height: 46px;
          margin: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: white;
          background: #14243a;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .openLiveButton:hover {
          background: #1d314d;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.45;
            transform: scale(0.82);
          }
        }
      `}</style>
    </aside>
  );
}
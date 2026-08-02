import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

type StateActivity = {
  id: string
  name: string
  abbreviation: string
  playersOnline: number
  liveRooms: number
  topGame: string
  topPlayer: string
  rank: number
  x: number
  y: number
}

const states: StateActivity[] = [
  {
    id: 'wa',
    name: 'Washington',
    abbreviation: 'WA',
    playersOnline: 148,
    liveRooms: 12,
    topGame: 'Madden NFL',
    topPlayer: 'NorthwestKing',
    rank: 12,
    x: 90,
    y: 58,
  },
  {
    id: 'ca',
    name: 'California',
    abbreviation: 'CA',
    playersOnline: 391,
    liveRooms: 37,
    topGame: 'NBA 2K',
    topPlayer: 'WestCoastBuckets',
    rank: 2,
    x: 82,
    y: 185,
  },
  {
    id: 'az',
    name: 'Arizona',
    abbreviation: 'AZ',
    playersOnline: 174,
    liveRooms: 15,
    topGame: 'NBA 2K',
    topPlayer: 'DesertHandles',
    rank: 10,
    x: 160,
    y: 238,
  },
  {
    id: 'co',
    name: 'Colorado',
    abbreviation: 'CO',
    playersOnline: 187,
    liveRooms: 19,
    topGame: 'EA Sports College Football 27',
    topPlayer: 'MileHighQB',
    rank: 7,
    x: 255,
    y: 178,
  },
  {
    id: 'tx',
    name: 'Texas',
    abbreviation: 'TX',
    playersOnline: 482,
    liveRooms: 44,
    topGame: 'EA Sports College Football 27',
    topPlayer: 'LoneStarQB',
    rank: 1,
    x: 315,
    y: 285,
  },
  {
    id: 'mn',
    name: 'Minnesota',
    abbreviation: 'MN',
    playersOnline: 132,
    liveRooms: 11,
    topGame: 'NHL',
    topPlayer: 'NorthStarGamer',
    rank: 15,
    x: 410,
    y: 95,
  },
  {
    id: 'mi',
    name: 'Michigan',
    abbreviation: 'MI',
    playersOnline: 236,
    liveRooms: 22,
    topGame: 'Madden NFL',
    topPlayer: 'WolverineElite',
    rank: 6,
    x: 515,
    y: 125,
  },
  {
    id: 'oh',
    name: 'Ohio',
    abbreviation: 'OH',
    playersOnline: 255,
    liveRooms: 24,
    topGame: 'Madden NFL',
    topPlayer: 'BuckeyeKing',
    rank: 5,
    x: 552,
    y: 160,
  },
  {
    id: 'ga',
    name: 'Georgia',
    abbreviation: 'GA',
    playersOnline: 312,
    liveRooms: 29,
    topGame: 'MLB The Show',
    topPlayer: 'PeachStateSlugger',
    rank: 4,
    x: 565,
    y: 270,
  },
  {
    id: 'fl',
    name: 'Florida',
    abbreviation: 'FL',
    playersOnline: 355,
    liveRooms: 34,
    topGame: 'EA Sports College Football 27',
    topPlayer: 'SunshineAce',
    rank: 3,
    x: 620,
    y: 330,
  },
  {
    id: 'ny',
    name: 'New York',
    abbreviation: 'NY',
    playersOnline: 221,
    liveRooms: 20,
    topGame: 'NBA 2K',
    topPlayer: 'EmpireBuckets',
    rank: 8,
    x: 665,
    y: 105,
  },
  {
    id: 'pa',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    playersOnline: 203,
    liveRooms: 18,
    topGame: 'Madden NFL',
    topPlayer: 'KeystoneKing',
    rank: 9,
    x: 635,
    y: 155,
  },
]

const stateShapes = [
  'M38 34 L112 28 L118 82 L53 91 Z',
  'M43 96 L105 91 L123 174 L94 245 L66 218 L58 150 Z',
  'M112 92 L183 91 L187 158 L126 170 Z',
  'M124 176 L191 165 L208 228 L158 253 L110 220 Z',
  'M191 86 L260 84 L267 149 L196 158 Z',
  'M198 163 L273 157 L280 225 L211 231 Z',
  'M214 237 L302 230 L342 326 L278 348 L231 284 Z',
  'M274 79 L345 72 L351 137 L279 144 Z',
  'M286 149 L358 145 L362 211 L286 219 Z',
  'M350 67 L419 61 L427 128 L357 136 Z',
  'M369 141 L438 135 L444 199 L371 207 Z',
  'M367 215 L441 205 L450 272 L379 280 Z',
  'M351 283 L451 279 L482 341 L402 350 Z',
  'M432 59 L490 66 L497 131 L438 127 Z',
  'M449 137 L510 137 L513 198 L455 199 Z',
  'M458 209 L523 203 L530 263 L465 270 Z',
  'M465 278 L532 270 L548 326 L487 340 Z',
  'M501 68 L559 77 L558 132 L503 128 Z',
  'M521 139 L580 140 L578 194 L519 195 Z',
  'M536 203 L594 198 L601 251 L540 259 Z',
  'M549 266 L608 257 L629 316 L574 326 Z',
  'M570 79 L620 88 L615 134 L566 131 Z',
  'M589 143 L637 148 L632 191 L586 190 Z',
  'M607 199 L653 202 L652 245 L608 247 Z',
  'M623 255 L663 249 L688 300 L650 316 Z',
  'M628 90 L680 91 L675 130 L623 133 Z',
  'M644 143 L695 140 L693 182 L641 189 Z',
  'M665 194 L714 188 L718 226 L665 238 Z',
]

export default function InteractiveUSMap() {
  const router = useRouter()
  const [selectedStateId, setSelectedStateId] = useState('tx')
  const [search, setSearch] = useState('')

  const selectedState =
    states.find((state) => state.id === selectedStateId) ?? states[0]

  const searchedStates = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return states
    }

    return states.filter(
      (state) =>
        state.name.toLowerCase().includes(query) ||
        state.abbreviation.toLowerCase().includes(query) ||
        state.topPlayer.toLowerCase().includes(query) ||
        state.topGame.toLowerCase().includes(query)
    )
  }, [search])

  const totalPlayers = states.reduce(
    (total, state) => total + state.playersOnline,
    0
  )

  const totalRooms = states.reduce(
    (total, state) => total + state.liveRooms,
    0
  )

  function getActivityClass(playersOnline: number) {
    if (playersOnline >= 350) return 'activityHot'
    if (playersOnline >= 225) return 'activityHigh'
    if (playersOnline >= 150) return 'activityMedium'
    return 'activityLow'
  }

  return (
    <section className="arenaMapSection">
      <div className="mapHeader">
        <div>
          <p className="mapEyebrow">Interactive Arena Map</p>

          <h2>See who is playing across America</h2>

          <p className="mapDescription">
            Select a state to view live rooms, online players, top-ranked
            gamers, and current state rivalries.
          </p>
        </div>

        <div className="mapStats">
          <div>
            <strong>{totalPlayers.toLocaleString()}</strong>
            <span>Players online</span>
          </div>

          <div>
            <strong>{totalRooms}</strong>
            <span>Live rooms</span>
          </div>
        </div>
      </div>

      <div className="mapSearchRow">
        <input
          type="search"
          value={search}
          placeholder="Search state, player, or game"
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="mapLegend">
          <span>
            <i className="legendLow" />
            Active
          </span>

          <span>
            <i className="legendMedium" />
            Busy
          </span>

          <span>
            <i className="legendHot" />
            Hot
          </span>
        </div>
      </div>

      <div className="mapLayout">
        <div className="mapCanvas">
          <svg
            viewBox="0 0 760 390"
            role="img"
            aria-label="Interactive United States gaming activity map"
          >
            <defs>
              <linearGradient id="mapBackground" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#102448" />
                <stop offset="100%" stopColor="#26152f" />
              </linearGradient>
            </defs>

            <rect
              x="0"
              y="0"
              width="760"
              height="390"
              rx="28"
              fill="url(#mapBackground)"
            />

            {stateShapes.map((shape, index) => (
              <path
                key={shape}
                d={shape}
                className="stateShape"
                opacity={0.35 + (index % 4) * 0.1}
              />
            ))}

            {states.map((state) => (
              <g
                key={state.id}
                className={`stateMarker ${
                  selectedState.id === state.id ? 'selectedMarker' : ''
                }`}
                onClick={() => {
  setSelectedStateId(state.id)
  router.push(`/states/${state.id}`)
}}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setSelectedStateId(state.id)
                    router.push(`/states/${state.id}`)
                  }
                }}
                aria-label={`Select ${state.name}`}
              >
                <circle
                  cx={state.x}
                  cy={state.y}
                  r={selectedState.id === state.id ? 23 : 18}
                  className={getActivityClass(state.playersOnline)}
                />

                <text
                  x={state.x}
                  y={state.y + 4}
                  textAnchor="middle"
                  className="stateLabel"
                >
                  {state.abbreviation}
                </text>

                <circle
                  cx={state.x + 14}
                  cy={state.y - 14}
                  r="5"
                  className="onlineDot"
                />
              </g>
            ))}
          </svg>
        </div>

        <aside className="stateActivityPanel">
          <div className="selectedStateTop">
            <div>
              <span className="selectedStateRank">
                National rank #{selectedState.rank}
              </span>

              <h3>{selectedState.name}</h3>

              <p>{selectedState.abbreviation} Arena Family</p>
            </div>

            <div className="stateInitial">
              {selectedState.abbreviation}
            </div>
          </div>

          <div className="selectedStateMetrics">
            <div>
              <strong>{selectedState.playersOnline}</strong>
              <span>Online now</span>
            </div>

            <div>
              <strong>{selectedState.liveRooms}</strong>
              <span>Live rooms</span>
            </div>
          </div>

          <div className="stateDetail">
            <span>Top game</span>
            <strong>{selectedState.topGame}</strong>
          </div>

          <div className="stateDetail">
            <span>Top-ranked player</span>
            <strong>{selectedState.topPlayer}</strong>
          </div>

          <div className="stateRivalry">
            <span>Featured rivalry</span>
            <strong>
              {selectedState.name} vs{' '}
              {selectedState.id === 'tx' ? 'Florida' : 'Texas'}
            </strong>
            <small>State Championship Series</small>
          </div>

          <div className="statePanelButtons">
            <button
              type="button"
              className="openStateButton"
              onClick={() => router.push(`/states/${selectedState.id}`)}
            >
              Open State Page
            </button>

            <div className="statePanelButtons">
  <button
    type="button"
    className="openStateButton"
    onClick={() => router.push(`/states/${selectedState.id}`)}
  >
    Open State Page
  </button>

  <button
    type="button"
    className="viewRoomsButton"
    onClick={() =>
      router.push(
        `/arena?state=${selectedState.id}#live-championships`
      )
    }
  >
    View Live Rooms
  </button>
</div>
</div>
        </aside>
      </div>

      {search && (
        <div className="stateSearchResults">
          <p>Search results</p>

          <div>
            {searchedStates.length > 0 ? (
              searchedStates.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => {
                    setSelectedStateId(state.id)
                    setSearch('')
                  }}
                >
                  <span>{state.abbreviation}</span>

                  <div>
                    <strong>{state.name}</strong>
                    <small>
                      {state.playersOnline} online · {state.liveRooms} rooms
                    </small>
                  </div>
                </button>
              ))
            ) : (
              <span className="noStatesFound">No states found.</span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .arenaMapSection {
          margin-top: 48px;
          padding: 42px;
          border-radius: 28px;
          background: #071225;
          color: white;
        }

        .mapHeader {
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .mapEyebrow {
          margin: 0 0 10px;
          color: #fb7185;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          max-width: 720px;
          font-size: clamp(34px, 5vw, 54px);
          line-height: 1.05;
        }

        .mapDescription {
          max-width: 680px;
          margin: 17px 0 0;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .mapStats {
          display: flex;
          gap: 12px;
        }

        .mapStats div {
          min-width: 135px;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
        }

        .mapStats strong,
        .mapStats span {
          display: block;
        }

        .mapStats strong {
          font-size: 25px;
        }

        .mapStats span {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 12px;
        }

        .mapSearchRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 28px;
        }

        .mapSearchRow input {
          width: min(440px, 100%);
          padding: 13px 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 13px;
          outline: none;
          background: rgba(255, 255, 255, 0.07);
          color: white;
        }

        .mapSearchRow input::placeholder {
          color: #94a3b8;
        }

        .mapSearchRow input:focus {
          border-color: #60a5fa;
        }

        .mapLegend {
          display: flex;
          gap: 14px;
          color: #cbd5e1;
          font-size: 12px;
        }

        .mapLegend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mapLegend i {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }

        .legendLow {
          background: #38bdf8;
        }

        .legendMedium {
          background: #a78bfa;
        }

        .legendHot {
          background: #fb7185;
        }

        .mapLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(285px, 0.7fr);
          gap: 22px;
          margin-top: 22px;
        }

        .mapCanvas {
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          overflow: hidden;
        }

        svg {
          display: block;
          width: 100%;
          height: auto;
        }

        .stateShape {
          fill: rgba(255, 255, 255, 0.08);
          stroke: rgba(255, 255, 255, 0.2);
          stroke-width: 2;
        }

        .stateMarker {
          cursor: pointer;
          outline: none;
        }

        .stateMarker circle:first-of-type {
          stroke: rgba(255, 255, 255, 0.85);
          stroke-width: 2;
          transition:
            r 160ms ease,
            opacity 160ms ease;
        }

        .stateMarker:hover circle:first-of-type,
        .stateMarker:focus circle:first-of-type {
          opacity: 1;
          stroke-width: 4;
        }

        .activityLow {
          fill: #0284c7;
          opacity: 0.75;
        }

        .activityMedium {
          fill: #7c3aed;
          opacity: 0.82;
        }

        .activityHigh {
          fill: #db2777;
          opacity: 0.88;
        }

        .activityHot {
          fill: #f97316;
          opacity: 0.95;
        }

        .selectedMarker circle:first-of-type {
          stroke: white;
          stroke-width: 5;
        }

        .stateLabel {
          fill: white;
          font-size: 11px;
          font-weight: 900;
          pointer-events: none;
        }

        .onlineDot {
          fill: #34d399;
          stroke: #052e24;
          stroke-width: 2;
          pointer-events: none;
        }

        .stateActivityPanel {
          padding: 23px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.06);
        }

        .selectedStateTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .selectedStateRank {
          display: inline-block;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(251, 113, 133, 0.16);
          color: #fda4af;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        h3 {
          margin: 16px 0 0;
          font-size: 30px;
        }

        .selectedStateTop p {
          margin: 5px 0 0;
          color: #94a3b8;
        }

        .stateInitial {
          display: grid;
          width: 58px;
          height: 58px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 18px;
          background: linear-gradient(135deg, #2563eb, #fb7185);
          font-weight: 900;
        }

        .selectedStateMetrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .selectedStateMetrics div {
          padding: 15px;
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.22);
        }

        .selectedStateMetrics strong,
        .selectedStateMetrics span {
          display: block;
        }

        .selectedStateMetrics strong {
          font-size: 22px;
        }

        .selectedStateMetrics span {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 12px;
        }

        .stateDetail,
        .stateRivalry {
          margin-top: 12px;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 15px;
        }

        .stateDetail span,
        .stateDetail strong,
        .stateRivalry span,
        .stateRivalry strong,
        .stateRivalry small {
          display: block;
        }

        .stateDetail span,
        .stateRivalry span {
          color: #94a3b8;
          font-size: 12px;
        }

        .stateDetail strong,
        .stateRivalry strong {
          margin-top: 6px;
        }

        .stateRivalry {
          background: rgba(37, 99, 235, 0.11);
        }

        .stateRivalry small {
          margin-top: 5px;
          color: #93c5fd;
        }

        .statePanelButtons {
          display: grid;
          gap: 9px;
          margin-top: 17px;
        }

        .statePanelButtons button {
          padding: 12px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .openStateButton {
          border: none;
          background: linear-gradient(135deg, #2563eb, #fb7185);
          color: white;
        }

        .viewRoomsButton {
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: transparent;
          color: white;
        }

        .stateSearchResults {
          margin-top: 16px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
        }

        .stateSearchResults > p {
          margin: 0 0 12px;
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
        }

        .stateSearchResults > div {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .stateSearchResults button {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.18);
          color: white;
          text-align: left;
          cursor: pointer;
        }

        .stateSearchResults button > span {
          display: grid;
          width: 39px;
          height: 39px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.35);
          font-weight: 900;
        }

        .stateSearchResults strong,
        .stateSearchResults small {
          display: block;
        }

        .stateSearchResults small {
          margin-top: 3px;
          color: #94a3b8;
        }

        .noStatesFound {
          color: #94a3b8;
        }

        @media (max-width: 920px) {
          .arenaMapSection {
            padding: 28px 18px;
          }

          .mapHeader {
            flex-direction: column;
          }

          .mapLayout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .mapStats {
            width: 100%;
          }

          .mapStats div {
            flex: 1;
            min-width: 0;
          }

          .mapSearchRow {
            align-items: flex-start;
            flex-direction: column;
          }

          .mapLegend {
            flex-wrap: wrap;
          }

          .stateSearchResults > div {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
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

const stateSeeds = [
  { id: 'wa', name: 'Washington', abbreviation: 'WA', x: 82, y: 70 },
  { id: 'or', name: 'Oregon', abbreviation: 'OR', x: 78, y: 113 },
  { id: 'ca', name: 'California', abbreviation: 'CA', x: 74, y: 176 },
  { id: 'nv', name: 'Nevada', abbreviation: 'NV', x: 112, y: 165 },
  { id: 'id', name: 'Idaho', abbreviation: 'ID', x: 125, y: 105 },
  { id: 'mt', name: 'Montana', abbreviation: 'MT', x: 185, y: 82 },
  { id: 'wy', name: 'Wyoming', abbreviation: 'WY', x: 190, y: 135 },
  { id: 'ut', name: 'Utah', abbreviation: 'UT', x: 158, y: 172 },
  { id: 'az', name: 'Arizona', abbreviation: 'AZ', x: 142, y: 229 },
  { id: 'co', name: 'Colorado', abbreviation: 'CO', x: 218, y: 177 },
  { id: 'nm', name: 'New Mexico', abbreviation: 'NM', x: 205, y: 235 },

  { id: 'nd', name: 'North Dakota', abbreviation: 'ND', x: 285, y: 82 },
  { id: 'sd', name: 'South Dakota', abbreviation: 'SD', x: 286, y: 125 },
  { id: 'ne', name: 'Nebraska', abbreviation: 'NE', x: 290, y: 165 },
  { id: 'ks', name: 'Kansas', abbreviation: 'KS', x: 292, y: 205 },
  { id: 'ok', name: 'Oklahoma', abbreviation: 'OK', x: 300, y: 245 },
  { id: 'tx', name: 'Texas', abbreviation: 'TX', x: 280, y: 305 },

  { id: 'mn', name: 'Minnesota', abbreviation: 'MN', x: 350, y: 95 },
  { id: 'ia', name: 'Iowa', abbreviation: 'IA', x: 355, y: 158 },
  { id: 'mo', name: 'Missouri', abbreviation: 'MO', x: 363, y: 205 },
  { id: 'ar', name: 'Arkansas', abbreviation: 'AR', x: 365, y: 252 },
  { id: 'la', name: 'Louisiana', abbreviation: 'LA', x: 374, y: 310 },

  { id: 'wi', name: 'Wisconsin', abbreviation: 'WI', x: 405, y: 112 },
  { id: 'il', name: 'Illinois', abbreviation: 'IL', x: 415, y: 175 },
  { id: 'mi', name: 'Michigan', abbreviation: 'MI', x: 460, y: 115 },
  { id: 'in', name: 'Indiana', abbreviation: 'IN', x: 455, y: 177 },
  { id: 'oh', name: 'Ohio', abbreviation: 'OH', x: 500, y: 168 },

  { id: 'ky', name: 'Kentucky', abbreviation: 'KY', x: 467, y: 217 },
  { id: 'tn', name: 'Tennessee', abbreviation: 'TN', x: 475, y: 248 },
  { id: 'ms', name: 'Mississippi', abbreviation: 'MS', x: 420, y: 290 },
  { id: 'al', name: 'Alabama', abbreviation: 'AL', x: 465, y: 292 },
  { id: 'ga', name: 'Georgia', abbreviation: 'GA', x: 515, y: 285 },
  { id: 'fl', name: 'Florida', abbreviation: 'FL', x: 550, y: 345 },

  { id: 'wv', name: 'West Virginia', abbreviation: 'WV', x: 535, y: 205 },
  { id: 'va', name: 'Virginia', abbreviation: 'VA', x: 570, y: 215 },
  { id: 'nc', name: 'North Carolina', abbreviation: 'NC', x: 585, y: 250 },
  { id: 'sc', name: 'South Carolina', abbreviation: 'SC', x: 550, y: 275 },

  { id: 'pa', name: 'Pennsylvania', abbreviation: 'PA', x: 575, y: 155 },
  { id: 'ny', name: 'New York', abbreviation: 'NY', x: 610, y: 120 },
  { id: 'vt', name: 'Vermont', abbreviation: 'VT', x: 625, y: 65 },
{ id: 'nh', name: 'New Hampshire', abbreviation: 'NH', x: 665, y: 78 },
{ id: 'me', name: 'Maine', abbreviation: 'ME', x: 710, y: 45 },

{ id: 'ma', name: 'Massachusetts', abbreviation: 'MA', x: 690, y: 115 },
{ id: 'ri', name: 'Rhode Island', abbreviation: 'RI', x: 710, y: 145 },
{ id: 'ct', name: 'Connecticut', abbreviation: 'CT', x: 660, y: 145 },
{ id: 'nj', name: 'New Jersey', abbreviation: 'NJ', x: 625, y: 178 },
{ id: 'de', name: 'Delaware', abbreviation: 'DE', x: 625, y: 218 },
{ id: 'md', name: 'Maryland', abbreviation: 'MD', x: 580, y: 205 },
  { id: 'ak', name: 'Alaska', abbreviation: 'AK', x: 95, y: 335 },
  { id: 'hi', name: 'Hawaii', abbreviation: 'HI', x: 175, y: 355 },
] as const

const arenaGames = [
  'EA Sports College Football',
  'Madden NFL',
  'NBA 2K',
  'MLB The Show',
  'EA Sports FC',
  'NHL',
]

const states: StateActivity[] = stateSeeds.map((state, index) => ({
  ...state,
  playersOnline: 125 + ((index * 37) % 390),
  liveRooms: 4 + ((index * 7) % 24),
  topGame: arenaGames[index % arenaGames.length],
  topPlayer: `${state.abbreviation}Arena${index + 1}`,
  rank: index + 1,
}))

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
const handleStateClick = (stateId: string) => {
  setSelectedStateId(stateId)
  router.push(`/states/${stateId}`)
}
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
  const hottestState = [...states].sort(
    (a, b) => b.playersOnline - a.playersOnline
  )[0]

  const mostActiveState = [...states].sort(
    (a, b) => b.liveRooms - a.liveRooms
  )[0]

  const topFiveStates = [...states]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5)
  return (
    <section className="arenaMapSection">
      <div className="mapHeader">
        <div className="mapStatsGrid">
  <div className="mapStatCard">
    <span className="mapStatLabel">Players Online</span>
    <strong className="mapStatValue">{totalPlayers.toLocaleString()}</strong>
  </div>

  <div className="mapStatCard">
    <span className="mapStatLabel">Live Rooms</span>
    <strong className="mapStatValue">{totalRooms}</strong>
  </div>

  <div className="mapStatCard">
    <span className="mapStatLabel">Hottest State</span>
    <strong className="mapStatValue">
      {hottestState.name}
    </strong>
    <small>{hottestState.playersOnline} online</small>
  </div>

  <div className="mapStatCard">
    <span className="mapStatLabel">#1 Ranked State</span>
    <strong className="mapStatValue">
      {topFiveStates[0]?.name}
    </strong>
  </div>
</div>
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
  handleStateClick(state.id)
}}
onKeyDown={(event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleStateClick(state.id)
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
    onClick={() =>
  router.push(`/arena/state?state=${selectedState.id}`)
}
  >
    Enter {selectedState.name} Arena
  </button>

  <button
    type="button"
    className="viewRoomsButton"
    onClick={() =>
      router.push(`/states/${selectedState.id}`)
    }
  >
    Open {selectedState.name} Community
  </button>

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
  handleStateClick(state.id)
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
.mapStatsGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
  margin-bottom: 24px;
}

.mapStatCard {
  background:
    linear-gradient(
      145deg,
      rgba(15, 23, 42, 0.96),
      rgba(30, 41, 59, 0.92)
    );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 18px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.mapStatCard:hover {
  transform: translateY(-3px);
  border-color: rgba(239, 68, 68, 0.65);
}

.mapStatLabel {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.mapStatValue {
  color: #ffffff;
  font-size: 24px;
  line-height: 1.1;
  font-weight: 900;
}

.mapStatCard small {
  color: #f87171;
  font-weight: 700;
  margin-top: 6px;
}

@media (max-width: 900px) {
  .mapStatsGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .mapStatsGrid {
    grid-template-columns: 1fr;
  }
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
          grid-template-columns: minmax(0, 2.15fr) minmax(280px, 0.7fr);
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
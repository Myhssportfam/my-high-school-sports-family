import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

type StatePoint = {
  name: string
  abbr: string
  slug: string
  x: number
  y: number
  activity?: number
}

const STATES: StatePoint[] = [
  { name:'Washington',abbr:'WA',slug:'wa',x:116,y:91 },{ name:'Oregon',abbr:'OR',slug:'or',x:105,y:139 },{ name:'California',abbr:'CA',slug:'ca',x:102,y:220,activity:84 },
  { name:'Idaho',abbr:'ID',slug:'id',x:164,y:132 },{ name:'Nevada',abbr:'NV',slug:'nv',x:151,y:203 },{ name:'Arizona',abbr:'AZ',slug:'az',x:194,y:283 },
  { name:'Montana',abbr:'MT',slug:'mt',x:247,y:105 },{ name:'Wyoming',abbr:'WY',slug:'wy',x:258,y:169 },{ name:'Utah',abbr:'UT',slug:'ut',x:216,y:221 },
  { name:'Colorado',abbr:'CO',slug:'co',x:301,y:230,activity:64 },{ name:'New Mexico',abbr:'NM',slug:'nm',x:280,y:300 },
  { name:'North Dakota',abbr:'ND',slug:'nd',x:367,y:110 },{ name:'South Dakota',abbr:'SD',slug:'sd',x:369,y:166 },{ name:'Nebraska',abbr:'NE',slug:'ne',x:384,y:217 },
  { name:'Kansas',abbr:'KS',slug:'ks',x:389,y:273 },{ name:'Oklahoma',abbr:'OK',slug:'ok',x:409,y:326 },{ name:'Texas',abbr:'TX',slug:'tx',x:388,y:390,activity:96 },
  { name:'Minnesota',abbr:'MN',slug:'mn',x:462,y:115 },{ name:'Iowa',abbr:'IA',slug:'ia',x:469,y:193 },{ name:'Missouri',abbr:'MO',slug:'mo',x:487,y:255 },
  { name:'Arkansas',abbr:'AR',slug:'ar',x:482,y:315 },{ name:'Louisiana',abbr:'LA',slug:'la',x:493,y:373 },
  { name:'Wisconsin',abbr:'WI',slug:'wi',x:526,y:147 },{ name:'Illinois',abbr:'IL',slug:'il',x:548,y:226 },{ name:'Michigan',abbr:'MI',slug:'mi',x:602,y:151,activity:70 },
  { name:'Indiana',abbr:'IN',slug:'in',x:594,y:229 },{ name:'Ohio',abbr:'OH',slug:'oh',x:646,y:219,activity:72 },{ name:'Kentucky',abbr:'KY',slug:'ky',x:605,y:276 },
  { name:'Tennessee',abbr:'TN',slug:'tn',x:611,y:316 },{ name:'Mississippi',abbr:'MS',slug:'ms',x:549,y:363 },{ name:'Alabama',abbr:'AL',slug:'al',x:607,y:360,activity:66 },
  { name:'Georgia',abbr:'GA',slug:'ga',x:668,y:357,activity:79 },{ name:'Florida',abbr:'FL',slug:'fl',x:720,y:415,activity:88 },
  { name:'West Virginia',abbr:'WV',slug:'wv',x:690,y:264 },{ name:'Virginia',abbr:'VA',slug:'va',x:745,y:278 },{ name:'North Carolina',abbr:'NC',slug:'nc',x:756,y:319,activity:75 },
  { name:'South Carolina',abbr:'SC',slug:'sc',x:711,y:352 },{ name:'Pennsylvania',abbr:'PA',slug:'pa',x:735,y:213,activity:68 },
  { name:'New York',abbr:'NY',slug:'ny',x:788,y:165 },{ name:'Vermont',abbr:'VT',slug:'vt',x:818,y:121 },{ name:'New Hampshire',abbr:'NH',slug:'nh',x:847,y:127 },
  { name:'Maine',abbr:'ME',slug:'me',x:875,y:84 },{ name:'Massachusetts',abbr:'MA',slug:'ma',x:848,y:173 },{ name:'Rhode Island',abbr:'RI',slug:'ri',x:867,y:190 },
  { name:'Connecticut',abbr:'CT',slug:'ct',x:829,y:191 },{ name:'New Jersey',abbr:'NJ',slug:'nj',x:790,y:225 },{ name:'Delaware',abbr:'DE',slug:'de',x:800,y:252 },
  { name:'Maryland',abbr:'MD',slug:'md',x:767,y:248 },{ name:'Alaska',abbr:'AK',slug:'ak',x:138,y:422 },{ name:'Hawaii',abbr:'HI',slug:'hi',x:244,y:442 }
]

export default function USMap({ height = 470 }: { width?: number; height?: number }) {
  const router = useRouter()
  const [selected, setSelected] = useState<StatePoint | null>(null)
  const [mode, setMode] = useState<'activity'|'community'>('activity')

  const topStates = useMemo(() => [...STATES].sort((a,b) => (b.activity || 35) - (a.activity || 35)).slice(0,4), [])
  const level = (state: StatePoint) => state.activity || 35
  const colorFor = (state: StatePoint) => mode === 'community' ? '#2f6bd8' : level(state) >= 85 ? '#ef3340' : level(state) >= 70 ? '#ff7a1a' : level(state) >= 55 ? '#4f8cff' : '#2563a8'

  const openState = (state: StatePoint) => {
    setSelected(state)
    router.push(`/states/${state.slug}`)
  }

  return (
    <div className="mhssf-map-shell real-outline-map" style={{ minHeight: height }}>
      <div className="mhssf-map-topbar">
        <div><span className="live-dot" /> Interactive national sports map</div>
        <div className="mhssf-map-mode">
          <button className={mode === 'activity' ? 'active' : ''} onClick={() => setMode('activity')}>Live activity</button>
          <button className={mode === 'community' ? 'active' : ''} onClick={() => setMode('community')}>Communities</button>
        </div>
      </div>

      <svg className="mhssf-state-map" viewBox="35 35 880 450" role="img" aria-label="Clickable map of all 50 United States sports communities">
        <defs>
          <linearGradient id="mapLand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5c694e"/><stop offset=".45" stopColor="#324b4b"/><stop offset="1" stopColor="#1b3343"/></linearGradient>
          <radialGradient id="mapHeat"><stop offset="0" stopColor="#ef3340" stopOpacity=".75"/><stop offset="1" stopColor="#ef3340" stopOpacity="0"/></radialGradient>
          <filter id="mapShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#020617" floodOpacity=".6"/></filter>
        </defs>

        <path className="real-country-shape" filter="url(#mapShadow)" d="M77 153 L96 105 L143 79 L204 82 L258 66 L321 78 L371 68 L423 83 L468 91 L511 82 L556 102 L604 104 L646 122 L684 126 L718 144 L758 151 L793 171 L824 187 L853 218 L842 243 L812 252 L793 274 L769 286 L748 309 L717 320 L693 343 L660 353 L643 379 L611 386 L586 374 L558 384 L529 369 L503 377 L479 354 L452 358 L426 342 L395 343 L367 320 L337 323 L313 300 L283 300 L257 279 L229 274 L209 249 L181 242 L163 219 L137 211 L119 188 L95 181 Z"/>
        <path className="real-country-shape alaska" d="M91 396 L135 377 L181 388 L191 414 L161 431 L118 425 Z"/>
        <path className="real-country-shape hawaii" d="M215 423 l16 -6 l12 8 l-13 9 z M244 435 l13 -5 l10 7 l-10 8 z M275 444 l10 -3 l7 6 l-8 6 z"/>

        <g className="state-boundaries">
          <path d="M144 82 L163 219 M205 82 L209 249 M258 67 L257 279 M321 78 L313 300 M371 69 L367 320 M423 84 L426 342 M468 91 L479 354 M511 83 L529 369 M556 103 L558 384 M604 105 L611 386 M646 123 L643 379 M684 127 L660 353 M718 145 L693 343 M758 152 L717 320"/>
          <path d="M92 132 L824 187 M83 178 L842 243 M129 218 L793 274 M180 260 L748 309 M252 299 L693 343"/>
        </g>

        {STATES.map((state) => (
          <g key={state.abbr} transform={`translate(${state.x} ${state.y})`} className="map-state-point" tabIndex={0} role="button" aria-label={`Open ${state.name} Sports Family`} onClick={() => openState(state)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openState(state) }} onMouseEnter={() => setSelected(state)} onMouseLeave={() => setSelected(null)}>
            {level(state) >= 70 && <circle r="25" className="point-heat" />}
            <circle r={level(state) >= 85 ? 10 : 7} fill={colorFor(state)} />
            <text y="-13">{state.abbr}</text>
          </g>
        ))}
      </svg>

      <div className="mhssf-map-footer">
        <div className="mhssf-map-status">
          <strong>{selected ? `${selected.name} Sports Family` : 'Choose your state'}</strong>
          <span>{selected ? `${level(selected)}% community activity · Click to enter` : 'Hover over a state marker, then click to enter its community.'}</span>
        </div>
        <div className="mhssf-map-leaders">{topStates.map((state, index) => <span key={state.abbr}><b>{index + 1}</b>{state.abbr}</span>)}</div>
      </div>
    </div>
  )
}

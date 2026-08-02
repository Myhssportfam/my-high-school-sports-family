import React from 'react'
import Link from 'next/link'
import USMap from "../components/InteractiveUSMap";

const liveGames = [
  { sport: '🏈', state: 'Texas', home: 'Duncanville', away: 'North Shore', homeScore: 21, awayScore: 14, status: '3rd QTR · 4:32' },
  { sport: '🏀', state: 'Texas', home: 'Allen', away: 'Plano West', homeScore: 58, awayScore: 52, status: '4th QTR · 1:12' },
  { sport: '⚾', state: 'Florida', home: 'Katy', away: 'Pearland', homeScore: 3, awayScore: 1, status: '5th inning' },
]

const topAthletes = [
  ['Jaden Williams', 'QB · 2025', '4.8'],
  ['Michael Brown', 'WR · 2025', '4.7'],
  ['Chris Davis', 'ATH · 2025', '4.6'],
  ['Tyrese Johnson', 'RB · 2026', '4.6'],
  ['Anthony Harris', 'CB · 2025', '4.5'],
]

const arenaGames = [
  ['Texas vs Florida', 'College Football 25', '1.8K'],
  ['California vs Ohio', 'NBA 2K24', '1.2K'],
  ['Georgia vs Alabama', 'MLB The Show 24', '982'],
  ['Michigan vs Minnesota', 'NHL 24', '643'],
]

const panel = 'overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/20'
const panelTitle = 'border-b border-slate-800 bg-black/30 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-200'

export default function Home() {
  return (
    <div className="bg-[#050b12] text-white">
      
      <USMap /><section className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_72%_28%,rgba(190,24,45,.42),transparent_28%),radial-gradient(circle_at_25%_45%,rgba(29,78,216,.36),transparent_34%),linear-gradient(120deg,#07111d,#120b12_62%,#21090d)]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="site-shell relative grid min-h-[610px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10">
            <div className="text-7xl font-black italic tracking-[-.08em] text-white sm:text-8xl">MH<span className="text-red-500">SSF</span></div>
            <div className="mt-3 text-sm font-black uppercase tracking-[.2em] text-slate-300">My High School Sports Family</div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black uppercase italic leading-[.98] tracking-tight sm:text-6xl">
              Every athlete has a story.<br />
              <span className="text-red-400">And this is where all athletes belong.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">A national sports family for athletes, parents, coaches, schools, fans, recruiters, live games and the MHSSF gaming arena.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-md bg-red-600 px-7 py-3 text-sm font-black uppercase shadow-lg shadow-red-950/40 hover:bg-red-500">Join now</Link>
              <Link href="/states" className="rounded-md border border-slate-500 bg-slate-950/40 px-7 py-3 text-sm font-black uppercase hover:bg-slate-800">Explore</Link>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/15 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[.18em] text-blue-300">MHSSF Live Center</div>
                <h2 className="mt-1 text-2xl font-black">Tonight across America</h2>
              </div>
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-black text-red-300">● LIVE</span>
            </div>
            <div className="mt-5 grid gap-3">
              {liveGames.map((game) => (
                <div key={`${game.home}-${game.away}`} className="rounded-xl border border-slate-700 bg-slate-900/85 p-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400"><span>{game.sport} {game.state}</span><span>{game.status}</span></div>
                  <div className="mt-3 flex items-center justify-between text-sm"><strong>{game.home}</strong><b className="text-xl">{game.homeScore}</b></div>
                  <div className="mt-1 flex items-center justify-between text-sm"><span>{game.away}</span><b className="text-xl">{game.awayScore}</b></div>
                </div>
              ))}
            </div>
            <Link href="/live" className="mt-4 block rounded-xl border border-slate-600 py-3 text-center text-xs font-black uppercase hover:bg-slate-800">Open MHSSF Live →</Link>
          </div>
        </div>

        <div className="relative grid grid-cols-2 border-t border-white/10 bg-black/45 sm:grid-cols-5">
          {[['1.2M+','Athletes'],['50','States'],['25K+','Schools'],['5K+','Live Games'],['2.1M+','Followers']].map(([value,label]) => (
            <div key={label} className="border-r border-white/10 px-4 py-5 text-center"><strong className="block text-xl">{value}</strong><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span></div>
          ))}
        </div>
      </section>

      <section className="mhssf-score-ticker" aria-label="Live score ticker">
        <div className="mhssf-score-ticker-track">
          {[...liveGames, ...liveGames].map((game, index) => (
            <div key={`${game.home}-${index}`} className="mhssf-score-ticker-item">
              <span className="mhssf-score-live">LIVE</span>
              <b>{game.sport} {game.state}</b>
              <span>{game.home} {game.homeScore}</span>
              <span>{game.away} {game.awayScore}</span>
              <small>{game.status}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="site-shell grid gap-4 py-5 lg:grid-cols-2">
        <section className={panel}>
          <div className={panelTitle}>1. Interactive National Sports Map</div>
          <div className="h-[600px] w-full">
            <USMap />
          </div>
        </section>

        <section className={panel}>
          <div className={panelTitle}>2. State Community — Texas Sports Family</div>
          <div className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_80%_38%,rgba(249,115,22,.45),transparent_25%),linear-gradient(110deg,#07111c,#172033)] p-6">
            <div className="text-xs font-black uppercase tracking-[.2em] text-red-300">The Lone Star State</div>
            <h2 className="mt-2 text-4xl font-black uppercase">Texas Sports Family</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Live games, rankings, schools, athletes, coaches, stories and statewide sports conversations.</p>
          </div>
          <div className="flex gap-5 overflow-x-auto border-b border-slate-800 px-4 text-[10px] font-black uppercase text-slate-400">
            {['Feed','Live Games','Rankings','Schools','Athletes','Coaches','Stories','About'].map((tab, index) => <span key={tab} className={`py-3 ${index === 0 ? 'border-b-2 border-red-500 text-white' : ''}`}>{tab}</span>)}
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            {liveGames.map((game) => (
              <article key={game.home} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="rounded bg-red-600 px-2 py-1 text-[9px] font-black">LIVE</span>
                <div className="mt-3 flex justify-between"><strong>{game.home}</strong><b>{game.homeScore}</b></div>
                <div className="mt-2 flex justify-between text-slate-300"><span>{game.away}</span><b>{game.awayScore}</b></div>
                <div className="mt-3 text-[10px] uppercase text-slate-500">{game.status}</div>
              </article>
            ))}
            <aside className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h3 className="font-black">Texas Rankings</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-300"><li>1. Duncanville</li><li>2. North Shore</li><li>3. Allen</li><li>4. DeSoto</li><li>5. Katy</li></ol>
            </aside>
          </div>
        </section>
      </div>

      <div className="site-shell grid gap-4 pb-5 lg:grid-cols-[1fr_1.15fr_1.15fr]">
        <section className={panel}>
          <div className={panelTitle}>3. Social Feed</div>
          <div className="p-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-red-700 text-xs font-black">JW</div><span className="text-sm text-slate-400">What's on your mind?</span></div>
            <article className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3 p-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-xs font-black">JW</div><div><strong className="block">Jaden Williams</strong><span className="text-xs text-slate-500">Texas · Football · 20m</span></div></div>
              <p className="px-4 pb-3 text-sm text-slate-300">Grind now, shine later. #TexasFamily #NoDaysOff</p>
              <div className="h-52 bg-[radial-gradient(circle_at_50%_75%,#2f7a45_0_14%,#152331_15%_40%,#5d141b_41%_55%,#07111c_56%)]" />
              <div className="flex justify-around p-3 text-xs text-slate-400"><span>♡ 142</span><span>◯ 24</span><span>↗ 12</span></div>
            </article>
          </div>
        </section>

        <section className={panel}>
          <div className={panelTitle}>4. Athlete Profile</div>
          <div className="bg-[radial-gradient(circle_at_70%_10%,rgba(190,24,93,.5),transparent_35%),linear-gradient(#111827,#050b12)] px-5 pb-5 pt-24">
            <div className="flex items-end gap-4"><div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-amber-700 to-slate-950 text-2xl font-black">JW</div><div><h2 className="text-2xl font-black">Jaden Williams ✓</h2><p className="text-sm text-slate-300">QB / ATH · 2025</p><p className="text-xs text-slate-400">Duncanville High School · Texas</p></div><button className="ml-auto rounded-md bg-red-600 px-4 py-2 text-xs font-black">Follow</button></div>
          </div>
          <div className="grid grid-cols-4 border-y border-slate-800 text-center">{[['4,892','Followers'],['1,203','Following'],['156','Posts'],['23.4K','Views']].map(([v,l]) => <div key={l} className="p-4"><strong className="block">{v}</strong><span className="text-[10px] text-slate-500">{l}</span></div>)}</div>
          <div className="flex flex-wrap gap-2 p-4 text-[10px] font-bold"><span className="rounded bg-slate-900 px-3 py-2">6'2&quot;</span><span className="rounded bg-slate-900 px-3 py-2">195 lbs</span><span className="rounded bg-slate-900 px-3 py-2">Dual Threat QB</span><span className="rounded bg-slate-900 px-3 py-2 text-amber-300">★★★★★ 4.8</span></div>
        </section>

        <section className={panel}>
          <div className={panelTitle}>5. Recruiting Center</div>
          <div className="p-4"><input className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm" placeholder="Search players, schools, or coaches..." /></div>
          <div className="grid gap-3 px-4 pb-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="font-black">Top Athletes</h3><ol className="mt-3 space-y-3 text-xs">{topAthletes.map(([name,pos,rating],i) => <li key={name} className="flex items-center justify-between"><span>{i+1}. {name}<small className="block text-slate-500">{pos}</small></span><b className="text-amber-300">★ {rating}</b></li>)}</ol></div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="font-black">Featured Schools</h3><div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-black">{['Texas','Texas A&M','LSU','Oklahoma','Ole Miss','Georgia'].map(s => <span key={s} className="rounded border border-slate-700 p-3">{s}</span>)}</div></div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="font-black">Recent Offers</h3><ul className="mt-3 space-y-3 text-xs text-slate-300"><li>Jaden Williams — QB</li><li>Michael Brown — WR</li><li>Chris Davis — ATH</li><li>Tyrese Johnson — RB</li></ul></div>
          </div>
        </section>
      </div>

      <section className="site-shell pb-5">
        <div className="mhssf-watchlist-head">
          <div>
            <p className="section-kicker">National spotlight</p>
            <h2>Top athletes to watch</h2>
          </div>
          <Link href="/athletes" className="text-link light">View all athletes →</Link>
        </div>
        <div className="mhssf-watchlist-grid">
          {topAthletes.map(([name, position, rating], index) => (
            <Link href="/athletes" key={name} className="mhssf-watch-card">
              <div className="mhssf-watch-rank">#{index + 1}</div>
              <div className="mhssf-watch-avatar">{name.split(' ').map(part => part[0]).join('')}</div>
              <div>
                <strong>{name}</strong>
                <span>{position}</span>
              </div>
              <b>★ {rating}</b>
            </Link>
          ))}
        </div>
      </section>

      <div className="site-shell grid gap-4 pb-10 lg:grid-cols-[1.05fr_1.15fr_1.1fr]">
        <section className={panel}>
          <div className={panelTitle}>6. Live Games Center</div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center p-5 text-center"><div><strong>Duncanville</strong><b className="block text-4xl">21</b></div><div className="text-xs font-black text-red-400">LIVE<br/><span className="text-slate-400">3rd QTR · 4:32</span></div><div><strong>North Shore</strong><b className="block text-4xl">14</b></div></div>
          <div className="relative grid h-64 place-items-center bg-[repeating-linear-gradient(90deg,#245b31_0_8%,#347541_8%_16%)]"><button className="grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-black/60 text-xl">▶</button></div>
        </section>

        <section className={panel}>
          <div className={panelTitle}>7. MHSSF Video Game Arena</div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">{arenaGames.map(([matchup,game,viewers],i) => <article key={matchup} className="min-h-36 rounded-xl border border-slate-800 bg-gradient-to-br from-red-950 via-slate-900 to-blue-950 p-4"><div className="text-[10px] font-black text-red-400">LIVE</div><h3 className="mt-8 font-black">{matchup}</h3><p className="text-xs text-slate-400">{game}</p><b className="text-xs">{viewers} watching</b></article>)}</div>
        </section>

        <section className={panel}>
          <div className={panelTitle}>8. Arena — Gamer Profile & Leaderboard</div>
          <div className="flex gap-4 p-5"><div className="grid h-20 w-20 place-items-center rounded-full bg-purple-900 text-xl font-black">TL</div><div><h2 className="text-xl font-black">TexasLegend23 ✓</h2><p className="text-xs text-slate-400">Texas Sports Family</p><button className="mt-3 rounded bg-purple-600 px-4 py-2 text-xs font-black">Connect Twitch</button></div></div>
          <div className="grid grid-cols-3 border-y border-slate-800 text-center">{[['247','Wins'],['68','Losses'],['78%','Win %']].map(([v,l]) => <div key={l} className="p-4"><b className="block text-xl">{v}</b><span className="text-[10px] text-slate-500">{l}</span></div>)}</div>
          <ol className="space-y-2 p-4 text-sm"><li className="flex justify-between">1. LoneStarKing <b>2,485</b></li><li className="flex justify-between">2. TX_Dominator <b>2,312</b></li><li className="flex justify-between rounded bg-red-800 p-2">3. TexasLegend23 <b>2,145</b></li><li className="flex justify-between">4. HoustonProdigy <b>1,876</b></li><li className="flex justify-between">5. SanAntonioGoat <b>1,654</b></li></ol>
        </section>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs font-black uppercase tracking-[.14em] text-slate-400">Safe. Respectful. Positive. · Built for athletes. Backed by family. · Represent your state. · #WEAREMHSSF</div>
    </div>
  )
}

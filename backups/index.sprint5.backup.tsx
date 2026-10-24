import React from 'react'
import Link from 'next/link'
import CreatePost from '../components/CreatePost'
import Feed from '../components/Feed'
import USMap from '../components/USMap'

const liveGames = [
  { sport: '🏈', state: 'Texas', matchup: 'North Shore vs. Westfield', status: '2nd Quarter', score: '14–10' },
  { sport: '🏀', state: 'Florida', matchup: 'Central vs. Lakewood', status: 'Halftime', score: '38–35' },
  { sport: '⚾', state: 'Colorado', matchup: 'Pueblo East vs. Central', status: 'Top 5th', score: '4–3' },
]

const communities = [
  { state: 'Texas', id: 'tx', tag: 'Friday Night Lights', stat: '12.8K members', accent: 'from-red-600 to-rose-800' },
  { state: 'Colorado', id: 'co', tag: 'Rocky Mountain Sports', stat: '4.2K members', accent: 'from-blue-700 to-indigo-900' },
  { state: 'Florida', id: 'fl', tag: 'Sunshine State Stars', stat: '9.7K members', accent: 'from-cyan-600 to-blue-800' },
]

const stories = ['Football', 'Basketball', 'Baseball', 'Softball', 'Cheer', 'Volleyball', 'Band', 'Gaming']

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="site-shell relative grid min-h-[640px] items-center gap-12 py-20 lg:grid-cols-[1.12fr_.88fr]">
          <div>
            <div className="eyebrow"><span className="live-dot" /> The national home of school sports</div>
            <h1 className="hero-title">Every athlete has a story.<br /><span>This is where all athletes belong.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Connect with athletes, families, coaches, schools, and fans in every state. Share highlights, follow the journey, get discovered, and celebrate sports together.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="primary-button">Join Your Sports Family</Link>
              <Link href="/live" className="secondary-button">▶ Watch Live</Link>
              <Link href="/arena" className="secondary-button">🎮 Enter Gaming Arena</Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[['50+', 'State communities'], ['All Sports', 'One platform'], ['24/7', 'Stories & highlights']].map(([value, label]) => (
                <div key={label} className="hero-stat"><div>{value}</div><span>{label}</span></div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">MHSF Live Center</div>
                <h2 className="mt-1 text-2xl font-black text-white">Tonight across America</h2>
              </div>
              <div className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-black text-red-200"><span className="mr-1 text-red-400">●</span> LIVE</div>
            </div>
            <div className="mt-6 space-y-3">
              {liveGames.map((game) => (
                <div key={game.matchup} className="live-row">
                  <div className="text-2xl">{game.sport}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-200">{game.state} · {game.status}</div>
                    <div className="truncate font-bold text-white">{game.matchup}</div>
                  </div>
                  <div className="text-lg font-black text-white">{game.score}</div>
                </div>
              ))}
            </div>
            <Link href="/live" className="mt-5 block rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15">Open MHSF Live →</Link>
          </div>
        </div>
      </section>

      <section className="site-shell -mt-8 relative z-10">
        <div className="story-shelf">
          <div className="story-add"><span>＋</span><small>Your Story</small></div>
          {stories.map((story, index) => (
            <div key={story} className="story-item">
              <div className={`story-ring story-${index + 1}`}><span>{['🏈','🏀','⚾','🥎','📣','🏐','🎺','🎮'][index]}</span></div>
              <small>{story}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell section-space">
        <div className="section-heading">
          <div><div className="section-kicker">Choose your sports family</div><h2>Explore America through sports</h2></div>
          <Link href="/states" className="text-link">View all states →</Link>
        </div>
        <div className="map-card">
          <div className="map-copy">
            <div className="inline-badge">🇺🇸 Interactive State Communities</div>
            <h3>Click your state. Find your people. Follow the story.</h3>
            <p>Enter a state community to discover athletes, schools, games, rankings, highlights, and local sports conversations.</p>
            <div className="map-legend"><span><i className="bg-red-500" /> Live activity</span><span><i className="bg-blue-600" /> State community</span></div>
          </div>
          <div className="map-wrap"><USMap height={470} /></div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="site-shell">
          <div className="section-heading light">
            <div><div className="section-kicker">Live now</div><h2>Games, competitions, and community</h2></div>
            <Link href="/live" className="text-link light">See all live events →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {liveGames.map((game, index) => (
              <article key={game.matchup} className="live-card">
                <div className="live-card-top"><span className="text-4xl">{game.sport}</span><span className="live-pill">● LIVE</span></div>
                <div className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-blue-300">{game.state} Sports Family</div>
                <h3 className="mt-2 text-xl font-black">{game.matchup}</h3>
                <div className="mt-5 flex items-end justify-between"><span className="text-sm text-slate-400">{game.status}</span><strong className="text-3xl">{game.score}</strong></div>
                <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950">Watch Stream</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell section-space">
        <div className="section-heading">
          <div><div className="section-kicker">State spotlight</div><h2>Communities built around pride</h2></div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {communities.map((community) => (
            <Link key={community.state} href={`/states/${community.id}`} className={`community-card bg-gradient-to-br ${community.accent}`}>
              <div className="community-shape" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">{community.tag}</div>
                <h3>{community.state} Sports Family</h3>
                <p>{community.stat}</p>
                <span>Enter community →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="section-heading">
          <div><div className="section-kicker">Community feed</div><h2>Share the journey</h2></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <CreatePost />
            <Feed />
          </div>
          <aside className="space-y-5">
            <div className="side-card">
              <div className="side-card-title">Trending on MHSF</div>
              {['Friday Night Lights', 'Class of 2027 Recruiting', 'Play of the Week', 'State Championship Watch'].map((item, index) => (
                <div key={item} className="trend-row"><span>#{index + 1}</span><div><strong>{item}</strong><small>{[12400, 8600, 7100, 5900][index].toLocaleString()} posts</small></div></div>
              ))}
            </div>
            <div className="side-card recruiting-card-home">
              <div className="text-3xl">🎓</div>
              <div className="side-card-title mt-3">Build your recruiting profile</div>
              <p>Put your stats, highlights, academics, and contact information in front of coaches.</p>
              <Link href="/recruiting" className="primary-button mt-5 w-full">Get Recruited</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

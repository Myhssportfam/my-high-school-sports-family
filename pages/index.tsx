import Link from "next/link"
import ClickableUSMap from "../components/ClickableUSMap"


const liveGames = [
  {
    state: "TEXAS",
    status: "2ND QUARTER",
    matchup: "North Shore vs. Westfield",
    score: "14 – 10",
    viewers: "2.4K watching",
    sport: "Football",
    icon: "🏈",
    color: "text-red-400",
  },
  {
    state: "FLORIDA",
    status: "HALFTIME",
    matchup: "Central vs. Lakewood",
    score: "38 – 35",
    viewers: "1.8K watching",
    sport: "Basketball",
    icon: "🏀",
    color: "text-orange-400",
  },
  {
    state: "COLORADO",
    status: "TOP 5TH",
    matchup: "Pueblo East vs. Central",
    score: "4 – 3",
    viewers: "980 watching",
    sport: "Baseball",
    icon: "⚾",
    color: "text-sky-400",
  },
  {
    state: "CALIFORNIA",
    status: "1ST SET",
    matchup: "Mater Dei vs. Sierra Canyon",
    score: "0 – 0",
    viewers: "1.2K watching",
    sport: "Volleyball",
    icon: "🏐",
    color: "text-purple-400",
  },
]

const stories = [
  { name: "Your Story", icon: "MHSF", href: "/states/co" },
  { name: "Texas", icon: "⭐", href: "/states/tx" },
  { name: "California", icon: "🐻", href: "/states/ca" },
  { name: "Florida", icon: "🌴", href: "/states/fl" },
  { name: "Georgia", icon: "G", href: "/states/ga" },
  { name: "Ohio", icon: "🏈", href: "/states/oh" },
  { name: "More States", icon: "🇺🇸", href: "/states" },
]

const schools = [
  { name: "IMG Academy", location: "Bradenton, FL", logo: "IMG" },
  { name: "Mater Dei", location: "Santa Ana, CA", logo: "MD" },
  { name: "St. John Bosco", location: "Bellflower, CA", logo: "SJB" },
  { name: "North Shore", location: "Houston, TX", logo: "NS" },
  { name: "Central", location: "Phenix City, AL", logo: "C" },
  { name: "De La Salle", location: "Concord, CA", logo: "D" },
]

const trendingAthletes = [
  {
    rank: 1,
    name: "Mason Carter",
    position: "QB · 2025",
    followers: "12.4K followers",
    initials: "MC",
  },
  {
    rank: 2,
    name: "Jayden Williams",
    position: "WR · 2025",
    followers: "9.8K followers",
    initials: "JW",
  },
  {
    rank: 3,
    name: "Landon Davis",
    position: "WR · 2025",
    followers: "9.2K followers",
    initials: "LD",
  },
  {
    rank: 4,
    name: "Chris Johnson",
    position: "RB · 2025",
    followers: "8.7K followers",
    initials: "CJ",
  },
  {
    rank: 5,
    name: "Tyler Brown",
    position: "LB · 2025",
    followers: "8.1K followers",
    initials: "TB",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020912] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020912]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-5 py-3">
          <Link href="/" className="flex min-w-fit items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/30 bg-gradient-to-b from-blue-800 via-red-700 to-blue-950 text-xs font-black shadow-lg">
              MHSF
            </div>

            <div>
              <p className="text-xl font-black leading-none">
                MY HIGH SCHOOL
              </p>
              <p className="text-xl font-black leading-none text-red-500">
                SPORTS FAMILY
              </p>
              <p className="mt-1 text-[9px] font-bold tracking-[0.18em] text-gray-300">
                ONE NATION. EVERY ATHLETE. ONE FAMILY.
              </p>
            </div>
          </Link>

          <div className="mx-auto hidden max-w-md flex-1 lg:block">
            <div className="flex items-center rounded-lg border border-white/15 bg-white/[0.03] px-4">
              <input
                type="search"
                placeholder="Search athletes, schools, teams, states..."
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              />
              <span className="text-lg text-gray-400">⌕</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/signin"
              className="hidden text-sm font-semibold hover:text-red-400 sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500"
            >
              Join Free
            </Link>
          </div>
        </div>

        <nav className="mx-auto flex max-w-[1600px] items-center justify-center gap-7 overflow-x-auto px-5 pb-3 text-sm font-semibold text-gray-300">
          <Link href="/" className="border-b-2 border-red-500 pb-2 text-white">
            🏠 Home
          </Link>
          <Link href="/states" className="pb-2 hover:text-white">
            🛡 States
          </Link>
          <Link href="/athletes" className="pb-2 hover:text-white">
            ♙ Athletes
          </Link>
          <Link href="/live" className="pb-2 hover:text-white">
            ▣ Live
          </Link>
          <Link href="/recruiting" className="pb-2 hover:text-white">
            ◇ Recruiting
          </Link>
          <Link href="/arena" className="pb-2 hover:text-white">
            🎮 Arena
          </Link>
          <Link href="/rankings" className="pb-2 hover:text-white">
            🏆 Rankings
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-[1600px] border-b border-white/10 xl:grid-cols-[330px_minmax(0,1fr)_350px]">
        <div className="flex flex-col justify-center border-r border-white/10 bg-gradient-to-br from-[#061220] to-[#020912] p-7">
          <h1 className="text-5xl font-black leading-[1.05]">
            Every athlete
            <br />
            has a story.
            <br />
            <span className="text-blue-400">This is where</span>
            <br />
            all athletes
            <br />
            <span className="text-red-500">belong.</span>
          </h1>

          <p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
            Connect with athletes, families, coaches, schools and fans in every
            state. Share highlights, follow the journey, get discovered and
            celebrate sports together.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-500"
            >
              Join Your Sports Family
            </Link>

            <Link
              href="/live"
              className="rounded-lg border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              ▶ Watch Live
            </Link>
          </div>
        </div>

        <div className="min-h-[525px] overflow-hidden">
          <ClickableUSMap />
        </div>

        <aside className="border-l border-white/10 bg-[#04101c] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black">
              <span className="mr-2 text-red-500">●</span>
              LIVE NOW
            </p>

            <Link href="/live" className="text-xs text-gray-400 hover:text-white">
              View All
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {liveGames.map((game) => (
              <Link
                key={`${game.state}-${game.matchup}`}
                href="/live"
                className="flex gap-3 py-4 transition hover:bg-white/[0.03]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-3xl">
                  {game.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-gray-400">
                    {game.state} · {game.status}
                  </p>

                  <div className="mt-1 flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-bold">
                      {game.matchup}
                    </p>
                    <p className="shrink-0 text-lg font-black">{game.score}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-400">◉ {game.viewers}</span>
                    <span className={game.color}>{game.sport}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/live"
            className="mt-3 block rounded-lg border border-white/10 bg-white/[0.04] py-3 text-center text-sm font-bold hover:bg-white/10"
          >
            Open Live Center
          </Link>
        </aside>
      </section>

      {/* LOWER CONTENT */}
      <section className="mx-auto grid max-w-[1600px] xl:grid-cols-[40%_1fr_350px]">
        {/* LEFT COLUMN */}
        <div className="border-r border-white/10">
          <section className="border-b border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-black">Stories</h2>
              <Link href="/states" className="text-xs text-gray-400">
                View all
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {stories.map((story) => (
                <Link
                  key={story.name}
                  href={story.href}
                  className="min-w-[66px] text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-700 to-blue-700 p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#020912] bg-[#0b1725] text-xl font-black">
                      {story.icon}
                    </div>
                  </div>
                  <p className="mt-2 truncate text-xs">{story.name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-black">Top Schools</h2>
              <Link href="/states" className="text-xs text-gray-400">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {schools.map((school) => (
                <Link key={school.name} href="/states" className="group">
                  <div className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-2xl font-black transition group-hover:border-red-500/50 group-hover:bg-white/[0.06]">
                    {school.logo}
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold">
                    {school.name}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">
                    {school.location}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* CENTER FEED */}
        <section className="border-r border-white/10">
          <div className="flex items-center gap-7 border-b border-white/10 px-5 py-4 text-sm">
            <button className="font-bold text-red-500">All Feed</button>
            <button className="text-gray-400 hover:text-white">Following</button>
            <button className="text-gray-400 hover:text-white">
              Your State
            </button>
            <button className="text-gray-400 hover:text-white">
              Your Sports
            </button>
            <button className="ml-auto text-gray-400">☷</button>
          </div>

          <article className="p-5">
            <div className="rounded-xl border border-white/10 bg-[#06111d]">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-blue-700 font-black">
                  JT
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Jalen Thompson{" "}
                    <span className="text-blue-400">●</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Central High School · Football · 2026
                  </p>
                  <p className="text-xs text-gray-500">2h · 🌎</p>
                </div>

                <button className="ml-auto text-xl text-gray-400">•••</button>
              </div>

              <div className="px-4 pb-4">
                <p className="text-sm">
                  Great team win tonight! All glory to God. 🙏
                </p>
                <p className="mt-1 text-sm text-blue-400">
                  #TeamFirst #BuiltDifferent
                </p>
              </div>

              <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden bg-gradient-to-br from-red-950 via-[#101b2c] to-blue-950">
                <div className="text-center">
                  <div className="text-8xl">🏈</div>
                  <p className="mt-4 text-3xl font-black">
                    GAME NIGHT HIGHLIGHT
                  </p>
                  <p className="mt-2 text-gray-300">
                    Central High School Football
                  </p>
                </div>

                <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs">
                  1/4
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-gray-400">
                <span>😂👏❤️ 352</span>
                <span>46 Comments &nbsp;&nbsp; 23 Shares</span>
              </div>

              <div className="grid grid-cols-4 text-center text-sm">
                <button className="py-3 hover:bg-white/[0.04]">♡ Like</button>
                <button className="py-3 hover:bg-white/[0.04]">
                  ◯ Comment
                </button>
                <button className="py-3 hover:bg-white/[0.04]">↗ Share</button>
                <button className="py-3 hover:bg-white/[0.04]">⌑ Save</button>
              </div>
            </div>
          </article>
        </section>

        {/* RIGHT TRENDING */}
        <aside className="p-4">
          <div className="rounded-xl border border-white/10 bg-[#06111d]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <h2 className="font-black">Trending Athletes</h2>
              <Link href="/athletes" className="text-xs text-gray-400">
                View all
              </Link>
            </div>

            <div className="divide-y divide-white/10 px-4">
              {trendingAthletes.map((athlete) => (
                <Link
                  key={athlete.rank}
                  href="/athletes"
                  className="flex items-center gap-3 py-4 transition hover:bg-white/[0.03]"
                >
                  <span className="w-4 text-sm">{athlete.rank}</span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-red-600 text-xs font-black">
                    {athlete.initials}
                  </div>

                  <div>
                    <p className="text-sm font-bold">{athlete.name}</p>
                    <p className="text-xs text-gray-400">{athlete.position}</p>
                    <p className="text-xs text-gray-500">
                      {athlete.followers}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
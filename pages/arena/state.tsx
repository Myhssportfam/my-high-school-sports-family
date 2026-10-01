import { useRouter } from "next/router"

const stateNames: Record<string, string> = {
  al: "Alabama",
  ak: "Alaska",
  az: "Arizona",
  ar: "Arkansas",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  de: "Delaware",
  fl: "Florida",
  ga: "Georgia",
  hi: "Hawaii",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ia: "Iowa",
  ks: "Kansas",
  ky: "Kentucky",
  la: "Louisiana",
  me: "Maine",
  md: "Maryland",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  ms: "Mississippi",
  mo: "Missouri",
  mt: "Montana",
  ne: "Nebraska",
  nv: "Nevada",
  nh: "New Hampshire",
  nj: "New Jersey",
  nm: "New Mexico",
  ny: "New York",
  nc: "North Carolina",
  nd: "North Dakota",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  sd: "South Dakota",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  vt: "Vermont",
  va: "Virginia",
  wa: "Washington",
  wv: "West Virginia",
  wi: "Wisconsin",
  wy: "Wyoming",
}

const games = [
  {
    id: "college-football-27-dynasty",
    name: "College Football 27 Dynasty",
    icon: "🏈",
  },
  {
    id: "madden-nfl",
    name: "Madden NFL",
    icon: "🏈",
  },
  {
    id: "nba-2k",
    name: "NBA 2K",
    icon: "🏀",
  },
  {
    id: "mlb-the-show",
    name: "MLB The Show",
    icon: "⚾",
  },
  {
    id: "ea-sports-fc",
    name: "EA Sports FC",
    icon: "⚽",
  },
  {
    id: "nhl",
    name: "NHL",
    icon: "🏒",
  },
]

export default function StateArenaLobby() {
  const router = useRouter()

  const state =
    typeof router.query.state === "string"
      ? router.query.state.toLowerCase()
      : "tx"

  const stateName = stateNames[state] || "State"

  function enterRoom(roomId: string) {
    router.push(
      `/arena/${roomId}?state=${state}&action=join`
    )
  }

  return (
    <main className="min-h-screen bg-[#020817] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/arena")}
          className="mb-8 text-sm font-bold text-slate-400 hover:text-white"
        >
          ← Back to Arena Map
        </button>

        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-500">
            State Gaming Headquarters
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {stateName} Arena
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Choose your game and enter the {stateName} competitive Arena.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => enterRoom(game.id)}
              className="group rounded-3xl border border-white/10 bg-[#071225] p-6 text-left transition hover:-translate-y-1 hover:border-red-500/70"
            >
              <div className="text-4xl">{game.icon}</div>

              <h2 className="mt-5 text-2xl font-black">
                {game.name}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Enter {stateName} competition
              </p>

              <div className="mt-6 font-black text-red-400">
                Enter Room →
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
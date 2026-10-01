import Link from "next/link"

const athletes = [
  { name: "Jaden Williams", sport: "Football", state: "Texas" },
  { name: "Michael Brown", sport: "Basketball", state: "Ohio" },
  { name: "Chris Davis", sport: "Baseball", state: "Georgia" },
  { name: "Tyrese Johnson", sport: "Track", state: "Florida" },
]

export default function TrendingSidebar() {
  return (
    <aside className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
          Trending Athletes
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Athletes to watch
        </h2>

        <div className="mt-5 space-y-4">
          {athletes.map((athlete, index) => (
            <div
              key={athlete.name}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1220] p-3"
            >
              <span className="font-black text-red-500">
                {index + 1}
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xs font-black">
                {athlete.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div>
                <p className="text-sm font-black">{athlete.name}</p>
                <p className="text-xs text-slate-500">
                  {athlete.sport} · {athlete.state}
                </p>
              </div>

              <button className="ml-auto rounded-lg border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                Follow
              </button>
            </div>
          ))}
        </div>

        <Link
          href="/athletes"
          className="mt-5 block text-center text-xs font-black text-blue-400"
        >
          View all athletes →
        </Link>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
          Live Now
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Sports happening now
        </h2>

        <div className="mt-5 space-y-3">
          {[
            "Texas vs Florida",
            "Georgia vs Alabama",
            "California vs Ohio",
          ].map((game) => (
            <Link
              key={game}
              href="/live"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b1220] p-4"
            >
              <span className="font-bold">{game}</span>
              <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-black">
                LIVE
              </span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )
}
import Link from 'next/link'

const states = [
  ['Alabama', 'al'],
  ['Alaska', 'ak'],
  ['Arizona', 'az'],
  ['Arkansas', 'ar'],
  ['California', 'ca'],
  ['Colorado', 'co'],
  ['Connecticut', 'ct'],
  ['Delaware', 'de'],
  ['Florida', 'fl'],
  ['Georgia', 'ga'],
  ['Hawaii', 'hi'],
  ['Idaho', 'id'],
  ['Illinois', 'il'],
  ['Indiana', 'in'],
  ['Iowa', 'ia'],
  ['Kansas', 'ks'],
  ['Kentucky', 'ky'],
  ['Louisiana', 'la'],
  ['Maine', 'me'],
  ['Maryland', 'md'],
  ['Massachusetts', 'ma'],
  ['Michigan', 'mi'],
  ['Minnesota', 'mn'],
  ['Mississippi', 'ms'],
  ['Missouri', 'mo'],
  ['Montana', 'mt'],
  ['Nebraska', 'ne'],
  ['Nevada', 'nv'],
  ['New Hampshire', 'nh'],
  ['New Jersey', 'nj'],
  ['New Mexico', 'nm'],
  ['New York', 'ny'],
  ['North Carolina', 'nc'],
  ['North Dakota', 'nd'],
  ['Ohio', 'oh'],
  ['Oklahoma', 'ok'],
  ['Oregon', 'or'],
  ['Pennsylvania', 'pa'],
  ['Rhode Island', 'ri'],
  ['South Carolina', 'sc'],
  ['South Dakota', 'sd'],
  ['Tennessee', 'tn'],
  ['Texas', 'tx'],
  ['Utah', 'ut'],
  ['Vermont', 'vt'],
  ['Virginia', 'va'],
  ['Washington', 'wa'],
  ['West Virginia', 'wv'],
  ['Wisconsin', 'wi'],
  ['Wyoming', 'wy'],
  ['Washington, D.C.', 'dc'],
]

export default function StatesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-400">
            My High School Sports Family
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-6xl">
            Find your state sports community
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Join athletes, families, coaches, schools and fans from across the
            country. Choose a state to view its stories, athletes, rivals and
            sports community.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              50 States + D.C.
            </span>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              Athlete profiles
            </span>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              State stories
            </span>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              Recruiting
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            State communities
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Choose your state
          </h2>

          <p className="mt-3 text-slate-600">
            Open a state page to follow athletes, watch stories and join the
            local sports family.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {states.map(([name, stateId]) => (
            <Link
              key={stateId}
              href={`/states/${stateId}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-400 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-slate-950 group-hover:text-red-600">
                    {name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    View sports community
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-black text-slate-700 group-hover:bg-red-600 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
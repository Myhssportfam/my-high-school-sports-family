import { useRouter } from 'next/router'

function formatStateName(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function StatePage() {
  const router = useRouter()
  const stateId =
    typeof router.query.stateId === 'string' ? router.query.stateId : ''

  const stateName = stateId ? formatStateName(stateId) : 'State'

  return (
    <main className="container py-8">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          My High School Sports Family
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {stateName} Sports Family
        </h1>

        <p className="mt-3 text-gray-600">
          Explore schools, athletes, highlights, cities, and recruiting activity
          across {stateName}.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 text-center">
          <div className="text-3xl font-bold">0</div>
          <div className="mt-1 text-gray-600">Schools</div>
        </div>

        <div className="rounded-xl border bg-white p-6 text-center">
          <div className="text-3xl font-bold">0</div>
          <div className="mt-1 text-gray-600">Athletes</div>
        </div>

        <div className="rounded-xl border bg-white p-6 text-center">
          <div className="text-3xl font-bold">0</div>
          <div className="mt-1 text-gray-600">Highlights</div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Featured Schools</h2>
          <p className="mt-2 text-gray-500">Schools will appear here.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Cities</h2>
          <p className="mt-2 text-gray-500">Cities will appear here.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Trending Athletes</h2>
          <p className="mt-2 text-gray-500">Athletes will appear here.</p>
        </div>
      </section>
    </main>
  )
}

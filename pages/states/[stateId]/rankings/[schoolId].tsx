import Link from "next/link"
import { useRouter } from "next/router"
import { schools } from "../../../../lib/schoolData"



export default function RankedSchoolPage() {
  const router = useRouter()
  const { stateId, schoolId } = router.query

  if (!router.isReady) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          Loading school...
        </div>
      </main>
    )
  }

  const school =
  typeof schoolId === "string"
    ? schools[schoolId]
    : undefined

  if (!school) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold">
            School not found
          </h1>

          <Link
            href={`/states/${stateId}/rankings`}
            className="mt-6 inline-block font-semibold text-red-600"
          >
            ← Back to rankings
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <div className="mb-7 flex flex-wrap gap-2 text-sm">
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>

          <span>/</span>

          <Link href="/states" className="hover:text-red-600">
            States
          </Link>

          <span>/</span>

          <Link
            href={`/states/${stateId}`}
            className="hover:text-red-600"
          >
            Colorado
          </Link>

          <span>/</span>

          <Link
            href={`/states/${stateId}/rankings`}
            className="hover:text-red-600"
          >
            Rankings
          </Link>

          <span>/</span>

          <span>{school.name}</span>
        </div>

        <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">

          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 px-8 py-10 text-white">

            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-400">
                Official School Community
              </p>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                ✓ Verified School
              </span>
            </div>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

              <div className="flex items-center gap-6">

                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white text-5xl font-bold text-slate-900">
                  {school.name.charAt(0)}
                </div>

                <div>
                  <p className="font-bold uppercase tracking-wider text-red-400">
                    {school.mascot}
                  </p>

                  <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                    {school.name}
                  </h1>

                  <p className="mt-3 text-lg text-gray-300">
                    {school.city}, Colorado
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    #{school.rank} in Colorado Football
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white"
                >
                  Follow School
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white"
                >
                  Share
                </button>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y border-t md:grid-cols-4 md:divide-y-0">

            <div className="bg-white p-6 text-center">
              <strong className="text-3xl">
                #{school.rank}
              </strong>
              <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                State Rank
              </p>
            </div>

            <div className="bg-white p-6 text-center">
              <strong className="text-3xl">
                {school.record}
              </strong>
              <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                Record
              </p>
            </div>

            <div className="bg-white p-6 text-center">
              <strong className="text-3xl">
                {school.rating}
              </strong>
              <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                Rating
              </p>
            </div>

            <div className="bg-white p-6 text-center">
              <strong className="text-3xl text-red-600">
                {school.strength}
              </strong>
              <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                Strength
              </p>
            </div>

          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-8">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
            School Sports
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Explore {school.name} Sports
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              className="rounded-full bg-red-600 px-5 py-2 font-semibold text-white"
            >
              🏈 Football
            </button>

            <Link
  href={`/states/${stateId}/rankings/${school.id}/schedule`}
  className="rounded-full border px-5 py-2 font-semibold"
>
  Schedule
</Link>

            <button
              type="button"
              className="rounded-full border px-5 py-2 font-semibold"
            >
              Roster
            </button>

            <Link
              href={`/live?state=${stateId}`}
              className="rounded-full border px-5 py-2 font-semibold"
            >
              Live
            </Link>

            <button
              type="button"
              className="rounded-full border px-5 py-2 font-semibold"
            >
              Recruiting
            </button>

          </div>
        </section>

      </div>
    </main>
  )
}
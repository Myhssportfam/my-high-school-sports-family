import React from 'react'

type School = {
  name?: string
  city?: string
  state?: string
  mascot?: string
  logoUrl?: string
  coverUrl?: string
}

type SchoolHeaderProps = {
  school: School
}

export default function SchoolHeader({ school }: SchoolHeaderProps) {
  const schoolName = school.name || 'High School'
  const city = school.city || 'Houston'
  const state = school.state || 'TX'
  const mascot = school.mascot || 'Tigers'

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div
        className="relative min-h-[280px] bg-gradient-to-br from-slate-950 via-slate-900 to-red-950"
        style={
          school.coverUrl
            ? {
                backgroundImage: `linear-gradient(
                  to right,
                  rgba(2, 6, 23, 0.94),
                  rgba(15, 23, 42, 0.76),
                  rgba(127, 29, 29, 0.60)
                ), url(${school.coverUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.28),transparent_42%)]" />

        <div className="relative flex min-h-[280px] flex-col justify-between p-6 text-white md:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
              Official School Community
            </p>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
              ✓ Verified School
            </span>
          </div>

          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white text-4xl font-black text-slate-950 shadow-xl">
                {school.logoUrl ? (
                  <img
                    src={school.logoUrl}
                    alt={`${schoolName} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  schoolName.charAt(0)
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-400">
                  {mascot}
                </p>

                <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                  {schoolName}
                </h1>

                <p className="mt-3 text-base font-medium text-slate-300">
                  {city}, {state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700"
              >
                Follow School
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y border-t border-gray-200 md:grid-cols-4 md:divide-y-0">
        <div className="p-5 text-center">
          <p className="text-2xl font-black text-slate-950">842</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Athletes
          </p>
        </div>

        <div className="p-5 text-center">
          <p className="text-2xl font-black text-slate-950">12</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Sports
          </p>
        </div>

        <div className="p-5 text-center">
          <p className="text-2xl font-black text-slate-950">18</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Championships
          </p>
        </div>

        <div className="p-5 text-center">
          <p className="text-2xl font-black text-red-600">24.8K</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Followers
          </p>
        </div>
      </div>
    </section>
  )
}
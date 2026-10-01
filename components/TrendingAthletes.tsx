import Link from 'next/link'
import { useMemo, useState } from 'react'

type TrendingAthletesProps = {
  stateName: string
  athletes: any[]
}

 

export default function TrendingAthletes({
  stateName,
  athletes: registeredAthletes,
}: TrendingAthletesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const athletes = useMemo(() => {
    return registeredAthletes
    .filter((athlete) => {
  const search = searchTerm.trim().toLowerCase()

  if (!search) return true

  const searchableText = [
    athlete.name,
    athlete.displayName,
    athlete.firstName,
    athlete.lastName,
    athlete.school,
    athlete.schoolName,
    athlete.sport,
    athlete.primarySport,
    athlete.position,
    athlete.classYear,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(search)
})
      .map((athlete, index) => {
        const views = Number(athlete.views ?? 0)
        const likes = Number(athlete.likes ?? 0)
        const followers = Number(athlete.followers ?? 0)
        const highlights = Number(athlete.highlights ?? 0)

        const trendingScore =
          views + likes * 3 + followers * 2 + highlights * 5

        const name =
          athlete.name ||
          athlete.displayName ||
          `${athlete.firstName ?? ''} ${athlete.lastName ?? ''}`.trim() ||
          'Athlete'

        const sport =
  athlete.sport ||
  athlete.primarySport ||
  athlete.sports?.[0] ||
  'Athlete'

        const sportIcons: Record<string, string> = {
          football: '🏈',
          basketball: '🏀',
          baseball: '⚾',
          softball: '🥎',
          soccer: '⚽',
          volleyball: '🏐',
          track: '🏃',
          wrestling: '🤼',
          swimming: '🏊',
          cheer: '📣',
        }

        return {
          id: String(athlete.id || athlete.uid || `athlete-${index}`),
          name,
          sport,
          school:
  athlete.school ||
  athlete.schoolName ||
  athlete.schoolId ||
  'School not listed',
          details:
            [
              athlete.classYear ? `Class of ${athlete.classYear}` : '',
              athlete.position || '',
            ]
              .filter(Boolean)
              .join(' • ') || 'Athlete profile',
          stat:
            athlete.topStat ||
            athlete.stat ||
            `${trendingScore.toLocaleString()} TREND SCORE`,
          ranking: '',
          icon: sportIcons[String(sport).toLowerCase()] || '🏅',
          trendingScore,
        }
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 3)
      .map((athlete, index) => ({
        ...athlete,
        ranking: `#${index + 1}`,
      }))
  }, [registeredAthletes, searchTerm])

  return (
    <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
            Athlete Spotlight
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-950">
            Trending in {stateName}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Athletes gaining attention across the {stateName} sports family.
          </p>
        </div>

        <Link
          href="/athletes"
          className="text-sm font-bold text-red-600 hover:text-red-700"
        >
          View all athletes →
        </Link>
      </div>
<div className="mt-5">
  <label
    htmlFor="athlete-search"
    className="mb-2 block text-sm font-bold text-gray-700"
  >
    Locate an athlete
  </label>

  <input
    id="athlete-search"
    type="search"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    placeholder={
  'Search ' +
  stateName +
  ' athletes by name, school, sport, or position'
}
    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
  />
</div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {athletes.map((athlete) => (
          <article
            key={athlete.id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
          >
            <div className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
              {athlete.ranking}
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-2xl text-white shadow-md">
              {athlete.icon}
            </div>

            <h3 className="mt-5 text-xl font-black text-gray-950">
              {athlete.name}
            </h3>

            <p className="mt-1 text-sm font-bold text-red-600">
              {athlete.sport}
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-700">
              {athlete.school}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {athlete.details}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Top stat
                </p>

                <p className="text-lg font-black text-gray-950">
                  {athlete.stat}
                </p>
              </div>

              <Link
                href={`/athletes/${athlete.id}`}
                className="rounded-full bg-gray-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
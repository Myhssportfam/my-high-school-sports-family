import Link from 'next/link'
type TrendingAthletesProps = {
  stateName: string
}

const athletes = [
  {
    id: 'jordan-williams',
    name: 'Jordan Williams',
    sport: 'Football',
    details: 'Class of 2026',
    stat: '1,842 YDS',
  },
  {
    id: 'avery-johnson',
    name: 'Avery Johnson',
    sport: 'Basketball',
    details: 'Class of 2027',
    stat: '28.4 PPG',
  },
  {
    id: 'micah-thompson',
    name: 'Micah Thompson',
    sport: 'Baseball',
    details: 'Class of 2027 • Center Field',
    stat: '.421 AVG',
  },
]

export default function TrendingAthletes({
  stateName,
}: TrendingAthletesProps) {
  return (
    <section className="mt-8 rounded-2xl border bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
        Trending Athletes
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Trending in {stateName}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {athletes.map((athlete) => (
          <article
            key={athlete.id}
            className="rounded-2xl border bg-slate-50 p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
              {athlete.name.charAt(0)}
            </div>

            <h3 className="mt-4 text-lg font-bold">
              {athlete.name}
            </h3>

            <p className="text-sm font-semibold text-red-600">
              {athlete.sport}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {athlete.details}
            </p>

            <p className="mt-4 text-xl font-black">
              {athlete.stat}
            </p>

            <Link
              href={`/athlete/${athlete.id}`}
              className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              View Athlete
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
 
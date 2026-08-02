type TournamentCardProps = {
  title: string
  game: string
  homeState: string
  awayState: string
  date: string
  time: string
  registered: number
  capacity: number
  status: 'registration' | 'live' | 'scheduled'
  onJoin?: () => void
  onWatch?: () => void
}

export default function TournamentCard({
  title,
  game,
  homeState,
  awayState,
  date,
  time,
  registered,
  capacity,
  status,
  onJoin,
  onWatch,
}: TournamentCardProps) {
  const spotsRemaining = Math.max(capacity - registered, 0)
  const isFull = spotsRemaining === 0

  const statusText = {
    registration: 'Registration Open',
    live: 'Live Now',
    scheduled: 'Coming Soon',
  }[status]

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-red-700 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-widest">
            {statusText}
          </span>

          <span className="text-sm font-bold text-blue-100">
            {date} · {time}
          </span>
        </div>

        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-blue-100">
          {game}
        </p>

        <h3 className="mt-1 text-2xl font-black">{title}</h3>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Home
            </p>
            <p className="mt-2 text-xl font-black text-gray-950">
              {homeState}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold uppercase text-gray-400">Versus</p>
            <p className="text-2xl font-black text-red-600">VS</p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">
              Away
            </p>
            <p className="mt-2 text-xl font-black text-gray-950">
              {awayState}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm font-bold text-gray-700">
            <span>
              {registered} of {capacity} players registered
            </span>

            <span className={isFull ? 'text-red-600' : 'text-green-700'}>
              {isFull ? 'Event full' : `${spotsRemaining} spots left`}
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-700 transition-all"
              style={{
                width: `${Math.min((registered / capacity) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onJoin}
            disabled={isFull || status === 'live'}
            className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isFull
              ? 'Tournament Full'
              : status === 'live'
                ? 'Registration Closed'
                : `Join ${homeState} Team`}
          </button>

          <button
            type="button"
            onClick={onWatch}
            className="rounded-2xl border-2 border-blue-700 px-5 py-3 font-black text-blue-800 transition hover:bg-blue-50"
          >
            {status === 'live' ? 'Watch Live' : 'View Tournament'}
          </button>
        </div>
      </div>
    </article>
  )
}
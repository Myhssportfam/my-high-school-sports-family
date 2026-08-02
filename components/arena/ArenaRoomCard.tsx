type ArenaRoomCardProps = {
  title: string
  game: string
  homeState: string
  awayState: string
  players: number
  capacity: number
  viewers: number
  host: string
  startTime: string
  status: 'live' | 'open' | 'scheduled' | 'full'
  voiceChat?: boolean
  stateMember?: boolean
  onEnter?: () => void
  onWatch?: () => void
}

export default function ArenaRoomCard({
  title,
  game,
  homeState,
  awayState,
  players,
  capacity,
  viewers,
  host,
  startTime,
  status,
  voiceChat = true,
  stateMember = false,
  onEnter,
  onWatch,
}: ArenaRoomCardProps) {
  const roomFull = players >= capacity
  const canEnter = stateMember && !roomFull && status !== 'scheduled'

  const statusLabel = {
    live: 'Live Now',
    open: 'Room Open',
    scheduled: 'Starting Soon',
    full: 'Room Full',
  }[status]

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-gray-950 via-blue-950 to-red-800 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-widest">
            {statusLabel}
          </span>

          <span className="text-sm font-bold text-blue-100">
            Starts {startTime}
          </span>
        </div>

        <p className="mt-5 text-sm font-black uppercase tracking-widest text-blue-200">
          {game}
        </p>

        <h3 className="mt-2 text-3xl font-black">
          {title}
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-bold">
          <span className="rounded-full bg-blue-500/20 px-3 py-2">
            {homeState}
          </span>

          <span className="text-red-300">VS</span>

          <span className="rounded-full bg-red-500/20 px-3 py-2">
            {awayState}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Players
            </p>
            <p className="mt-2 text-xl font-black text-gray-950">
              {players} / {capacity}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Watching
            </p>
            <p className="mt-2 text-xl font-black text-gray-950">
              {viewers.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Host
            </p>
            <p className="mt-2 text-base font-black text-gray-950">
              {host}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Voice Chat
            </p>
            <p className="mt-2 text-base font-black text-gray-950">
              {voiceChat ? 'Enabled' : 'Off'}
            </p>
          </div>
        </div>

        {!stateMember && (
          <div className="mt-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="font-black text-yellow-900">
              Join your state family to play
            </p>
            <p className="mt-1 text-sm text-yellow-800">
              Visitors may watch, but only state family members can enter this room.
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onEnter}
            disabled={!canEnter}
            className="rounded-2xl bg-red-600 px-5 py-4 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {roomFull
              ? 'Room Full'
              : !stateMember
                ? 'Join State Family First'
                : status === 'scheduled'
                  ? 'Room Not Open Yet'
                  : 'Enter Dynasty Room'}
          </button>

          <button
            type="button"
            onClick={onWatch}
            className="rounded-2xl border-2 border-blue-700 px-5 py-4 font-black text-blue-800 transition hover:bg-blue-50"
          >
            Watch Room
          </button>
        </div>
      </div>
    </article>
  )
}
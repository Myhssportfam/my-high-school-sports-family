export default function Feed() {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] text-white shadow-xl">
      <div className="flex items-center gap-3 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-black">
          JW
        </div>

        <div>
          <h3 className="font-black">Jaden Williams</h3>
          <p className="text-xs text-slate-400">
            Texas · Football · 25 minutes ago
          </p>
        </div>

        <button className="ml-auto text-slate-400">•••</button>
      </div>

      <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-900 to-black text-8xl">
        🏈
      </div>

      <div className="p-5">
        <p className="text-sm leading-6 text-slate-200">
          Grind now, shine later. Representing Texas and building my sports
          story one game at a time.
        </p>

        <div className="mt-4 flex items-center gap-6 text-sm font-bold text-slate-400">
          <button>♡ 142</button>
          <button>💬 24</button>
          <button>↗ Share</button>
          <button className="ml-auto">🔖 Save</button>
        </div>
      </div>
    </article>
  )
}
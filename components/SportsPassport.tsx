type SportsPassportProps = {
  name: string;
  username?: string;
  avatarUrl?: string;
  sport?: string;
  role?: string;
  position?: string;
  school?: string;
  state?: string;
  classYear?: string;
  height?: string;
  weight?: string;
  followers?: number;
  achievements?: string[];
  verified?: boolean;
};

export default function SportsPassport({
  name,
  username,
  avatarUrl,
  sport = "Sports",
  role = "Sports Family Member",
  position,
  school,
  state,
  classYear,
  height,
  weight,
  followers = 0,
  achievements = [],
  verified = false,
}: SportsPassportProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-red-800 p-6 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                {name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
                MHSF Sports Passport
              </p>

              {verified && (
                <span className="rounded-full bg-blue-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider">
                  Verified
                </span>
              )}
            </div>

            <h2 className="mt-2 text-3xl font-black">
              {name}
            </h2>

            {username && (
              <p className="mt-1 text-sm text-white/70">
                @{username}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold">
                {sport}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                {role}
              </span>

              {position && (
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                  {position}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 px-5 py-4 text-center">
            <div className="text-2xl font-black">
              {followers.toLocaleString()}
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Followers
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            Sports Identity
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoCard label="School / Organization" value={school} />
            <InfoCard label="State Family" value={state} />
            <InfoCard label="Class" value={classYear} />
            <InfoCard label="Position / Role" value={position || role} />
            <InfoCard label="Height" value={height} />
            <InfoCard label="Weight" value={weight} />
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            Achievements
          </p>

          <div className="mt-4 space-y-2">
            {achievements.length > 0 ? (
              achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
                >
                  🏆 {achievement}
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No achievements added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-200 sm:grid-cols-4">
        <PassportButton label="Timeline" icon="📅" />
        <PassportButton label="Highlights" icon="🎥" />
        <PassportButton label="Stats" icon="📊" />
        <PassportButton label="Share Card" icon="🔗" />
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-bold text-slate-900">
        {value || "Not added"}
      </div>
    </div>
  );
}

function PassportButton({
  label,
  icon,
}: {
  label: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 border-r border-slate-200 px-4 py-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
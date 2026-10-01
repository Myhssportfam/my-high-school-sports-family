import Link from "next/link";

type ProfileConnectionsProps = {
  stateId?: string;
};

export default function ProfileConnections({
  stateId,
}: ProfileConnectionsProps) {
  const statePath = stateId
    ? `/states/${stateId.toLowerCase()}`
    : "/states";

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
        My Sports Family
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link
          href={statePath}
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          🏠 State Family
        </Link>

        <Link
          href="/live"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          🔴 Live
        </Link>

        <Link
          href="/arena"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          🎮 Arena
        </Link>

        <Link
          href="/live?tab=replays"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          📺 Replays
        </Link>

        <Link
          href="#accomplishments"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          🏆 Accomplishments
        </Link>
      </div>
    </section>
  );
}
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getArenaLeaderboard } from "../lib/arenaLive";
import { getSortedStateRankings } from "../lib/stateRankings";

export default function RankingsPage() {
const [arenaPlayers, setArenaPlayers] = useState<
  Awaited<ReturnType<typeof getArenaLeaderboard>>
>([]);

const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadRankings = async () => {
    try {
      const players = await getArenaLeaderboard();
      setArenaPlayers(players);
    } catch (error) {
      console.error("Failed to load national state rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  loadRankings();
}, []);

const rankings = useMemo(() => {
  const states = getSortedStateRankings().map((state) => ({
    ...state,

    // Arena totals will replace the temporary totals
    points: 0,
    wins: 0,
    losses: 0,

    // Tournament medals will be connected next
    gold: 0,
    silver: 0,
    bronze: 0,
  }));

  const stateMap = new Map(
    states.map((state) => [state.state.toLowerCase(), state])
  );

  arenaPlayers.forEach((player) => {
    const stateName = player.state?.trim();

    if (!stateName) return;

    const state = stateMap.get(stateName.toLowerCase());

    if (!state) return;

    state.wins += player.arenaWins || 0;
state.losses += player.arenaLosses || 0;
  });

  return states
  .map((state) => ({
    ...state,
    points: state.wins * 10,
  }))
  .filter((state) => state.wins > 0 || state.losses > 0)
  .sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    if (a.losses !== b.losses) {
      return a.losses - b.losses;
    }

    return a.state.localeCompare(b.state);
  })
  .map((state, index) => ({
    ...state,
    rank: index + 1,
  }));
}, [arenaPlayers]);

  const medal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
};

const ordinal = (rank: number) => {
  const lastTwo = rank % 100;

  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${rank}th`;
  }

  switch (rank % 10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
};

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            My High School Sports Family
          </p>

          <h1 className="text-3xl font-black sm:text-5xl">
            NATIONAL STATE RANKINGS
          </h1>

          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Every athlete competes for their state.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-3 items-end gap-3">

          {rankings[1] && (
            <div className="rounded-2xl border border-gray-700 bg-zinc-900 p-4 text-center">
              <div className="text-4xl">🥈</div>

              <div className="mt-2 text-lg font-black">
                {rankings[1].state}
              </div>

              <div className="text-sm text-gray-400">
                {rankings[1].points.toLocaleString()} pts
              </div>

              <div className="mt-3 flex h-20 items-center justify-center rounded-xl bg-gray-700 text-2xl font-black">
                2
              </div>
            </div>
          )}

          {rankings[0] && (
            <div className="rounded-2xl border border-yellow-500 bg-zinc-900 p-4 text-center">
              <div className="text-5xl">🥇</div>

              <div className="mt-2 text-xl font-black">
                {rankings[0].state}
              </div>

              <div className="text-sm text-yellow-400">
                {rankings[0].points.toLocaleString()} pts
              </div>

              <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-yellow-500 text-4xl font-black text-black">
                1
              </div>
            </div>
          )}

          {rankings[2] && (
            <div className="rounded-2xl border border-orange-800 bg-zinc-900 p-4 text-center">
              <div className="text-4xl">🥉</div>

              <div className="mt-2 text-lg font-black">
                {rankings[2].state}
              </div>

              <div className="text-sm text-gray-400">
                {rankings[2].points.toLocaleString()} pts
              </div>

              <div className="mt-3 flex h-16 items-center justify-center rounded-xl bg-orange-900 text-2xl font-black">
                3
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

          <div className="grid grid-cols-[55px_1fr_90px_55px_55px_55px] border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-xs font-bold uppercase text-gray-400">
            <div>Rank</div>
            <div>State</div>
            <div className="text-right">Points</div>
            <div className="text-center">🥇</div>
            <div className="text-center">🥈</div>
            <div className="text-center">🥉</div>
          </div>

          {rankings.map((state, index) => {
            const rank = state.rank;

            return (
              <Link
                key={state.state}
                href={`/states/${state.state
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="grid grid-cols-[55px_1fr_90px_55px_55px_55px] items-center border-b border-zinc-900 px-4 py-4 transition hover:bg-zinc-900"
              >
                <div className="font-black">
  {medal(rank)} {ordinal(rank)}
</div>

                <div>
                  <div className="font-bold">
                    {state.state}
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    {state.wins}-{state.losses}
                  </div>
                </div>

                <div className="text-right font-black">
                  {state.points.toLocaleString()}
                </div>

                <div className="text-center">
                  {state.gold}
                </div>

                <div className="text-center">
                  {state.silver}
                </div>

                <div className="text-center">
                  {state.bronze}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Rankings update as athletes compete in the Arena.
        </div>

      </div>
    </main>
  );
}
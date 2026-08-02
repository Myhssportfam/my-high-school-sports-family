import { useState } from 'react'

type StateMembershipGateProps = {
  defaultState?: string
  onJoin?: (state: string) => void
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Florida',
  'Georgia',
  'Michigan',
  'New York',
  'Ohio',
  'Texas',
]

export default function StateMembershipGate({
  defaultState = 'Texas',
  onJoin,
}: StateMembershipGateProps) {
  const [selectedState, setSelectedState] = useState(defaultState)
  const [joinedState, setJoinedState] = useState<string | null>(null)

  function handleJoin() {
    setJoinedState(selectedState)
    onJoin?.(selectedState)
  }

  if (joinedState) {
    return (
      <section className="rounded-3xl border border-green-400 bg-green-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Arena access unlocked
            </p>

            <h2 className="mt-2 text-2xl font-black text-gray-950">
              You joined the {joinedState} Sports Family
            </h2>

            <p className="mt-2 text-gray-600">
              You can now join rooms, enter tournaments, represent your state,
              and compete in State vs. State events.
            </p>
          </div>

          <div className="rounded-2xl bg-green-700 px-5 py-3 text-center font-bold text-white">
            ✓ {joinedState} Member
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-red-700 p-6 text-white md:p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
          Represent your home state
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Join Your State Family to Compete
        </h2>

        <p className="mt-3 max-w-3xl text-blue-100">
          Tournament players must join their state family before entering a
          gaming room, registering for an event, or representing their state.
          Visitors can still watch live matches.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-800">
            Choose your state
          </span>

          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-4 text-base font-semibold text-gray-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleJoin}
          className="rounded-2xl bg-red-600 px-7 py-4 font-black text-white transition hover:bg-red-700 active:scale-95"
        >
          Join {selectedState} Family
        </button>
      </div>
    </section>
  )
}
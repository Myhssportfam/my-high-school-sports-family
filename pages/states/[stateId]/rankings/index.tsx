import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { schools } from "../../../../lib/schoolData"

const STATES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
}

const SPORTS = [
  { key: "football", label: "Football" },
  { key: "basketball", label: "Basketball" },
  { key: "baseball", label: "Baseball" },
  { key: "soccer", label: "Soccer" },
  { key: "volleyball", label: "Volleyball" },
] as const

type SportKey = (typeof SPORTS)[number]["key"]

export default function StateRankingsPage() {
  const router = useRouter()
  const { stateId } = router.query

  const [selectedSportKey, setSelectedSportKey] =
    useState<SportKey>("football")

  const currentState = (
    (Array.isArray(stateId) ? stateId[0] : stateId) ?? ""
  ).toUpperCase()

  const stateName = STATES[currentState]
  const statePath = currentState.toLowerCase()

  const selectedSport =
    SPORTS.find((sport) => sport.key === selectedSportKey)?.label ??
    "Football"

  const stateSportRankings = Object.values(schools)
    .filter((school) => {
      const sport = school.sports?.[selectedSportKey]

      if (school.state.toUpperCase() !== currentState) return false
      if (!sport || !Number.isFinite(sport.rank)) return false

      // Preserve the existing Colorado 5A volleyball filter.
      if (
        currentState === "CO" &&
        selectedSportKey === "volleyball" &&
        school.classification !== "5A"
      ) {
        return false
      }

      return true
    })
    .map((school) => ({
      ...school,
      ...school.sports![selectedSportKey]!,
    }))
    .sort(
      (a, b) =>
        a.rank - b.rank || a.name.localeCompare(b.name)
    )

  if (!router.isReady) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-gray-700">
        Loading rankings…
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {stateName && (
          <Link
            href={`/states/${statePath}`}
            className="text-sm font-semibold text-red-600"
          >
            ← Back to {stateName} Sports Family
          </Link>
        )}

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-red-600">
          State Rankings
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          {stateName
            ? `${stateName} ${selectedSport} Rankings`
            : "Choose a State"}
        </h1>

        <p className="mt-2 text-gray-600">
          Browse high school rankings by state and sport.
        </p>

        <div className="mt-6 max-w-md">
          <label
            htmlFor="rankings-state"
            className="mb-2 block text-sm font-bold"
          >
            Select your state
          </label>

          <select
            id="rankings-state"
            value={stateName ? currentState : ""}
            onChange={(event) => {
              const nextState = event.target.value.toLowerCase()
              void router.push(`/states/${nextState}/rankings`)
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="" disabled>
              Choose a state
            </option>

            {Object.entries(STATES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {SPORTS.map((sport) => (
            <button
              key={sport.key}
              type="button"
              aria-pressed={selectedSportKey === sport.key}
              onClick={() => setSelectedSportKey(sport.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedSportKey === sport.key
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>

        {currentState === "CO" &&
          selectedSportKey === "volleyball" && (
            <p className="mt-4 text-sm text-gray-600">
              Showing Colorado 5A volleyball rankings.
            </p>
          )}

        <div className="mt-8">
          {!stateName ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              Select one of the 50 states above to view its rankings.
            </div>
          ) : stateSportRankings.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
              <h2 className="text-2xl font-bold">
                Rankings coming soon
              </h2>

              <p className="mt-3 text-gray-600">
                {stateName} {selectedSport.toLowerCase()} rankings
                have not been added yet.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Choose another state or sport to browse available
                rankings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
              <table className="w-full min-w-[700px] text-left">
                <thead className="border-b border-gray-300 bg-gray-100 text-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-4">
                      School
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Record
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Strength
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stateSportRankings.map((school) => (
                    <tr
                      key={school.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-5 font-bold">
                        #{school.rank}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/states/${statePath}/rankings/${school.id}`}
                            className="font-semibold hover:text-red-600 hover:underline"
                          >
                            {school.name}
                          </Link>

                          {school.classification && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                              {school.classification}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {school.city}, {stateName}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {school.record}
                      </td>
                      <td className="px-6 py-5">
                        {school.rating}
                      </td>
                      <td className="px-6 py-5">
                        {school.strength}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
import Link from "next/link"
import { useRouter } from "next/router"
import { schools } from "../../../../../lib/schoolData"
const schoolNames: Record<string, string> = {
  "cherry-creek": "Cherry Creek",
  "valor-christian": "Valor Christian",
  "ralston-valley": "Ralston Valley",
  "mountain-vista": "Mountain Vista",
  grandview: "Grandview",
  arapahoe: "Arapahoe",
  eaglecrest: "Eaglecrest",
  legend: "Legend",
  "palmer-ridge": "Palmer Ridge",
  "regis-jesuit": "Regis Jesuit",
}

export default function SchoolSchedulePage() {
  const router = useRouter()
  const { stateId, schoolId } = router.query
const id = typeof schoolId === "string" ? schoolId : ""
const school = schools[id]
  if (!router.isReady) {
    return null
  }

  const schoolName = school?.name || schoolNames[id] || "School"

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <Link
          href={`/states/${stateId}/rankings/${schoolId}`}
          className="font-semibold text-red-600"
        >
          ← Back to {schoolName}
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
            Football Schedule
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {schoolName} Football
          </h1>

          <p className="mt-2 text-gray-600">
            2026 schedule, scores and upcoming games
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border bg-white">

          <div className="grid grid-cols-4 gap-4 border-b bg-gray-100 px-6 py-4 text-sm font-bold">
            <span>Date</span>
            <span>Opponent</span>
            <span>Location</span>
            <span>Result</span>
          </div>

          {school?.schedule.map((game, index) => (
  <div
    key={index}
    className="grid grid-cols-4 gap-4 border-b px-6 py-5 last:border-b-0"
  >
    <span className="font-semibold">
      {game.date}
    </span>

    <span className="font-semibold">
      {game.opponent}
    </span>

    <span className="text-gray-600">
      {game.location}
    </span>

    <span
      className={
        game.result.startsWith("W")
          ? "font-bold text-green-600"
          : "font-semibold text-gray-700"
      }
    >
      {game.result}
    </span>
  </div>
))}

        </section>

      </div>
    </main>
  )
}
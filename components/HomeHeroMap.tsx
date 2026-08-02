import { useRouter } from "next/router"

type StateMarker = {
  name: string
  abbreviation: string
  slug: string
  left: string
  top: string
  isLive?: boolean
}


  const stateMarkers: StateMarker[] = [
  { name: "Washington", abbreviation: "WA", slug: "wa", left: "12%", top: "15%" },
  { name: "Oregon", abbreviation: "OR", slug: "or", left: "10%", top: "26%" },
  { name: "California", abbreviation: "CA", slug: "ca", left: "9%", top: "51%", isLive: true },
  { name: "Nevada", abbreviation: "NV", slug: "nv", left: "16%", top: "43%" },
  { name: "Idaho", abbreviation: "ID", slug: "id", left: "20%", top: "25%" },
  { name: "Montana", abbreviation: "MT", slug: "mt", left: "30%", top: "18%" },
  { name: "Wyoming", abbreviation: "WY", slug: "wy", left: "33%", top: "32%" },
  { name: "Utah", abbreviation: "UT", slug: "ut", left: "25%", top: "44%" },
  { name: "Arizona", abbreviation: "AZ", slug: "az", left: "25%", top: "59%" },
  { name: "Colorado", abbreviation: "CO", slug: "co", left: "36%", top: "45%", isLive: true },
  { name: "New Mexico", abbreviation: "NM", slug: "nm", left: "35%", top: "62%" },

  { name: "North Dakota", abbreviation: "ND", slug: "nd", left: "45%", top: "20%" },
  { name: "South Dakota", abbreviation: "SD", slug: "sd", left: "45%", top: "31%" },
  { name: "Nebraska", abbreviation: "NE", slug: "ne", left: "46%", top: "41%" },
  { name: "Kansas", abbreviation: "KS", slug: "ks", left: "47%", top: "51%" },
  { name: "Oklahoma", abbreviation: "OK", slug: "ok", left: "48%", top: "62%" },
  { name: "Texas", abbreviation: "TX", slug: "tx", left: "45%", top: "77%", isLive: true },

  { name: "Minnesota", abbreviation: "MN", slug: "mn", left: "56%", top: "21%" },
  { name: "Iowa", abbreviation: "IA", slug: "ia", left: "57%", top: "37%" },
  { name: "Missouri", abbreviation: "MO", slug: "mo", left: "58%", top: "49%" },
  { name: "Arkansas", abbreviation: "AR", slug: "ar", left: "58%", top: "63%" },
  { name: "Louisiana", abbreviation: "LA", slug: "la", left: "59%", top: "76%" },

  { name: "Wisconsin", abbreviation: "WI", slug: "wi", left: "64%", top: "27%" },
  { name: "Illinois", abbreviation: "IL", slug: "il", left: "65%", top: "43%" },
  { name: "Michigan", abbreviation: "MI", slug: "mi", left: "71%", top: "27%", isLive: true },
  { name: "Indiana", abbreviation: "IN", slug: "in", left: "70%", top: "44%" },
  { name: "Ohio", abbreviation: "OH", slug: "oh", left: "75%", top: "43%", isLive: true },

  { name: "Kentucky", abbreviation: "KY", slug: "ky", left: "72%", top: "53%" },
  { name: "Tennessee", abbreviation: "TN", slug: "tn", left: "72%", top: "61%" },
  { name: "Mississippi", abbreviation: "MS", slug: "ms", left: "66%", top: "71%" },
  { name: "Alabama", abbreviation: "AL", slug: "al", left: "72%", top: "71%" },
  { name: "Georgia", abbreviation: "GA", slug: "ga", left: "78%", top: "70%", isLive: true },
  { name: "Florida", abbreviation: "FL", slug: "fl", left: "83%", top: "85%", isLive: true },

  { name: "West Virginia", abbreviation: "WV", slug: "wv", left: "80%", top: "49%" },
  { name: "Virginia", abbreviation: "VA", slug: "va", left: "84%", top: "52%" },
  { name: "North Carolina", abbreviation: "NC", slug: "nc", left: "85%", top: "60%" },
  { name: "South Carolina", abbreviation: "SC", slug: "sc", left: "82%", top: "66%" },

  { name: "Pennsylvania", abbreviation: "PA", slug: "pa", left: "83%", top: "39%" },
  { name: "New York", abbreviation: "NY", slug: "ny", left: "87%", top: "29%", isLive: true },
  { name: "Vermont", abbreviation: "VT", slug: "vt", left: "91%", top: "21%" },
  { name: "New Hampshire", abbreviation: "NH", slug: "nh", left: "94%", top: "22%" },
  { name: "Maine", abbreviation: "ME", slug: "me", left: "97%", top: "13%" },
  { name: "Massachusetts", abbreviation: "MA", slug: "ma", left: "95%", top: "29%" },
  { name: "Rhode Island", abbreviation: "RI", slug: "ri", left: "97%", top: "32%" },
  { name: "Connecticut", abbreviation: "CT", slug: "ct", left: "94%", top: "34%" },
  { name: "New Jersey", abbreviation: "NJ", slug: "nj", left: "89%", top: "41%" },
  { name: "Delaware", abbreviation: "DE", slug: "de", left: "89%", top: "47%" },
  { name: "Maryland", abbreviation: "MD", slug: "md", left: "86%", top: "47%" },

  { name: "Alaska", abbreviation: "AK", slug: "ak", left: "19%", top: "84%" },
  { name: "Hawaii", abbreviation: "HI", slug: "hi", left: "31%", top: "90%" },
]

export default function HomeHeroMap() {
  const router = useRouter()

  return (
    <div className="relative h-full min-h-[525px] w-full overflow-hidden bg-[#07111d]">
      <img
        src="/images/us-satellite-map.jpg"
        alt="Interactive United States sports map"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-slate-950/20" />

      {stateMarkers.map((state) => (
        <button
          key={state.slug}
          type="button"
          onClick={() => router.push(`/states/${state.slug}`)}
          className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: state.left, top: state.top }}
          aria-label={`Open ${state.name} sports community`}
        >
          <span
            className={`flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-white px-2 text-xs font-black text-white shadow-lg transition group-hover:scale-110 ${
              state.isLive ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {state.abbreviation}
          </span>

          {state.isLive && (
            <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-red-500" />
          )}
        </button>
      ))}

      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/70 px-5 py-2 text-sm font-semibold text-white">
        📍 Click on your state to join your community
      </div>
    </div>
  )
}
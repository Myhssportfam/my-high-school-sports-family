import { useRouter } from "next/router"
import { USAMap } from "react-usa-map-fc"

export default function ClickableUSMap() {
  const router = useRouter()

  const handleStateClick = (stateAbbreviation: string) => {
    router.push(`/states/${stateAbbreviation.toLowerCase()}`)
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-slate-950 p-4">
      <div className="mx-auto flex w-full justify-center">
        <USAMap
          width={960}
          height={600}
          defaultFill="#486b32"
          onClick={handleStateClick}
        />
      </div>

      <p className="mt-3 text-center text-sm text-white">
        Click your state to enter its sports community
      </p>
    </div>
  )
}
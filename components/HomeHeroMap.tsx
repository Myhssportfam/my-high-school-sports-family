import USMap from "./USMap"

export default function HomeHeroMap() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-transparent">
      <div className="mx-auto h-full w-full max-w-[820px]">
        <USMap height={500} />
      </div>
    </div>
  )
}
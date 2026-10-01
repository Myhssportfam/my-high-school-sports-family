import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const STATE_SLUGS: Record<string, string> = {
  Alabama: "al",
  Alaska: "ak",
  Arizona: "az",
  Arkansas: "ar",
  California: "ca",
  Colorado: "co",
  Connecticut: "ct",
  Delaware: "de",
  Florida: "fl",
  Georgia: "ga",
  Hawaii: "hi",
  Idaho: "id",
  Illinois: "il",
  Indiana: "in",
  Iowa: "ia",
  Kansas: "ks",
  Kentucky: "ky",
  Louisiana: "la",
  Maine: "me",
  Maryland: "md",
  Massachusetts: "ma",
  Michigan: "mi",
  Minnesota: "mn",
  Mississippi: "ms",
  Missouri: "mo",
  Montana: "mt",
  Nebraska: "ne",
  Nevada: "nv",
  "New Hampshire": "nh",
  "New Jersey": "nj",
  "New Mexico": "nm",
  "New York": "ny",
  "North Carolina": "nc",
  "North Dakota": "nd",
  Ohio: "oh",
  Oklahoma: "ok",
  Oregon: "or",
  Pennsylvania: "pa",
  "Rhode Island": "ri",
  "South Carolina": "sc",
  "South Dakota": "sd",
  Tennessee: "tn",
  Texas: "tx",
  Utah: "ut",
  Vermont: "vt",
  Virginia: "va",
  Washington: "wa",
  "West Virginia": "wv",
  Wisconsin: "wi",
  Wyoming: "wy",
};
const STATE_INFO: Record<
  string,
  {
    athletes: string;
    schools: string;
    live: string;
    sports: string;
    members: string;
    followers: string;
  }
> = {
  Texas: {
    athletes: "12,480",
    schools: "842",
    live: "326",
    sports: "🏈 🏀 ⚾ ⚽",
    members: "48.2K",
followers: "126K",
  },
  California: {
    athletes: "14,210",
    schools: "1,020",
    live: "412",
    sports: "🏈 🏀 ⚾ 🏐",
    members: "56.8K",
followers: "148K",
  },
  Florida: {
    athletes: "10,940",
    schools: "716",
    live: "289",
    sports: "🏈 🏀 ⚾ ⚽",
    members: "42.5K",
followers: "119K",
  },
  Colorado: {
    athletes: "6,420",
    schools: "412",
    live: "184",
    sports: "🏈 🏀 ⚾ 🏐",
    members: "24.7K",
followers: "68.4K",
  },
};
const STATE_LABELS: Record<
  string,
  { abbr: string; x: number; y: number }
> = {
  Alabama: { abbr: "AL", x: 568, y: 350 },
  Alaska: { abbr: "AK", x: 130, y: 430 },
  Arizona: { abbr: "AZ", x: 180, y: 320 },
  Arkansas: { abbr: "AR", x: 455, y: 330 },
  California: { abbr: "CA", x: 105, y: 275 },
  Colorado: { abbr: "CO", x: 285, y: 255 },
  Connecticut: { abbr: "CT", x: 700, y: 175 },
  Delaware: { abbr: "DE", x: 690, y: 245 },
  Florida: { abbr: "FL", x: 635, y: 425 },
  Georgia: { abbr: "GA", x: 610, y: 345 },
  Hawaii: { abbr: "HI", x: 240, y: 450 },
  Idaho: { abbr: "ID", x: 205, y: 145 },
  Illinois: { abbr: "IL", x: 505, y: 225 },
  Indiana: { abbr: "IN", x: 545, y: 225 },
  Iowa: { abbr: "IA", x: 450, y: 195 },
  Kansas: { abbr: "KS", x: 365, y: 275 },
  Kentucky: { abbr: "KY", x: 555, y: 285 },
  Louisiana: { abbr: "LA", x: 470, y: 390 },
  Maine: { abbr: "ME", x: 735, y: 95 },
  Maryland: { abbr: "MD", x: 670, y: 245 },
  Massachusetts: { abbr: "MA", x: 710, y: 155 },
  Michigan: { abbr: "MI", x: 555, y: 160 },
  Minnesota: { abbr: "MN", x: 430, y: 120 },
  Mississippi: { abbr: "MS", x: 520, y: 355 },
  Missouri: { abbr: "MO", x: 460, y: 265 },
  Montana: { abbr: "MT", x: 290, y: 110 },
  Nebraska: { abbr: "NE", x: 370, y: 215 },
  Nevada: { abbr: "NV", x: 145, y: 235 },
  "New Hampshire": { abbr: "NH", x: 715, y: 125 },
  "New Jersey": { abbr: "NJ", x: 700, y: 215 },
  "New Mexico": { abbr: "NM", x: 270, y: 335 },
  "New York": { abbr: "NY", x: 665, y: 155 },
  "North Carolina": { abbr: "NC", x: 650, y: 305 },
  "North Dakota": { abbr: "ND", x: 380, y: 115 },
  Ohio: { abbr: "OH", x: 590, y: 220 },
  Oklahoma: { abbr: "OK", x: 385, y: 325 },
  Oregon: { abbr: "OR", x: 130, y: 140 },
  Pennsylvania: { abbr: "PA", x: 640, y: 205 },
  "Rhode Island": { abbr: "RI", x: 725, y: 175 },
  "South Carolina": { abbr: "SC", x: 625, y: 330 },
  "South Dakota": { abbr: "SD", x: 380, y: 165 },
  Tennessee: { abbr: "TN", x: 560, y: 315 },
  Texas: { abbr: "TX", x: 355, y: 375 },
  Utah: { abbr: "UT", x: 220, y: 235 },
  Vermont: { abbr: "VT", x: 700, y: 115 },
  Virginia: { abbr: "VA", x: 640, y: 275 },
  Washington: { abbr: "WA", x: 135, y: 85 },
  "West Virginia": { abbr: "WV", x: 620, y: 255 },
  Wisconsin: { abbr: "WI", x: 490, y: 150 },
  Wyoming: { abbr: "WY", x: 285, y: 190 },
};
export default function USMap({
  height = 470,
}: {
  width?: number;
  height?: number;
}) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
const [hoveredState, setHoveredState] = useState<string | null>(null);
const [hoverPosition, setHoverPosition] = useState({
  x: 400,
  y: 250,
  containerWidth: 800,
});
  const updateHoverPosition = (event: React.MouseEvent<SVGPathElement>) => {
    const container = mapContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setHoverPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      containerWidth: rect.width,
    });
  };
  const cardWidth = Math.min(270, Math.max(0, hoverPosition.containerWidth - 20));
  const cardLeft = Math.max(
    10,
    Math.min(hoverPosition.x + 18, hoverPosition.containerWidth - cardWidth - 10)
  );
  const openState = (stateName: string) => {
    const slug = STATE_SLUGS[stateName];

    if (!slug) return;

    router.push(`/states/${slug}`);
  };

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        minHeight: height,
        background: "transparent",
        position: "relative",
      }}
    >
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 990,
        }}
        width={800}
        height={500}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
        }}
      >
       <defs>
  <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#9a7445" />
    <stop offset="28%" stopColor="#b38b55" />
    <stop offset="48%" stopColor="#71834a" />
    <stop offset="68%" stopColor="#3f7137" />
    <stop offset="100%" stopColor="#244f2d" />
  </linearGradient>

  <filter id="terrainTexture">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.025"
      numOctaves="4"
      seed="7"
      result="noise"
    />
    <feColorMatrix
      in="noise"
      type="saturate"
      values="0.4"
      result="texture"
    />
    <feBlend
      in="SourceGraphic"
      in2="texture"
      mode="soft-light"
    />
  </filter>
</defs>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const isState = Boolean(STATE_SLUGS[stateName]);

              if (!isState) return null;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${stateName} Sports Family`}
                  onClick={() => openState(stateName)}
onMouseEnter={(event) => {
  setHoveredState(stateName);
  updateHoverPosition(event);
}}
onMouseMove={updateHoverPosition}
onMouseLeave={() => setHoveredState(null)}  
onFocus={() => setHoveredState(stateName)}
onBlur={() => setHoveredState(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openState(stateName);
                    }
                  }}
                 style={{
  default: {
  fill: stateName === "California" ||
        stateName === "Nevada" ||
        stateName === "Arizona" ||
        stateName === "New Mexico" ||
        stateName === "Utah"
    ? "#8b6b45"
    : stateName === "Colorado" ||
      stateName === "Wyoming" ||
      stateName === "Montana" ||
      stateName === "Idaho"
    ? "#6f7b45"
    : "#315f33",
  stroke: "#ffffff",
  strokeWidth: 0.8,
  outline: "none",
  cursor: "pointer",
},
  hover: {
    fill: "rgba(47,107,216,0.35)",
    stroke: "#ffffff",
    strokeWidth: 1.1,
    outline: "none",
    cursor: "pointer",
  },
  pressed: {
    fill: "rgba(220,38,38,0.45)",
    stroke: "#ffffff",
    strokeWidth: 1.1,
    outline: "none",
    cursor: "pointer",
  },
}}
                />
              );
            })
          }
        </Geographies>
      
      </ComposableMap>
      {hoveredState && (
  <div
  className="absolute z-30 w-[270px] rounded-2xl border border-white/20 bg-[#07111f]/95 p-4 text-white shadow-2xl backdrop-blur-md"
  style={{
    left: cardLeft,
    maxWidth: "calc(100% - 20px)",
    top: Math.max(hoverPosition.y - 80, 10),
    pointerEvents: "auto",
  }}
  onMouseEnter={() => setHoveredState(hoveredState)}
  onMouseLeave={() => setHoveredState(null)}
>
    <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
      Sports Family
    </div>

    <div className="mt-1 text-xl font-black">
      {hoveredState}
    </div>

    <div className="mt-2 text-lg">
      {STATE_INFO[hoveredState]?.sports ?? "🏈 🏀 ⚾ 🏐"}
    </div>

    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
      <div>
        <div className="font-black">
          {STATE_INFO[hoveredState]?.athletes ?? "5,000+"}
        </div>
        <div className="text-[10px] text-white/60">
          Athletes
        </div>
      </div>

      <div>
        <div className="font-black">
          {STATE_INFO[hoveredState]?.schools ?? "300+"}
        </div>
        <div className="text-[10px] text-white/60">
          Schools
        </div>
      </div>

      <div>
        <div className="font-black text-red-400">
          {STATE_INFO[hoveredState]?.live ?? "100+"}
        </div>
        <div className="text-[10px] text-white/60">
          Live
        </div>
      </div>
    </div>

   <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
  <button
    type="button"
    onClick={() => openState(hoveredState)}
    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-500"
  >
    View Community
  </button>

  <button
    type="button"
    onClick={() =>
      router.push(`/live?state=${STATE_SLUGS[hoveredState]}`)
    }
    className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20"
  >
    Live Games
    </button>
    </div>
    </div>
      )}

      </div>
  );
}

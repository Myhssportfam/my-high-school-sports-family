import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { UserProfile } from "../types/user";
const STATE_NAMES: Record<string, string> = {
  al: "Alabama",
  ak: "Alaska",
  az: "Arizona",
  ar: "Arkansas",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  de: "Delaware",
  fl: "Florida",
  ga: "Georgia",
  hi: "Hawaii",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ia: "Iowa",
  ks: "Kansas",
  ky: "Kentucky",
  la: "Louisiana",
  me: "Maine",
  md: "Maryland",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  ms: "Mississippi",
  mo: "Missouri",
  mt: "Montana",
  ne: "Nebraska",
  nv: "Nevada",
  nh: "New Hampshire",
  nj: "New Jersey",
  nm: "New Mexico",
  ny: "New York",
  nc: "North Carolina",
  nd: "North Dakota",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  sd: "South Dakota",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  vt: "Vermont",
  va: "Virginia",
  wa: "Washington",
  wv: "West Virginia",
  wi: "Wisconsin",
  wy: "Wyoming",
};

export default function AthletesPage() {
  const router = useRouter();
const [athletes, setAthletes] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
  const stateFilter =
    typeof router.query.state === "string"
      ? router.query.state.toLowerCase()
      : "";

  const selectedStateName =
    STATE_NAMES[stateFilter] || "National";
    
useEffect(() => {
  async function loadAthletes() {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "users"));

      const allAthletes = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const filtered = stateFilter
        ? allAthletes.filter((athlete: any) => {
            const athleteState = (
              athlete.state ||
              athlete.stateId ||
              athlete.stateSlug ||
              ""
            )
              .toString()
              .toLowerCase();

            return athleteState === stateFilter;
          })
        : allAthletes;

      setAthletes(filtered);
    } catch (error) {
      console.error("Failed to load athletes:", error);
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  }

  loadAthletes();
}, [stateFilter]);
const filteredAthletes = stateFilter
  ? athletes.filter((athlete: any) => {
      const athleteStateId = String(
        athlete.stateId || ""
      ).toLowerCase();

      const athleteStateName = String(
        athlete.state ||
        athlete.stateName ||
        athlete.stateCommunity ||
        ""
      ).toLowerCase();

      const currentStateId = String(stateFilter).toLowerCase();
      const currentStateName = String(selectedStateName || "").toLowerCase();

      return (
        athleteStateId === currentStateId ||
        athleteStateName === currentStateName
      );
    })
  : athletes;
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            My High School Sports Family
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {stateFilter
              ? `${selectedStateName} Athletes`
              : "Athletes"}
          </h1>

          {loading ? (
  <p className="mt-4 text-white/60">
    Loading athletes...
  </p>
) : filteredAthletes.length === 0 ? (
  <p className="mt-4 text-white/60">
    No athlete profiles found for {selectedStateName}.
  </p>
) : (
  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {filteredAthletes.map((athlete: any) => (
      <button
        key={athlete.id}
        type="button"
        onClick={() => router.push(`/athletes/${athlete.id}`)}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
      >
        <div className="text-lg font-black">
          {athlete.displayName ||
            athlete.name ||
            athlete.fullName ||
            "Athlete"}
        </div>

        <div className="mt-1 text-sm text-white/60">
          {athlete.school || athlete.schoolName || "School not listed"}
        </div>

        <div className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-400">
          {Array.isArray(athlete.sports)
            ? athlete.sports.join(" • ")
            : athlete.sport || "Athlete"}
        </div>
      </button>
    ))}
  </div>
)}
            <p className="mt-4 text-sm text-white/60">
  {stateFilter
    ? `Discover athletes representing the ${selectedStateName} Sports Family.`
    : "Discover high school athletes from across the country."}
</p>

        {stateFilter && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(`/states/${stateFilter}`)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-bold"
            >
              ← {selectedStateName} Community
            </button>

            <button
              type="button"
              onClick={() => router.push(`/live?state=${stateFilter}`)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-bold"
            >
              Live
            </button>

            <button
              type="button"
              onClick={() => router.push(`/arena?state=${stateFilter}`)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-bold"
            >
              Arena
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">
            {stateFilter
              ? `${selectedStateName} Athlete Directory`
              : "National Athlete Directory"}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {athletes.length === 0 ? (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-white/60">
      No athlete profiles found yet.
    </div>
  ) : (
    athletes.map((athlete: any) => (
      <button
        key={athlete.id}
        type="button"
        onClick={() => router.push(`/athletes/${athlete.id}`)}
        className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-blue-500/50 hover:bg-white/10"
      >
        <div className="flex items-center gap-4">
          <img
            src={
              athlete.avatar ||
              athlete.profileImage ||
              athlete.photo ||
              "/default-avatar.png"
            }
            alt={athlete.name || "Athlete"}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="min-w-0">
            <div className="truncate text-lg font-black text-white">
              {athlete.name || "Athlete"}
            </div>

            <div className="mt-1 truncate text-sm text-white/60">
              {athlete.school ||
                athlete.schoolName ||
                "School not listed"}
            </div>

            <div className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-400">
              {Array.isArray(athlete.sports)
                ? athlete.sports.join(" • ")
                : athlete.sport || "Athlete"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
          {athlete.position && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              {athlete.position}
            </span>
          )}

          {athlete.gradYear && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Class of {athlete.gradYear}
            </span>
          )}

          {athlete.city && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              {athlete.city}
            </span>
          )}
        </div>

        <div className="mt-5 font-bold text-blue-400">
          View Profile →
        </div>
      </button>
    ))
  )}
</div>
        </div>
      </div>
      </div>
    </main>
  );
}
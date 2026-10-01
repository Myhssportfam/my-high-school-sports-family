import { useState } from "react";

export const SPORTS_ACTIVITIES = [
  "Football",
  "Baseball",
  "Softball",
  "Boys Basketball",
  "Girls Basketball",
  "Soccer",
  "Volleyball",
  "Track & Field",
  "Cross Country",
  "Wrestling",
  "Swimming & Diving",
  "Tennis",
  "Golf",
  "Lacrosse",
  "Hockey",
  "Gymnastics",
  "Cheerleading",
  "Pom / Dance",
  "Marching Band",
  "Color Guard",
  "Bowling",
  "Esports",
  "Other",
];

export const PROFILE_ROLES = [
  "Athlete",
  "Cheerleader",
  "Pom / Dance",
  "Band Member",
  "Color Guard",
  "Coach",
  "Trainer",
  "Team Manager",
  "Alumni",
  "Fan / Supporter",
];

type SportsIdentityProps = {
  initialActivity?: string;
  initialRole?: string;
  onChange?: (data: {
    activity: string;
    role: string;
  }) => void;
};

export default function SportsIdentity({
  initialActivity = "",
  initialRole = "",
  onChange,
}: SportsIdentityProps) {
  const [activity, setActivity] = useState(initialActivity);
  const [role, setRole] = useState(initialRole);

  function updateActivity(value: string) {
    setActivity(value);
    onChange?.({
      activity: value,
      role,
    });
  }

  function updateRole(value: string) {
    setRole(value);
    onChange?.({
      activity,
      role: value,
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          My Sports Identity
        </p>

        <h2 className="mt-1 text-xl font-black text-white">
          What do you represent?
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Choose your sport, activity, and role in the sports family.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-white">
            Sport / Activity
          </label>

          <select
            value={activity}
            onChange={(e) => updateActivity(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          >
            <option value="">Choose activity</option>

            {SPORTS_ACTIVITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-white">
            Profile Role
          </label>

          <select
            value={role}
            onChange={(e) => updateRole(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">Choose role</option>

            {PROFILE_ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(activity || role) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {activity && (
            <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
              {activity}
            </span>
          )}

          {role && (
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              {role}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
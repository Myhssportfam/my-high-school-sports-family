
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
type Accomplishment = {
  id: string;
  title: string;
  year?: string;
  description?: string;
  icon?: string;
};

type AthleteAccomplishmentsProps = {
  athleteId: string;
  accomplishments?: Accomplishment[];
};

export default function AthleteAccomplishments({
  athleteId,
  accomplishments = [],
}: AthleteAccomplishmentsProps) {
  const [items, setItems] = useState<Accomplishment[]>(accomplishments);
  const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🏆");

  useEffect(() => {
    setItems(accomplishments);
  }, [accomplishments]);

  const handleAdd = async () => {
  if (!title.trim()) return;

  const updatedItems = editingId
    ? items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: title.trim(),
              year: year.trim(),
              description: description.trim(),
              icon,
            }
          : item
      )
    : [
        {
          id: `${Date.now()}`,
          title: title.trim(),
          year: year.trim(),
          description: description.trim(),
          icon,
        },
        ...items,
      ];

  try {
    setItems(updatedItems);

    await updateDoc(doc(db, "users", athleteId), {
      accomplishments: updatedItems,
    });

    setTitle("");
    setYear("");
    setDescription("");
    setIcon("🏆");
    setEditingId(null);
    setShowForm(false);
  } catch (error) {
    console.error("Error saving accomplishment:", error);
    setItems(items);
  }
};

const handleDelete = async (id: string) => {
  const updatedItems = items.filter((item) => item.id !== id);

  try {
    setItems(updatedItems);

    await updateDoc(doc(db, "users", athleteId), {
      accomplishments: updatedItems,
    });
  } catch (error) {
    console.error("Error deleting accomplishment:", error);
    setItems(items);
  }
};
const handleEdit = (item: Accomplishment) => {
  setEditingId(item.id);
  setTitle(item.title);
  setYear(item.year || "");
  setDescription(item.description || "");
  setIcon(item.icon || "🏆");
  setShowForm(true);
};
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-red-600">
            Career
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Accomplishments
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
        >
          {showForm ? "Cancel" : "+ Add Accomplishment"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-black text-slate-900">
            Add to your sports legacy
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Accomplishment
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: First Team All-State"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Year
              </label>

              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2026"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Type
              </label>

              <select
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              >
                <option value="🏆">🏆 Championship / Award</option>
                <option value="🥇">🥇 Honor</option>
                <option value="⭐">⭐ All-State / All-Conference</option>
                <option value="📈">📈 Record / Milestone</option>
                <option value="🎓">🎓 College Offer</option>
                <option value="✍️">✍️ Commitment</option>
                <option value="🔥">🔥 Player of the Week</option>
                <option value="🏅">🏅 Other Achievement</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>

              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add details..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!title.trim()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to Profile
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
          <div className="text-4xl">🏅</div>

          <p className="mt-3 font-bold text-slate-900">
            Build your sports legacy
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Championships, awards, records, honors, offers and career milestones
            will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="text-3xl">{item.icon || "🏆"}</div>

              <div className="min-w-0 flex-1">
                <button
  type="button"
  onClick={() => handleDelete(item.id)}
  className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
>
  Delete
</button>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900">
                    {item.title}
                  </h3>

                  {item.year && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                      {item.year}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
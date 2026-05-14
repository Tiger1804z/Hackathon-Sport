"use client";

import { useState, useTransition } from "react";
import { createMatch } from "@/server/actions/matches";

type Team = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  teams: Team[];
};

export default function CreateMatchModal({
  open,
  onClose,
  teams,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    teamAId: "",
    teamBId: "",
    date: "",
    location: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.teamAId === form.teamBId) {
      alert("A team cannot play against itself");
      return;
    }

    startTransition(async () => {
      try {
        await createMatch({
          teamAId: form.teamAId,
          teamBId: form.teamBId,
          date: new Date(form.date),
          location: form.location,
        });

        alert("Match created");
        onClose();

        setForm({
          teamAId: "",
          teamBId: "",
          date: "",
          location: "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to create match");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Create Match</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TEAM A */}
          <div>
            <label className="text-sm font-medium">Team A</label>
            <select
              name="teamAId"
              value={form.teamAId}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* TEAM B */}
          <div>
            <label className="text-sm font-medium">Team B</label>
            <select
              name="teamBId"
              value={form.teamBId}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Montreal Stadium"
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={isPending}
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              {isPending ? "Creating..." : "Create"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
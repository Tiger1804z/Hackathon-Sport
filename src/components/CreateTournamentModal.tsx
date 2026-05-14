"use client";

import { useState, useTransition } from "react";
import { createTournament } from "@/server/actions/tournaments";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateTournamentModal({
  open,
  onClose,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    sport: "",
    city: "",
    startDate: "",
    entryFee: 0,
    currency: "CAD",
  });

  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "entryFee"
          ? Number(e.target.value)
          : e.target.value,
    }));

    setError(null); // clear error while typing
  }

  function validate() {
    if (form.name.trim().length < 2) return "Name must be at least 2 characters";
    if (form.sport.trim().length < 2) return "Sport must be at least 2 characters";
    if (form.city.trim().length < 2) return "City must be at least 2 characters";
    if (!form.startDate) return "Start date is required";
    if (form.entryFee < 0) return "Entry fee cannot be negative";

    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      try {
        await createTournament({
          name: form.name.trim(),
          sport: form.sport.trim(),
          city: form.city.trim(),
          startDate: new Date(form.startDate),
          entryFee: form.entryFee,
          currency: form.currency,
        });

        onClose();

        setForm({
          name: "",
          sport: "",
          city: "",
          startDate: "",
          entryFee: 0,
          currency: "CAD",
        });

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to create tournament");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Tournament</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Tournament Name"
          />

          {/* SPORT */}
          <input
            name="sport"
            value={form.sport}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Sport"
          />

          {/* CITY */}
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="City"
          />

          {/* DATE */}
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* ENTRY FEE */}
          <input
            type="number"
            name="entryFee"
            value={form.entryFee}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Entry Fee (cents)"
          />

          {/* CURRENCY */}
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
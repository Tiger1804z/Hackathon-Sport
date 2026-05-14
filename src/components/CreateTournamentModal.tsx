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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "entryFee"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        await createTournament({
          name: form.name,
          sport: form.sport,
          city: form.city,
          startDate: new Date(form.startDate),
          entryFee: form.entryFee,
          currency: form.currency,
        });

        alert("Tournament created");

        onClose();

        setForm({
          name: "",
          sport: "",
          city: "",
          startDate: "",
          entryFee: 0,
          currency: "CAD",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to create tournament");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Create Tournament
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">
              Tournament Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Montreal Spring Cup"
            />
          </div>

          {/* SPORT */}
          <div>
            <label className="text-sm font-medium">
              Sport
            </label>

            <input
              name="sport"
              value={form.sport}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Football"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-sm font-medium">
              City
            </label>

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Montreal"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm font-medium">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* ENTRY FEE */}
          <div>
            <label className="text-sm font-medium">
              Entry Fee (in cents)
            </label>

            <input
              type="number"
              name="entryFee"
              value={form.entryFee}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="0"
            />
          </div>

          {/* CURRENCY */}
          <div>
            <label className="text-sm font-medium">
              Currency
            </label>

            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </div>

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
              className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
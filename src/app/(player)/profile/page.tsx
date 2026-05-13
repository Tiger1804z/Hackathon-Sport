"use client";

import { useState } from "react";
import PlayerHeader from "@/components/PlayerHeader";

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    city: "",
    favoriteSport: "",
    level: "BEGINNER",
    position: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("PROFILE SUBMIT:", form);

    // later → call Server Action (updatePlayerProfile)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-3xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            My Profile
          </h1>

          <p className="text-gray-600 mt-2">
            Complete your profile so teams can find you and understand your play style.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 space-y-5"
        >
          {/* FULL NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="John Doe"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-sm font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Montreal"
            />
          </div>

          {/* SPORT */}
          <div>
            <label className="text-sm font-medium">Favorite Sport</label>
            <input
              name="favoriteSport"
              value={form.favoriteSport}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Football, Basketball..."
            />
          </div>

          {/* LEVEL */}
          <div>
            <label className="text-sm font-medium">Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* POSITION */}
          <div>
            <label className="text-sm font-medium">
              Preferred Position (optional)
            </label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              placeholder="Striker, Defender..."
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save Profile
          </button>
        </form>
      </section>
    </main>
  );
}
"use client";

import { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomePage() {
  const [role, setRole] = useState<"PLAYER" | "ORGANIZER" | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Sports League Platform
      </h1>

      <p className="text-gray-600">
        Join teams, create tournaments, play locally.
      </p>

      {/* ROLE SELECTION */}
      <div className="flex gap-4">
        <button
          onClick={() => setRole("PLAYER")}
          className={`px-4 py-2 rounded border ${
            role === "PLAYER" ? "bg-black text-white" : ""
          }`}
        >
          PLAYER
        </button>

        <button
          onClick={() => setRole("ORGANIZER")}
          className={`px-4 py-2 rounded border ${
            role === "ORGANIZER" ? "bg-black text-white" : ""
          }`}
        >
          ORGANIZER
        </button>
      </div>

      {/* AUTH BUTTONS */}
      <div className="flex gap-4">
        <SignInButton>
          <button className="px-4 py-2 bg-black text-white rounded">
            Sign in
          </button>
        </SignInButton>

        <SignUpButton>
          <button
            disabled={!role}
            className={`px-4 py-2 rounded border ${
              !role ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Sign up
          </button>
        </SignUpButton>
      </div>

      {!role && (
        <p className="text-red-500 text-sm">
          Please select a role before signing up
        </p>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function HomePage() {
  const [role, setRole] = useState<"PLAYER" | "ORGANIZER" | null>(null);
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="w-full border-b">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Sports League
          </Link>

          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button
                    disabled={!role}
                    className={`px-4 py-2 rounded-lg border transition ${
                      !role
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton
                  mode="modal"
                  unsafeMetadata={{
                    role: role ?? "PLAYER",
                  }}
                >
                  <button
                    disabled={!role}
                    className={`px-4 py-2 rounded-lg transition ${
                      !role
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-black text-white hover:opacity-90"
                    }`}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Sports League Platform
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl">
            Join local teams, create tournaments, and connect with players in your city.
          </p>
        </div>

        {/* ROLE SELECTION */}
        <div className="flex gap-4">
          <button
            onClick={() => setRole("PLAYER")}
            className={`px-6 py-3 rounded-xl border transition ${
              role === "PLAYER" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            PLAYER
          </button>

          <button
            onClick={() => setRole("ORGANIZER")}
            className={`px-6 py-3 rounded-xl border transition ${
              role === "ORGANIZER"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            ORGANIZER
          </button>
        </div>

        {!role && (
          <p className="text-sm text-red-500">
            Please select a role before signing up
          </p>
        )}
      </section>
    </main>
  );
}
"use client";

import Link from "next/link";
import { UserButton, useClerk } from "@clerk/nextjs";

export default function PlayerHeader() {
  const { signOut } = useClerk();

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/teams"
          className="text-2xl font-bold tracking-tight"
        >
          Sports League
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/teams" className="hover:text-gray-500 transition">
            Teams
          </Link>

          <Link href="/matches" className="hover:text-gray-500 transition">
            Matches
          </Link>

          <Link href="/my-requests" className="hover:text-gray-500 transition">
            My Requests
          </Link>

          <Link href="/profile" className="hover:text-gray-500 transition">
            Profile
          </Link>
        </nav>

        {/* USER */}
        <div className="flex items-center gap-3">
          <UserButton />

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => signOut()}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function OrganizerHeader() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/dashboard"
          className="text-2xl font-bold tracking-tight"
        >
          Organizer Panel
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="hover:text-gray-500 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/tournaments"
            className="hover:text-gray-500 transition"
          >
            Tournaments
          </Link>

          <Link
            href="/requests"
            className="hover:text-gray-500 transition"
          >
            Requests
          </Link>
        </nav>

        {/* USER */}
        <div className="flex items-center gap-3">
          <UserButton />
        </div>

      </div>
    </header>
  );
}
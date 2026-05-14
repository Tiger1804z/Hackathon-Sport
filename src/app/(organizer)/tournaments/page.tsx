import OrganizerHeader from "@/components/OrganizerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CreateTournamentController from "@/components/CreateTournamentController";
import Link from "next/link";

export default async function TournamentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const tournaments = await prisma.tournament.findMany({
    where: {
      organizerId: user.id,
    },
    include: {
      teams: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <OrganizerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Tournaments</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your sports competitions.
            </p>
          </div>

          <CreateTournamentController />
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">
                {tournament.name}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                Teams: {tournament.teams.length}
              </p>

              {/* CTA */}
              <div className="mt-5 flex gap-2">

                {/* ✅ FIX: use Link instead of router */}
                <Link
                  href={`/tournaments/${tournament.id}`}
                  className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                >
                  Details
                </Link>

                <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
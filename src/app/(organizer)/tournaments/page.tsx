import OrganizerHeader from "@/components/OrganizerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CreateTournamentController from "@/components/CreateTournamentController";

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
            <h1 className="text-4xl font-bold">
              Tournaments
            </h1>

            <p className="text-gray-600 mt-2">
              Create and manage your sports competitions.
            </p>
          </div>

          {/* ✅ MODAL TRIGGER */}
          <CreateTournamentController />
        </div>

        {/* EMPTY STATE */}
        {tournaments.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No tournaments yet
            </h2>

            <p className="text-gray-600 mt-2">
              Create your first tournament to get started.
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {tournament.sport}
                </span>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {tournament.city}
                </span>
              </div>

              {/* NAME */}
              <h2 className="text-xl font-semibold">
                {tournament.name}
              </h2>

              {/* INFO */}
              <p className="text-sm text-gray-600 mt-2">
                Starts:{" "}
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                Teams: {tournament.teams.length}
              </p>

              <p className="text-sm mt-2">
                Entry fee:{" "}
                <span className="font-medium">
                  {tournament.entryFee === 0
                    ? "Free"
                    : `$${tournament.entryFee / 100} ${tournament.currency}`}
                </span>
              </p>

              {/* CTA */}
              <div className="mt-5 flex gap-2">
                <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100">
                  Manage
                </button>

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
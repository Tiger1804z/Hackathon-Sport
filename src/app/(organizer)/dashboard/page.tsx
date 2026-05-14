import OrganizerHeader from "@/components/OrganizerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CreateTournamentController from "@/components/CreateTournamentController";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  // REAL DATA
  const [tournaments, teams, pendingRequests] = await Promise.all([
    prisma.tournament.findMany({
      where: { organizerId: user.id },
      include: { teams: true },
      orderBy: { createdAt: "desc" },
    }),

    prisma.team.count({
      where: {
        tournament: {
          organizerId: user.id,
        },
      },
    }),

    prisma.joinRequest.count({
      where: {
        status: "PENDING",
        team: {
          tournament: {
            organizerId: user.id,
          },
        },
      },
    }),
  ]);

  const stats = {
    totalTournaments: tournaments.length,
    totalTeams: teams,
    pendingRequests,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <OrganizerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Organizer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your tournaments, teams, and requests.
            </p>
          </div>

          <CreateTournamentController />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">Tournaments</p>
            <p className="text-3xl font-bold mt-2">
              {stats.totalTournaments}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">Teams</p>
            <p className="text-3xl font-bold mt-2">
              {stats.totalTeams}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">
              {stats.pendingRequests}
            </p>
          </div>
        </div>

        {/* TOURNAMENT LIST */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">My Tournaments</h2>

          <div className="space-y-4">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">
                    {t.teams.length} teams •{" "}
                    {t.entryFee === 0
                      ? "Free"
                      : `$${t.entryFee / 100}`}
                  </p>
                </div>

                <a
                  href={`/tournaments/${t.id}`}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
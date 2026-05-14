import OrganizerHeader from "@/components/OrganizerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import TournamentMatchesSection from "@/components/TournamentMatchesSection";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TournamentDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const tournament = await prisma.tournament.findFirst({
    where: {
      id,
      organizerId: user.id,
    },
    include: {
      teams: {
        include: {
          members: true,

          matchesAsTeamA: {
            include: {
              teamA: true,
              teamB: true,
            },
          },

          matchesAsTeamB: {
            include: {
              teamA: true,
              teamB: true,
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  const totalPlayers = tournament.teams.reduce(
    (sum, team) => sum + team.members.length,
    0
  );

  const matches = tournament.teams.flatMap((team) => [
    ...team.matchesAsTeamA,
    ...team.matchesAsTeamB,
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <OrganizerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            {tournament.name}
          </h1>

          <p className="text-gray-600 mt-2">
            {tournament.sport} • {tournament.city}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Starts:{" "}
            {new Date(
              tournament.startDate
            ).toLocaleDateString()}
          </p>

          <p className="mt-2 text-sm">
            Entry fee:{" "}
            <span className="font-medium">
              {tournament.entryFee === 0
                ? "Free"
                : `$${tournament.entryFee / 100} ${
                    tournament.currency
                  }`}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Teams
            </p>

            <p className="text-3xl font-bold mt-2">
              {tournament.teams.length}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Players
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalPlayers}
            </p>
          </div>

        </div>

        <div className="bg-white border rounded-xl p-6 mb-10">

          <h2 className="text-xl font-semibold mb-4">
            Teams
          </h2>

          <div className="space-y-3">
            {tournament.teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {team.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {team.members.length} players
                  </p>
                </div>

                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                  {team.members.length}/
                  {team.maxCapacity}
                </span>
              </div>
            ))}
          </div>

        </div>

        <TournamentMatchesSection
          tournamentId={tournament.id}
          teams={tournament.teams}
          matches={matches}
        />

      </section>
    </main>
  );
}
import PlayerHeader from "@/components/PlayerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import JoinTeamButton from "@/components/JoinTeamButton";

export default async function TeamsPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const teams = await prisma.team.findMany({
    include: {
      tournament: true,
      _count: {
        select: { members: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* HERO */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Find Teams Near You
          </h1>

          <p className="text-gray-600 mt-2 max-w-2xl">
            Join existing teams and start playing competitively.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => {
            const isFull =
              team._count.members >= team.maxCapacity;

            return (
              <div
                key={team.id}
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                    {team.tournament.sport}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {team.tournament.city}
                  </span>
                </div>

                {/* NAME */}
                <h2 className="text-xl font-semibold">
                  {team.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  📍 {team.tournament.city}
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  👥 {team._count.members} / {team.maxCapacity}
                </p>

                {/* BAR */}
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-black rounded-full"
                    style={{
                      width: `${
                        (team._count.members / team.maxCapacity) * 100
                      }%`,
                    }}
                  />
                </div>

                {/* ACTION */}
                <div className="mt-6">
                  <JoinTeamButton
                    teamId={team.id}
                    disabled={isFull}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
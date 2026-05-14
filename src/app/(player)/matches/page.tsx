import PlayerHeader from "@/components/PlayerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function MatchesPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

const matches = await prisma.match.findMany({
  include: {
    teamA: {
      include: {
        tournament: true,
      },
    },
    teamB: true,
  },
  orderBy: {
    date: "asc",
  },
});

  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover Matches Near You
          </h1>

          <p className="text-gray-600 mt-2 max-w-2xl">
            Join a game, support your team, or check upcoming local matches.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
            >
              
              {/* TOP BADGE */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {match.teamA.tournament?.sport ?? "Match"}
                </span>

                {match.scoreA != null ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Finished
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Upcoming
                  </span>
                )}
              </div>

              {/* TEAMS */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="font-semibold">{match.teamA.name}</p>
                  <p className="text-xs text-gray-500">Home</p>
                </div>

                <div className="text-2xl font-bold">
                  {match.scoreA != null ? (
                    <span>
                      {match.scoreA} - {match.scoreB}
                    </span>
                  ) : (
                    <span className="text-gray-400">VS</span>
                  )}
                </div>

                <div className="text-center">
                  <p className="font-semibold">{match.teamB.name}</p>
                  <p className="text-xs text-gray-500">Away</p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-6 text-sm text-gray-600 space-y-1">
                <p>
                  📅 {new Date(match.date).toLocaleDateString()} •{" "}
                  {new Date(match.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>📍 {match.location}</p>
              </div>

              {/* CTA */}
              <button className="mt-6 w-full py-2 rounded-lg border hover:bg-gray-100 transition text-sm">
                View Match Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
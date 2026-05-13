import PlayerHeader from "@/components/PlayerHeader";

const matches = [
  {
    id: 1,
    teamA: "Montreal Wolves",
    teamB: "Laval Titans",
    date: "May 18, 2026",
    time: "7:00 PM",
    location: "Montreal Stadium",
    scoreA: 2,
    scoreB: 1,
    sport: "Football",
  },
  {
    id: 2,
    teamA: "Quebec Strikers",
    teamB: "Downtown FC",
    date: "May 20, 2026",
    time: "6:30 PM",
    location: "Quebec Arena",
    scoreA: null,
    scoreB: null,
    sport: "Football",
  },
];

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* HERO IDEA (MEETUP STYLE) */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover Matches Near You 
          </h1>

          <p className="text-gray-600 mt-2 max-w-2xl">
            Join a game, support your team, or check upcoming local matches.
            Think of it as a Meetup for sports — connect, play, compete.
          </p>
        </div>

        {/* MATCH GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
            >
              
              {/* TOP BADGE */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {match.sport}
                </span>

                {match.scoreA !== null ? (
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
                  <p className="font-semibold">{match.teamA}</p>
                  <p className="text-xs text-gray-500">Home</p>
                </div>

                <div className="text-2xl font-bold">
                  {match.scoreA !== null ? (
                    <span>
                      {match.scoreA} - {match.scoreB}
                    </span>
                  ) : (
                    <span className="text-gray-400">VS</span>
                  )}
                </div>

                <div className="text-center">
                  <p className="font-semibold">{match.teamB}</p>
                  <p className="text-xs text-gray-500">Away</p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-6 text-sm text-gray-600 space-y-1">
                <p>📅 {match.date} • {match.time}</p>
                <p>📍 {match.location}</p>
              </div>

              {/* CTA STYLE */}
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
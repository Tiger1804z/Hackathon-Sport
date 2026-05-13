import PlayerHeader from "@/components/PlayerHeader";

const teams = [
  {
    id: 1,
    name: "Montreal Wolves",
    sport: "Football",
    city: "Montreal",
    members: 8,
    maxCapacity: 15,
    level: "INTERMEDIATE",
  },
  {
    id: 2,
    name: "Laval Titans",
    sport: "Football",
    city: "Laval",
    members: 12,
    maxCapacity: 15,
    level: "BEGINNER",
  },
  {
    id: 3,
    name: "Quebec Strikers",
    sport: "Football",
    city: "Quebec",
    members: 15,
    maxCapacity: 15,
    level: "ADVANCED",
  },
];

export default function TeamsPage() {
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
            Join existing teams, meet players, and start competing in local tournaments.
            Think of it as discovering groups to play your favorite sport.
          </p>
        </div>

        {/* SEARCH BAR (UI ONLY FOR NOW) */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Search teams by name or city..."
            className="w-full px-4 py-2 border rounded-lg bg-white"
          />

          <button className="px-4 py-2 bg-black text-white rounded-lg">
            Search
          </button>
        </div>

        {/* TEAM GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => {
            const isFull = team.members >= team.maxCapacity;

            return (
              <div
                key={team.id}
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                    {team.sport}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {team.level}
                  </span>
                </div>

                {/* NAME */}
                <h2 className="text-xl font-semibold">{team.name}</h2>

                <p className="text-sm text-gray-600 mt-1">
                  📍 {team.city}
                </p>

                {/* MEMBERS */}
                <p className="text-sm text-gray-600 mt-3">
                  👥 {team.members} / {team.maxCapacity} members
                </p>

                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-black rounded-full"
                    style={{
                      width: `${(team.members / team.maxCapacity) * 100}%`,
                    }}
                  />
                </div>

                {/* ACTION */}
                <button
                  disabled={isFull}
                  className={`mt-6 w-full py-2 rounded-lg text-sm transition ${
                    isFull
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:opacity-90"
                  }`}
                >
                  {isFull ? "Team Full" : "Request to Join"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
import OrganizerHeader from "@/components/OrganizerHeader";

export default function DashboardPage() {

  const stats = {
    totalTournaments: 4,
    totalTeams: 18,
    pendingRequests: 7,
  };

  const tournaments = [
    {
      id: 1,
      name: "Montreal Spring Cup",
      teams: 6,
      entryFee: 500,
    },
    {
      id: 2,
      name: "Laval Winter League",
      teams: 4,
      entryFee: 0,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <OrganizerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Organizer Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Overview of your tournaments, teams, and requests.
          </p>
        </div>

        {/* STATS CARDS */}
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

          <h2 className="text-xl font-semibold mb-4">
            My Tournaments
          </h2>

          <div className="space-y-4">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">
                    {t.teams} teams •{" "}
                    {t.entryFee === 0
                      ? "Free"
                      : `$${t.entryFee / 100}`}
                  </p>
                </div>

                <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                  View
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
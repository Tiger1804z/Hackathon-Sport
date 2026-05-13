import Link from "next/link";
import OrganizerHeader from "@/components/OrganizerHeader";

export default function TournamentsPage() {
  // prisma.tournament.findMany({ where: { organizerId } }) 
  const tournaments = [
    {
      id: "1",
      name: "Montreal Spring Cup",
      sport: "Football",
      city: "Montreal",
      startDate: "2026-05-20",
      entryFee: 500,
      teamsCount: 6,
    },
    {
      id: "2",
      name: "Laval Winter League",
      sport: "Basketball",
      city: "Laval",
      startDate: "2026-06-10",
      entryFee: 0,
      teamsCount: 4,
    },
  ];

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

          <Link
            href="/tournaments/new"
            className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            + New Tournament
          </Link>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {t.sport}
                </span>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {t.city}
                </span>
              </div>

              {/* NAME */}
              <h2 className="text-xl font-semibold">
                {t.name}
              </h2>

              {/* INFO */}
              <p className="text-sm text-gray-600 mt-2">
                Starts: {t.startDate}
              </p>

              <p className="text-sm text-gray-600">
                Teams: {t.teamsCount}
              </p>

              <p className="text-sm mt-2">
                Entry fee:{" "}
                <span className="font-medium">
                  {t.entryFee === 0
                    ? "Free"
                    : `$${t.entryFee / 100}`}
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
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
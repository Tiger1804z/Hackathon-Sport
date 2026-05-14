import PlayerHeader from "@/components/PlayerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import JoinTeamButton from "@/components/JoinTeamButton";
import Link from "next/link";

type Props = {
  searchParams?: {
    city?: string;
    sport?: string;
    available?: string;
  };
};

export default async function TeamsPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const city = searchParams?.city;
  const sport = searchParams?.sport;
  const availableOnly = searchParams?.available === "true";

  const teams = await prisma.team.findMany({
    where: {
      ...(city && {
        tournament: {
          city: { contains: city, mode: "insensitive" },
        },
      }),
      ...(sport && {
        tournament: {
          sport: { contains: sport, mode: "insensitive" },
        },
      }),
    },
    include: {
      tournament: true,
      members: true,
      _count: {
        select: { members: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredTeams = availableOnly
    ? teams.filter((t) => t._count.members < t.maxCapacity)
    : teams;

  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Find Teams</h1>
          <p className="text-gray-600 mt-2">
            Search and join available teams.
          </p>
        </div>

        {/* FILTERS (FIXED: uses GET params properly) */}
        <form className="bg-white border rounded-xl p-4 mb-8 flex flex-wrap gap-3">

          <input
            type="text"
            name="city"
            defaultValue={city}
            placeholder="City (e.g. Montreal)"
            className="px-3 py-2 border rounded-lg text-sm"
          />

          <input
            type="text"
            name="sport"
            defaultValue={sport}
            placeholder="Sport (e.g. Football)"
            className="px-3 py-2 border rounded-lg text-sm"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="available"
              defaultChecked={availableOnly}
              value="true"
            />
            Available only
          </label>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            Apply
          </button>
        </form>

        {/* EMPTY */}
        {filteredTeams.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold">No teams found</h2>
            <p className="text-gray-600 mt-2">
              Try adjusting filters.
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTeams.map((team) => {
            const isFull = team._count.members >= team.maxCapacity;

            return (
              <div
                key={team.id}
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
              >

                {/* HEADER */}
                <div className="flex justify-between mb-3">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">
                    {team.tournament.sport}
                  </span>

                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded">
                    {team.tournament.city}
                  </span>
                </div>

                {/* NAME */}
                <h2 className="text-xl font-semibold">
                  {team.name}
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  Tournament: {team.tournament.name}
                </p>

                {/* CAPACITY */}
                <p className="text-sm mt-3">
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

                {/* ACTIONS */}
                <div className="mt-6 flex gap-2">

                  <JoinTeamButton
                    teamId={team.id}
                    disabled={isFull}
                  />

                  <Link
                    href={`/teams/${team.id}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            );
          })}
        </div>

      </section>
    </main>
  );
}
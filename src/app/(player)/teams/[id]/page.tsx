import PlayerHeader from "@/components/PlayerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeamDetailsPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  // ✅ FIX: unwrap params
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      tournament: true,
      members: true,
      _count: {
        select: { members: true },
      },
    },
  });

  if (!team) {
    return notFound();
  }

  const currentPlayers = team._count.members;
  const maxPlayers = team.maxCapacity;
  const isFull = currentPlayers >= maxPlayers;

  return (
    <main className="min-h-screen bg-gray-50">
      <PlayerHeader />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold">{team.name}</h1>

          <p className="text-gray-600 mt-2">
            {team.tournament.sport} • {team.tournament.name}
          </p>

          <p className="text-sm text-gray-500">
            City: {team.tournament.city}
          </p>

          <p className="mt-3 font-medium">
            Places available: {currentPlayers} / {maxPlayers}
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
            <div
              className="h-2 bg-black rounded-full"
              style={{
                width: `${(currentPlayers / maxPlayers) * 100}%`,
              }}
            />
          </div>

          {isFull && (
            <p className="text-red-500 text-sm mt-2">
              Team is full
            </p>
          )}
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Members</h2>

          {team.members.length === 0 ? (
            <p className="text-gray-500">No members yet</p>
          ) : (
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <p className="font-medium">
                    {member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member.email || "Unknown Player"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {member.email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
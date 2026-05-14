import OrganizerHeader from "@/components/OrganizerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  acceptJoinRequest,
  rejectJoinRequest,
} from "@/server/actions/join-requests";

export default async function RequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const requests = await prisma.joinRequest.findMany({
    where: {
      team: {
        tournament: {
          organizerId: user.id,
        },
      },
    },

    include: {
      player: true,

      team: {
        include: {
          tournament: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  function statusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function paymentColor(status: string) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "NOT_REQUIRED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <OrganizerHeader />

      <section className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Join Requests
          </h1>

          <p className="text-gray-600 mt-2">
            Approve or reject players joining teams.
          </p>
        </div>

        {requests.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold">
              No join requests
            </h2>

            <p className="text-gray-600 mt-2">
              Requests from players will appear here.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border rounded-2xl p-6 flex items-center justify-between"
            >

              <div>
                <h2 className="text-lg font-semibold">
                  {req.player.firstName && req.player.lastName
                    ? `${req.player.firstName} ${req.player.lastName}`
                    : req.player.email}
                </h2>

                <p className="text-sm text-gray-500">
                  {req.team.name} • {req.team.tournament.sport}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Requested on{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-3">

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${statusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${paymentColor(
                      req.paymentStatus
                    )}`}
                  >
                    {req.paymentStatus}
                  </span>

                </div>
              </div>

              <div className="flex flex-col gap-2">

                {req.status === "PENDING" && (
                  <>
                    <form
                      action={async () => {
                        "use server";

                        await acceptJoinRequest({
                          id: req.id,
                        });
                      }}
                    >
                      <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:opacity-90">
                        Accept
                      </button>
                    </form>

                    <form
                      action={async () => {
                        "use server";

                        await rejectJoinRequest({
                          id: req.id,
                        });
                      }}
                    >
                      <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                        Reject
                      </button>
                    </form>
                  </>
                )}

                {req.status === "ACCEPTED" &&
                  req.paymentStatus === "PAID" && (
                    <button className="px-4 py-2 text-sm border rounded-lg">
                      View Player
                    </button>
                  )}

              </div>

            </div>
          ))}
        </div>

      </section>
    </main>
  );
}
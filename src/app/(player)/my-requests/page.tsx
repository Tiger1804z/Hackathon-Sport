import PlayerHeader from "@/components/PlayerHeader";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function MyRequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const requests = await prisma.joinRequest.findMany({
    where: {
      playerId: user.id,
    },
    include: {
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

  function getStatusColor(status: string) {
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

  function getPaymentColor(status: string) {
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
      <PlayerHeader />

      <section className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            My Join Requests
          </h1>

          <p className="text-gray-600 mt-2">
            Track the status of your team applications and payments.
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {requests.length === 0 && (
            <div className="bg-white border rounded-2xl p-6 text-center text-gray-600">
              No join requests yet.
            </div>
          )}

          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border rounded-2xl p-6 flex items-center justify-between"
            >
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold">
                  {req.team.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {req.team.tournament.sport} • Requested on{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getPaymentColor(
                      req.paymentStatus
                    )}`}
                  >
                    Payment: {req.paymentStatus}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTIONS (UI only for now) */}
              <div className="flex flex-col gap-2">
                {req.status === "PENDING" && (
                  <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                    Cancel Request
                  </button>
                )}

                {req.status === "ACCEPTED" &&
                  req.paymentStatus === "PENDING" && (
                    <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:opacity-90">
                      Pay Now
                    </button>
                  )}

                {req.status === "ACCEPTED" &&
                  req.paymentStatus === "PAID" && (
                    <button className="px-4 py-2 text-sm border rounded-lg">
                      View Team
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
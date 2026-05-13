import OrganizerHeader from "@/components/OrganizerHeader";

export default function RequestsPage() {
  // prisma.joinRequest.findMany({ where: { team: { tournament: ... }}})
  const requests = [
    {
      id: "1",
      playerName: "John Doe",
      teamName: "Montreal Wolves",
      sport: "Football",
      status: "PENDING",
      paymentStatus: "NOT_REQUIRED",
      createdAt: "2026-05-10",
    },
    {
      id: "2",
      playerName: "Sarah Lee",
      teamName: "Laval Titans",
      sport: "Football",
      status: "ACCEPTED",
      paymentStatus: "PAID",
      createdAt: "2026-05-09",
    },
    {
      id: "3",
      playerName: "Mike Brown",
      teamName: "Quebec Strikers",
      sport: "Football",
      status: "PENDING",
      paymentStatus: "PENDING",
      createdAt: "2026-05-08",
    },
  ];

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

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Join Requests
          </h1>

          <p className="text-gray-600 mt-2">
            Approve or reject players joining teams.
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border rounded-2xl p-6 flex items-center justify-between"
            >

              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold">
                  {req.playerName}
                </h2>

                <p className="text-sm text-gray-500">
                  {req.teamName} • {req.sport}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Requested on {req.createdAt}
                </p>

                {/* BADGES */}
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

              {/* ACTIONS */}
              <div className="flex flex-col gap-2">
                {req.status === "PENDING" && (
                  <>
                    <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:opacity-90">
                      Accept
                    </button>

                    <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                      Reject
                    </button>
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
"use client";

import { useState } from "react";
import CreateMatchModal from "@/components/CreateMatchModal";

type Props = {
  tournamentId: string;
  teams: {
    id: string;
    name: string;
  }[];
  matches: {
    id: string;
    date: Date;
    location: string;
    teamA: { id: string; name: string };
    teamB: { id: string; name: string };
    scoreA?: number | null;
    scoreB?: number | null;
  }[];
};

export default function TournamentMatchesSection({
  tournamentId,
  teams,
  matches,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Matches</h2>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
        >
          + Create Match
        </button>
      </div>

      {/* MATCH LIST */}
      <div className="bg-white border rounded-xl p-6">
        {matches.length === 0 ? (
          <p className="text-gray-500">No matches yet</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                {/* LEFT SIDE */}
                <div>
                  <p className="font-semibold">
                    {match.teamA.name} vs {match.teamB.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    {match.location}
                  </p>
                </div>

                {/* SCORE */}
                <div className="text-right">
                  {match.scoreA !== null && match.scoreB !== null ? (
                    <p className="font-bold">
                      {match.scoreA} - {match.scoreB}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Not played</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <CreateMatchModal
        open={open}
        onClose={() => setOpen(false)}
        teams={teams}
      />
    </div>
  );
}
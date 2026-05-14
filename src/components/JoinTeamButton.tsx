"use client";

import { useTransition } from "react";
import { createJoinRequest } from "@/server/actions/join-requests";

export default function JoinTeamButton({
  teamId,
  disabled,
}: {
  teamId: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createJoinRequest({
          teamId,
          message: "",
        });

        alert("Request sent!");
      } catch (err) {
        console.error(err);
        alert("Failed to join team");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPending}
      className={`w-full py-2 rounded-lg text-sm transition ${
        disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-black text-white hover:opacity-90"
      }`}
    >
      {disabled ? "Team Full" : isPending ? "Sending..." : "Request to Join"}
    </button>
  );
}
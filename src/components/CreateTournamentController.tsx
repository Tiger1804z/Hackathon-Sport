"use client";

import { useState } from "react";
import CreateTournamentModal from "./CreateTournamentModal";

export default function CreateTournamentController() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90"
      >
        + New Tournament
      </button>

      <CreateTournamentModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
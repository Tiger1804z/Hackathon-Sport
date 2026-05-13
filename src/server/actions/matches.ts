"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createMatchSchema,
  updateMatchScoreSchema,
  type CreateMatchInput,
  type UpdateMatchScoreInput,
} from "@/lib/validations/schema";

export async function createMatch(input: CreateMatchInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = createMatchSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { teamAId, teamBId, date, location } = result.data;

  const [teamA, teamB] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamAId }, include: { tournament: true } }),
    prisma.team.findUnique({ where: { id: teamBId } }),
  ]);

  if (!teamA || !teamB) throw new Error("Team not found");
  if (teamA.tournamentId !== teamB.tournamentId) throw new Error("Teams must be in the same tournament");
  if (teamA.tournament.organizerId !== organizer.id && organizer.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const match = await prisma.match.create({
    data: { teamAId, teamBId, date, location },
  });

  revalidatePath(`/tournaments/${teamA.tournamentId}`);
  return match;
}

export async function updateMatchScore(input: UpdateMatchScoreInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = updateMatchScoreSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { id, scoreA, scoreB } = result.data;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { teamA: { include: { tournament: true } } },
  });
  if (!match) throw new Error("Match not found");
  if (
    match.teamA.tournament.organizerId !== organizer.id &&
    organizer.role !== "ADMIN"
  ) {
    throw new Error("Forbidden");
  }

  const updated = await prisma.match.update({
    where: { id },
    data: { scoreA, scoreB },
  });

  revalidatePath(`/tournaments/${match.teamA.tournamentId}`);
  return updated;
}
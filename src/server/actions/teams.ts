"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createTeamSchema,
  updateTeamSchema,
  type CreateTeamInput,
  type UpdateTeamInput,
} from "@/lib/validations/schema";

export async function createTeam(input: CreateTeamInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = createTeamSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { tournamentId, ...data } = result.data;

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) throw new Error("Tournament not found");
  if (tournament.organizerId !== organizer.id && organizer.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const team = await prisma.team.create({
    data: { ...data, tournamentId },
  });

  revalidatePath(`/tournaments/${tournamentId}`);
  return team;
}

export async function updateTeam(input: UpdateTeamInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = updateTeamSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { id, ...data } = result.data;

  const team = await prisma.team.findUnique({
    where: { id },
    include: { tournament: true },
  });
  if (!team) throw new Error("Team not found");
  if (team.tournament.organizerId !== organizer.id && organizer.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const updated = await prisma.team.update({ where: { id }, data });

  revalidatePath(`/tournaments/${team.tournamentId}`);
  return updated;
}

export async function deleteTeam(id: string) {
  const organizer = await requireRole("ORGANIZER");

  const team = await prisma.team.findUnique({
    where: { id },
    include: { tournament: true },
  });
  if (!team) throw new Error("Team not found");
  if (team.tournament.organizerId !== organizer.id && organizer.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  await prisma.team.delete({ where: { id } });

  revalidatePath(`/tournaments/${team.tournamentId}`);
}

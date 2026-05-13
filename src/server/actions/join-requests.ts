"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole, getCurrentUser } from "@/lib/auth";
import {
  createJoinRequestSchema,
  joinRequestIdSchema,
  type CreateJoinRequestInput,
  type JoinRequestIdInput,
} from "@/lib/validations/schema";

export async function createJoinRequest(input: CreateJoinRequestInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");

  const result = createJoinRequestSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { teamId, message } = result.data;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { _count: { select: { members: true } } },
  });
  if (!team) throw new Error("Team not found");
  if (team._count.members >= team.maxCapacity) throw new Error("Team is full");

  const existing = await prisma.joinRequest.findUnique({
    where: { playerId_teamId: { playerId: user.id, teamId } },
  });
  if (existing) throw new Error("Request already exists");

  const joinRequest = await prisma.joinRequest.create({
    data: { playerId: user.id, teamId, message },
  });

  revalidatePath(`/tournaments`);
  return joinRequest;
}

export async function cancelJoinRequest(input: JoinRequestIdInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");

  const result = joinRequestIdSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { id } = result.data;

  const joinRequest = await prisma.joinRequest.findUnique({ where: { id } });
  if (!joinRequest) throw new Error("Join request not found");
  if (joinRequest.playerId !== user.id) throw new Error("Forbidden");
  if (joinRequest.status !== "PENDING") throw new Error("Cannot cancel a non-pending request");

  await prisma.joinRequest.delete({ where: { id } });

  revalidatePath(`/tournaments`);
}

export async function acceptJoinRequest(input: JoinRequestIdInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = joinRequestIdSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { id } = result.data;

  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id },
    include: { team: { include: { tournament: true } } },
  });
  if (!joinRequest) throw new Error("Join request not found");
  if (
    joinRequest.team.tournament.organizerId !== organizer.id &&
    organizer.role !== "ADMIN"
  ) {
    throw new Error("Forbidden");
  }

  await prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({
      where: { id: joinRequest.teamId },
      include: { _count: { select: { members: true } } },
    });
    if (!team) throw new Error("Team not found");
    if (team._count.members >= team.maxCapacity) throw new Error("Team is full");

    // Verrou optimiste — échoue si version changée par tx concurrente
    const locked = await tx.team.updateMany({
      where: { id: team.id, version: team.version },
      data: { version: { increment: 1 } },
    });
    if (locked.count === 0) throw new Error("Concurrent modification, please retry");

    await tx.joinRequest.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    await tx.team.update({
      where: { id: team.id },
      data: { members: { connect: { id: joinRequest.playerId } } },
    });
  });

  revalidatePath(`/tournaments`);
}

export async function rejectJoinRequest(input: JoinRequestIdInput) {
  const organizer = await requireRole("ORGANIZER");

  const result = joinRequestIdSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const { id } = result.data;

  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id },
    include: { team: { include: { tournament: true } } },
  });
  if (!joinRequest) throw new Error("Join request not found");
  if (joinRequest.status !== "PENDING") throw new Error("Request already processed");
  if (
    joinRequest.team.tournament.organizerId !== organizer.id &&
    organizer.role !== "ADMIN"
  ) {
    throw new Error("Forbidden");
  }

  await prisma.joinRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath(`/tournaments`);
}
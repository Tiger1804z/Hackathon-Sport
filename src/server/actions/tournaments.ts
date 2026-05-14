"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createTournamentSchema,
  updateTournamentSchema,
  type CreateTournamentInput,
  type UpdateTournamentInput,
} from "@/lib/validations/schema";


export async function createTournament(input: CreateTournamentInput){
    const organizer = await requireRole("ORGANIZER");
    const result = createTournamentSchema.safeParse(input);

    if (!result.success) {
        throw new Error("Invalid input: " + result.error.message);
    }

    const data = result.data;

    

    const tournament = await prisma.tournament.create({
        data:{
            ...data,
            organizerId: organizer.id,

        },
    });
    revalidatePath("/tournaments");
    return tournament;
}


export async function updateTournament(input: UpdateTournamentInput){
    const organizer = await requireRole("ORGANIZER");
    const result = updateTournamentSchema.safeParse(input);
    if (!result.success) {
        throw new Error("Invalid input: " + result.error.message);
    }
    const {id, ...data} = result.data;

    const existing = await prisma.tournament.findUnique({
        where: {id},
    });
    if (existing?.organizerId !== organizer.id && organizer.role !== "ADMIN") {
        throw new Error("Forbidden");
    }

    const tournament = await prisma.tournament.update({
        where: {id},
        data,
    });

    revalidatePath("/tournaments");
    revalidatePath(`/tournaments/${id}`);
    return tournament;
}


export async function deleteTournament(id: string ){
    const organizer = await requireRole("ORGANIZER");

    const existing = await prisma.tournament.findUnique({where: {id}});
    if (!existing) throw new Error("Tournament not found");
    if (existing.organizerId !== organizer.id && organizer.role !== "ADMIN") {
        throw new Error("Forbidden");
    }

    await prisma.tournament.delete({where: {id}});
    revalidatePath("/tournaments");
}


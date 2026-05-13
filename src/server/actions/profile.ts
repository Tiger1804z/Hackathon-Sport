"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  upsertPlayerProfileSchema,
  type UpdatePlayerProfileInput,
} from "@/lib/validations/schema";

export async function upsertPlayerProfile(input: UpdatePlayerProfileInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");

  const result = upsertPlayerProfileSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid input: " + result.error.message);

  const profile = await prisma.playerProfile.upsert({
    where: { userId: user.id },
    update: result.data,
    create: { userId: user.id, ...result.data },
  });

  revalidatePath("/profile");
  return profile;
}
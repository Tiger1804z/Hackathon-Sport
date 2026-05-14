import {auth} from "@clerk/nextjs/server";
import {redirect } from "next/navigation";
import prisma from "./prisma";
import type {Role} from "../app/generated/prisma";


export async function getCurrentUser() {
    const {userId} =  await auth();
    if (!userId)  return null;

    return prisma.user.findUnique({
        where: { clerkId: userId },
    })
}

export async function requireAuth() {
    const {userId} =  await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    return userId;
}

export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  
  const u = user!; // narrowing explicite si TS se plaint
  if (u.role !== role && u.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return u;
}
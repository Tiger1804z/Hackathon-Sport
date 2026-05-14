import { Webhook } from "svix";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Role } from "@/app/generated/prisma";

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) throw new Error("CLERK_WEBHOOK_SECRET not set");

  // IMPORTANT: headers() is NOT async
const svix_id = request.headers.get("svix-id");
const svix_timestamp = request.headers.get("svix-timestamp");
const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const payload = await request.text();

  let event: { type: string; data: any };

  try {
    const wh = new Webhook(secret);

    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.log("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  const { type, data } = event;

  console.log("Clerk webhook received:", type);

  if (type === "user.created") {
    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: {
        email: data.email_addresses[0].email_address,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
      },
      create: {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        role: (data.unsafe_metadata?.role as Role) || "PLAYER",
      },
    }).catch(async (e) => {
      if (e.code === "P2002") {
        return prisma.user.update({
          where: { email: data.email_addresses[0].email_address },
          data: {
            clerkId: data.id,
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
          },
        });
      }
      throw e;
    });
  }

  // optional but recommended
  if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email: data.email_addresses[0].email_address,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
      },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.delete({
      where: { clerkId: data.id },
    });
  }

  return NextResponse.json({ ok: true });
}
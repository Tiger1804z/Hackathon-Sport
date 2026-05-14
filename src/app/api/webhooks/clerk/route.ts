import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Role } from "@/app/generated/prisma";
import { ok } from "assert";


export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) throw new Error("CLERK_WEBHOOK_SECRET not set");


  const headersList = await headers();
  const svix_id = headersList.get("svix-id")!;
  const svix_timestamp = headersList.get("svix-timestamp")!;
  const svix_signature = headersList.get("svix-signature")!;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  // body must be read as text to be verified by svix
  const payload = await request.text();

  let event : {type: string, data: any};
  try{
    const wh = new Webhook(secret);
    event = wh.verify(payload, {"svix-id": svix_id, "svix-timestamp": svix_timestamp, "svix-signature": svix_signature }) as {type: string, data: any};
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const {type,data} = event;

  if (type === "user.created" ){
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        role: (data.public_metadata?.role as Role) || "PLAYER",
      },
    });
      
  }
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
  if (type === "user.deleted" && data.id) {
    await prisma.user.delete({
      where: { clerkId: data.id },
    });
  }
  return NextResponse.json({ ok : true });


}
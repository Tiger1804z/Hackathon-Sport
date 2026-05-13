import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "user.created") {
      const user = body.data;

      const role = user || "PLAYER";

      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.email_addresses[0].email_address,
          fullName:
            `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          role,
        },
      });

      console.log(" USER CREATED IN DB");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
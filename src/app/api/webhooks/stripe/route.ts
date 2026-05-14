import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not set");

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  // Vérification cryptographique — même principe que Svix pour Clerk
  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const joinRequestId = session.metadata?.joinRequestId;

    if (!joinRequestId) {
      return NextResponse.json({ error: "Missing joinRequestId in metadata" }, { status: 400 });
    }

    // Passer paymentStatus = PAID + enregistrer paidAt
    await prisma.joinRequest.update({
      where: { id: joinRequestId },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    const { teamId } = await request.json();
    if (!teamId) return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
    

    // recuperer l'equipe + tournoi pour avoir le motant reel cote serveur
    const team = await prisma.team.findUnique({
        where: {id: teamId},
        include: { tournament: true },
    })
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    if (team.tournament.entryFee === 0) {
        return NextResponse.json({ error: "Tournament is free" }, { status: 400 });
    }

    // verifier pas de demande existante 
    const existing = await prisma.joinRequest.findUnique({
        where: { playerId_teamId: { playerId: user.id, teamId } },
    });
    if (existing) return NextResponse.json({ error: "Request already exists" }, { status: 409 });

    // creer le join requestavec status pending
    const joinRequest = await prisma.joinRequest.create({
        data: {
            playerId: user.id,
            teamId,
            paymentStatus: "PENDING",
        },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;


    // creer  la session stripe checkout 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: team.tournament.currency.toLowerCase(),
                    unit_amount: team.tournament.entryFee,
                    product_data: {
                        name: `Inscription - ${team.name} - ${team.tournament.name}`,
                    },
                },
            },
        ],
        // joinRequestId  dans les metadata pour le retrouver dans le webhook
        metadata: {
            joinRequestId: joinRequest.id,
        },
        success_url: `${appUrl}/payment/success`,
        cancel_url: `${appUrl}/payment/cancel`,

    });

    // sauvegarder l'id de session stripe sur la join request
    await prisma.joinRequest.update({
        where: { id: joinRequest.id },
        data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
    
        
    
}
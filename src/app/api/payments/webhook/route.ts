import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/payments/webhook — notifications Stripe.
 * Vérifie la signature (STRIPE_WEBHOOK_SECRET) puis traite
 * `checkout.session.completed` : c'est ICI, et non sur la page de retour,
 * que le paiement doit être considéré comme acquis en production.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });

  const payload = await req.text();
  const header = req.headers.get("stripe-signature") ?? "";
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const expected = createHmac("sha256", secret).update(`${parts.t}.${payload}`).digest("hex");
  const valid =
    !!parts.v1 && parts.v1.length === expected.length && timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
  const fresh = Math.abs(Date.now() / 1000 - Number(parts.t)) < 300;
  if (!valid || !fresh) return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });

  const event = JSON.parse(payload) as { type: string; data: { object: { client_reference_id?: string; id: string } } };
  if (event.type === "checkout.session.completed") {
    const leadId = event.data.object.client_reference_id;
    // À brancher : marquer l'acompte comme payé dans la base, passer le
    // dossier en « Accepté », notifier le conseiller et envoyer le reçu.
    console.info("[payments] deposit paid", { leadId, session: event.data.object.id });
  }
  return NextResponse.json({ received: true });
}

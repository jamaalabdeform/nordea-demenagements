import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/lib/payments/provider";

/**
 * POST /api/payments/checkout
 * Crée une session de paiement pour l'acompte d'un dossier.
 *
 * PRODUCTION : le montant doit être relu côté serveur depuis la base
 * (jamais depuis le navigateur). En démo, les dossiers vivent dans le
 * navigateur, le montant est donc transmis par le client.
 */
const schema = z.object({
  leadId: z.string().min(1).max(80),
  reference: z.string().min(1).max(40),
  amount: z.number().positive().max(100000),
  email: z.email().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });

  const origin = new URL(req.url).origin;
  const { leadId, reference, amount, email } = parsed.data;
  try {
    const result = await getPaymentProvider().createCheckout({
      leadId,
      reference,
      amount,
      customerEmail: email || undefined,
      successUrl: `${origin}/paiement/${leadId}?statut=succes`,
      cancelUrl: `${origin}/paiement/${leadId}?statut=annule`,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[payments] checkout failed", e);
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  }
}

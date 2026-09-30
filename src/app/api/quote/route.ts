import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteSchema, phoneRegex } from "@/features/quote/schema";
import { PricingEngine } from "@/lib/pricing/engine";
import { totalVolume, hasSpecialItem } from "@/features/inventory/volume";

/**
 * POST /api/quote
 * Point d'entrée unique des demandes (devis complet ou rappel).
 *
 * Aujourd'hui : validation, passage dans le PricingEngine (mode démo),
 * transmission optionnelle à un webhook (CRM / Make / n8n) via LEAD_WEBHOOK_URL.
 * Demain : persistance en base, e-mail de confirmation, notification SMS,
 * création de l'opportunité dans le CRM.
 */

const callbackSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  phone: z.string().trim().regex(phoneRegex),
  slot: z.enum(["matin", "midi", "apres-midi", "soir", "indifferent"]),
  consent: z.literal(true),
});

const bodySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("quote"), draft: quoteSchema, attribution: z.record(z.string(), z.string()).optional() }),
  z.object({ kind: z.literal("callback"), callback: callbackSchema, attribution: z.record(z.string(), z.string()).optional() }),
]);

function reference() {
  const d = new Date();
  return `ND-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues.slice(0, 10) }, { status: 422 });
  }

  const ref = reference();
  const body = parsed.data;
  let payload: Record<string, unknown>;

  if (body.kind === "quote") {
    const draft = body.draft;
    const pricing = await new PricingEngine().quote(draft);
    payload = {
      kind: "quote",
      reference: ref,
      receivedAt: new Date().toISOString(),
      volume: totalVolume(draft),
      specialItem: hasSpecialItem(draft.specials),
      pricing,
      draft,
      attribution: body.attribution,
    };
  } else {
    payload = { kind: "callback", reference: ref, receivedAt: new Date().toISOString(), callback: body.callback, attribution: body.attribution };
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000) });
    } catch (e) {
      // la demande n'est jamais perdue pour l'utilisateur : on journalise et on continue
      console.error("[quote] webhook failed", e);
    }
  }

  return NextResponse.json({ ok: true, reference: ref, pricing: payload.pricing ?? null, volume: payload.volume ?? null });
}

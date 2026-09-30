import { pricingConfig, type PricingConfig } from "@/config/pricing.config";
import { totalVolume } from "@/features/inventory/volume";
import type { QuoteDraft } from "@/features/quote/types";
import { defaultRules } from "./rules";
import type { DistanceProvider, PricingAccumulator, PricingContext, PricingResult, PricingRule } from "./types";

/**
 * PricingEngine
 * ─────────────
 * Orchestrateur de règles tarifaires. En mode "demo" (par défaut), il exécute
 * les règles uniquement pour identifier ce qu'un conseiller doit vérifier, et
 * ne renvoie AUCUN montant.
 *
 * Passage en production : renseigner src/config/pricing.config.ts, brancher un
 * DistanceProvider, puis `mode: "live"`.
 */
export class PricingEngine {
  constructor(
    private readonly config: PricingConfig = pricingConfig,
    private readonly rules: PricingRule[] = defaultRules(config),
    private readonly distance: DistanceProvider = nullDistanceProvider,
  ) {}

  async buildContext(draft: QuoteDraft): Promise<PricingContext> {
    const from = [draft.origin.address, draft.origin.postalCode, draft.origin.city || draft.from.city].filter(Boolean).join(" ");
    const to = [draft.destination.address, draft.destination.postalCode, draft.destination.city || draft.to.city].filter(Boolean).join(" ");
    const month = draft.date.value ? Number(draft.date.value.slice(5, 7)) : null;
    return {
      draft,
      volume: totalVolume(draft),
      distanceKm: await this.distance.distanceKm(from, to),
      specialItemIds: Object.entries(draft.specials).filter(([, q]) => q > 0).map(([id]) => id),
      isFlexibleDate: draft.date.flexible,
      month,
    };
  }

  async quote(draft: QuoteDraft): Promise<PricingResult> {
    const ctx = await this.buildContext(draft);
    const acc: PricingAccumulator = { lines: [], multiplier: 1, reviewReasons: [] };
    for (const rule of this.rules) rule.apply(ctx, acc);
    const reviewReasons = [...new Set(acc.reviewReasons)];

    if (this.config.mode === "demo") {
      return { mode: "demo", message: this.config.demoMessage, reviewReasons };
    }

    const subtotal = acc.lines.reduce((s, l) => s + l.amount, 0) * acc.multiplier;
    const minimum = this.config.minimumCharge ?? 0;
    const total = Math.max(subtotal, minimum);
    return { mode: "live", lines: acc.lines, subtotal, total, minimumApplied: total > subtotal, reviewReasons };
  }
}

export const nullDistanceProvider: DistanceProvider = {
  async distanceKm() {
    return null;
  },
};

/**
 * Points à vérifier par le conseiller, calculés de façon synchrone
 * (sans fournisseur de distance) — utilisé par l'admin.
 */
export function reviewPoints(draft: QuoteDraft, config: PricingConfig = pricingConfig): string[] {
  const ctx: PricingContext = {
    draft,
    volume: totalVolume(draft),
    distanceKm: null,
    specialItemIds: Object.entries(draft.specials).filter(([, q]) => q > 0).map(([id]) => id),
    isFlexibleDate: draft.date.flexible,
    month: draft.date.value ? Number(draft.date.value.slice(5, 7)) : null,
  };
  const acc: PricingAccumulator = { lines: [], multiplier: 1, reviewReasons: [] };
  for (const rule of defaultRules(config)) rule.apply(ctx, acc);
  // En démo, les tarifs non configurés ne sont pas des points à vérifier côté dossier
  return [...new Set(acc.reviewReasons)].filter((r) => !/non configuré|à chiffrer|Distance à calculer/.test(r));
}

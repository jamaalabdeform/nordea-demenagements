import type { PricingConfig } from "@/config/pricing.config";
import type { PricingRule } from "./types";

/**
 * Règles tarifaires de base. Chacune lit sa configuration et ne fait rien si
 * la valeur n'est pas renseignée (null) — ce qui permet de brancher la grille
 * du client progressivement.
 */
export function defaultRules(cfg: PricingConfig): PricingRule[] {
  return [
    {
      id: "volume",
      label: "Volume × tarif de la formule",
      apply(ctx, acc) {
        const rate = cfg.volumeRate[ctx.draft.formula ?? "essentiel"];
        if (rate == null) {
          acc.reviewReasons.push("Tarif au m³ non configuré");
          return;
        }
        acc.lines.push({ ruleId: this.id, label: `Volume ${ctx.volume} m³`, amount: ctx.volume * rate });
      },
    },
    {
      id: "distance",
      label: "Distance",
      apply(ctx, acc) {
        const { includedKm, perKm } = cfg.distance;
        if (ctx.distanceKm == null) {
          acc.reviewReasons.push("Distance à calculer");
          return;
        }
        if (includedKm == null || perKm == null) return;
        const extra = Math.max(0, ctx.distanceKm - includedKm);
        if (extra > 0) acc.lines.push({ ruleId: this.id, label: `Distance (${Math.round(ctx.distanceKm)} km)`, amount: extra * perKm });
      },
    },
    {
      id: "floors",
      label: "Étages sans ascenseur",
      apply(ctx, acc) {
        if (cfg.floorWithoutElevator == null) return;
        for (const [label, a] of [["départ", ctx.draft.origin], ["arrivée", ctx.draft.destination]] as const) {
          const noLift = a.elevator === "non" || a.elevatorFits === "non";
          if (noLift && a.floor) acc.lines.push({ ruleId: this.id, label: `${a.floor} étage(s) sans ascenseur — ${label}`, amount: a.floor * cfg.floorWithoutElevator });
        }
      },
    },
    {
      id: "carry",
      label: "Portage",
      apply(ctx, acc) {
        for (const [label, a] of [["départ", ctx.draft.origin], ["arrivée", ctx.draft.destination]] as const) {
          if (!a.carryDistance) continue;
          if (a.carryDistance === "nsp") { acc.reviewReasons.push(`Distance de portage à confirmer (${label})`); continue; }
          const amount = cfg.carryDistance[a.carryDistance];
          if (amount) acc.lines.push({ ruleId: this.id, label: `Portage ${label}`, amount });
        }
      },
    },
    {
      id: "access",
      label: "Accès à vérifier",
      apply(ctx, acc) {
        for (const [label, a] of [["départ", ctx.draft.origin], ["arrivée", ctx.draft.destination]] as const) {
          if (a.parking !== "oui") acc.reviewReasons.push(`Stationnement à vérifier (${label})`);
          if (a.elevatorFits === "nsp") acc.reviewReasons.push(`Gabarit d'ascenseur à vérifier (${label})`);
        }
      },
    },
    {
      id: "options",
      label: "Options",
      apply(ctx, acc) {
        for (const id of ctx.draft.options) {
          const amount = cfg.options[id];
          if (amount == null) { acc.reviewReasons.push(`Option « ${id} » à chiffrer`); continue; }
          acc.lines.push({ ruleId: this.id, label: `Option ${id}`, amount });
        }
      },
    },
    {
      id: "special-items",
      label: "Objets spécifiques",
      apply(ctx, acc) {
        for (const id of ctx.specialItemIds) {
          const amount = cfg.specialItems[id];
          if (amount == null) acc.reviewReasons.push(`Objet spécifique « ${id} » : étude nécessaire`);
          else acc.lines.push({ ruleId: this.id, label: `Objet spécifique ${id}`, amount });
        }
      },
    },
    {
      id: "date",
      label: "Saison & flexibilité",
      apply(ctx, acc) {
        if (ctx.month && cfg.seasonality[ctx.month]) acc.multiplier *= cfg.seasonality[ctx.month];
        if (ctx.isFlexibleDate && cfg.flexibleDateMultiplier) acc.multiplier *= cfg.flexibleDateMultiplier;
      },
    },
  ];
}

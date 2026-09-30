import type { QuoteDraft } from "@/features/quote/types";

/**
 * Contexte de calcul : toutes les données utiles au tarif, déjà normalisées.
 * Construit par `buildPricingContext` à partir d'une demande.
 */
export interface PricingContext {
  draft: QuoteDraft;
  volume: number;
  /** Distance routière en km — null tant qu'aucun fournisseur de distance n'est branché */
  distanceKm: number | null;
  specialItemIds: string[];
  isFlexibleDate: boolean;
  /** Mois (1–12) de la date souhaitée, pour la saisonnalité */
  month: number | null;
}

export interface PricingLine {
  ruleId: string;
  label: string;
  /** Montant HT en euros */
  amount: number;
}

export interface PricingAccumulator {
  lines: PricingLine[];
  /** Coefficient multiplicateur global appliqué en fin de calcul (saison, urgence…) */
  multiplier: number;
  /** Raisons pour lesquelles un conseiller doit impérativement valider */
  reviewReasons: string[];
}

/**
 * Une règle tarifaire. Chaque règle est pure et indépendante : on peut les
 * activer, désactiver, réordonner ou en ajouter sans toucher au moteur.
 */
export interface PricingRule {
  id: string;
  label: string;
  apply(ctx: PricingContext, acc: PricingAccumulator): void;
}

export type PricingResult =
  | {
      mode: "demo";
      /** Message affiché à l'utilisateur */
      message: string;
      reviewReasons: string[];
    }
  | {
      mode: "live";
      lines: PricingLine[];
      subtotal: number;
      total: number;
      minimumApplied: boolean;
      reviewReasons: string[];
    };

/** Fournit une distance entre deux adresses (Google Distance Matrix, OSRM, API interne…) */
export interface DistanceProvider {
  distanceKm(from: string, to: string): Promise<number | null>;
}

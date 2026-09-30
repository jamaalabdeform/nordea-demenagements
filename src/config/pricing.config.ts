/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PARAMÈTRES TARIFAIRES — VIDES EN MODE DÉMO
 * ─────────────────────────────────────────────────────────────────────────────
 *  Aucun tarif n'est inventé. Toutes les valeurs sont `null` : le moteur
 *  (src/lib/pricing/engine.ts) reste en mode « demo » et renvoie un message de
 *  prise en charge par un conseiller.
 *
 *  Pour passer en calcul réel : renseigner les valeurs issues du modèle de
 *  devis du déménageur puis passer `mode` à "live".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const pricingConfig = {
  mode: "demo" as "demo" | "live",

  demoMessage:
    "Votre demande a bien été préparée. Un conseiller vérifie les informations avant de vous transmettre votre proposition.",

  /** € HT par m³ selon la formule */
  volumeRate: { essentiel: null, confort: null, serenite: null } as Record<"essentiel" | "confort" | "serenite", number | null>,

  /** € HT par km au-delà du forfait local */
  distance: { includedKm: null as number | null, perKm: null as number | null },

  /** Supplément par étage sans ascenseur (ou ascenseur inadapté), par adresse */
  floorWithoutElevator: null as number | null,

  /** Supplément selon la distance de portage logement → camion */
  carryDistance: { lt10: 0, "10-30": null, "30-50": null, gt50: null, nsp: null } as Record<string, number | null>,

  /** Forfait par option */
  options: {} as Record<string, number | null>,

  /** Forfait de base par objet spécifique (souvent sur étude) */
  specialItems: {} as Record<string, number | null>,

  /** Coefficient par mois (1 = normal) */
  seasonality: {} as Record<number, number>,

  /** Remise appliquée si les dates sont flexibles (ex. 0.95) */
  flexibleDateMultiplier: null as number | null,

  /** Montant minimum facturé HT */
  minimumCharge: null as number | null,
};

export type PricingConfig = typeof pricingConfig;

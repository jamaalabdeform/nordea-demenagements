/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PAIEMENT — ACOMPTE À LA SIGNATURE DU DEVIS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Parcours : le conseiller saisit le montant du devis dans /admin-demo,
 *  génère un lien de paiement, le client règle l'acompte sur /paiement/[id].
 *
 *  provider "demo"   → paiement simulé, AUCUNE donnée bancaire collectée
 *  provider "stripe" → Stripe Checkout (page de paiement hébergée par Stripe,
 *                      conformité PCI-DSS assurée par Stripe). Activé
 *                      automatiquement si STRIPE_SECRET_KEY est défini.
 *
 *  Les modalités (taux d'acompte, moyens acceptés, IBAN, délais) doivent être
 *  fournies par le client — voir docs/CLIENT-INFO-NEEDED.md §16.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const paymentConfig = {
  currency: "eur",
  /** Valeur proposée par défaut dans l'admin — modifiable dossier par dossier */
  defaultDepositPercent: 30,
  methods: {
    card: true,
    transfer: true,
  },
  transfer: {
    holder: "[Titulaire du compte — à compléter]",
    iban: "[IBAN — à compléter]",
    bic: "[BIC — à compléter]",
  },
  /** Mentions affichées sous le bouton de paiement */
  legalNote: "Le solde est réglé selon les modalités prévues au devis. Conditions générales de vente : [à compléter].",
};

export const paymentMode = (): "demo" | "stripe" => (process.env.STRIPE_SECRET_KEY ? "stripe" : "demo");

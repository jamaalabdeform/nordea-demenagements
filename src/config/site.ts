/**
 * Réglages transverses du site : URL, SEO par défaut, drapeaux de démo.
 */
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nordea-demenagements.fr").replace(/\/$/, ""),
  locale: "fr_FR",
  lang: "fr",

  seo: {
    titleTemplate: "%s · Nordéa Déménagements",
    defaultTitle: "Nordéa Déménagements — Déménageur à Lille et dans le Nord",
    description:
      "Déménagement à Lille et dans le Nord, vers toute la France. Estimez votre volume en quelques minutes, recevez une proposition claire, vérifiée par un conseiller.",
  },

  /** Libellés des CTA — centralisés pour tests A/B futurs */
  cta: {
    primary: "Estimer mon déménagement",
    secondary: "Être rappelé",
    mobile: "Mon devis",
    advisor: "Parler à un conseiller",
  },

  flags: {
    /** Affiche la mention « démonstration » dans le footer et sur les avis */
    demoNotice: true,
    /**
     * Affiche un repère discret sur les emplacements média non encore produits
     * (utile en revue interne, à désactiver pour la présentation client).
     */
    showAssetSlotLabels: false,
  },
} as const;

export const routes = {
  home: "/",
  quote: "/devis",
  legal: "/mentions-legales",
  privacy: "/confidentialite",
  admin: "/admin-demo",
  city: (slug: string) => `/demenagement-${slug}`,
} as const;

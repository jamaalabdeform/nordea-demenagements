/**
 * Réglages transverses du site : URL, SEO par défaut, drapeaux de démo.
 */
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.samyo-demenagement.fr").replace(/\/$/, ""),
  locale: "fr_FR",
  lang: "fr",

  seo: {
    titleTemplate: "%s · Samyo Déménagement",
    defaultTitle: "Samyo Déménagement & Transport — Lille, Nord et toute la France",
    description:
      "Déménagement et transport de mobilier à Lille, dans le Nord et vers toute la France. Calculez votre volume en quelques minutes et recevez un devis clair, vérifié par un conseiller.",
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

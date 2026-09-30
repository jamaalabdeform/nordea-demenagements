/**
 * Formules, prestations et options — contenus de démonstration modifiables.
 * Les noms de formules et leur périmètre doivent être validés avec le client.
 */

export interface Formula {
  id: "essentiel" | "confort" | "serenite";
  name: string;
  promise: string;
  description: string;
  includes: string[];
  /** Mis en avant visuellement (pas de prix : aucune grille tarifaire en démo) */
  featured?: boolean;
}

export const formulas: Formula[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    promise: "Vous emballez, nous transportons.",
    description: "Pour ceux qui préfèrent préparer leurs cartons eux-mêmes et confier le reste à une équipe.",
    includes: [
      "Protection du mobilier sous couvertures",
      "Chargement, transport, déchargement",
      "Mise en place dans les pièces indiquées",
    ],
  },
  {
    id: "confort",
    name: "Confort",
    promise: "Nous emballons le fragile, vous gardez la main sur le reste.",
    description: "Le bon équilibre : vous préparez le courant, nous prenons en charge ce qui demande du soin.",
    includes: [
      "Tout ce qui est compris dans Essentiel",
      "Emballage de la vaisselle et des objets fragiles",
      "Démontage et remontage du mobilier",
      "Fourniture des cartons et adhésifs",
    ],
    featured: true,
  },
  {
    id: "serenite",
    name: "Sérénité",
    promise: "Nous nous occupons de tout.",
    description: "Emballage complet, transport, déballage : vous retrouvez un logement prêt à vivre.",
    includes: [
      "Tout ce qui est compris dans Confort",
      "Emballage intégral de vos affaires",
      "Déballage et rangement à l'arrivée",
      "Reprise des cartons vides",
    ],
  },
];

export interface Service {
  id: string;
  title: string;
  text: string;
  icon: "home" | "briefcase" | "route" | "warehouse" | "gem" | "piano";
}

export const services: Service[] = [
  {
    id: "particuliers",
    title: "Particuliers",
    text: "Du studio à la maison familiale, un inventaire précis et une équipe dimensionnée pour votre volume.",
    icon: "home",
  },
  {
    id: "professionnels",
    title: "Professionnels",
    text: "Bureaux, commerces, cabinets : transfert planifié pour limiter l'interruption de votre activité.",
    icon: "briefcase",
  },
  {
    id: "longue-distance",
    title: "Longue distance",
    text: "Depuis le Nord vers toute la France, avec un interlocuteur unique du départ à la livraison.",
    icon: "route",
  },
  {
    id: "garde-meubles",
    title: "Garde-meubles",
    text: "Entre deux logements ou pendant des travaux, vos affaires restent au sec et accessibles sur demande.",
    icon: "warehouse",
  },
  {
    id: "fragile",
    title: "Mobilier fragile",
    text: "Meubles anciens, verre, marbre : emballage adapté à chaque pièce, pas de solution unique.",
    icon: "gem",
  },
  {
    id: "specifiques",
    title: "Objets spécifiques",
    text: "Piano, coffre-fort, billard, œuvres : chaque objet particulier fait l'objet d'une étude dédiée.",
    icon: "piano",
  },
];

export interface QuoteOption {
  id: string;
  label: string;
  hint: string;
}

export const quoteOptions: QuoteOption[] = [
  { id: "emballage", label: "Emballage des cartons", hint: "Nous emballons vos affaires" },
  { id: "fourniture-cartons", label: "Fourniture de cartons", hint: "Livrés avant le jour J" },
  { id: "demontage", label: "Démontage des meubles", hint: "Lits, armoires, bureaux" },
  { id: "remontage", label: "Remontage des meubles", hint: "À l'arrivée" },
  { id: "protection", label: "Protection renforcée", hint: "Mobilier de valeur ou fragile" },
  { id: "deballage", label: "Déballage", hint: "Et évacuation des cartons" },
  { id: "garde-meubles", label: "Garde-meubles", hint: "Stockage temporaire" },
  { id: "nettoyage", label: "Nettoyage", hint: "Du logement quitté" },
  { id: "autre", label: "Autre besoin", hint: "À préciser au conseiller" },
];

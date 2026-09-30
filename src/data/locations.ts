/**
 * Zones d'intervention & structure SEO locale.
 *
 * Stratégie : une page locale n'est publiée (`published: true`) que lorsqu'elle
 * dispose d'un contenu réellement spécifique (contraintes d'accès, quartiers,
 * stationnement, références). Les autres villes restent listées dans la
 * section « Zones » sans générer de page pauvre.
 *
 * Les URLs publiques suivent le format /demenagement-{slug}.
 */

export interface Location {
  slug: string;
  name: string;
  postalCode: string;
  department: "Nord" | "Pas-de-Calais";
  /** Position relative sur la carte stylisée (0–100) */
  map: { x: number; y: number };
  published: boolean;
  /** Contenu éditorial spécifique — requis pour publier la page */
  content?: {
    intro: string;
    access: string[];
    neighbourhoods: string[];
    note: string;
  };
}

export const locations: Location[] = [
  {
    slug: "lille",
    name: "Lille",
    postalCode: "59000",
    department: "Nord",
    map: { x: 52, y: 38 },
    published: true,
    content: {
      intro:
        "Nous sommes installés à Lille. Rues étroites du Vieux-Lille, immeubles sans ascenseur de Wazemmes, résidences récentes d'Euralille : chaque quartier a ses contraintes, et nous les anticipons dès l'inventaire.",
      access: [
        "Demande d'autorisation de stationnement auprès de la ville, à prévoir plusieurs jours avant la date",
        "Monte-meubles envisagé lorsque l'escalier ou l'ascenseur ne permettent pas le passage",
        "Créneaux adaptés dans les rues piétonnes et à circulation restreinte",
      ],
      neighbourhoods: ["Vieux-Lille", "Wazemmes", "Vauban-Esquermes", "Fives", "Saint-Maurice Pellevoisin", "Lille-Moulins", "Euralille", "Lomme"],
      note: "Les délais d'autorisation de stationnement sont donnés à titre indicatif et doivent être confirmés auprès des services de la ville.",
    },
  },
  { slug: "roubaix", name: "Roubaix", postalCode: "59100", department: "Nord", map: { x: 66, y: 28 }, published: false },
  { slug: "tourcoing", name: "Tourcoing", postalCode: "59200", department: "Nord", map: { x: 62, y: 18 }, published: false },
  { slug: "villeneuve-d-ascq", name: "Villeneuve-d'Ascq", postalCode: "59650", department: "Nord", map: { x: 64, y: 42 }, published: false },
  { slug: "douai", name: "Douai", postalCode: "59500", department: "Nord", map: { x: 50, y: 72 }, published: false },
  { slug: "arras", name: "Arras", postalCode: "62000", department: "Pas-de-Calais", map: { x: 28, y: 84 }, published: false },
  { slug: "valenciennes", name: "Valenciennes", postalCode: "59300", department: "Nord", map: { x: 82, y: 74 }, published: false },
];

export const publishedLocations = locations.filter((l) => l.published && l.content);
export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CATALOGUE MOBILIER & VOLUMES INDICATIFS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Les volumes (m³) sont des valeurs INDICATIVES couramment utilisées dans la
 *  profession, fournies pour la démonstration. Ils doivent être remplacés par
 *  la grille réelle du déménageur (voir docs/CLIENT-INFO-NEEDED.md §8).
 *
 *  Structure pensée pour être alimentée plus tard depuis une base de données
 *  ou un back-office : chaque entrée est plate, identifiée par un `id` stable.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type RoomId =
  | "salon"
  | "cuisine"
  | "chambre"
  | "bureau"
  | "salle-a-manger"
  | "salle-de-bain"
  | "garage"
  | "cave"
  | "exterieur"
  | "transport";

export type HousingTypeId = "studio" | "t2" | "t3" | "t4" | "maison" | "autre";

export interface FurnitureItem {
  id: string;
  label: string;
  /** Volume indicatif en m³ pour UNE unité */
  volume: number;
  /** Précision affichée sous le libellé (dimensions, remarque) */
  hint?: string;
}

export interface Room {
  id: RoomId;
  label: string;
  /** Une pièce peut exister en plusieurs exemplaires (chambres) */
  multiple?: boolean;
  items: FurnitureItem[];
}

export interface SpecialItem {
  id: string;
  label: string;
  volume: number;
  hint: string;
}

export interface HousingType {
  id: HousingTypeId;
  label: string;
  detail: string;
  /** Fourchette de volume habituellement constatée (m³) — indicatif */
  typicalRange: [number, number];
  /** Pièces pré-cochées à l'étape 2 */
  defaultRooms: RoomId[];
}

/** Volume d'un carton standard, utilisé pour la ligne « Cartons » de chaque pièce */
export const CARTON_VOLUME = 0.1;

const cartons = (hint = "Carton standard ≈ 0,1 m³"): FurnitureItem => ({
  id: "cartons",
  label: "Cartons",
  volume: CARTON_VOLUME,
  hint,
});

export const rooms: Room[] = [
  {
    id: "salon",
    label: "Salon",
    items: [
      { id: "canape-2", label: "Canapé 2 places", volume: 1.5 },
      { id: "canape-3", label: "Canapé 3 places", volume: 2 },
      { id: "canape-angle", label: "Canapé d'angle", volume: 3 },
      { id: "fauteuil", label: "Fauteuil", volume: 0.8 },
      { id: "table-basse", label: "Table basse", volume: 0.4 },
      { id: "meuble-tv", label: "Meuble TV", volume: 0.6 },
      { id: "bibliotheque", label: "Bibliothèque", volume: 1.2, hint: "Hauteur ≈ 2 m" },
      { id: "buffet", label: "Buffet / enfilade", volume: 1.5 },
      { id: "table", label: "Table", volume: 1 },
      { id: "chaise", label: "Chaise", volume: 0.3 },
      { id: "television", label: "Télévision", volume: 0.3 },
      { id: "lampadaire", label: "Lampadaire", volume: 0.2 },
      { id: "tapis", label: "Tapis", volume: 0.2 },
      cartons(),
    ],
  },
  {
    id: "cuisine",
    label: "Cuisine",
    items: [
      { id: "refrigerateur", label: "Réfrigérateur", volume: 1 },
      { id: "refrigerateur-us", label: "Réfrigérateur américain", volume: 1.8 },
      { id: "lave-vaisselle", label: "Lave-vaisselle", volume: 0.5 },
      { id: "four", label: "Four / cuisinière", volume: 0.5 },
      { id: "micro-ondes", label: "Micro-ondes", volume: 0.1 },
      { id: "table-cuisine", label: "Table de cuisine", volume: 0.8 },
      { id: "chaise-cuisine", label: "Chaise / tabouret", volume: 0.2 },
      { id: "meuble-cuisine", label: "Meuble d'appoint", volume: 0.6 },
      cartons("Vaisselle, ustensiles, épicerie"),
    ],
  },
  {
    id: "chambre",
    label: "Chambre",
    multiple: true,
    items: [
      { id: "lit-1", label: "Lit 1 place", volume: 1, hint: "Sommier + matelas" },
      { id: "lit-2", label: "Lit 2 places", volume: 2, hint: "Sommier + matelas" },
      { id: "lit-bebe", label: "Lit bébé", volume: 0.6 },
      { id: "armoire-2", label: "Armoire 2 portes", volume: 1.5 },
      { id: "armoire-3", label: "Armoire 3 portes", volume: 2.2 },
      { id: "commode", label: "Commode", volume: 0.8 },
      { id: "chevet", label: "Table de chevet", volume: 0.2 },
      { id: "bureau-chambre", label: "Petit bureau", volume: 0.6 },
      { id: "miroir", label: "Miroir", volume: 0.1 },
      cartons("Linge, vêtements, affaires personnelles"),
    ],
  },
  {
    id: "bureau",
    label: "Bureau",
    items: [
      { id: "bureau", label: "Bureau", volume: 1 },
      { id: "fauteuil-bureau", label: "Fauteuil de bureau", volume: 0.4 },
      { id: "etagere", label: "Étagère", volume: 0.8 },
      { id: "caisson", label: "Caisson de rangement", volume: 0.3 },
      { id: "ordinateur", label: "Ordinateur & écran", volume: 0.2 },
      { id: "imprimante", label: "Imprimante", volume: 0.1 },
      cartons("Dossiers, livres (préférer de petits cartons)"),
    ],
  },
  {
    id: "salle-a-manger",
    label: "Salle à manger",
    items: [
      { id: "table-6", label: "Table 6 personnes", volume: 1.2 },
      { id: "table-10", label: "Table 8 à 10 personnes", volume: 1.8 },
      { id: "chaise-sam", label: "Chaise", volume: 0.3 },
      { id: "vaisselier", label: "Vaisselier", volume: 2 },
      { id: "buffet-sam", label: "Buffet", volume: 1.5 },
      cartons(),
    ],
  },
  {
    id: "salle-de-bain",
    label: "Salle de bain",
    items: [
      { id: "lave-linge", label: "Lave-linge", volume: 0.5 },
      { id: "seche-linge", label: "Sèche-linge", volume: 0.5 },
      { id: "meuble-sdb", label: "Meuble de rangement", volume: 0.4 },
      cartons(),
    ],
  },
  {
    id: "garage",
    label: "Garage",
    items: [
      { id: "velo", label: "Vélo", volume: 0.5 },
      { id: "etabli", label: "Établi", volume: 1 },
      { id: "etagere-metal", label: "Étagère métallique", volume: 0.8 },
      { id: "outillage", label: "Caisse à outils", volume: 0.2 },
      { id: "pneus", label: "Jeu de 4 pneus", volume: 0.4 },
      { id: "tondeuse", label: "Tondeuse", volume: 0.5 },
      cartons(),
    ],
  },
  {
    id: "cave",
    label: "Cave",
    items: [
      { id: "etagere-cave", label: "Étagère", volume: 0.6 },
      { id: "casier-bouteilles", label: "Casier à bouteilles", volume: 0.4 },
      { id: "malle", label: "Malle", volume: 0.3 },
      cartons(),
    ],
  },
  {
    id: "exterieur",
    label: "Extérieur",
    items: [
      { id: "salon-jardin", label: "Salon de jardin", volume: 1.5 },
      { id: "table-jardin", label: "Table de jardin", volume: 1 },
      { id: "chaise-jardin", label: "Chaise de jardin", volume: 0.2 },
      { id: "barbecue", label: "Barbecue", volume: 0.4 },
      { id: "parasol", label: "Parasol", volume: 0.2 },
      { id: "jardiniere", label: "Jardinière / grand pot", volume: 0.2 },
    ],
  },
];

/**
 * Liste utilisée pour une demande de TRANSPORT (quelques objets, sans
 * déménagement complet). Mêmes règles de volume que les pièces.
 */
export const transportRoom: Room = {
  id: "transport",
  label: "Objets à transporter",
  items: [
    { id: "t-canape", label: "Canapé", volume: 2 },
    { id: "t-fauteuil", label: "Fauteuil", volume: 0.8 },
    { id: "t-armoire", label: "Armoire", volume: 1.8 },
    { id: "t-commode", label: "Commode / buffet", volume: 1 },
    { id: "t-lit", label: "Lit (sommier + matelas)", volume: 1.6 },
    { id: "t-matelas", label: "Matelas seul", volume: 0.5 },
    { id: "t-table", label: "Table", volume: 1 },
    { id: "t-chaise", label: "Chaise", volume: 0.3 },
    { id: "t-frigo", label: "Réfrigérateur", volume: 1 },
    { id: "t-lave-linge", label: "Lave-linge / sèche-linge", volume: 0.5 },
    { id: "t-kit", label: "Meuble en kit (cartons plats)", volume: 0.3 },
    { id: "t-velo", label: "Vélo", volume: 0.5 },
    { id: "t-colis", label: "Colis volumineux", volume: 0.3 },
    { id: "cartons", label: "Cartons", volume: CARTON_VOLUME, hint: "Carton standard ≈ 0,1 m³" },
  ],
};

/**
 * Objets nécessitant une étude spécifique : leur sélection pose le drapeau
 * `specialItem = true` sur la demande.
 */
export const specialItems: SpecialItem[] = [
  { id: "piano-droit", label: "Piano droit", volume: 1.5, hint: "Manutention dédiée" },
  { id: "piano-queue", label: "Piano à queue", volume: 3, hint: "Démontage des pieds, sanglage" },
  { id: "coffre-fort", label: "Coffre-fort", volume: 0.5, hint: "Poids à préciser" },
  { id: "billard", label: "Billard", volume: 3, hint: "Démontage et remise à niveau" },
  { id: "oeuvre-art", label: "Œuvre d'art", volume: 0.3, hint: "Caisse sur mesure possible" },
  { id: "grand-miroir", label: "Très grand miroir", volume: 0.3, hint: "Emballage renforcé" },
  { id: "mobilier-lourd", label: "Mobilier très lourd", volume: 1.5, hint: "Marbre, fonte, bois massif" },
  { id: "moto", label: "Moto / scooter", volume: 2, hint: "Arrimage spécifique" },
  { id: "autre-special", label: "Autre objet particulier", volume: 0, hint: "Précisez-le à l'étape contact" },
];

export const housingTypes: HousingType[] = [
  { id: "studio", label: "Studio", detail: "≈ 20 à 35 m²", typicalRange: [8, 15], defaultRooms: ["salon", "cuisine"] },
  { id: "t2", label: "T2", detail: "≈ 35 à 50 m²", typicalRange: [15, 25], defaultRooms: ["salon", "cuisine", "chambre"] },
  { id: "t3", label: "T3", detail: "≈ 50 à 75 m²", typicalRange: [25, 35], defaultRooms: ["salon", "cuisine", "chambre", "salle-de-bain"] },
  { id: "t4", label: "T4", detail: "≈ 75 à 100 m²", typicalRange: [35, 50], defaultRooms: ["salon", "cuisine", "chambre", "salle-a-manger", "salle-de-bain"] },
  { id: "maison", label: "Maison", detail: "Avec ou sans étage", typicalRange: [45, 80], defaultRooms: ["salon", "cuisine", "chambre", "salle-a-manger", "salle-de-bain", "garage"] },
  { id: "autre", label: "Autre", detail: "Local, chambre, box…", typicalRange: [3, 30], defaultRooms: ["salon"] },
];

/**
 * Inventaires types, utilisés par le bouton « Pré-remplir un inventaire type ».
 * Clé : `${roomId}` (première instance) → { itemId: quantité }.
 */
export const inventoryPresets: Partial<Record<HousingTypeId, Partial<Record<RoomId, Record<string, number>>>>> = {
  studio: {
    salon: { "canape-2": 1, "table-basse": 1, "meuble-tv": 1, television: 1, table: 1, chaise: 2, cartons: 8 },
    cuisine: { refrigerateur: 1, "micro-ondes": 1, cartons: 4 },
  },
  t2: {
    salon: { "canape-3": 1, "table-basse": 1, "meuble-tv": 1, television: 1, bibliotheque: 1, table: 1, chaise: 4, cartons: 10 },
    cuisine: { refrigerateur: 1, "lave-vaisselle": 1, "micro-ondes": 1, cartons: 6 },
    chambre: { "lit-2": 1, "armoire-2": 1, commode: 1, chevet: 2, cartons: 10 },
  },
  t3: {
    salon: { "canape-3": 1, fauteuil: 1, "table-basse": 1, "meuble-tv": 1, television: 1, bibliotheque: 2, buffet: 1, table: 1, chaise: 4, cartons: 14 },
    cuisine: { refrigerateur: 1, "lave-vaisselle": 1, four: 1, "micro-ondes": 1, "table-cuisine": 1, "chaise-cuisine": 2, cartons: 8 },
    chambre: { "lit-2": 1, "armoire-3": 1, commode: 1, chevet: 2, cartons: 12 },
    "salle-de-bain": { "lave-linge": 1, "meuble-sdb": 1, cartons: 4 },
  },
  t4: {
    salon: { "canape-angle": 1, fauteuil: 1, "table-basse": 1, "meuble-tv": 1, television: 1, bibliotheque: 2, cartons: 14 },
    cuisine: { "refrigerateur-us": 1, "lave-vaisselle": 1, four: 1, "micro-ondes": 1, cartons: 10 },
    chambre: { "lit-2": 1, "armoire-3": 1, commode: 1, chevet: 2, cartons: 12 },
    "salle-a-manger": { "table-6": 1, "chaise-sam": 6, vaisselier: 1, cartons: 6 },
    "salle-de-bain": { "lave-linge": 1, "seche-linge": 1, cartons: 4 },
  },
  maison: {
    salon: { "canape-angle": 1, fauteuil: 2, "table-basse": 1, "meuble-tv": 1, television: 1, bibliotheque: 2, buffet: 1, cartons: 18 },
    cuisine: { "refrigerateur-us": 1, "lave-vaisselle": 1, four: 1, "micro-ondes": 1, "table-cuisine": 1, "chaise-cuisine": 4, cartons: 12 },
    chambre: { "lit-2": 1, "armoire-3": 1, commode: 1, chevet: 2, cartons: 14 },
    "salle-a-manger": { "table-10": 1, "chaise-sam": 8, vaisselier: 1, cartons: 8 },
    "salle-de-bain": { "lave-linge": 1, "seche-linge": 1, "meuble-sdb": 1, cartons: 6 },
    garage: { velo: 2, etabli: 1, "etagere-metal": 2, tondeuse: 1, cartons: 10 },
  },
  autre: { salon: { cartons: 10 } },
};

/**
 * Véhicules indicatifs utilisés pour la visualisation 3D du remplissage.
 * Capacités à remplacer par la flotte réelle du déménageur.
 */
export const vehicles = [
  { id: "utilitaire-12", label: "Utilitaire 12 m³", capacity: 12, dims: [3.2, 1.8, 2.1] as const },
  { id: "porteur-20", label: "Porteur 20 m³", capacity: 20, dims: [4.3, 2.1, 2.2] as const },
  { id: "porteur-30", label: "Porteur 30 m³", capacity: 30, dims: [5.6, 2.3, 2.35] as const },
  { id: "porteur-50", label: "Porteur 50 m³", capacity: 50, dims: [7.4, 2.45, 2.75] as const },
] as const;

export type Vehicle = (typeof vehicles)[number];

/* ───────────── Accès rapide ───────────── */

export const roomById = Object.fromEntries([...rooms, transportRoom].map((r) => [r.id, r])) as Record<RoomId, Room>;
export const specialItemById = Object.fromEntries(specialItems.map((s) => [s.id, s])) as Record<string, SpecialItem>;
export const housingById = Object.fromEntries(housingTypes.map((h) => [h.id, h])) as Record<HousingTypeId, HousingType>;

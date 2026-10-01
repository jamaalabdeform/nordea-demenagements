/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  REGISTRE DES MÉDIAS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Chaque emplacement visuel du site est déclaré ici. Tant qu'un fichier n'est
 *  pas fourni (src/poster = null), le composant <MediaSlot> affiche une
 *  composition graphique de repli (« scene »), pensée pour rester élégante.
 *
 *  Pour brancher un asset produit avec Higgsfield (voir creative/higgsfield-prompts.md) :
 *    1. exporter en WebM (VP9) + MP4 (H.264) + poster JPG/AVIF
 *    2. déposer les fichiers dans /public/media/
 *    3. renseigner les chemins ci-dessous — rien d'autre à modifier.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type FallbackScene = "window-light" | "morning" | "street" | "quilt" | "hands";

export interface MediaAsset {
  id: string;
  /** Référence dans creative/higgsfield-prompts.md */
  brief: string;
  alt: string;
  poster: string | null;
  video?: { webm?: string; mp4?: string; mobileMp4?: string } | null;
  fallback: FallbackScene;
}

export const media = {
  hero: {
    id: "hero",
    brief: "ASSET 01 — Hero video",
    alt: "Déménageurs protégeant un meuble dans un appartement lumineux",
    poster: null,
    video: null,
    fallback: "window-light",
  },
  van: {
    id: "van",
    brief: "Fourgon SAMYO détouré (photo du véritable véhicule, fond transparent PNG/WebP)",
    alt: "Fourgon de déménagement SAMYO",
    // Image fournie par le client comme libre de droits (source à documenter),
    // détourée. Remplaçable par une photo du véritable véhicule.
    poster: process.env.NEXT_PUBLIC_VAN_IMAGE || "/media/samyo-van-logo.webp",
    video: null,
    fallback: "street",
  },
  volume: {
    id: "volume",
    brief: "ASSET 02 — Transition objets → volume",
    alt: "",
    poster: null,
    video: null,
    fallback: "morning",
  },
  truck: {
    id: "truck",
    brief: "ASSET 03 — Camion dans une rue du Nord",
    alt: "Camion de déménagement stationné dans une rue de maisons en brique",
    poster: null,
    video: null,
    fallback: "street",
  },
  protection: {
    id: "protection",
    brief: "ASSET 04 — Protection des biens",
    alt: "Commode enveloppée dans une couverture de protection et sanglée",
    poster: null,
    video: null,
    fallback: "quilt",
  },
  carry: {
    id: "carry",
    brief: "ASSET 04b — Manutention, plan mains",
    alt: "Mains fermant un carton avec du ruban adhésif",
    poster: null,
    video: null,
    fallback: "hands",
  },
  arrival: {
    id: "arrival",
    brief: "ASSET 05 — Nouveau départ",
    alt: "Pièce vide baignée par la lumière du matin",
    poster: null,
    video: null,
    fallback: "morning",
  },
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

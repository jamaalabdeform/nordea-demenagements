import {
  roomById,
  specialItemById,
  vehicles,
  type Vehicle,
} from "@/data/furnitureCatalog";
import type { QuoteDraft } from "@/features/quote/types";

/**
 * Calcul du volume à partir de l'inventaire.
 * Fonction pure : réutilisable côté serveur (API) comme côté client (simulateur).
 */

export function roomVolume(roomId: keyof typeof roomById, items: Record<string, number> | undefined): number {
  if (!items) return 0;
  const room = roomById[roomId];
  if (!room) return 0;
  let total = 0;
  for (const item of room.items) total += (items[item.id] ?? 0) * item.volume;
  return total;
}

export function inventoryVolume(draft: Pick<QuoteDraft, "rooms" | "inventory">): number {
  return draft.rooms.reduce((sum, r) => sum + roomVolume(r.roomId, draft.inventory[r.key]), 0);
}

export function specialsVolume(specials: QuoteDraft["specials"]): number {
  return Object.entries(specials).reduce((sum, [id, qty]) => sum + (specialItemById[id]?.volume ?? 0) * qty, 0);
}

export function totalVolume(draft: Pick<QuoteDraft, "rooms" | "inventory" | "specials">): number {
  return round1(inventoryVolume(draft) + specialsVolume(draft.specials));
}

export function itemCount(draft: Pick<QuoteDraft, "inventory" | "specials">): number {
  let n = 0;
  for (const items of Object.values(draft.inventory)) for (const q of Object.values(items)) n += q;
  for (const q of Object.values(draft.specials)) n += q;
  return n;
}

export function specialCount(specials: QuoteDraft["specials"]): number {
  return Object.values(specials).reduce((a, b) => a + b, 0);
}

export function hasSpecialItem(specials: QuoteDraft["specials"]): boolean {
  return specialCount(specials) > 0;
}

/** Plus petit véhicule indicatif pouvant contenir le volume (avec 10 % de marge de calage). */
export function suggestVehicle(volume: number): Vehicle {
  const needed = volume * 1.1;
  return vehicles.find((v) => v.capacity >= needed) ?? vehicles[vehicles.length - 1];
}

export const round1 = (n: number) => Math.round(n * 10) / 10;

import type { Vehicle } from "@/data/furnitureCatalog";

/**
 * Grille de remplissage du volume utile du camion, partagée par la vue 3D
 * (WebGL) et la vue isométrique SVG. Le chargement suit la logique réelle :
 * du fond de la caisse vers les portes, du sol vers le plafond.
 */
export const GRID = { x: 10, y: 4, z: 4 } as const;
export const CELL_COUNT = GRID.x * GRID.y * GRID.z;

export interface Cell {
  x: number;
  y: number;
  z: number;
  /** Ordre de chargement */
  order: number;
  /** Légère variation de teinte, pour éviter l'effet « pixel » */
  tint: number;
}

export const cells: Cell[] = (() => {
  const list: Cell[] = [];
  let order = 0;
  for (let x = 0; x < GRID.x; x++)
    for (let y = 0; y < GRID.y; y++)
      for (let z = 0; z < GRID.z; z++) list.push({ x, y, z, order: order++, tint: pseudoRandom(x * 31 + y * 7 + z * 13) });
  return list;
})();

export function filledCells(volume: number, vehicle: Vehicle) {
  const ratio = Math.min(1, volume / vehicle.capacity);
  return Math.round(ratio * CELL_COUNT);
}

export function fillRatio(volume: number, vehicle: Vehicle) {
  return Math.min(1, volume / vehicle.capacity);
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

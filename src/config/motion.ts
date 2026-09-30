/**
 * Langage de mouvement Nordéa.
 * Principe : le mouvement sert à orienter, jamais à décorer.
 * - reveal : apparition douce au scroll, une seule fois
 * - ui     : retours d'interaction (sélection, compteur)
 * - step   : transition entre étapes du simulateur
 */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.18,
  base: 0.32,
  reveal: 0.7,
  slow: 0.9,
};

export const spring = {
  /** Retour tactile d'un élément sélectionné */
  press: { type: "spring", stiffness: 520, damping: 32, mass: 0.6 } as const,
  /** Compteur de volume, jauges */
  value: { type: "spring", stiffness: 90, damping: 22, mass: 1 } as const,
};

export const reveal = {
  distance: 18,
  stagger: 0.07,
};

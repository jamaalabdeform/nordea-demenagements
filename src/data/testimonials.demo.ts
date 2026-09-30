/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TÉMOIGNAGES DE DÉMONSTRATION — NE SONT PAS DE VRAIS AVIS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ces textes illustrent la mise en page. Ils sont affichés avec la mention
 *  « Exemple » tant que `isDemo` est vrai, et ne sont JAMAIS exposés en
 *  données structurées (schema.org Review / AggregateRating).
 *
 *  À remplacer par de vrais avis (Google Business, formulaire post-prestation)
 *  avec l'accord explicite des clients.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Testimonial {
  id: string;
  isDemo: true;
  quote: string;
  author: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "demo-1",
    isDemo: true,
    quote:
      "L'inventaire en ligne m'a pris un quart d'heure. Le conseiller m'a rappelé le lendemain pour vérifier deux ou trois meubles, et le devis correspondait exactement à ce qu'on avait dit.",
    author: "Camille R.",
    context: "T3 · Lille → Nantes",
  },
  {
    id: "demo-2",
    isDemo: true,
    quote:
      "Quatrième étage sans ascenseur dans le Vieux-Lille. Ils avaient anticipé le stationnement et le passage de l'armoire. Rien n'a été improvisé le jour même.",
    author: "Thomas et Inès",
    context: "T4 · Vieux-Lille → Marcq-en-Barœul",
  },
  {
    id: "demo-3",
    isDemo: true,
    quote:
      "Nous avons déplacé le cabinet un vendredi soir. Le lundi matin, les postes étaient en place et les dossiers rangés dans le bon ordre.",
    author: "Cabinet d'architectes",
    context: "Bureaux · Roubaix → Lille",
  },
];

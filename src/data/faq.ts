/**
 * FAQ — réponses volontairement prudentes : aucune donnée réglementaire,
 * tarifaire ou contractuelle n'est affirmée tant que le client ne l'a pas
 * validée. Les passages entre crochets dans CLIENT-INFO-NEEDED.md indiquent
 * ce qu'il faudra préciser.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Comment calculer le volume de mon déménagement ?",
    a: "Le plus fiable est de passer pièce par pièce. Notre simulateur liste le mobilier courant avec un volume indicatif pour chaque meuble, et additionne au fur et à mesure. Si vous manquez de temps, vous pouvez partir d'un inventaire type selon votre logement, puis l'ajuster. Un conseiller vérifie ensuite l'estimation avec vous avant tout devis définitif.",
  },
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Le plus tôt possible, surtout en fin de mois et de juin à septembre, où les demandes sont les plus nombreuses. Anticiper laisse aussi le temps de demander les autorisations de stationnement. Si vos dates sont souples, indiquez-le : cela nous aide à vous proposer le créneau le plus adapté.",
  },
  {
    q: "Déménagez-vous les pianos ?",
    a: "Oui. Un piano, comme un coffre-fort ou un billard, demande une étude spécifique : poids, accès, étages, matériel de manutention. Signalez-le dans le simulateur, un conseiller reviendra vers vous pour en parler précisément.",
  },
  {
    q: "Comment mes meubles sont-ils protégés ?",
    a: "Chaque meuble est protégé sous couvertures avant d'être manipulé, les éléments fragiles sont emballés individuellement et le chargement est sanglé dans le camion. Pour le mobilier de valeur, une protection renforcée peut être prévue en option.",
  },
  {
    q: "Comment fonctionne l'assurance ?",
    a: "Les conditions de garantie et les modalités de déclaration de valeur vous sont présentées avec votre devis, par écrit. Nous vous conseillons de lister les biens de valeur dès l'inventaire pour que la couverture soit adaptée.",
  },
  {
    q: "Puis-je modifier mon inventaire après l'avoir envoyé ?",
    a: "Oui. Votre demande n'engage à rien tant que le devis n'est pas signé. Le conseiller qui vous rappelle peut ajouter, retirer ou corriger des éléments, et la proposition est mise à jour en conséquence.",
  },
  {
    q: "Comment les tarifs sont-ils calculés ?",
    a: "Le prix dépend principalement du volume, de la distance, des conditions d'accès (étages, ascenseur, distance jusqu'au camion, stationnement), de la formule choisie et des options. C'est pour cela que nous vous posons ces questions : un devis construit sur des informations précises évite les ajustements le jour du déménagement.",
  },
];

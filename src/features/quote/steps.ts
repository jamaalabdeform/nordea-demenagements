import type { QuoteDraft } from "./types";
import { totalVolume } from "@/features/inventory/volume";

export type StepId =
  | "trajet"
  | "logement"
  | "pieces"
  | "inventaire"
  | "speciaux"
  | "depart"
  | "arrivee"
  | "date"
  | "options"
  | "contact"
  | "recap";

export interface StepDef {
  id: StepId;
  group: number;
  title: string;
  subtitle?: string;
}

export const GROUPS = ["Projet", "Inventaire", "Accès", "Date & options", "Envoi"] as const;

export const STEPS: StepDef[] = [
  { id: "trajet", group: 0, title: "De quoi avez-vous besoin ?", subtitle: "Une ville suffit pour commencer. L'adresse exacte viendra plus tard." },
  { id: "logement", group: 0, title: "Quel est votre logement actuel ?", subtitle: "Cela nous aide à vous proposer un point de départ réaliste." },
  { id: "pieces", group: 0, title: "Quelles pièces déménagez-vous ?", subtitle: "Cochez les pièces dont vous emportez le contenu." },
  { id: "inventaire", group: 1, title: "Qu'emportez-vous ?", subtitle: "Ajoutez vos meubles pièce par pièce. Le volume se met à jour à chaque ajout." },
  { id: "speciaux", group: 1, title: "Des objets particuliers ?", subtitle: "Certains objets demandent du matériel ou une équipe spécifiques. Mieux vaut le savoir tôt." },
  { id: "depart", group: 2, title: "L'accès au logement de départ", subtitle: "Étages, ascenseur, stationnement : c'est ce qui évite les surprises le jour J." },
  { id: "arrivee", group: 2, title: "L'accès au logement d'arrivée", subtitle: "Mêmes questions, pour votre nouvelle adresse." },
  { id: "date", group: 3, title: "Quand souhaitez-vous déménager ?" },
  { id: "options", group: 3, title: "Comment pouvons-nous vous aider ?", subtitle: "Choisissez une formule et les services dont vous avez besoin. Tout reste modifiable." },
  { id: "contact", group: 4, title: "À qui adressons-nous la proposition ?", subtitle: "Vos coordonnées servent uniquement à vous transmettre votre devis." },
  { id: "recap", group: 4, title: "Vérifiez votre demande" },
];

/** Étapes actives : une demande de transport saute le logement et les pièces */
export function activeSteps(d: Pick<QuoteDraft, "kind">): StepDef[] {
  if (d.kind !== "transport") return STEPS;
  return STEPS.filter((s) => s.id !== "logement" && s.id !== "pieces").map((s) =>
    s.id === "inventaire" ? { ...s, title: "Que faut-il transporter ?", subtitle: "Ajoutez les objets un par un. Le volume se met à jour à chaque ajout." } : s,
  );
}

export const stepIndex = (id: StepId, steps: StepDef[] = STEPS) => steps.findIndex((s) => s.id === id);

function accessMissing(a: QuoteDraft["origin"]): string | null {
  const missing: string[] = [];
  if (!a.city.trim()) missing.push("la ville");
  if (a.floor === null) missing.push("l'étage");
  if (a.floor !== null && a.floor > 0 && !a.elevator) missing.push("la présence d'un ascenseur");
  if (a.elevator === "oui" && a.floor && !a.elevatorFits) missing.push("le gabarit de l'ascenseur");
  if (!a.carryDistance) missing.push("la distance jusqu'au camion");
  if (!a.parking) missing.push("le stationnement");
  return missing.length ? `Il reste à préciser ${joinFr(missing)}.` : null;
}

/** Message d'aide si l'étape n'est pas complète, sinon null */
export function validateStep(id: StepId, d: QuoteDraft): string | null {
  switch (id) {
    case "trajet":
      if (!d.from.city.trim() && !d.to.city.trim()) return "Indiquez vos villes de départ et d'arrivée.";
      if (!d.from.city.trim()) return "Indiquez votre ville de départ.";
      if (!d.to.city.trim()) return "Indiquez votre ville d'arrivée.";
      return null;
    case "logement":
      return d.housing ? null : "Choisissez votre type de logement.";
    case "pieces":
      return d.rooms.length ? null : "Sélectionnez au moins une pièce.";
    case "inventaire":
      return totalVolume(d) > 0 ? null : "Ajoutez au moins un meuble ou quelques cartons.";
    case "depart":
      return accessMissing(d.origin);
    case "arrivee":
      return accessMissing(d.destination);
    case "date":
      return d.date.value || d.date.flexible ? null : "Choisissez une date, ou indiquez que vos dates sont flexibles.";
    default:
      return null;
  }
}

function joinFr(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

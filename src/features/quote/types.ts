import type { HousingTypeId, RoomId } from "@/data/furnitureCatalog";
import type { Formula } from "@/data/services";

export type YesNo = "oui" | "non";
export type YesNoUnknown = "oui" | "non" | "nsp";
export type CarryDistance = "lt10" | "10-30" | "30-50" | "gt50" | "nsp";

export interface Access {
  address: string;
  postalCode: string;
  city: string;
  housing: HousingTypeId | null;
  /** 0 = rez-de-chaussée */
  floor: number | null;
  elevator: YesNo | null;
  elevatorFits: YesNoUnknown | null;
  carryDistance: CarryDistance | null;
  parking: YesNoUnknown | null;
}

/** Une pièce ajoutée par l'utilisateur. `key` distingue « Chambre 1 », « Chambre 2 »… */
export interface RoomInstance {
  key: string;
  roomId: RoomId;
  label: string;
}

export interface QuoteDraft {
  from: { city: string };
  to: { city: string };
  housing: HousingTypeId | null;
  rooms: RoomInstance[];
  /** roomKey → itemId → quantité */
  inventory: Record<string, Record<string, number>>;
  /** specialItemId → quantité */
  specials: Record<string, number>;
  origin: Access;
  destination: Access;
  date: { value: string; flexible: boolean };
  formula: Formula["id"] | null;
  options: string[];
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
    consent: boolean;
  };
}

export const emptyAccess = (): Access => ({
  address: "",
  postalCode: "",
  city: "",
  housing: null,
  floor: null,
  elevator: null,
  elevatorFits: null,
  carryDistance: null,
  parking: null,
});

export const emptyDraft = (): QuoteDraft => ({
  from: { city: "" },
  to: { city: "" },
  housing: null,
  rooms: [],
  inventory: {},
  specials: {},
  origin: emptyAccess(),
  destination: emptyAccess(),
  date: { value: "", flexible: false },
  formula: null,
  options: [],
  contact: { firstName: "", lastName: "", phone: "", email: "", message: "", consent: false },
});

export const carryDistanceLabels: Record<CarryDistance, string> = {
  lt10: "Moins de 10 m",
  "10-30": "10 à 30 m",
  "30-50": "30 à 50 m",
  gt50: "Plus de 50 m",
  nsp: "Je ne sais pas",
};

export const yesNoUnknownLabels: Record<YesNoUnknown, string> = {
  oui: "Oui",
  non: "Non",
  nsp: "Je ne sais pas",
};

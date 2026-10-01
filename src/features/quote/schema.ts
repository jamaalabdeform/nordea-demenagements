import { z } from "zod";

/**
 * Schéma de validation d'une demande complète — partagé entre le client
 * (étape coordonnées) et l'API (/api/quote).
 */

const housing = z.enum(["studio", "t2", "t3", "t4", "maison", "autre"]);

const access = z.object({
  address: z.string().trim().max(200),
  postalCode: z.string().trim().max(10),
  city: z.string().trim().max(100),
  housing: housing.nullable(),
  floor: z.number().int().min(0).max(60).nullable(),
  elevator: z.enum(["oui", "non"]).nullable(),
  elevatorFits: z.enum(["oui", "non", "nsp"]).nullable(),
  carryDistance: z.enum(["lt10", "10-30", "30-50", "gt50", "nsp"]).nullable(),
  parking: z.enum(["oui", "non", "nsp"]).nullable(),
});

export const phoneRegex = /^(?:(?:\+|00)33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Indiquez votre prénom").max(80),
  lastName: z.string().trim().min(1, "Indiquez votre nom").max(80),
  phone: z.string().trim().regex(phoneRegex, "Ce numéro ne semble pas valide (ex. 06 12 34 56 78)"),
  email: z.email("Cette adresse e-mail ne semble pas valide").trim().max(160),
  message: z.string().trim().max(1500),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour que nous puissions vous recontacter" }),
});

export type ContactValues = z.infer<typeof contactSchema>;

const qtyMap = z.record(z.string().max(60), z.number().int().min(0).max(999));

export const quoteSchema = z.object({
  kind: z.enum(["demenagement", "transport"]).default("demenagement"),
  from: z.object({ city: z.string().trim().min(1).max(100) }),
  to: z.object({ city: z.string().trim().min(1).max(100) }),
  housing: housing.nullable(),
  rooms: z.array(z.object({ key: z.string().max(60), roomId: z.enum(["salon", "cuisine", "chambre", "bureau", "salle-a-manger", "salle-de-bain", "garage", "cave", "exterieur", "transport"]), label: z.string().max(60) })).max(40),
  inventory: z.record(z.string().max(60), qtyMap),
  specials: qtyMap,
  origin: access,
  destination: access,
  date: z.object({ value: z.string().max(10), flexible: z.boolean() }),
  formula: z.enum(["essentiel", "confort", "serenite"]).nullable(),
  options: z.array(z.string().max(40)).max(20),
  contact: contactSchema,
});

export type QuotePayload = z.infer<typeof quoteSchema>;

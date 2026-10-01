/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  IDENTITÉ ENTREPRISE — SAMYO (coordonnées provisoires)
 * ─────────────────────────────────────────────────────────────────────────────
 *  SAMYO Déménagement & Transport — maquette réalisée par STIPway.
 *  Le nom et la marque sont ceux du client ; en revanche ADRESSE, TÉLÉPHONE,
 *  HORAIRES et mentions légales sont des VALEURS PROVISOIRES à remplacer
 *  par les informations réelles (voir docs/CLIENT-INFO-NEEDED.md).
 *  Rien ici n'est un SIRET, un label, une certification ou une assurance réelle.
 *
 *  Ce fichier est la SEULE source de vérité pour l'identité : le header, le
 *  footer, le schema.org, les métadonnées et les pages légales le lisent.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const company = {
  isDemo: true,

  name: "Samyo Déménagement",
  shortName: "Samyo",
  /** Graphie utilisée dans le logo */
  wordmark: "SAMYO",
  descriptor: "Déménagement & Transport",
  tagline: "De A à B, sans détour.",
  baseline:
    "Déménagement et transport, basés à Lille. Particuliers et professionnels, dans le Nord et partout en France.",

  address: {
    street: "28 rue des Ateliers", // provisoire
    postalCode: "59000",
    city: "Lille",
    region: "Hauts-de-France",
    country: "France",
    countryCode: "FR",
    /** Coordonnées approximatives du centre de Lille — à remplacer */
    geo: { lat: 50.6292, lng: 3.0573 },
  },

  phone: {
    display: "03 20 84 27 61", // provisoire
    e164: "+33320842761",
  },
  email: "contact@samyo-demenagement.fr",

  hours: {
    display: "Du lundi au samedi, 8 h – 19 h",
    short: "Lun – sam · 8 h – 19 h",
    /** Format schema.org */
    schema: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "19:00" }],
  },

  /** Réseaux sociaux : laisser vide tant que le client n'a pas fourni ses comptes */
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    googleBusiness: "",
  },

  /**
   * Mentions réglementaires : volontairement génériques en mode démo.
   * NE JAMAIS inventer de SIRET, de numéro d'inscription au registre des
   * transporteurs, de compagnie d'assurance ou de label.
   */
  legal: {
    legalName: "[Raison sociale — à compléter]",
    legalForm: "[Forme juridique — à compléter]",
    siret: "[SIRET — à compléter]",
    vat: "[N° TVA — à compléter]",
    transportRegistry: "[Inscription registre des transporteurs — à compléter]",
    insurance: "[Assureur et contrat — à compléter]",
    publisher: "[Directeur de la publication — à compléter]",
    host: "[Hébergeur — à compléter]",
  },
} as const;

export type Company = typeof company;

export const telHref = `tel:${company.phone.e164}`;
export const mailHref = `mailto:${company.email}`;

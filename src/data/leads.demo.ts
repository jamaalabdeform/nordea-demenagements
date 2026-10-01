/**
 * LEADS D'EXEMPLE — DONNÉES FICTIVES pour peupler /admin-demo.
 * Noms, téléphones et e-mails inventés (domaine example.com réservé).
 */
import type { Lead, LeadStatus } from "@/features/admin/leads";
import { totalVolume } from "@/features/inventory/volume";
import { emptyAccess, emptyDraft, type Access, type QuoteDraft } from "@/features/quote/types";
import { inventoryPresets, housingById, type HousingTypeId, type RoomId } from "@/data/furnitureCatalog";

function draftFrom(opts: {
  from: string;
  to: string;
  housing: HousingTypeId;
  origin: Partial<Access>;
  destination: Partial<Access>;
  date: string;
  flexible?: boolean;
  specials?: Record<string, number>;
  options?: string[];
  formula?: QuoteDraft["formula"];
  contact: [string, string, string];
  message?: string;
}): QuoteDraft {
  const d = emptyDraft();
  const preset = inventoryPresets[opts.housing] ?? {};
  const roomIds = housingById[opts.housing].defaultRooms;
  d.from.city = opts.from;
  d.to.city = opts.to;
  d.housing = opts.housing;
  d.rooms = roomIds.map((id: RoomId) => ({ key: `${id}-1`, roomId: id, label: labelOf(id) }));
  for (const r of d.rooms) d.inventory[r.key] = { ...(preset[r.roomId] ?? {}) };
  d.specials = opts.specials ?? {};
  d.origin = { ...emptyAccess(), city: opts.from, housing: opts.housing, ...opts.origin };
  d.destination = { ...emptyAccess(), city: opts.to, ...opts.destination };
  d.date = { value: opts.date, flexible: !!opts.flexible };
  d.options = opts.options ?? [];
  d.formula = opts.formula ?? null;
  const [firstName, lastName, phone] = opts.contact;
  d.contact = {
    firstName,
    lastName,
    phone,
    email: `${firstName}.${lastName}`.toLowerCase().normalize("NFD").replace(/[^a-z.]/g, "") + "@example.com",
    message: opts.message ?? "",
    consent: true,
  };
  return d;
}

const labels: Record<RoomId, string> = {
  salon: "Salon",
  cuisine: "Cuisine",
  chambre: "Chambre",
  bureau: "Bureau",
  "salle-a-manger": "Salle à manger",
  "salle-de-bain": "Salle de bain",
  garage: "Garage",
  cave: "Cave",
  exterieur: "Extérieur",
  transport: "Objets à transporter",
};
const labelOf = (id: RoomId) => labels[id];

const daysAgo = (d: number, h = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 12, 0, 0);
  return t.toISOString();
};
const inDays = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};

function lead(id: string, ref: string, createdAt: string, status: LeadStatus, quote: QuoteDraft, notes = "", extra: Lead["timeline"] = []): Lead {
  return {
    id,
    reference: ref,
    createdAt,
    status,
    origin: "demo",
    volume: totalVolume(quote),
    specialItem: Object.values(quote.specials).some((q) => q > 0),
    quote,
    notes,
    reviewReasons: [],
    timeline: [{ at: createdAt, type: "created", text: "Demande reçue depuis le simulateur" }, ...extra],
    attribution: { utm_source: "google", utm_medium: "cpc" },
  };
}

export function demoLeads(): Lead[] {
  const leads = [
    lead(
      "demo-lead-1",
      "SM-DEMO-0142",
      daysAgo(0, 9),
      "nouveau",
      draftFrom({
        from: "Lille",
        to: "Paris",
        housing: "t3",
        origin: { address: "12 rue Royale", postalCode: "59000", floor: 3, elevator: "oui", elevatorFits: "nsp", carryDistance: "10-30", parking: "non" },
        destination: { address: "48 rue de la Roquette", postalCode: "75011", housing: "t3", floor: 2, elevator: "non", carryDistance: "lt10", parking: "nsp" },
        date: inDays(34),
        specials: { "piano-droit": 1 },
        options: ["fourniture-cartons", "demontage", "remontage"],
        formula: "confort",
        contact: ["Claire", "Martin", "06 12 34 56 78"],
        message: "Le piano est au 3e, l'ascenseur est petit.",
      }),
    ),
    lead(
      "demo-lead-2",
      "SM-DEMO-0139",
      daysAgo(1, 16),
      "a-rappeler",
      draftFrom({
        from: "Roubaix",
        to: "Villeneuve-d'Ascq",
        housing: "t2",
        origin: { floor: 1, elevator: "non", carryDistance: "lt10", parking: "oui" },
        destination: { floor: 4, elevator: "oui", elevatorFits: "oui", carryDistance: "10-30", parking: "oui" },
        date: inDays(12),
        flexible: true,
        options: ["emballage"],
        formula: "serenite",
        contact: ["Julien", "Lefebvre", "07 81 22 45 10"],
      }),
      "Préfère être appelé après 18 h.",
      [{ at: daysAgo(1, 17), type: "status", text: "Statut : À rappeler" }],
    ),
    lead(
      "demo-lead-3",
      "SM-DEMO-0131",
      daysAgo(3, 11),
      "devis-envoye",
      draftFrom({
        from: "Lille",
        to: "Lyon",
        housing: "maison",
        origin: { floor: 0, carryDistance: "10-30", parking: "oui" },
        destination: { floor: 0, carryDistance: "lt10", parking: "oui" },
        date: inDays(48),
        specials: { billard: 1 },
        options: ["emballage", "demontage", "remontage", "protection"],
        formula: "serenite",
        contact: ["Sophie", "Dubois", "06 45 78 12 90"],
      }),
      "Visite technique faite le 2e jour. Billard démontable.",
      [
        { at: daysAgo(3, 14), type: "call", text: "Appel — inventaire vérifié, visite proposée" },
        { at: daysAgo(2, 10), type: "status", text: "Statut : Devis préparé" },
        { at: daysAgo(2, 15), type: "status", text: "Statut : Devis envoyé" },
      ],
    ),
    lead(
      "demo-lead-4",
      "SM-DEMO-0127",
      daysAgo(6, 10),
      "accepte",
      draftFrom({
        from: "Tourcoing",
        to: "Arras",
        housing: "studio",
        origin: { floor: 2, elevator: "non", carryDistance: "lt10", parking: "oui" },
        destination: { floor: 1, elevator: "non", carryDistance: "lt10", parking: "oui" },
        date: inDays(5),
        formula: "essentiel",
        contact: ["Nadia", "Benali", "06 98 76 54 32"],
      }),
      "",
      [
        { at: daysAgo(5, 9), type: "status", text: "Statut : Devis envoyé" },
        { at: daysAgo(4, 18), type: "status", text: "Statut : Accepté" },
      ],
    ),
    lead(
      "demo-lead-5",
      "SM-DEMO-0118",
      daysAgo(11, 15),
      "perdu",
      draftFrom({
        from: "Douai",
        to: "Valenciennes",
        housing: "t4",
        origin: { floor: 5, elevator: "oui", elevatorFits: "oui", carryDistance: "30-50", parking: "non" },
        destination: { floor: 0, carryDistance: "lt10", parking: "oui" },
        date: inDays(-2),
        contact: ["Marc", "Vandamme", "07 12 90 33 41"],
      }),
      "A choisi un autre prestataire (date indisponible).",
      [{ at: daysAgo(9, 11), type: "status", text: "Statut : Perdu" }],
    ),
  ];
  // Transport d'objets (sans déménagement complet)
  const t = draftFrom({
    from: "Roubaix",
    to: "Lille",
    housing: "autre",
    origin: { floor: 0, carryDistance: "lt10", parking: "oui" },
    destination: { address: "5 rue Gambetta", postalCode: "59000", floor: 2, elevator: "non", carryDistance: "10-30", parking: "nsp" },
    date: inDays(9),
    flexible: true,
    contact: ["Yanis", "Haddad", "06 71 20 48 33"],
    message: "Canapé et buffet achetés chez un particulier, à récupérer en rez-de-chaussée.",
  });
  t.kind = "transport";
  t.housing = null;
  t.rooms = [{ key: "transport-1", roomId: "transport", label: "Objets à transporter" }];
  t.inventory = { "transport-1": { "t-canape": 1, "t-commode": 1, "t-chaise": 4 } };
  leads.splice(1, 0, lead("demo-lead-6", "SM-DEMO-0144", daysAgo(0, 11), "nouveau", t));

  // Suivi commercial d'exemple
  leads[3].followUp = { amount: 3480, sentAt: daysAgo(2, 15) };
  leads[4].followUp = { amount: 690, sentAt: daysAgo(5, 9), depositReceivedAt: daysAgo(4, 18) };
  return leads;
}

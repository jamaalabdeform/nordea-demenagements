"use client";

import { useSyncExternalStore } from "react";
import type { QuoteDraft } from "@/features/quote/types";
import { demoLeads } from "@/data/leads.demo";

/**
 * Dépôt des demandes (leads).
 *
 * DÉMO : stockage dans le navigateur (localStorage) + jeu de leads d'exemple.
 * Ainsi, une demande remplie devant le prospect apparaît immédiatement dans
 * /admin-demo sur le même poste, sans base de données.
 *
 * PRODUCTION : remplacer `LocalLeadRepository` par une implémentation API
 * (Supabase, Postgres, CRM…) respectant la même interface `LeadRepository`.
 */

export const LEAD_STATUSES = [
  { id: "nouveau", label: "Nouveau" },
  { id: "a-rappeler", label: "À rappeler" },
  { id: "devis-prepare", label: "Devis préparé" },
  { id: "devis-envoye", label: "Devis envoyé" },
  { id: "relance", label: "Relance" },
  { id: "accepte", label: "Accepté" },
  { id: "perdu", label: "Perdu" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["id"];

export const statusLabel = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.id === s)?.label ?? s;

export interface LeadEvent {
  at: string;
  type: "created" | "status" | "note" | "call";
  text: string;
}

/**
 * Suivi commercial du devis. Le montant est saisi par le conseiller ;
 * l'encaissement se fait hors site (ex. lien SumUp envoyé au client).
 */
export interface LeadQuoteFollowUp {
  /** Montant TTC du devis envoyé, en euros */
  amount: number;
  sentAt: string;
  /** Acompte encaissé hors site (SumUp, virement…) */
  depositReceivedAt?: string;
}

export interface Lead {
  id: string;
  reference: string;
  createdAt: string;
  status: LeadStatus;
  /** `demo` = lead d'exemple pré-chargé ; `site` = soumis depuis le simulateur */
  origin: "demo" | "site";
  volume: number;
  specialItem: boolean;
  quote: QuoteDraft;
  notes: string;
  timeline: LeadEvent[];
  reviewReasons: string[];
  attribution?: Record<string, string>;
  followUp?: LeadQuoteFollowUp;
}

export interface LeadRepository {
  list(): Lead[];
  get(id: string): Lead | undefined;
  add(lead: Lead): void;
  update(id: string, patch: Partial<Lead>, event?: Omit<LeadEvent, "at">): Lead | undefined;
  reset(): void;
}

const KEY = "samyo:leads";
const CHANGE = "samyo:leads-changed";

class LocalLeadRepository implements LeadRepository {
  private read(): Lead[] | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Lead[]) : null;
    } catch {
      return null;
    }
  }

  private write(leads: Lead[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(leads));
      window.dispatchEvent(new Event(CHANGE));
    } catch {
      /* quota / navigation privée */
    }
  }

  list(): Lead[] {
    const stored = this.read();
    const leads = stored ?? demoLeads();
    return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(id: string) {
    return this.list().find((l) => l.id === id);
  }

  add(lead: Lead) {
    this.write([lead, ...this.list()]);
  }

  update(id: string, patch: Partial<Lead>, event?: Omit<LeadEvent, "at">) {
    let updated: Lead | undefined;
    const leads = this.list().map((l) => {
      if (l.id !== id) return l;
      updated = { ...l, ...patch, timeline: event ? [...l.timeline, { ...event, at: new Date().toISOString() }] : l.timeline };
      return updated;
    });
    this.write(leads);
    return updated;
  }

  reset() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem("samyo:funnel");
      window.dispatchEvent(new Event(CHANGE));
    } catch {
      /* noop */
    }
  }
}

export const leadRepository: LeadRepository = new LocalLeadRepository();

export function subscribeLeads(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}

export function makeReference(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `SM-${y}${m}-${n}`;
}

/* ───────────── Hook React : liste réactive des leads ───────────── */


const EMPTY: Lead[] = [];
let snapshot: { raw: string | null; leads: Lead[] } | null = null;

function getSnapshot(): Lead[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* noop */
  }
  if (snapshot && snapshot.raw === raw) return snapshot.leads;
  snapshot = { raw, leads: leadRepository.list() };
  return snapshot.leads;
}

export function useLeads(): Lead[] {
  return useSyncExternalStore(subscribeLeads, getSnapshot, () => EMPTY);
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { housingById, type HousingTypeId } from "@/data/furnitureCatalog";
import { emptyDraft, type QuoteDraft } from "./types";
import type { StepId } from "./steps";

/**
 * État du devis en cours. Persisté en sessionStorage : un rechargement ou un
 * retour arrière ne fait jamais perdre la saisie.
 */
const KEY = "nordea:draft:v1";

interface Stored {
  draft: QuoteDraft;
  step: StepId;
}

export interface InitialParams {
  from?: string;
  to?: string;
  housing?: string;
  formula?: string;
}

function load(params: InitialParams): Stored {
  let stored: Stored | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) stored = JSON.parse(raw) as Stored;
  } catch {
    /* noop */
  }
  const draft = stored?.draft ?? emptyDraft();
  let step: StepId = stored?.step ?? "trajet";

  // Les paramètres d'URL (hero, simulateur, formules) complètent la saisie
  if (params.from) draft.from.city = draft.origin.city = params.from;
  if (params.to) draft.to.city = draft.destination.city = params.to;
  if (params.formula && ["essentiel", "confort", "serenite"].includes(params.formula)) draft.formula = params.formula as QuoteDraft["formula"];
  if (params.housing && params.housing in housingById) {
    applyHousing(draft, params.housing as HousingTypeId);
  }
  if (!stored && params.from && params.to) step = params.housing ? "pieces" : "logement";
  if (!stored && !params.from && params.housing) step = "trajet";
  return { draft, step };
}

/** Choix du logement : pré-coche les pièces habituelles si rien n'a encore été saisi */
export function applyHousing(d: QuoteDraft, housing: HousingTypeId) {
  d.housing = housing;
  d.origin.housing = housing;
  if (d.rooms.length === 0) {
    d.rooms = housingById[housing].defaultRooms.map((roomId) => ({ key: `${roomId}-1`, roomId, label: roomLabel(roomId) }));
  }
}

export function roomLabel(roomId: string) {
  const map: Record<string, string> = {
    salon: "Salon",
    cuisine: "Cuisine",
    chambre: "Chambre",
    bureau: "Bureau",
    "salle-a-manger": "Salle à manger",
    "salle-de-bain": "Salle de bain",
    garage: "Garage",
    cave: "Cave",
    exterieur: "Extérieur",
  };
  return map[roomId] ?? roomId;
}

export function useQuoteDraft(params: InitialParams) {
  const [state, setState] = useState<Stored>(() => load(params));

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const update = useCallback((fn: (d: QuoteDraft) => void) => {
    setState((s) => {
      const draft = structuredClone(s.draft);
      fn(draft);
      return { ...s, draft };
    });
  }, []);

  const goTo = useCallback((step: StepId) => setState((s) => ({ ...s, step })), []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
    setState({ draft: emptyDraft(), step: "trajet" });
  }, []);

  return { draft: state.draft, step: state.step, update, goTo, reset };
}

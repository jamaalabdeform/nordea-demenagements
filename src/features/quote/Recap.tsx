"use client";

import { Pencil } from "lucide-react";
import { housingById, specialItemById } from "@/data/furnitureCatalog";
import { formulas, quoteOptions } from "@/data/services";
import { formatDate, formatFloor, formatNumber1 } from "@/lib/format";
import { hasSpecialItem, itemCount, specialCount, totalVolume } from "@/features/inventory/volume";
import { carryDistanceLabels, yesNoUnknownLabels, type Access, type QuoteDraft } from "./types";
import type { StepId } from "./steps";

/**
 * Récapitulatif avant envoi : lisible en un coup d'œil, chaque bloc
 * modifiable en un clic.
 */
export function Recap({ draft, onEdit }: { draft: QuoteDraft; onEdit: (s: StepId) => void }) {
  const volume = totalVolume(draft);
  const specials = specialCount(draft.specials);
  const formula = formulas.find((f) => f.id === draft.formula);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-[var(--shadow-lift)]">
      {/* Bandeau trajet */}
      <div className="grain bg-marine-900 px-6 py-8 text-paper sm:px-8">
        <div className="relative z-[2] flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl">{draft.from.city || "—"}</span>
          <svg aria-hidden viewBox="0 0 40 12" className="h-3 w-10 text-lagon-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 6h37M32 1l5 5-5 5" />
          </svg>
          <span className="text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl">{draft.to.city || "—"}</span>
        </div>
        <div className="relative z-[2] mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <p>
            <span className="font-display num text-5xl [font-weight:300]">{formatNumber1(volume)}</span>
            <span className="ml-1.5 text-lg text-paper/60">m³</span>
          </p>
          <p className="pb-1.5 text-sm text-paper/65">
            {draft.kind === "transport" ? "Transport d'objets" : draft.housing ? housingById[draft.housing].label : ""} · {itemCount(draft) - specials} éléments
            {draft.date.value && <> · {formatDate(draft.date.value, { day: "numeric", month: "long" })}</>}
            {draft.date.flexible && " (flexible)"}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-ink/8">
        <Row label="Départ" onEdit={() => onEdit("depart")}>
          <AccessSummary a={draft.origin} fallbackCity={draft.from.city} />
        </Row>
        <Row label="Arrivée" onEdit={() => onEdit("arrivee")}>
          <AccessSummary a={draft.destination} fallbackCity={draft.to.city} />
        </Row>
        <Row label="Inventaire" onEdit={() => onEdit("inventaire")}>
          {draft.rooms.map((r) => r.label).join(", ")}
        </Row>
        <Row label="Objets particuliers" onEdit={() => onEdit("speciaux")}>
          {hasSpecialItem(draft.specials) ? (
            <span className="text-alert-600">
              {Object.entries(draft.specials)
                .filter(([, q]) => q > 0)
                .map(([id, q]) => `${q > 1 ? `${q} × ` : ""}${specialItemById[id]?.label ?? id}`)
                .join(", ")}{" "}
              — étude spécifique
            </span>
          ) : (
            "Aucun"
          )}
        </Row>
        <Row label="Date" onEdit={() => onEdit("date")}>
          {draft.date.value ? formatDate(draft.date.value, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "À convenir"}
          {draft.date.flexible && " · dates flexibles"}
        </Row>
        <Row label="Formule & options" onEdit={() => onEdit("options")}>
          {[formula ? formula.name : "Formule à définir", ...draft.options.map((id) => quoteOptions.find((o) => o.id === id)?.label ?? id)].join(" · ")}
        </Row>
        <Row label="Contact" onEdit={() => onEdit("contact")}>
          {draft.contact.firstName} {draft.contact.lastName}
          <br />
          <span className="num">{draft.contact.phone}</span> · {draft.contact.email}
        </Row>
      </dl>
    </div>
  );
}

function Row({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-6 py-4 sm:grid-cols-[10rem_1fr_auto] sm:px-8">
      <dt className="text-xs font-medium uppercase tracking-[0.1em] text-stone-600 sm:pt-0.5">{label}</dt>
      <dd className="col-start-1 text-[0.9375rem] text-ink sm:col-start-2 sm:row-start-1">{children}</dd>
      <button
        type="button"
        onClick={onEdit}
        className="col-start-2 row-span-2 row-start-1 grid size-9 place-items-center self-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-ink sm:col-start-3 sm:row-span-1"
        aria-label={`Modifier : ${label}`}
      >
        <Pencil className="size-3.5" strokeWidth={1.8} />
      </button>
    </div>
  );
}

function AccessSummary({ a, fallbackCity }: { a: Access; fallbackCity: string }) {
  const parts = [
    formatFloor(a.floor),
    a.floor && a.floor > 0 ? (a.elevator === "oui" ? `ascenseur${a.elevatorFits === "non" ? " non adapté" : a.elevatorFits === "nsp" ? " (gabarit à vérifier)" : ""}` : "sans ascenseur") : null,
    a.carryDistance ? `portage ${carryDistanceLabels[a.carryDistance].toLowerCase()}` : null,
    a.parking ? `stationnement : ${yesNoUnknownLabels[a.parking].toLowerCase()}` : null,
  ].filter(Boolean);
  return (
    <>
      <span className="font-medium">{[a.address, [a.postalCode, a.city || fallbackCity].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</span>
      <br />
      <span className="text-stone-600">{parts.join(" · ")}</span>
    </>
  );
}

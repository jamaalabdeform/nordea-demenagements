"use client";

import { useId } from "react";
import { ArrowRight } from "lucide-react";
import { housingTypes, rooms as catalogRooms, type RoomId } from "@/data/furnitureCatalog";
import { citySuggestions } from "@/data/cities";
import { ChoiceCard, QtyStepper, TextField } from "@/components/ui/form";
import { cn } from "@/lib/format";
import type { QuoteDraft } from "../types";
import { applyHousing, applyKind, roomLabel } from "../useQuoteDraft";

type Props = { draft: QuoteDraft; update: (fn: (d: QuoteDraft) => void) => void };

export function StepTrajet({ draft, update }: Props) {
  const list = useId();
  return (
    <div className="space-y-9">
    <div role="radiogroup" aria-label="Votre besoin" className="grid gap-3 sm:grid-cols-2">
      <ChoiceCard
        selected={draft.kind === "demenagement"}
        onClick={() => update((d) => applyKind(d, "demenagement"))}
        title="Un déménagement"
        detail="Tout ou partie d'un logement, d'un bureau"
      />
      <ChoiceCard
        selected={draft.kind === "transport"}
        onClick={() => update((d) => applyKind(d, "transport"))}
        title="Un transport d'objets"
        detail="Quelques meubles, un achat à récupérer, une livraison"
      />
    </div>
    <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
      <TextField
        label="Ville de départ"
        placeholder="Lille"
        list={list}
        autoComplete="address-level2"
        value={draft.from.city}
        onChange={(e) =>
          update((d) => {
            d.from.city = e.target.value;
            d.origin.city = e.target.value;
          })
        }
      />
      <ArrowRight aria-hidden className="mx-auto hidden size-5 text-stone-500 sm:mb-[1.1rem] sm:block" strokeWidth={1.5} />
      <TextField
        label="Ville d'arrivée"
        placeholder="Paris"
        list={list}
        autoComplete="off"
        value={draft.to.city}
        onChange={(e) =>
          update((d) => {
            d.to.city = e.target.value;
            d.destination.city = e.target.value;
          })
        }
      />
      <datalist id={list}>
        {citySuggestions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
    </div>
  );
}

export function StepLogement({ draft, update }: Props) {
  return (
    <div role="radiogroup" aria-label="Type de logement" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {housingTypes.map((h) => (
        <ChoiceCard
          key={h.id}
          selected={draft.housing === h.id}
          onClick={() => update((d) => applyHousing(d, h.id))}
          title={h.label}
          detail={h.detail}
          className="min-h-28"
        >
          <span className={cn("num mt-auto pt-4 text-xs", draft.housing === h.id ? "text-paper/60" : "text-stone-600")}>
            {h.typicalRange[0]}–{h.typicalRange[1]} m³ en moyenne
          </span>
        </ChoiceCard>
      ))}
    </div>
  );
}

export function StepPieces({ draft, update }: Props) {
  const countOf = (id: RoomId) => draft.rooms.filter((r) => r.roomId === id).length;

  function setCount(id: RoomId, n: number) {
    update((d) => {
      const others = d.rooms.filter((r) => r.roomId !== id);
      const instances = Array.from({ length: n }, (_, i) => ({
        key: `${id}-${i + 1}`,
        roomId: id,
        label: n > 1 ? `${roomLabel(id)} ${i + 1}` : roomLabel(id),
      }));
      // conserve l'ordre du catalogue
      const order = catalogRooms.map((r) => r.id);
      d.rooms = [...others, ...instances].sort((a, b) => order.indexOf(a.roomId) - order.indexOf(b.roomId) || a.key.localeCompare(b.key));
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {catalogRooms.map((room) => {
        const n = countOf(room.id);
        if (room.multiple) {
          return (
            <div
              key={room.id}
              className={cn(
                "col-span-2 flex items-center justify-between rounded-[var(--radius-md)] p-5 transition-[background-color,box-shadow] duration-200 sm:col-span-1 sm:flex-col sm:items-start sm:gap-3",
                n ? "bg-paper shadow-[0_0_0_1.5px_var(--color-marine-700)]" : "bg-paper shadow-[var(--shadow-hairline)]",
              )}
            >
              <div>
                <p className="text-[1.0625rem] font-semibold">Chambres</p>
                <p className="text-sm text-stone-600">Combien ?</p>
              </div>
              <QtyStepper value={n} onChange={(v) => setCount(room.id, v)} label="Nombre de chambres" max={8} size="sm" />
            </div>
          );
        }
        return (
          <ChoiceCard key={room.id} role="checkbox" selected={n > 0} onClick={() => setCount(room.id, n ? 0 : 1)} title={room.label} className="min-h-20 justify-center" />
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, Sparkles, X } from "lucide-react";
import { housingById, inventoryPresets, roomById, specialItems } from "@/data/furnitureCatalog";
import { QtyStepper } from "@/components/ui/form";
import { track } from "@/lib/analytics";
import { cn, formatNumber1, formatVolume } from "@/lib/format";
import { duration, ease } from "@/config/motion";
import type { QuoteDraft } from "@/features/quote/types";
import { roomVolume } from "./volume";

type Props = { draft: QuoteDraft; update: (fn: (d: QuoteDraft) => void) => void };

/**
 * Inventaire pièce par pièce.
 * - onglets de pièces avec volume par pièce
 * - lignes meuble + compteur, volume unitaire visible
 * - recherche transversale
 * - pré-remplissage à partir d'un inventaire type
 */
export function InventoryPicker({ draft, update }: Props) {
  const [activeKey, setActiveKey] = useState(draft.rooms[0]?.key ?? "");
  const [query, setQuery] = useState("");
  const active = draft.rooms.find((r) => r.key === activeKey) ?? draft.rooms[0];

  useEffect(() => {
    track("inventory_started", { housing: draft.housing ?? "" }, { oncePerSession: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmpty = useMemo(() => Object.values(draft.inventory).every((items) => Object.values(items).every((q) => !q)), [draft.inventory]);
  const preset = draft.housing ? inventoryPresets[draft.housing] : undefined;

  function setQty(roomKey: string, itemId: string, qty: number) {
    update((d) => {
      d.inventory[roomKey] = { ...(d.inventory[roomKey] ?? {}), [itemId]: qty };
    });
  }

  function applyPreset() {
    if (!preset) return;
    update((d) => {
      const seen = new Set<string>();
      for (const r of d.rooms) {
        if (seen.has(r.roomId)) continue;
        seen.add(r.roomId);
        const items = preset[r.roomId];
        if (items) d.inventory[r.key] = { ...items };
      }
    });
  }

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return draft.rooms.flatMap((r) =>
      roomById[r.roomId].items.filter((it) => it.label.toLowerCase().includes(q)).map((it) => ({ room: r, item: it })),
    );
  }, [q, draft.rooms]);

  if (!active) return <p className="text-stone-600">Revenez à l&apos;étape précédente pour choisir vos pièces.</p>;

  const catalog = roomById[active.roomId];
  const qtyOf = (key: string, id: string) => draft.inventory[key]?.[id] ?? 0;

  return (
    <div>
      {isEmpty && preset && draft.housing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 rounded-[var(--radius-md)] bg-marine-50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-marine-500" strokeWidth={1.5} aria-hidden />
            <p className="text-sm text-marine-900">
              <span className="font-semibold">Pas le temps de tout lister ?</span> Partez d&apos;un inventaire type {housingById[draft.housing].label}, puis ajustez.
            </p>
          </div>
          <button type="button" onClick={applyPreset} className="h-11 shrink-0 rounded-full bg-marine-700 px-5 text-sm font-medium text-paper transition-colors hover:bg-marine-900 active:scale-[0.98]">
            Pré-remplir
          </button>
        </motion.div>
      )}

      {/* Recherche */}
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-500" strokeWidth={1.8} />
        <label htmlFor="inv-search" className="sr-only">
          Rechercher un meuble
        </label>
        <input
          id="inv-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un meuble (armoire, vélo…)"
          className="h-12 w-full rounded-full bg-paper pl-11 pr-11 text-[0.9375rem] shadow-[var(--shadow-hairline)] outline-none transition-shadow placeholder:text-stone-500 focus:shadow-[0_0_0_1.5px_var(--color-marine-500)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-stone-100" aria-label="Effacer la recherche">
            <X className="size-4" strokeWidth={1.8} />
          </button>
        )}
      </div>

      {q ? (
        <div className="mt-5">
          {results.length === 0 ? (
            <p className="rounded-[var(--radius-md)] bg-paper p-6 text-center text-sm text-stone-600 shadow-[var(--shadow-hairline)]">
              Aucun meuble ne correspond. Vous pourrez le préciser au conseiller dans votre message.
            </p>
          ) : (
            <ul className="divide-y divide-ink/6 overflow-hidden rounded-[var(--radius-md)] bg-paper shadow-[var(--shadow-hairline)]">
              {results.map(({ room, item }) => (
                <ItemRow key={room.key + item.id} label={item.label} hint={room.label} volume={item.volume} qty={qtyOf(room.key, item.id)} onChange={(v) => setQty(room.key, item.id, v)} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {/* Onglets de pièces */}
          {draft.rooms.length > 1 && (
          <div role="tablist" aria-label="Pièces" className="-mx-[var(--spacing-gutter)] mt-5 flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {draft.rooms.map((r) => {
              const vol = roomVolume(r.roomId, draft.inventory[r.key]);
              const selected = r.key === active.key;
              return (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="inv-panel"
                  onClick={() => setActiveKey(r.key)}
                  className={cn(
                    "flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-200",
                    selected ? "bg-ink text-paper" : "bg-paper text-ink shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(20_26_34/0.25)]",
                  )}
                >
                  <span className="font-medium">{r.label}</span>
                  {vol > 0 && <span className={cn("num text-xs", selected ? "text-paper/60" : "text-stone-600")}>{formatNumber1(vol)}</span>}
                </button>
              );
            })}
          </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active.key}
              id="inv-panel"
              role="tabpanel"
              aria-label={active.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: duration.fast, ease: ease.out }}
              className="mt-4 divide-y divide-ink/6 overflow-hidden rounded-[var(--radius-md)] bg-paper shadow-[var(--shadow-hairline)]"
            >
              {catalog.items.map((item) => (
                <ItemRow key={item.id} label={item.label} hint={item.hint} volume={item.volume} qty={qtyOf(active.key, item.id)} onChange={(v) => setQty(active.key, item.id, v)} />
              ))}
            </motion.ul>
          </AnimatePresence>
          <p className="mt-4 text-xs text-stone-600">
            Volumes indicatifs par meuble. Un objet absent de la liste ? Mentionnez-le dans votre message, ou parmi les{" "}
            <span className="font-medium text-ink">objets particuliers</span> ({specialItems.length - 1} catégories) à l&apos;étape suivante.
          </p>
        </>
      )}
    </div>
  );
}

function ItemRow({ label, hint, volume, qty, onChange }: { label: string; hint?: string; volume: number; qty: number; onChange: (v: number) => void }) {
  return (
    <li className={cn("flex items-center gap-4 py-3 pl-5 pr-3 transition-colors duration-300", qty > 0 && "bg-marine-50/60")}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-medium text-ink">{label}</p>
        <p className="num mt-0.5 truncate text-xs text-stone-600">
          {formatVolume(volume)}
          {hint && <span> · {hint}</span>}
        </p>
      </div>
      <QtyStepper value={qty} onChange={onChange} label={label} />
    </li>
  );
}

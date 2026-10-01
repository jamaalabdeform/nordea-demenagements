"use client";

import { AlertCircle } from "lucide-react";
import { housingById } from "@/data/furnitureCatalog";
import { FillGauge, VolumeCounter, VolumeVisual } from "@/features/inventory/VolumeVisual";
import { hasSpecialItem, specialCount, suggestVehicle, totalVolume } from "@/features/inventory/volume";
import { cn } from "@/lib/format";
import type { QuoteDraft } from "./types";

/** Panneau latéral « Votre déménagement » — se construit au fil des étapes */
export function QuoteSummary({ draft }: { draft: QuoteDraft }) {
  const volume = totalVolume(draft);
  const vehicle = suggestVehicle(volume);
  const specials = specialCount(draft.specials);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-[var(--shadow-lift)]">
      <div className="px-6 pt-6">
        <p className="eyebrow text-stone-600">{draft.kind === "transport" ? "Votre transport" : "Votre déménagement"}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[0.9375rem] font-semibold text-ink">
          <span className={cn(!draft.from.city && "text-stone-500")}>{draft.from.city || "Départ"}</span>
          <span aria-hidden className="text-lagon-600">→</span>
          <span className={cn(!draft.to.city && "text-stone-500")}>{draft.to.city || "Arrivée"}</span>
        </p>
        {draft.kind === "transport" ? (
          <p className="mt-0.5 text-sm text-stone-600">Transport d&apos;objets</p>
        ) : (
          draft.housing && <p className="mt-0.5 text-sm text-stone-600">{housingById[draft.housing].label}</p>
        )}
      </div>

      <div className="mt-5 border-t border-ink/6 px-6 pt-5">
        <p className="eyebrow text-stone-600">Volume estimé</p>
        <VolumeCounter value={volume} className={cn("font-display mt-1 text-[3.25rem] leading-none [font-weight:300]", volume === 0 && "text-stone-500")} />
      </div>

      <VolumeVisual volume={volume} vehicle={vehicle} className="mx-2 aspect-[16/11]" />

      <div className="px-6 pb-6">
        <FillGauge volume={volume} vehicle={vehicle} />
        {hasSpecialItem(draft.specials) && (
          <p className="mt-4 flex items-center gap-2 rounded-full bg-alert-50/70 px-3 py-2 text-xs font-medium text-alert-600">
            <AlertCircle className="size-3.5" strokeWidth={2} aria-hidden />
            {specials} objet{specials > 1 ? "s" : ""} spécifique{specials > 1 ? "s" : ""} · étude dédiée
          </p>
        )}
        <p className="mt-4 text-xs leading-relaxed text-stone-600">Cette estimation sera vérifiée avant validation définitive du devis.</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { housingTypes, type HousingTypeId } from "@/data/furnitureCatalog";
import { routes, site } from "@/config/site";
import { suggestVehicle } from "@/features/inventory/volume";
import { IsoCargo } from "@/features/inventory/IsoCargo";
import { filledCells } from "@/features/inventory/cargo";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";

/**
 * Aperçu du simulateur : l'utilisateur choisit un logement, voit l'ordre de
 * grandeur du volume se matérialiser, puis passe à l'inventaire réel.
 */
export function SimulatorTeaser() {
  const [housing, setHousing] = useState<HousingTypeId>("t3");
  const h = housingTypes.find((x) => x.id === housing)!;
  const [lo, hi] = h.typicalRange;
  const mid = (lo + hi) / 2;
  const vehicle = suggestVehicle(hi);

  return (
    <section id="simulateur" aria-labelledby="simulateur-title" className="grain overflow-hidden bg-forest-900 py-section text-paper">
      <div className="container-page relative z-[2] grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            id="simulateur-title"
            tone="dark"
            index="02"
            eyebrow="Simulateur de volume"
            title="Votre volume, meuble par meuble."
            lead="Vous sélectionnez ce que vous emportez, le volume se calcule en direct. Pas de formulaire administratif : un inventaire que vous comprenez."
          />

          <Reveal delay={0.1} className="mt-10">
            <fieldset>
              <legend className="eyebrow text-paper/55">Votre logement actuel</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {housingTypes
                  .filter((t) => t.id !== "autre")
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={housing === t.id}
                      onClick={() => setHousing(t.id)}
                      className={cn(
                        "h-11 rounded-full px-5 text-sm font-medium transition-[background-color,color,box-shadow] duration-300",
                        housing === t.id
                          ? "bg-paper text-forest-900"
                          : "text-paper/80 shadow-[inset_0_0_0_1px_rgb(251_249_244/0.22)] hover:text-paper hover:shadow-[inset_0_0_0_1px_rgb(251_249_244/0.5)]",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
              </div>
            </fieldset>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink
                href={`${routes.quote}?logement=${housing}`}
                variant="inverse"
                size="lg"
                arrow
                onClick={() => track("cta_click", { location: "simulator_teaser", housing })}
              >
                {site.cta.primary}
              </ButtonLink>
              <p className="text-sm text-paper/55">Environ 5 minutes · sans engagement</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="rounded-[var(--radius-xl)] bg-paper/[0.04] p-6 shadow-[inset_0_0_0_1px_rgb(251_249_244/0.08)] sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div>
                <p className="eyebrow text-paper/55">Ordre de grandeur · {h.label}</p>
                <p className="font-display num mt-3 whitespace-nowrap text-5xl text-paper [font-weight:300]" aria-live="polite">
                  {lo}–{hi}
                  <span className="ml-2 text-2xl text-paper/60">m³</span>
                </p>
              </div>
              <p className="max-w-[14rem] text-xs text-paper/50 sm:text-right">{h.detail}. Votre inventaire donnera le chiffre exact.</p>
            </div>
            <IsoCargo filled={filledCells(mid, vehicle)} tone="dark" className="mx-auto mt-8 aspect-[16/10] w-full max-w-[36rem]" />
            <p className="mt-6 text-center text-xs text-paper/45">Représentation indicative du chargement · {vehicle.label}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

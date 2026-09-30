"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Info } from "lucide-react";
import { housingTypes, specialItems } from "@/data/furnitureCatalog";
import { formulas, quoteOptions } from "@/data/services";
import { Checkbox, ChoiceCard, QtyStepper, Segmented, TextField, inputClass } from "@/components/ui/form";
import { track } from "@/lib/analytics";
import { cn, formatDate } from "@/lib/format";
import { duration, ease } from "@/config/motion";
import { carryDistanceLabels, type Access, type CarryDistance, type QuoteDraft, type YesNoUnknown } from "../types";

type Props = { draft: QuoteDraft; update: (fn: (d: QuoteDraft) => void) => void };

/* ───────────────────────── Objets particuliers ───────────────────────── */

export function StepSpeciaux({ draft, update }: Props) {
  const any = Object.values(draft.specials).some((q) => q > 0);
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {specialItems.map((s) => {
          const qty = draft.specials[s.id] ?? 0;
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-[var(--radius-md)] bg-paper p-4 pl-5 transition-shadow duration-200",
                qty ? "shadow-[0_0_0_1.5px_var(--color-brick-600)]" : "shadow-[var(--shadow-hairline)]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{s.label}</p>
                  <p className="text-xs text-stone-600">{s.hint}</p>
                </div>
                <QtyStepper
                  value={qty}
                  size="sm"
                  label={s.label}
                  max={10}
                  onChange={(v) => {
                    if (v > qty) track("special_item_added", { item: s.id });
                    update((d) => {
                      d.specials[s.id] = v;
                    });
                  }}
                />
              </div>
              <AnimatePresence initial={false}>
                {qty > 0 && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: duration.base, ease: ease.out }}
                    className="overflow-hidden text-xs font-medium text-brick-600"
                  >
                    <span className="flex items-center gap-1.5 pt-3">
                      <AlertCircle className="size-3.5" strokeWidth={2} aria-hidden />
                      Cet objet nécessite une étude spécifique.
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <p className={cn("mt-6 flex gap-3 rounded-[var(--radius-md)] p-4 text-sm", any ? "bg-brick-100/70 text-ink" : "bg-stone-100 text-stone-600")}>
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden />
        {any
          ? "Un conseiller vous contactera pour évaluer ces objets (poids, dimensions, accès) avant d'établir le devis."
          : "Aucun objet particulier ? Continuez simplement."}
      </p>
    </div>
  );
}

/* ───────────────────────── Accès (départ / arrivée) ───────────────────────── */

const floors = [0, 1, 2, 3, 4, 5, 6];

export function StepAccess({ draft, update, which }: Props & { which: "origin" | "destination" }) {
  const a = draft[which];
  const set = (patch: Partial<Access>) =>
    update((d) => {
      d[which] = { ...d[which], ...patch };
    });

  return (
    <div className="space-y-9">
      <div className="grid gap-4 sm:grid-cols-6">
        <TextField
          className="sm:col-span-6"
          label="Adresse"
          optional
          placeholder={which === "origin" ? "28 rue des Ateliers" : "Numéro et rue"}
          autoComplete={which === "origin" ? "street-address" : "off"}
          value={a.address}
          onChange={(e) => set({ address: e.target.value })}
          hint="Elle nous permet de vérifier le stationnement et les accès en amont."
        />
        <TextField
          className="sm:col-span-2"
          label="Code postal"
          inputMode="numeric"
          maxLength={5}
          placeholder="59000"
          autoComplete={which === "origin" ? "postal-code" : "off"}
          value={a.postalCode}
          onChange={(e) => set({ postalCode: e.target.value.replace(/\D/g, "") })}
          optional
        />
        <TextField className="sm:col-span-4" label="Ville" placeholder="Lille" value={a.city} onChange={(e) => set({ city: e.target.value })} />
      </div>

      {which === "destination" && (
        <Segmented
          legend="Type de logement"
          value={a.housing}
          onChange={(v) => set({ housing: v })}
          options={housingTypes.map((h) => ({ value: h.id, label: h.label }))}
          columns="grid-cols-3 sm:flex sm:flex-wrap"
        />
      )}

      <fieldset>
        <legend className="text-sm font-medium text-ink">Étage</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {floors.map((f) => (
            <FloorPill key={f} active={a.floor === f} onClick={() => set({ floor: f, ...(f === 0 ? { elevator: null, elevatorFits: null } : {}) })}>
              {f === 0 ? "RDC" : f === 6 ? "6+" : f}
            </FloorPill>
          ))}
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {a.floor !== null && a.floor > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
              <Segmented
                legend="Ascenseur"
                value={a.elevator}
                onChange={(v) => set({ elevator: v, elevatorFits: v === "non" ? null : a.elevatorFits })}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" },
                ]}
                columns="grid-cols-2"
              />
              {a.elevator === "oui" && (
                <Segmented<YesNoUnknown>
                  legend="Adapté aux meubles ?"
                  value={a.elevatorFits}
                  onChange={(v) => set({ elevatorFits: v })}
                  options={[
                    { value: "oui", label: "Oui" },
                    { value: "non", label: "Non" },
                    { value: "nsp", label: "Je ne sais pas" },
                  ]}
                  columns="grid-cols-3"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Segmented<CarryDistance>
        legend="Distance entre le logement et le camion"
        hint="Du pied de l'immeuble ou de la porte jusqu'à l'endroit où le camion peut stationner."
        value={a.carryDistance}
        onChange={(v) => set({ carryDistance: v })}
        options={(Object.keys(carryDistanceLabels) as CarryDistance[]).map((k) => ({ value: k, label: carryDistanceLabels[k] }))}
      />

      <Segmented<YesNoUnknown>
        legend="Stationnement facile devant l'adresse ?"
        value={a.parking}
        onChange={(v) => set({ parking: v })}
        options={[
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "nsp", label: "Je ne sais pas" },
        ]}
        columns="grid-cols-3"
      />
      {a.parking && a.parking !== "oui" && (
        <p className="-mt-5 text-xs text-stone-600">Pas d&apos;inquiétude : nous nous renseignons sur l&apos;autorisation de stationnement si nécessaire.</p>
      )}
    </div>
  );
}

function FloorPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "num h-12 min-w-12 rounded-full px-4 text-[0.9375rem] transition-[background-color,color,box-shadow] duration-200 active:scale-95",
        active ? "bg-forest-700 font-medium text-paper" : "bg-paper text-ink shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(26_28_27/0.25)]",
      )}
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Date ───────────────────────── */

export function StepDate({ draft, update }: Props) {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const min = today.toISOString().slice(0, 10);
  const month = draft.date.value ? Number(draft.date.value.slice(5, 7)) : null;
  const day = draft.date.value ? Number(draft.date.value.slice(8, 10)) : null;
  const busy = (month !== null && month >= 6 && month <= 9) || (day !== null && day >= 25);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="move-date" className="text-sm font-medium text-ink">
          Date souhaitée
        </label>
        <input
          id="move-date"
          type="date"
          min={min}
          value={draft.date.value}
          onChange={(e) =>
            update((d) => {
              d.date.value = e.target.value;
            })
          }
          className={cn(inputClass, "mt-2 max-w-sm [color-scheme:light]")}
        />
        {draft.date.value && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-ink">
            Le <span className="font-semibold">{formatDate(draft.date.value, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </motion.p>
        )}
      </div>

      <Checkbox
        checked={draft.date.flexible}
        onChange={(v) =>
          update((d) => {
            d.date.flexible = v;
          })
        }
      >
        <span className="font-medium">Mes dates sont flexibles</span>
        <span className="block text-sm text-stone-600">Quelques jours de souplesse nous aident à vous proposer le meilleur créneau.</span>
      </Checkbox>

      {busy && (
        <p className="flex gap-3 rounded-[var(--radius-md)] bg-stone-100 p-4 text-sm text-stone-600">
          <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden />
          Les fins de mois et la période estivale sont très demandées : plus la demande est anticipée, plus le choix de créneaux est large.
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── Formule & options ───────────────────────── */

export function StepOptions({ draft, update }: Props) {
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Formule</legend>
        <div role="radiogroup" className="mt-3 grid gap-3 sm:grid-cols-3">
          {formulas.map((f) => (
            <ChoiceCard
              key={f.id}
              selected={draft.formula === f.id}
              onClick={() =>
                update((d) => {
                  d.formula = d.formula === f.id ? null : f.id;
                })
              }
              title={f.name}
              detail={f.promise}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-600">Pas encore décidé ? Laissez vide, le conseiller vous aidera à choisir.</p>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Services complémentaires</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {quoteOptions.map((o) => {
            const on = draft.options.includes(o.id);
            return (
              <label
                key={o.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] bg-paper p-4 transition-shadow duration-200 has-[:focus-visible]:shadow-[0_0_0_2px_var(--color-ivory),0_0_0_4px_var(--color-forest-500)]",
                  on ? "shadow-[0_0_0_1.5px_var(--color-forest-700)]" : "shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(26_28_27/0.25)]",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() =>
                    update((d) => {
                      d.options = on ? d.options.filter((x) => x !== o.id) : [...d.options, o.id];
                    })
                  }
                />
                <span
                  aria-hidden
                  className={cn("grid size-5 shrink-0 place-items-center rounded-[6px] transition-colors", on ? "bg-forest-700 text-paper" : "shadow-[inset_0_0_0_1.5px_rgb(26_28_27/0.25)]")}
                >
                  {on && (
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.2 5 8.5l4.5-5" />
                    </svg>
                  )}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium">{o.label}</span>
                  <span className="block text-xs text-stone-600">{o.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

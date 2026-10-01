"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { routes, site } from "@/config/site";
import { citySuggestions } from "@/data/cities";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { Arrow } from "@/components/ui/Button";

/**
 * Point d'entrée du devis dans le hero : deux champs, un bouton.
 * Les villes sont transmises au simulateur, qui reprend là où l'on s'est arrêté.
 */
export function RouteForm({ className }: { className?: string }) {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const listId = useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("de", from.trim());
    if (to.trim()) params.set("vers", to.trim());
    track("cta_click", { location: "hero_route" });
    router.push(`${routes.quote}${params.size ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative grid rounded-[1.375rem] bg-paper p-1.5 shadow-[var(--shadow-lift)] sm:grid-cols-[1fr_1fr_auto] sm:rounded-full",
        className,
      )}
      aria-label="Commencer une estimation"
    >
      <CityField label="Départ" placeholder="Lille" value={from} onChange={setFrom} listId={listId} />
      <div aria-hidden className="mx-5 h-px bg-ink/8 sm:hidden" />
      <CityField label="Arrivée" placeholder="Paris" value={to} onChange={setTo} listId={listId} divider />
      <datalist id={listId}>
        {citySuggestions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <button
        type="submit"
        className="group/btn mt-1.5 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-marine-700 px-7 font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-marine-900 active:scale-[0.98] sm:mt-0"
      >
        <span className="sm:hidden">{site.cta.primary}</span>
        <span className="hidden sm:inline">Continuer</span>
        <Arrow />
      </button>
    </form>
  );
}

function CityField({
  label,
  placeholder,
  value,
  onChange,
  listId,
  divider,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  listId: string;
  divider?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center rounded-full px-5 py-2.5 transition-[background-color,box-shadow] focus-within:bg-stone-100/70 focus-within:shadow-[inset_0_0_0_1.5px_var(--color-marine-500)] sm:px-6",
        divider && "sm:before:absolute sm:before:inset-y-3 sm:before:left-0 sm:before:w-px sm:before:bg-ink/10",
      )}
    >
      <label htmlFor={id} className="eyebrow text-stone-600">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        autoComplete="address-level2"
        className="mt-0.5 w-full bg-transparent text-[1.0625rem] font-medium text-ink outline-none placeholder:text-stone-500 focus-visible:outline-none"
      />
    </div>
  );
}

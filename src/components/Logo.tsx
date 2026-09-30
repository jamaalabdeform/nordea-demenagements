import { company } from "@/config/company";
import { cn } from "@/lib/format";

/**
 * Marque provisoire NORDÉA : un cube isométrique ouvert — le volume, l'objet
 * qu'on protège, la boîte qu'on transporte. Le trait brique marque l'arête
 * « avant », comme un repère d'orientation.
 *
 * À remplacer par le logo du client : conserver le composant et son API
 * (`tone`, `compact`) pour ne rien toucher ailleurs.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)} fill="none">
      <path d="M16 3.5 27 9.75v12.5L16 28.5 5 22.25V9.75L16 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 9.75 16 16l11-6.25" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 16v12.5" stroke="var(--color-brick-600)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ tone = "dark", compact = false, className }: { tone?: "dark" | "light"; compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", tone === "light" ? "text-paper" : "text-forest-900", className)}>
      <LogoMark className="size-7" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-[0.2em]">{company.wordmark}</span>
        {!compact && (
          <span className={cn("mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.34em]", tone === "light" ? "text-paper/60" : "text-stone-600")}>
            {company.descriptor}
          </span>
        )}
      </span>
    </span>
  );
}

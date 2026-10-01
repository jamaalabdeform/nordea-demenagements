import { company } from "@/config/company";
import { cn } from "@/lib/format";
import { DESCRIPTOR_PATH, LOGO_WIDTH, WORDMARK_PATH, WORDMARK_WIDTH } from "./logo-paths";

/**
 * Logo SAMYO — le « S » est dessiné comme un trajet : départ (cercle ouvert)
 * en bas à gauche, arrivée (pastille turquoise) en haut à droite.
 * Lettrage vectorisé (scripts/build-logo.py) : rendu identique partout,
 * sans dépendre du chargement des polices.
 * Fichiers d'export : /public/brand/*.svg
 */
export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stroke = tone === "light" ? "var(--color-paper)" : "var(--color-marine-700)";
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-8", className)} fill="none">
      <SymbolPaths stroke={stroke} />
    </svg>
  );
}

function SymbolPaths({ stroke }: { stroke: string }) {
  return (
    <>
      <path d="M13.4 29.5H24a4.75 4.75 0 0 0 0-9.5h-8a4.75 4.75 0 0 1 0-9.5h10.4" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.6" cy="29.5" r="2.35" stroke={stroke} strokeWidth="2" />
      <circle cx="30.6" cy="10.5" r="3.1" fill="var(--color-lagon-400)" />
    </>
  );
}

export function Logo({ tone = "dark", compact = false, className }: { tone?: "dark" | "light"; compact?: boolean; className?: string }) {
  const fg = tone === "light" ? "var(--color-paper)" : "var(--color-marine-700)";
  const width = compact ? WORDMARK_WIDTH : LOGO_WIDTH;
  return (
    <svg
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={`${company.wordmark} ${company.descriptor}`}
      className={cn("h-10 w-auto", className)}
      fill="none"
    >
      <SymbolPaths stroke={fg} />
      <path d={WORDMARK_PATH} fill={fg} />
      {!compact && <path d={DESCRIPTOR_PATH} fill={fg} fillOpacity={tone === "light" ? 0.6 : 0.68} />}
    </svg>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { Reveal } from "./Reveal";

/**
 * En-tête de section éditorial : index + surtitre, titre serif, chapeau.
 * L'index numéroté (« 03 ») structure la lecture comme un sommaire de magazine.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
  id,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center", dark ? "text-marine-300" : "text-stone-600")}>
        {index && <span className={cn("num", dark ? "text-lagon-400" : "text-lagon-600")}>{index}</span>}
        {index && <span aria-hidden className={cn("h-px w-6", dark ? "bg-paper/25" : "bg-ink/20")} />}
        <span>{eyebrow}</span>
      </p>
      <h2 id={id} className={cn("font-display mt-5 text-4xl", dark ? "text-paper" : "text-ink")}>
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-5 max-w-[36rem] text-lg", align === "center" && "mx-auto", dark ? "text-paper/70" : "text-stone-600")}>{lead}</p>
      )}
    </Reveal>
  );
}

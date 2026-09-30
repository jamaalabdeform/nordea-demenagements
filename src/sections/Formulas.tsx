import { Check } from "lucide-react";
import { formulas } from "@/data/services";
import { routes } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

export function Formulas() {
  return (
    <section id="formules" aria-labelledby="formules-title" className="py-section">
      <div className="container-page">
        <SectionHeading
          id="formules-title"
          index="03"
          eyebrow="Formules"
          title="Vous choisissez ce que vous nous confiez."
          lead="Trois niveaux d'accompagnement. Vous pourrez en changer jusqu'à la validation du devis."
        />

        <div className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {formulas.map((f, i) => (
            <Reveal
              as="article"
              key={f.id}
              delay={i * 0.07}
              className={cn(
                "relative flex flex-col rounded-[var(--radius-lg)] p-8 transition-shadow duration-500 lg:p-10",
                f.featured
                  ? "bg-forest-700 text-paper shadow-[var(--shadow-float)]"
                  : "bg-paper shadow-[var(--shadow-hairline)] hover:shadow-[var(--shadow-lift)]",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="eyebrow">{f.name}</h3>
                {f.featured && <span className="rounded-full bg-paper/12 px-3 py-1 text-xs text-paper/85">Le plus demandé</span>}
              </div>
              <p className={cn("font-display mt-8 text-2xl leading-tight lg:text-[1.75rem]", f.featured ? "text-paper" : "text-ink")}>{f.promise}</p>
              <p className={cn("mt-4 text-[0.9375rem]", f.featured ? "text-paper/70" : "text-stone-600")}>{f.description}</p>

              <ul className={cn("mt-8 space-y-3 border-t pt-8 text-[0.9375rem]", f.featured ? "border-paper/15" : "border-ink/8")}>
                {f.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check className={cn("mt-1 size-4 shrink-0", f.featured ? "text-brick-400" : "text-forest-500")} strokeWidth={2} aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <ButtonLink href={`${routes.quote}?formule=${f.id}`} variant={f.featured ? "inverse" : "secondary"} arrow className="w-full">
                  Estimer avec {f.name}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-sm text-stone-600">Le prix dépend de votre volume, des accès et de la distance. Il vous est communiqué après vérification de votre demande.</p>
        </Reveal>
      </div>
    </section>
  );
}

import { testimonials } from "@/data/testimonials.demo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Témoignages — contenus de DÉMONSTRATION, signalés comme tels à l'écran.
 * Aucune donnée structurée Review n'est émise pour ces textes.
 */
export function Testimonials() {
  const isDemo = testimonials.some((t) => t.isDemo);
  return (
    <section aria-labelledby="avis-title" className="bg-paper py-section">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="avis-title" index="08" eyebrow="Ils nous ont confié leur déménagement" title="Ce qu'on retient, après." />
          {isDemo && (
            <p className="max-w-xs rounded-full bg-stone-100 px-4 py-2 text-xs text-stone-600 md:mb-2">
              Exemples de mise en page — les avis clients réels seront intégrés ici.
            </p>
          )}
        </div>

        <ul className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.07} className="flex flex-col rounded-[var(--radius-lg)] bg-ivory p-8 lg:p-10">
              <figure className="flex h-full flex-col">
                <span aria-hidden className="font-display text-5xl leading-none text-lagon-600">“</span>
                <blockquote className="font-display mt-2 text-xl leading-snug text-ink">{t.quote}</blockquote>
                <figcaption className="mt-auto flex items-baseline justify-between gap-4 border-t border-ink/8 pt-6 text-sm">
                  <span className="font-semibold text-ink">{t.author}</span>
                  <span className="text-right text-stone-600">{t.context}</span>
                </figcaption>
                {t.isDemo && <span className="sr-only">Témoignage d&apos;exemple, non authentique.</span>}
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

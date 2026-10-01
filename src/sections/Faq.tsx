import { Plus } from "lucide-react";
import { faq } from "@/data/faq";
import { company, telHref } from "@/config/company";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** FAQ en <details> natif : accessible au clavier, fonctionne sans JavaScript */
export function Faq() {
  return (
    <section id="questions" aria-labelledby="faq-title" className="border-t border-ink/8 bg-paper py-section">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" index="10" eyebrow="Questions fréquentes" title="Les questions qu'on nous pose le plus." />
          <Reveal delay={0.1}>
            <p className="mt-8 text-[0.9375rem] text-stone-600">
              Une autre question ? Appelez-nous au{" "}
              <a href={telHref} className="num font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                {company.phone.display}
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faq.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-6 rounded-sm py-6 text-left text-lg font-medium text-ink transition-colors hover:text-marine-700">
                  <span>{f.q}</span>
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full shadow-[var(--shadow-hairline)] transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-marine-700 group-open:text-paper">
                    <Plus className="size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                </summary>
                <p className="max-w-[40rem] pb-7 pr-12 text-[0.9375rem] leading-relaxed text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

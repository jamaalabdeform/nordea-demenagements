import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Décrivez votre déménagement",
    text: "Départ, arrivée, type de logement. Deux minutes, sans créer de compte.",
  },
  {
    title: "Estimez votre volume",
    text: "Pièce par pièce, meuble par meuble. Le volume se calcule pendant que vous avancez.",
  },
  {
    title: "Recevez votre proposition",
    text: "Un conseiller vérifie votre inventaire et les accès, puis vous adresse un devis détaillé.",
  },
  {
    title: "Nous nous occupons du reste",
    text: "Protection, chargement, transport, installation. Vous savez qui vient, et quand.",
  },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" aria-labelledby="fonctionnement-title" className="py-section">
      <div className="container-page">
        <SectionHeading
          id="fonctionnement-title"
          index="01"
          eyebrow="Fonctionnement"
          title="Quatre étapes, et aucune zone d'ombre."
          lead="Vous préparez votre demande à votre rythme. Nous la vérifions avant de nous engager sur un prix."
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-ink/8 shadow-[var(--shadow-hairline)] md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06} className="flex flex-col bg-paper p-7 lg:min-h-[19rem] lg:p-8">
              <span className="font-display num text-[2.75rem] leading-none text-brick-600 [font-weight:300]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-auto pt-12 text-lg font-semibold leading-snug text-ink">{s.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-stone-600">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

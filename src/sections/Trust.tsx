import { MediaSlot } from "@/components/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const principles = [
  { word: "Clarté", text: "Un devis écrit, poste par poste. Ce qui est inclus est écrit, ce qui ne l'est pas aussi." },
  { word: "Protection", text: "Couvertures, housses, emballage adapté aux objets fragiles, sanglage dans le camion." },
  { word: "Ponctualité", text: "Une heure d'arrivée annoncée la veille, et un appel si quoi que ce soit change." },
  { word: "Accompagnement", text: "Un conseiller suit votre dossier, de la première question jusqu'à la livraison." },
  { word: "Transparence", text: "Les contraintes d'accès sont identifiées avant le devis, pas découvertes le jour J." },
];

export function Trust() {
  return (
    <section id="confiance" aria-labelledby="confiance-title" className="py-section">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <MediaSlot id="protection" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] rounded-[var(--radius-lg)] lg:sticky lg:top-28" />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading
            id="confiance-title"
            index="05"
            eyebrow="Pourquoi nous faire confiance"
            title="On ne déplace pas des cartons. On déplace votre quotidien."
          />
          <dl className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
            {principles.map((p, i) => (
              <Reveal key={p.word} delay={i * 0.04} className="grid gap-2 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <dt className="font-display text-2xl text-ink">{p.word}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-stone-600 sm:pt-1.5">{p.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

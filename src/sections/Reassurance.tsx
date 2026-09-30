import { Reveal } from "@/components/ui/Reveal";

/**
 * Réassurance immédiate — bénéfices qualitatifs uniquement.
 * Aucune statistique tant que le client n'a pas fourni de chiffres vérifiables.
 */
const points = [
  { title: "Un devis lisible", text: "Chaque poste expliqué, sans ligne floue." },
  { title: "Un inventaire vérifié", text: "Un conseiller relit votre estimation avec vous." },
  { title: "Des biens protégés", text: "Couvertures, emballage adapté, arrimage." },
  { title: "Un seul interlocuteur", text: "De la première question à la dernière pièce." },
];

export function Reassurance() {
  return (
    <section aria-label="Nos engagements" className="border-y border-ink/8 bg-paper">
      <ul className="mx-auto grid max-w-[var(--container-page)] grid-cols-1 gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.05} className="bg-paper px-[var(--spacing-gutter)] py-7 sm:py-9 lg:px-8">
            <p className="text-[0.9375rem] font-semibold text-ink">{p.title}</p>
            <p className="mt-1.5 text-sm text-stone-600">{p.text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

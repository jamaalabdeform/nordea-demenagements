import { MediaSlot } from "@/components/MediaSlot";
import type { MediaId } from "@/config/media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

/**
 * Galerie narrative : quatre moments d'un déménagement, légendés sobrement.
 * Emplacements prêts pour les assets Higgsfield (ASSET 01 → 05).
 */
const frames: Array<{ id: MediaId; label: string; caption: string; col: string; media: string }> = [
  { id: "carry", label: "Préparer", caption: "Chaque carton fermé, étiqueté, attribué à une pièce.", col: "lg:col-span-5", media: "aspect-[4/3] sm:aspect-[4/5]" },
  { id: "truck", label: "Charger", caption: "Le camion est chargé dans l'ordre inverse de la livraison.", col: "lg:col-span-7", media: "aspect-[4/3] lg:aspect-auto lg:flex-1" },
  { id: "protection", label: "Protéger", caption: "Les meubles voyagent sous couverture, sanglés.", col: "lg:col-span-7", media: "aspect-[4/3] lg:aspect-[16/10]" },
  { id: "arrival", label: "Arriver", caption: "Chaque chose posée dans la bonne pièce.", col: "lg:col-span-5", media: "aspect-[4/3] sm:aspect-[4/5] lg:aspect-auto lg:flex-1" },
];

export function Gallery() {
  return (
    <section aria-labelledby="galerie-title" className="py-section">
      <div className="container-page">
        <SectionHeading id="galerie-title" index="07" eyebrow="Sur le terrain" title="Chaque chose à sa place." />
        <div className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          {frames.map((f, i) => (
            <Reveal as="article" key={f.id} delay={(i % 2) * 0.08} className={cn("flex flex-col", f.col)}>
              <MediaSlot id={f.id} sizes="(min-width: 1024px) 50vw, 100vw" className={cn("w-full rounded-[var(--radius-lg)]", f.media)} />
              <p className="mt-4 flex gap-4 text-sm">
                <span className="eyebrow w-20 shrink-0 pt-[3px] text-lagon-600">{f.label}</span>
                <span className="text-stone-600">{f.caption}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

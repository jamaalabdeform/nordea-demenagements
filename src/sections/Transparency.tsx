"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

const stages = [
  {
    title: "Inventaire structuré",
    text: "Vos meubles sont listés pièce par pièce. Rien ne repose sur une estimation « à l'œil ».",
    file: "Inventaire · 6 pièces, 58 éléments",
  },
  {
    title: "Volume estimé",
    text: "Le volume est calculé à partir de votre inventaire, puis relu par un conseiller.",
    file: "Volume estimé · 26,4 m³",
  },
  {
    title: "Contraintes identifiées",
    text: "Étages, ascenseur, stationnement, portage, objets particuliers : tout est noté avant le devis.",
    file: "Accès · 3e étage, ascenseur étroit",
  },
  {
    title: "Demande centralisée",
    text: "Toutes vos informations sont réunies dans un seul dossier, suivi par un seul interlocuteur.",
    file: "Dossier SM-2611 · suivi par un conseiller",
  },
  {
    title: "Validation avant devis",
    text: "Le devis n'est établi qu'une fois ces points vérifiés avec vous. Ce qui est écrit est ce qui est prévu.",
    file: "Devis · prêt à être envoyé",
  },
];

export function Transparency() {
  const [reached, setReached] = useState(-1);
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.index);
          if (e.isIntersecting) setReached((r) => Math.max(r, i));
        }
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="suivi-title" className="border-t border-ink/8 bg-stone-100/60 py-section">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="suivi-title"
              index="06"
              eyebrow="Suivi"
              title="Vous savez où vous en êtes, à chaque étape."
              lead="Pas de mauvaise surprise le jour J : tout ce qui peut faire varier le prix est identifié avant."
            />

            {/* Aperçu d'un dossier client : se complète au fil du scroll */}
            <div aria-hidden className="mt-12 hidden rounded-[var(--radius-lg)] bg-paper p-6 shadow-[var(--shadow-lift)] lg:block">
              <div className="flex items-center justify-between border-b border-ink/8 pb-4">
                <p className="text-sm font-semibold">Votre dossier</p>
                <p className="num text-xs text-stone-600">{Math.max(0, reached + 1)}/5</p>
              </div>
              <ul className="mt-4 space-y-3">
                {stages.map((s, i) => {
                  const done = i <= reached;
                  return (
                    <li key={s.title} className="flex items-center gap-3 text-sm">
                      <motion.span
                        animate={{ backgroundColor: done ? "var(--color-marine-700)" : "rgba(0,0,0,0)", scale: done && !reduce ? [0.8, 1] : 1 }}
                        transition={{ duration: 0.35 }}
                        className={cn("grid size-5 shrink-0 place-items-center rounded-full", !done && "shadow-[inset_0_0_0_1px_rgb(20_26_34/0.2)]")}
                      >
                        {done && <Check className="size-3 text-paper" strokeWidth={2.5} />}
                      </motion.span>
                      <span className={cn("transition-colors duration-500", done ? "text-ink" : "text-stone-500")}>{s.file}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {stages.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-14 last:pb-0 sm:gap-6"
            >
              {i < stages.length - 1 && <span aria-hidden className="absolute bottom-0 left-[1.25rem] top-11 w-px bg-ink/12" />}
              <span
                className={cn(
                  "num grid size-10 place-items-center rounded-full text-sm font-medium transition-colors duration-500",
                  i <= reached ? "bg-marine-700 text-paper" : "bg-paper text-stone-600 shadow-[var(--shadow-hairline)]",
                )}
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-stone-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

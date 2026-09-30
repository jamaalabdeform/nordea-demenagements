"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import { pricingConfig } from "@/config/pricing.config";
import { routes, site } from "@/config/site";
import { ease } from "@/config/motion";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";

const nextSteps = [
  { title: "Vérification", text: "Un conseiller relit votre inventaire et vos accès." },
  { title: "Échange", text: "Il vous appelle pour lever les derniers doutes, si nécessaire." },
  { title: "Proposition", text: "Vous recevez un devis détaillé, poste par poste." },
];

export function Confirmation({
  reference,
  leadId,
  message,
  firstName,
  kind = "quote",
}: {
  reference: string;
  leadId: string;
  message: string;
  firstName?: string;
  kind?: "quote" | "callback";
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-[4.25rem] items-center">
        <Link href="/" aria-label={`${company.name} — accueil`}>
          <Logo compact />
        </Link>
      </header>

      <main id="contenu" className="container-page flex flex-1 flex-col items-center justify-center pb-20 pt-8 text-center">
        <motion.svg viewBox="0 0 64 64" className="size-16 text-forest-700" aria-hidden initial={false}>
          <motion.circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: ease.out }} />
          <motion.path d="M20 33l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.55, ease: ease.out }} />
        </motion.svg>

        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: ease.out }}>
          <h1 className="font-display mt-8 text-4xl text-ink">{kind === "callback" ? `C'est noté${firstName ? `, ${firstName}` : ""}.` : `Merci${firstName ? `, ${firstName}` : ""}.`}</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-stone-600">
            {kind === "callback" ? "Un conseiller vous appelle sur le créneau choisi." : message || pricingConfig.demoMessage}
          </p>
          <p className="mt-6 text-sm text-stone-600">
            Référence de votre dossier : <span className="num font-semibold text-ink">{reference}</span>
          </p>
        </motion.div>

        {kind === "quote" && (
          <motion.ol
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-14 grid w-full max-w-3xl gap-px overflow-hidden rounded-[var(--radius-lg)] bg-ink/8 text-left shadow-[var(--shadow-hairline)] sm:grid-cols-3"
          >
            {nextSteps.map((s, i) => (
              <li key={s.title} className="bg-paper p-6">
                <span className="num text-sm font-medium text-brick-600">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-stone-600">{s.text}</p>
              </li>
            ))}
          </motion.ol>
        )}

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary">
            Retour au site
          </ButtonLink>
          <a href={telHref} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-[0.9375rem] text-ink-2 hover:bg-stone-100">
            <Phone className="size-4 text-forest-500" strokeWidth={1.6} aria-hidden />
            <span className="num">{company.phone.display}</span>
          </a>
        </div>

        {site.flags.demoNotice && (
          <Link href={`${routes.admin}/leads/${leadId}`} className="mt-16 text-xs text-stone-600 underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink">
            Démo · voir cette demande côté entreprise →
          </Link>
        )}
      </main>
    </div>
  );
}

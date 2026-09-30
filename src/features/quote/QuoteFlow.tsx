"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Phone, X } from "lucide-react";
import { company, telHref } from "@/config/company";
import { duration, ease } from "@/config/motion";
import { Logo } from "@/components/Logo";
import { Arrow, Button } from "@/components/ui/Button";
import { InventoryPicker } from "@/features/inventory/InventoryPicker";
import { VolumeCounter } from "@/features/inventory/VolumeVisual";
import { hasSpecialItem, suggestVehicle, totalVolume } from "@/features/inventory/volume";
import { IsoCargo } from "@/features/inventory/IsoCargo";
import { filledCells } from "@/features/inventory/cargo";
import { leadRepository, makeReference, type Lead } from "@/features/admin/leads";
import { attribution, track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { GROUPS, STEPS, stepIndex, validateStep, type StepId } from "./steps";
import { useQuoteDraft, type InitialParams } from "./useQuoteDraft";
import { StepLogement, StepPieces, StepTrajet } from "./steps/ProjectSteps";
import { StepAccess, StepDate, StepOptions, StepSpeciaux } from "./steps/DetailSteps";
import { CONTACT_FORM_ID, ContactStep } from "./steps/ContactStep";
import { QuoteSummary } from "./QuoteSummary";
import { Recap } from "./Recap";
import { Confirmation } from "./Confirmation";

const STEP_FORM_ID = "step-form";

export default function QuoteFlow({ params }: { params: InitialParams }) {
  const { draft, step, update, goTo, reset } = useQuoteDraft(params);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reference: string; leadId: string; message: string; firstName: string } | null>(null);
  const [dir, setDir] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const index = stepIndex(step);
  const def = STEPS[index];
  const volume = totalVolume(draft);

  useEffect(() => {
    track("quote_started", { entry: params.from ? "hero" : params.housing ? "simulator" : "direct" }, { oncePerSession: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(to: StepId) {
    setDir(stepIndex(to) > index ? 1 : -1);
    setError(null);
    goTo(to);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  }

  function next() {
    const msg = validateStep(step, draft);
    if (msg) {
      setError(msg);
      return;
    }
    if (step === "inventaire") track("inventory_completed", { volume, rooms: draft.rooms.length });
    if (step === "depart") track("origin_completed", { city: draft.origin.city, floor: draft.origin.floor ?? "" });
    if (step === "arrivee") track("destination_completed", { city: draft.destination.city, floor: draft.destination.floor ?? "" });
    const nextStep = STEPS[index + 1];
    if (nextStep) move(nextStep.id);
  }

  function back() {
    const prev = STEPS[index - 1];
    if (prev) move(prev.id);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const attr = attribution();
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "quote", draft, attribution: attr }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "submit_failed");

      const lead: Lead = {
        id: crypto.randomUUID(),
        reference: data.reference ?? makeReference(),
        createdAt: new Date().toISOString(),
        status: "nouveau",
        origin: "site",
        volume,
        specialItem: hasSpecialItem(draft.specials),
        quote: draft,
        notes: "",
        reviewReasons: data.pricing?.reviewReasons ?? [],
        timeline: [{ at: new Date().toISOString(), type: "created", text: "Demande reçue depuis le simulateur" }],
        attribution: attr,
      };
      leadRepository.add(lead);
      track("quote_submitted", { volume, special_item: lead.specialItem, housing: draft.housing ?? "", formula: draft.formula ?? "" });
      setDone({ reference: lead.reference, leadId: lead.id, message: data.pricing?.message ?? "", firstName: draft.contact.firstName });
      reset();
      window.scrollTo({ top: 0 });
    } catch {
      setError(`L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou appelez-nous au ${company.phone.display}.`);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <Confirmation {...done} />;

  const isContact = step === "contact";
  const isRecap = step === "recap";
  const showMobileVolume = ["inventaire", "speciaux"].includes(step);

  const content = (() => {
    switch (step) {
      case "trajet":
        return <StepTrajet draft={draft} update={update} />;
      case "logement":
        return <StepLogement draft={draft} update={update} />;
      case "pieces":
        return <StepPieces draft={draft} update={update} />;
      case "inventaire":
        return <InventoryPicker draft={draft} update={update} />;
      case "speciaux":
        return <StepSpeciaux draft={draft} update={update} />;
      case "depart":
        return <StepAccess draft={draft} update={update} which="origin" />;
      case "arrivee":
        return <StepAccess draft={draft} update={update} which="destination" />;
      case "date":
        return <StepDate draft={draft} update={update} />;
      case "options":
        return <StepOptions draft={draft} update={update} />;
      case "contact":
        return (
          <ContactStep
            draft={draft}
            onValid={(v) => {
              update((d) => {
                d.contact = v;
              });
              track("contact_completed");
              move("recap");
            }}
          />
        );
      case "recap":
        return <Recap draft={draft} onEdit={move} />;
    }
  })();

  const primary = isRecap ? (
    <Button type="button" onClick={submit} disabled={submitting} size="lg" className="min-w-0 flex-1 sm:flex-none">
      {submitting ? <Spinner /> : null}
      {submitting ? "Envoi…" : "Recevoir mon devis"}
      {!submitting && <Arrow />}
    </Button>
  ) : (
    <Button type="submit" form={isContact ? CONTACT_FORM_ID : STEP_FORM_ID} size="lg" arrow className="min-w-0 flex-1 sm:flex-none">
      {isContact ? "Vérifier ma demande" : "Continuer"}
    </Button>
  );

  return (
    <div className="min-h-dvh">
      <FlowHeader index={index} />

      <div ref={topRef} className="container-page scroll-mt-28 grid gap-10 pb-36 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:pb-20 xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-20">
        <main id="contenu" className="min-w-0 max-w-[44rem]">
          <p className="eyebrow num text-stone-600">
            <span className="text-brick-600">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-2 text-stone-500">/</span>
            {String(STEPS.length).padStart(2, "0")} · {GROUPS[def.group]}
          </p>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -16 }}
              transition={{ duration: duration.base, ease: ease.out }}
            >
              <h1 className="font-display mt-4 text-4xl text-ink">{def.title}</h1>
              {def.subtitle && <p className="mt-4 max-w-xl text-[1.0625rem] text-stone-600">{def.subtitle}</p>}

              {showMobileVolume && (
                <div className="sticky top-[4.25rem] z-20 -mx-[var(--spacing-gutter)] mt-6 flex items-center justify-between bg-ivory/90 px-[var(--spacing-gutter)] py-3 backdrop-blur lg:hidden">
                  <span className="flex items-center gap-3 text-sm text-stone-600">
                    <IsoCargo filled={filledCells(volume, suggestVehicle(volume))} className="h-9 w-16" />
                    Volume estimé
                  </span>
                  <VolumeCounter value={volume} className="font-display text-2xl [font-weight:400]" />
                </div>
              )}

              <div className="mt-8 sm:mt-10">
                {isContact || isRecap ? (
                  content
                ) : (
                  <form
                    id={STEP_FORM_ID}
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      next();
                    }}
                  >
                    {content}
                  </form>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-[var(--radius-md)] bg-brick-100/70 px-4 py-3 text-sm font-medium text-brick-600"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {isRecap && (
            <p className="mt-6 text-sm text-stone-600">
              En envoyant votre demande, vous ne vous engagez à rien. Un conseiller vérifie les informations avant de vous transmettre votre proposition.
            </p>
          )}

          {/* Navigation — desktop */}
          <div className="mt-12 hidden items-center justify-between gap-4 border-t border-ink/8 pt-8 sm:flex">
            {index > 0 ? (
              <button type="button" onClick={back} className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[0.9375rem] text-ink-2 transition-colors hover:bg-stone-100 hover:text-ink">
                <ArrowLeft className="size-4" strokeWidth={1.6} aria-hidden />
                Retour
              </button>
            ) : (
              <span />
            )}
            {primary}
          </div>
        </main>

        <aside aria-label="Résumé de votre demande" className="hidden lg:block">
          <div className="sticky top-28">
            <QuoteSummary draft={draft} />
          </div>
        </aside>
      </div>

      {/* Navigation — mobile, toujours à portée de pouce */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button type="button" onClick={back} aria-label="Étape précédente" className="grid size-14 shrink-0 place-items-center rounded-full shadow-[var(--shadow-hairline)]">
              <ArrowLeft className="size-5" strokeWidth={1.6} />
            </button>
          )}
          {primary}
        </div>
      </div>
    </div>
  );
}

function FlowHeader({ index }: { index: number }) {
  const group = STEPS[index].group;
  const progress = (index + 1) / STEPS.length;
  return (
    <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-xl">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name} — retour au site`} className="rounded-md">
          <Logo compact />
        </Link>

        <ol className="hidden items-center gap-1 md:flex" aria-label="Progression">
          {GROUPS.map((g, i) => (
            <li
              key={g}
              aria-current={i === group ? "step" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors duration-300",
                i === group ? "bg-ink font-medium text-paper" : i < group ? "text-ink" : "text-stone-500",
              )}
            >
              {g}
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-1">
          <a href={telHref} className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm text-ink-2 hover:bg-stone-100 lg:inline-flex">
            <Phone className="size-4 text-forest-500" strokeWidth={1.6} aria-hidden />
            <span className="num">{company.phone.display}</span>
          </a>
          <Link href="/" className="grid size-10 place-items-center rounded-full text-ink-2 hover:bg-stone-100" aria-label="Quitter l'estimation">
            <X className="size-5" strokeWidth={1.6} />
          </Link>
        </div>
      </div>
      <div className="h-[2px] bg-ink/6" role="progressbar" aria-label="Avancement de la demande" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <motion.div className="h-full origin-left bg-forest-700" initial={false} animate={{ scaleX: progress }} transition={{ duration: 0.6, ease: ease.out }} />
      </div>
    </header>
  );
}

function Spinner() {
  return <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />;
}

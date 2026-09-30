"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Building2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { company, telHref } from "@/config/company";
import { paymentConfig } from "@/config/payment.config";
import { formulas } from "@/data/services";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form";
import { ease } from "@/config/motion";
import { leadRepository, type Lead } from "@/features/admin/leads";
import { cn, formatDate, formatNumber1 } from "@/lib/format";
import { formatEur } from "./format";

type Method = "carte" | "virement";

/**
 * Page de paiement de l'acompte, envoyée au client par lien.
 * Carte : redirection vers Stripe Checkout (page hébergée) — ou simulation
 * en mode démo. Virement : coordonnées bancaires + référence du dossier.
 */
export default function PaymentView({ id, returnStatus }: { id: string; returnStatus?: string }) {
  const reduce = useReducedMotion();
  const [lead, setLead] = useState<Lead | undefined>(() => {
    const l = leadRepository.get(id);
    // Retour de Stripe : l'état définitif est confirmé par le webhook côté serveur
    if (l?.payment && returnStatus === "succes" && l.payment.status !== "paye") {
      return markPaid(l, "carte");
    }
    return l;
  });
  const [method, setMethod] = useState<Method>(paymentConfig.methods.card ? "carte" : "virement");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  if (!lead || !lead.payment) return <NotFound />;
  const p = lead.payment;
  const q = lead.quote;
  const formula = formulas.find((f) => f.id === q.formula);

  async function pay() {
    if (!lead || !accepted) {
      setError("Merci de confirmer avoir pris connaissance du devis et des conditions.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, reference: lead.reference, amount: lead.payment!.deposit, email: lead.quote.contact.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      if (data.mode === "redirect") {
        window.location.href = data.url;
        return;
      }
      // Mode démo : simulation du passage par la page de paiement sécurisée
      setDemo(true);
      await new Promise((r) => setTimeout(r, 1600));
      setLead(markPaid(lead, "carte"));
    } catch {
      setError(`Le paiement n'a pas pu être initié. Réessayez dans un instant ou contactez-nous au ${company.phone.display}.`);
    } finally {
      setBusy(false);
    }
  }

  function declareTransfer() {
    if (!lead) return;
    if (!accepted) {
      setError("Merci de confirmer avoir pris connaissance du devis et des conditions.");
      return;
    }
    const updated = leadRepository.update(lead.id, { payment: { ...lead.payment!, method: "virement" } }, { type: "note", text: "Le client indique avoir effectué le virement de l'acompte" });
    setLead(updated);
    setError(null);
  }

  const paid = p.status === "paye";

  return (
    <div className="min-h-dvh">
      <header className="container-page flex h-[4.25rem] items-center justify-between">
        <Link href="/" aria-label={`${company.name} — accueil`}>
          <Logo compact />
        </Link>
        <p className="flex items-center gap-2 text-xs text-stone-600">
          <Lock className="size-3.5" strokeWidth={1.8} aria-hidden />
          Paiement sécurisé
        </p>
      </header>

      <main id="contenu" className="container-page grid max-w-6xl gap-10 pb-24 pt-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 lg:pt-14">
        <div>
          <p className="eyebrow text-stone-600">
            Dossier <span className="num text-ink">{lead.reference}</span>
          </p>

          {paid ? (
            <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
              <h1 className="font-display mt-4 text-4xl">Acompte reçu. Votre date est réservée.</h1>
              <p className="mt-5 max-w-lg text-lg text-stone-600">
                Merci {q.contact.firstName}. Votre conseiller vous recontacte quelques jours avant le déménagement pour confirmer l&apos;horaire d&apos;arrivée de l&apos;équipe.
              </p>
              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] bg-ink/8 shadow-[var(--shadow-hairline)]">
                <Cell label="Acompte réglé" value={formatEur(p.deposit)} />
                <Cell label="Le" value={p.paidAt ? formatDate(p.paidAt, { day: "numeric", month: "long", year: "numeric" }) : "—"} />
                <Cell label="Reste à régler" value={formatEur(p.total - p.deposit)} />
                <Cell label="Moyen" value={p.method === "virement" ? "Virement" : "Carte bancaire"} />
              </dl>
              <p className="mt-8 text-sm text-stone-600">Un reçu vous est adressé par e-mail{q.contact.email ? ` à ${q.contact.email}` : ""}.</p>
            </motion.div>
          ) : (
            <>
              <h1 className="font-display mt-4 text-4xl">Réservez votre date.</h1>
              <p className="mt-5 max-w-lg text-lg text-stone-600">
                Le règlement de l&apos;acompte valide votre devis et bloque l&apos;équipe et le véhicule pour votre déménagement.
              </p>

              <fieldset className="mt-10">
                <legend className="text-sm font-medium text-ink">Moyen de paiement</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {paymentConfig.methods.card && (
                    <MethodCard selected={method === "carte"} onClick={() => setMethod("carte")} icon={<CreditCard className="size-5" strokeWidth={1.5} />} title="Carte bancaire" detail="Page de paiement sécurisée" />
                  )}
                  {paymentConfig.methods.transfer && (
                    <MethodCard selected={method === "virement"} onClick={() => setMethod("virement")} icon={<Building2 className="size-5" strokeWidth={1.5} />} title="Virement" detail="Sous 3 à 5 jours ouvrés" />
                  )}
                </div>
              </fieldset>

              {method === "virement" && (
                <div className="mt-6 rounded-[var(--radius-md)] bg-paper p-5 text-sm shadow-[var(--shadow-hairline)]">
                  <dl className="grid grid-cols-[7rem_1fr] gap-y-2">
                    <dt className="text-stone-600">Titulaire</dt>
                    <dd>{paymentConfig.transfer.holder}</dd>
                    <dt className="text-stone-600">IBAN</dt>
                    <dd className="num">{paymentConfig.transfer.iban}</dd>
                    <dt className="text-stone-600">BIC</dt>
                    <dd className="num">{paymentConfig.transfer.bic}</dd>
                    <dt className="text-stone-600">Libellé</dt>
                    <dd className="num font-semibold">{lead.reference}</dd>
                  </dl>
                </div>
              )}

              <Checkbox checked={accepted} onChange={setAccepted} className="mt-8">
                <span className="text-sm text-ink-2">J&apos;ai pris connaissance du devis et des conditions générales de vente, et je les accepte.</span>
              </Checkbox>

              {error && (
                <p role="alert" className="mt-5 rounded-[var(--radius-md)] bg-brick-100/70 px-4 py-3 text-sm font-medium text-brick-600">
                  {error}
                </p>
              )}

              <div className="mt-8">
                {method === "carte" ? (
                  <Button size="lg" onClick={pay} disabled={busy} className="w-full sm:w-auto">
                    {busy ? (demo ? "Paiement en cours…" : "Redirection…") : `Payer l'acompte de ${formatEur(p.deposit)}`}
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" onClick={declareTransfer} disabled={p.method === "virement"} className="w-full sm:w-auto">
                    {p.method === "virement" ? "Virement signalé — merci" : "J'ai effectué le virement"}
                  </Button>
                )}
              </div>

              <p className="mt-6 flex items-start gap-2 text-xs text-stone-600">
                <ShieldCheck className="mt-px size-4 shrink-0 text-forest-500" strokeWidth={1.6} aria-hidden />
                <span>
                  Vos données bancaires sont saisies uniquement sur la page sécurisée de notre prestataire de paiement : elles ne transitent jamais par notre site.{" "}
                  {paymentConfig.legalNote}
                </span>
              </p>
              {!process.env.NEXT_PUBLIC_STRIPE_ENABLED && (
                <p className="mt-4 inline-block rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600">Mode démonstration — aucun paiement réel n&apos;est effectué.</p>
              )}
            </>
          )}
        </div>

        <aside aria-label="Récapitulatif du devis" className="lg:pt-8">
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-[var(--shadow-lift)]">
            <div className="grain bg-forest-900 p-6 text-paper">
              <p className="relative z-[2] text-lg font-semibold uppercase tracking-[0.08em]">
                {q.from.city} <span className="text-brick-400">→</span> {q.to.city}
              </p>
              <p className="relative z-[2] mt-1 text-sm text-paper/65">
                {formatNumber1(lead.volume)} m³{q.date.value && ` · ${formatDate(q.date.value, { day: "numeric", month: "long", year: "numeric" })}`}
                {formula && ` · ${formula.name}`}
              </p>
            </div>
            <dl className="divide-y divide-ink/8 text-[0.9375rem]">
              <Line label="Total du devis (TTC)" value={formatEur(p.total)} />
              <Line label={`Acompte (${p.depositPercent} %)`} value={formatEur(p.deposit)} strong />
              <Line label="Solde à régler" value={formatEur(p.total - p.deposit)} muted />
            </dl>
          </div>
          <p className="mt-5 text-center text-sm text-stone-600">
            Une question ?{" "}
            <a href={telHref} className="num font-medium text-ink underline underline-offset-4">
              {company.phone.display}
            </a>
          </p>
        </aside>
      </main>
    </div>
  );
}

function markPaid(lead: Lead, method: Method): Lead | undefined {
  return leadRepository.update(
    lead.id,
    { status: "accepte", payment: { ...lead.payment!, status: "paye", method, paidAt: new Date().toISOString() } },
    { type: "status", text: `Acompte réglé (${formatEur(lead.payment!.deposit)}, ${method === "carte" ? "carte" : "virement"}) — statut : Accepté` },
  );
}

function MethodCard({ selected, onClick, icon, title, detail }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; detail: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius-md)] bg-paper p-5 text-left transition-shadow duration-200",
        selected ? "shadow-[0_0_0_1.5px_var(--color-forest-700)]" : "shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(26_28_27/0.25)]",
      )}
    >
      <span className={cn("grid size-10 place-items-center rounded-full", selected ? "bg-forest-700 text-paper" : "bg-stone-100 text-ink")}>{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-stone-600">{detail}</span>
      </span>
    </button>
  );
}

function Line({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-6 py-4">
      <dt className={cn(muted ? "text-stone-600" : "text-ink-2")}>{label}</dt>
      <dd className={cn("num", strong ? "font-display text-2xl text-ink" : muted ? "text-stone-600" : "text-ink")}>{value}</dd>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-4">
      <dt className="text-xs text-stone-600">{label}</dt>
      <dd className="num mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container-page flex min-h-dvh max-w-xl flex-col justify-center text-center">
      <Logo compact className="mx-auto" />
      <h1 className="font-display mt-10 text-3xl">Ce lien de paiement n&apos;est pas disponible.</h1>
      <p className="mt-4 text-stone-600">
        Il a peut-être expiré, ou le dossier a été modifié. Contactez votre conseiller au{" "}
        <a href={telHref} className="num font-medium text-ink underline underline-offset-4">
          {company.phone.display}
        </a>
        .
      </p>
      <p className="mt-8 text-xs text-stone-500">Démo : les dossiers sont conservés dans le navigateur où ils ont été créés.</p>
    </div>
  );
}

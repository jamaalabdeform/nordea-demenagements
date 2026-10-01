"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, PhoneCall, Receipt, TriangleAlert } from "lucide-react";
import { housingById, roomById, specialItemById } from "@/data/furnitureCatalog";
import { formulas, quoteOptions } from "@/data/services";
import { roomVolume } from "@/features/inventory/volume";
import { carryDistanceLabels, yesNoUnknownLabels, type Access } from "@/features/quote/types";
import { reviewPoints } from "@/lib/pricing/engine";
import { cn, formatDate, formatDateTime, formatFloor, formatNumber1 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Checkbox, inputClass } from "@/components/ui/form";
import { LEAD_STATUSES, leadRepository, statusLabel, useLeads, type Lead, type LeadStatus } from "./leads";

export function LeadDetail({ id }: { id: string }) {
  const leads = useLeads();
  const lead = leads.find((l) => l.id === id);

  if (!leads.length) return <div className="h-96 animate-pulse rounded-[var(--radius-lg)] bg-stone-200" aria-busy="true" />;
  if (!lead)
    return (
      <div className="py-24 text-center">
        <p className="font-display text-3xl">Demande introuvable</p>
        <p className="mt-2 text-stone-600">Elle a peut-être été créée sur un autre navigateur.</p>
        <Link href="/admin-demo" className="mt-6 inline-block text-sm underline underline-offset-4">
          Retour aux demandes
        </Link>
      </div>
    );

  return <LeadView lead={lead} />;
}

function LeadView({ lead }: { lead: Lead }) {
  const q = lead.quote;
  const c = q.contact;
  const formula = formulas.find((f) => f.id === q.formula);
  const points = [...new Set([...lead.reviewReasons, ...(q.from.city ? reviewPoints(q) : [])])];

  function setStatus(status: LeadStatus) {
    leadRepository.update(lead.id, { status }, { type: "status", text: `Statut : ${statusLabel(status)}` });
  }

  return (
    <div>
      <Link href="/admin-demo" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-ink">
        <ArrowLeft className="size-4" strokeWidth={1.6} aria-hidden />
        Demandes
      </Link>

      {/* En-tête */}
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="num flex items-center gap-3 text-sm text-stone-600">
            {lead.reference} · reçue le {formatDateTime(lead.createdAt)}
            {lead.origin === "demo" && <span className="rounded bg-stone-200/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">exemple</span>}
          </p>
          <h1 className="font-display mt-2 text-4xl">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "Sans nom"}</h1>
          <p className="mt-2 text-lg text-ink-2">
            {q.from.city ? (
              <>
                {q.from.city} → {q.to.city} · <span className="num">{formatNumber1(lead.volume)} m³</span>
                {q.kind === "transport" ? " · Transport d'objets" : q.housing && ` · ${housingById[q.housing].label}`}
              </>
            ) : (
              "Demande de rappel"
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {c.phone && (
            <a
              href={`tel:${c.phone.replace(/\s/g, "")}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-marine-700 px-5 text-sm font-medium text-paper hover:bg-marine-900"
              onClick={() => leadRepository.update(lead.id, {}, { type: "call", text: "Appel sortant" })}
            >
              <Phone className="size-4" strokeWidth={1.6} aria-hidden />
              <span className="num">{c.phone}</span>
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}?subject=Votre déménagement — ${lead.reference}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm shadow-[var(--shadow-hairline)] hover:bg-white">
              <Mail className="size-4" strokeWidth={1.6} aria-hidden />
              E-mail
            </a>
          )}
          <label className="sr-only" htmlFor="status">
            Statut
          </label>
          <select
            id="status"
            value={lead.status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="h-11 rounded-full bg-paper pl-4 pr-9 text-sm font-medium shadow-[var(--shadow-hairline)] outline-none focus:shadow-[0_0_0_1.5px_var(--color-marine-500)]"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline */}
      <ol className="mt-8 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
        {LEAD_STATUSES.filter((s) => s.id !== "perdu").map((s, i, arr) => {
          const current = arr.findIndex((x) => x.id === lead.status);
          const reached = lead.status !== "perdu" && i <= current;
          return (
            <li key={s.id} className="min-w-28 flex-1">
              <button type="button" onClick={() => setStatus(s.id)} className="group w-full text-left" aria-current={lead.status === s.id ? "step" : undefined}>
                <span className={cn("block h-1 rounded-full transition-colors", reached ? "bg-marine-700" : "bg-stone-200 group-hover:bg-stone-300")} />
                <span className={cn("mt-2 block text-xs", lead.status === s.id ? "font-semibold text-ink" : "text-stone-600")}>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 space-y-6">
          {points.length > 0 && (
            <Card title="Points à vérifier avant devis" icon={<TriangleAlert className="size-4 text-alert-600" strokeWidth={1.8} />}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ink-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-alert-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {q.from.city && (
            <Card title="Logistique">
              <div className="grid gap-6 sm:grid-cols-2">
                <AccessBlock label="Départ" a={q.origin} city={q.from.city} />
                <AccessBlock label="Arrivée" a={q.destination} city={q.to.city} />
              </div>
              <dl className="mt-6 grid gap-4 border-t border-ink/8 pt-5 text-sm sm:grid-cols-3">
                <Info label="Date souhaitée" value={q.date.value ? formatDate(q.date.value, { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "À convenir"} extra={q.date.flexible ? "Dates flexibles" : undefined} />
                <Info label="Formule" value={formula?.name ?? "À définir"} />
                <Info label="Options" value={q.options.length ? q.options.map((o) => quoteOptions.find((x) => x.id === o)?.label ?? o).join(", ") : "Aucune"} />
              </dl>
            </Card>
          )}

          {q.rooms.length > 0 && (
            <Card title={`Inventaire · ${formatNumber1(lead.volume)} m³`}>
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {q.rooms.map((r) => {
                  const items = Object.entries(q.inventory[r.key] ?? {}).filter(([, n]) => n > 0);
                  const catalog = roomById[r.roomId];
                  return (
                    <div key={r.key}>
                      <p className="flex justify-between border-b border-ink/8 pb-2 text-sm font-semibold">
                        {r.label}
                        <span className="num font-normal text-stone-600">{formatNumber1(roomVolume(r.roomId, q.inventory[r.key]))} m³</span>
                      </p>
                      {items.length ? (
                        <ul className="mt-2 space-y-1 text-sm text-ink-2">
                          {items.map(([id, n]) => (
                            <li key={id} className="flex justify-between">
                              <span>{catalog.items.find((i) => i.id === id)?.label ?? id}</span>
                              <span className="num text-stone-600">× {n}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-stone-500">Vide</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {lead.specialItem && (
                <div className="mt-6 rounded-[var(--radius-md)] bg-alert-50/60 p-4 text-sm">
                  <p className="font-semibold text-alert-600">Objets spécifiques · étude nécessaire</p>
                  <p className="mt-1 text-ink-2">
                    {Object.entries(q.specials)
                      .filter(([, n]) => n > 0)
                      .map(([id, n]) => `${specialItemById[id]?.label ?? id} × ${n}`)
                      .join(" · ")}
                  </p>
                </div>
              )}
            </Card>
          )}

          {c.message && (
            <Card title="Message du client">
              <p className="whitespace-pre-line text-[0.9375rem] text-ink-2">« {c.message} »</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <QuoteFollowUpCard lead={lead} />
          <Card title="Coordonnées">
            <dl className="space-y-3 text-sm">
              <Info label="Téléphone" value={c.phone || "—"} />
              <Info label="E-mail" value={c.email || "—"} />
              {lead.attribution && Object.keys(lead.attribution).length > 0 && (
                <Info label="Source" value={[lead.attribution.utm_source, lead.attribution.utm_medium, lead.attribution.utm_campaign].filter(Boolean).join(" / ") || lead.attribution.referrer || "Accès direct"} />
              )}
            </dl>
          </Card>
          <Notes lead={lead} />
          <Card title="Historique">
            <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-ink/10">
              {[...lead.timeline].reverse().map((e, i) => (
                <li key={i} className="relative pl-6 text-sm">
                  <span aria-hidden className={cn("absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-paper", e.type === "created" ? "bg-lagon-600" : e.type === "call" ? "bg-marine-500" : "bg-stone-300")} />
                  <p className="text-ink-2">{e.text}</p>
                  <p className="num text-xs text-stone-500">{formatDateTime(e.at)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Suivi du devis ───────────────────────── */

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function QuoteFollowUpCard({ lead }: { lead: Lead }) {
  const f = lead.followUp;
  const [amount, setAmount] = useState(f ? String(f.amount) : "");
  const value = Number(amount.replace(/\s/g, "").replace(",", "."));
  const valid = value > 0;

  function markSent() {
    if (!valid) return;
    leadRepository.update(
      lead.id,
      { status: lead.status === "accepte" ? lead.status : "devis-envoye", followUp: { ...f, amount: value, sentAt: new Date().toISOString() } },
      { type: "status", text: `Devis envoyé — ${eur.format(value)} TTC` },
    );
  }

  function toggleDeposit(received: boolean) {
    if (!f) return;
    leadRepository.update(
      lead.id,
      { status: received ? "accepte" : lead.status, followUp: { ...f, depositReceivedAt: received ? new Date().toISOString() : undefined } },
      { type: "status", text: received ? "Acompte encaissé (hors site) — statut : Accepté" : "Acompte : encaissement annulé" },
    );
  }

  return (
    <Card title="Suivi du devis" icon={<Receipt className="size-4 text-marine-500" strokeWidth={1.8} />}>
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="text-xs font-medium text-stone-600">
            Montant du devis TTC (€)
          </label>
          <div className="mt-1.5 flex gap-2">
            <input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1 850" className={cn(inputClass, "num h-12")} />
            <Button type="button" onClick={markSent} disabled={!valid} className="h-12 shrink-0 px-5">
              {f ? "Mettre à jour" : "Marquer envoyé"}
            </Button>
          </div>
        </div>
        {f && (
          <div className="rounded-[var(--radius-md)] bg-stone-100 p-4 text-sm">
            <p className="text-ink-2">
              Envoyé le {formatDateTime(f.sentAt)} · <span className="num font-semibold text-ink">{eur.format(f.amount)}</span>
            </p>
            <Checkbox checked={!!f.depositReceivedAt} onChange={toggleDeposit} className="mt-3">
              <span className="text-sm">
                Acompte encaissé
                <span className="block text-xs text-stone-600">
                  {f.depositReceivedAt ? `Le ${formatDateTime(f.depositReceivedAt)}` : "Réglé hors site (lien SumUp, virement…)"}
                </span>
              </span>
            </Checkbox>
          </div>
        )}
        <p className="text-xs text-stone-500">Le montant sera proposé automatiquement une fois la grille tarifaire de l&apos;entreprise intégrée.</p>
      </div>
    </Card>
  );
}

/* ───────────────────────── Notes ───────────────────────── */

function Notes({ lead }: { lead: Lead }) {
  const [value, setValue] = useState(lead.notes);
  const [saved, setSaved] = useState(false);
  const dirty = value !== lead.notes;
  return (
    <Card title="Notes internes">
      <label htmlFor="notes" className="sr-only">
        Notes internes
      </label>
      <textarea id="notes" rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Visite technique, précisions obtenues au téléphone…" className={cn(inputClass, "h-auto resize-y py-3 text-sm")} />
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => leadRepository.update(lead.id, {}, { type: "call", text: "Appel — client joint" })}
          className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs text-ink-2 shadow-[var(--shadow-hairline)] hover:bg-paper"
        >
          <PhoneCall className="size-3.5" strokeWidth={1.8} aria-hidden />
          Consigner un appel
        </button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!dirty}
          onClick={() => {
            leadRepository.update(lead.id, { notes: value }, { type: "note", text: "Note mise à jour" });
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
        >
          {saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </div>
    </Card>
  );
}

/* ───────────────────────── Primitives ───────────────────────── */

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] bg-paper p-6 shadow-[var(--shadow-hairline)]">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Info({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-600">{label}</dt>
      <dd className="mt-0.5 text-ink">
        {value}
        {extra && <span className="block text-xs text-stone-600">{extra}</span>}
      </dd>
    </div>
  );
}

function AccessBlock({ label, a, city }: { label: string; a: Access; city: string }) {
  const noLift = a.floor !== null && a.floor > 0 && a.elevator === "non";
  return (
    <div>
      <p className="eyebrow text-stone-600">{label}</p>
      <p className="mt-2 font-semibold">
        {[a.address, [a.postalCode, a.city || city].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
      </p>
      <ul className="mt-2 space-y-1 text-sm text-ink-2">
        <li>
          {a.housing ? `${housingById[a.housing].label} · ` : ""}
          {formatFloor(a.floor)}
        </li>
        {a.floor !== null && a.floor > 0 && (
          <li className={cn(noLift && "font-medium text-alert-600")}>
            {a.elevator === "oui" ? `Ascenseur · adapté : ${a.elevatorFits ? yesNoUnknownLabels[a.elevatorFits].toLowerCase() : "?"}` : "Sans ascenseur"}
          </li>
        )}
        <li>Portage : {a.carryDistance ? carryDistanceLabels[a.carryDistance].toLowerCase() : "?"}</li>
        <li className={cn(a.parking === "non" && "font-medium text-alert-600")}>Stationnement facile : {a.parking ? yesNoUnknownLabels[a.parking].toLowerCase() : "?"}</li>
      </ul>
    </div>
  );
}


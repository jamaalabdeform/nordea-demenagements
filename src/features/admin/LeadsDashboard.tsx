"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AlertCircle, ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { QUOTE_EVENTS, readFunnel } from "@/lib/analytics";
import { cn, formatDate, formatDateTime, formatNumber1 } from "@/lib/format";
import { LEAD_STATUSES, leadRepository, useLeads, type Lead, type LeadStatus } from "./leads";
import { StatusBadge } from "./StatusBadge";

const funnelLabels: Record<(typeof QUOTE_EVENTS)[number], string> = {
  quote_started: "Devis commencé",
  origin_completed: "Départ renseigné",
  destination_completed: "Arrivée renseignée",
  inventory_started: "Inventaire commencé",
  inventory_completed: "Inventaire terminé",
  special_item_added: "Objet spécifique ajouté",
  contact_completed: "Coordonnées saisies",
  quote_submitted: "Demande envoyée",
};

export function LeadsDashboard() {
  const leads = useLeads();
  const [filter, setFilter] = useState<LeadStatus | "tous">("tous");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "tous" && l.status !== filter) return false;
      if (!needle) return true;
      const c = l.quote.contact;
      return [c.firstName, c.lastName, c.phone, c.email, l.reference, l.quote.from.city, l.quote.to.city].join(" ").toLowerCase().includes(needle);
    });
  }, [leads, filter, q]);

  const count = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
  const withVolume = leads.filter((l) => l.volume > 0);
  const avgVolume = withVolume.length ? withVolume.reduce((a, l) => a + l.volume, 0) / withVolume.length : 0;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-stone-600">Tableau de bord</p>
          <h1 className="font-display mt-2 text-4xl">Demandes de devis</h1>
        </div>
        <button
          type="button"
          onClick={() => confirm("Réinitialiser la démo ? Les demandes saisies seront effacées.") && leadRepository.reset()}
          className="inline-flex h-10 items-center gap-2 self-start rounded-full px-4 text-sm text-stone-600 shadow-[var(--shadow-hairline)] hover:bg-paper hover:text-ink sm:self-auto"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.8} aria-hidden />
          Réinitialiser la démo
        </button>
      </div>

      {/* Indicateurs */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-ink/8 shadow-[var(--shadow-hairline)] md:grid-cols-5">
        <Kpi label="Nouvelles" value={count("nouveau")} accent />
        <Kpi label="À rappeler" value={count("a-rappeler")} />
        <Kpi label="Devis envoyés" value={count("devis-envoye") + count("relance")} />
        <Kpi label="Acceptés" value={count("accepte")} />
        <Kpi label="Volume moyen" value={`${formatNumber1(avgVolume)} m³`} className="col-span-2 md:col-span-1" />
      </dl>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label="Liste des demandes" className="min-w-0">
          {/* Filtres */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {[{ id: "tous" as const, label: "Toutes" }, ...LEAD_STATUSES].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={filter === s.id}
                  onClick={() => setFilter(s.id)}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors",
                    filter === s.id ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper",
                  )}
                >
                  {s.label}
                  {s.id !== "tous" && <span className="num ml-1.5 text-xs opacity-60">{count(s.id)}</span>}
                </button>
              ))}
            </div>
            <div className="relative lg:w-72">
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-500" strokeWidth={1.8} />
              <label htmlFor="lead-search" className="sr-only">
                Rechercher
              </label>
              <input
                id="lead-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nom, ville, référence…"
                className="h-10 w-full rounded-full bg-paper pl-10 pr-4 text-sm shadow-[var(--shadow-hairline)] outline-none focus:shadow-[0_0_0_1.5px_var(--color-marine-500)]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius-lg)] bg-paper p-12 text-center shadow-[var(--shadow-hairline)]">
              <p className="font-medium">Aucune demande pour ce filtre.</p>
              <p className="mt-1 text-sm text-stone-600">Les nouvelles demandes du simulateur apparaissent ici instantanément.</p>
            </div>
          ) : (
            <>
              {/* Tableau — desktop */}
              <div className="mt-4 hidden overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-[var(--shadow-hairline)] md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ink/8 text-xs uppercase tracking-[0.08em] text-stone-600">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-medium">Client</th>
                      <th scope="col" className="px-3 py-3.5 font-medium">Trajet</th>
                      <th scope="col" className="px-3 py-3.5 text-right font-medium">Volume</th>
                      <th scope="col" className="px-3 py-3.5 font-medium">Date souhaitée</th>
                      <th scope="col" className="px-3 py-3.5 font-medium">Statut</th>
                      <th scope="col" className="px-5 py-3.5 text-right font-medium">Reçue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/6">
                    {filtered.map((l) => (
                      <Row key={l.id} lead={l} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cartes — mobile */}
              <ul className="mt-4 space-y-3 md:hidden">
                {filtered.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin-demo/leads/${l.id}`} className="block rounded-[var(--radius-md)] bg-paper p-4 shadow-[var(--shadow-hairline)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{name(l)}</p>
                          <p className="text-sm text-stone-600">{route(l)}</p>
                        </div>
                        <StatusBadge status={l.status} />
                      </div>
                      <p className="num mt-3 flex gap-3 text-xs text-stone-600">
                        <span>{l.volume ? `${formatNumber1(l.volume)} m³` : "Rappel"}</span>
                        {l.specialItem && <span className="text-alert-600">Objet spécifique</span>}
                        <span className="ml-auto">{formatDateTime(l.createdAt)}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-4 text-xs text-stone-500">Démo : données stockées dans ce navigateur. Les leads marqués « exemple » sont fictifs.</p>
        </section>

        <aside>
          <Funnel />
        </aside>
      </div>
    </div>
  );
}

function Row({ lead: l }: { lead: Lead }) {
  const href = `/admin-demo/leads/${l.id}`;
  return (
    <tr className="group relative transition-colors hover:bg-ivory">
      <td className="px-5 py-4">
        <Link href={href} className="font-semibold text-ink after:absolute after:inset-0">
          {name(l)}
        </Link>
        <p className="num text-xs text-stone-600">
          {l.reference}
          {l.origin === "demo" && <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">exemple</span>}
        </p>
      </td>
      <td className="px-3 py-4 text-ink-2">{route(l)}</td>
      <td className="num px-3 py-4 text-right">
        {l.volume ? `${formatNumber1(l.volume)} m³` : "—"}
        {l.specialItem && <AlertCircle className="-mt-0.5 ml-1.5 inline size-3.5 text-alert-600" strokeWidth={2} aria-label="Objet spécifique" />}
      </td>
      <td className="px-3 py-4 text-ink-2">{l.quote.date.value ? formatDate(l.quote.date.value, { day: "numeric", month: "short" }) : l.quote.date.flexible ? "Flexible" : "—"}</td>
      <td className="px-3 py-4">
        <StatusBadge status={l.status} />
      </td>
      <td className="num px-5 py-4 text-right text-xs text-stone-600">
        {formatDateTime(l.createdAt)}
        <ArrowUpRight className="ml-2 inline size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </td>
    </tr>
  );
}

const name = (l: Lead) => [l.quote.contact.firstName, l.quote.contact.lastName].filter(Boolean).join(" ") || "Sans nom";
const route = (l: Lead) =>
  l.quote.from.city ? `${l.quote.from.city} → ${l.quote.to.city}${l.quote.kind === "transport" ? " · transport" : ""}` : "Demande de rappel";

function Kpi({ label, value, accent, className }: { label: string; value: number | string; accent?: boolean; className?: string }) {
  return (
    <div className={cn("bg-paper px-5 py-5", className)}>
      <dt className="text-xs text-stone-600">{label}</dt>
      <dd className={cn("font-display num mt-1 text-3xl", accent && "text-lagon-600")}>{value}</dd>
    </div>
  );
}

const subscribeFunnel = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("samyo:leads-changed", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("samyo:leads-changed", cb);
  };
};
let funnelCache: { raw: string; data: Record<string, number> } | null = null;
const funnelSnapshot = () => {
  const data = readFunnel();
  const raw = JSON.stringify(data);
  if (funnelCache?.raw === raw) return funnelCache.data;
  funnelCache = { raw, data };
  return data;
};
const emptyFunnel = {};

function Funnel() {
  const data = useSyncExternalStore(subscribeFunnel, funnelSnapshot, () => emptyFunnel as Record<string, number>);
  const max = Math.max(1, data.quote_started ?? 0);
  return (
    <div className="rounded-[var(--radius-lg)] bg-paper p-6 shadow-[var(--shadow-hairline)]">
      <p className="text-sm font-semibold">Entonnoir du simulateur</p>
      <p className="mt-1 text-xs text-stone-600">Événements analytics enregistrés sur ce navigateur</p>
      <ol className="mt-5 space-y-3">
        {QUOTE_EVENTS.map((e) => {
          const v = data[e] ?? 0;
          return (
            <li key={e}>
              <div className="flex justify-between text-xs">
                <span className="text-ink-2">{funnelLabels[e]}</span>
                <span className="num font-medium">{v}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className={cn("h-full rounded-full", e === "special_item_added" ? "bg-lagon-400" : "bg-marine-500")} style={{ width: `${Math.min(100, (v / max) * 100)}%` }} />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-xs text-stone-500">En production : GA4 / Google Ads / Meta via Tag Manager, mêmes événements.</p>
    </div>
  );
}

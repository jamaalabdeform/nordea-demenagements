"use client";

import dynamic from "next/dynamic";
import type { InitialParams } from "@/features/quote/useQuoteDraft";
import { CallbackPanel } from "@/features/quote/CallbackPanel";

/**
 * Le simulateur est rendu côté client uniquement : il relit la saisie en
 * cours (sessionStorage) dès le premier rendu, sans décalage d'hydratation.
 */
const QuoteFlow = dynamic(() => import("@/features/quote/QuoteFlow"), {
  ssr: false,
  loading: () => <FlowSkeleton />,
});

export function QuoteEntry({ params, callback }: { params: InitialParams; callback: boolean }) {
  if (callback) return <CallbackPanel />;
  return <QuoteFlow params={params} />;
}

function FlowSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement du simulateur" className="min-h-dvh">
      <div className="container-page flex h-[4.25rem] items-center justify-between">
        <div className="h-7 w-32 animate-pulse rounded-full bg-stone-200" />
        <div className="size-10 animate-pulse rounded-full bg-stone-200" />
      </div>
      <div className="h-[2px] bg-ink/6" />
      <div className="container-page grid gap-10 pt-12 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-20">
        <div className="max-w-[44rem] space-y-5">
          <div className="h-3 w-40 animate-pulse rounded-full bg-stone-200" />
          <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-stone-200" />
          <div className="h-4 w-3/5 animate-pulse rounded-full bg-stone-200" />
          <div className="grid gap-4 pt-6 sm:grid-cols-2">
            <div className="h-14 animate-pulse rounded-[var(--radius-md)] bg-stone-200" />
            <div className="h-14 animate-pulse rounded-[var(--radius-md)] bg-stone-200" />
          </div>
        </div>
        <div className="hidden h-[32rem] animate-pulse rounded-[var(--radius-lg)] bg-stone-200 lg:block" />
      </div>
    </div>
  );
}

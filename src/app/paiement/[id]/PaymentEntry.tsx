"use client";

import dynamic from "next/dynamic";

const PaymentView = dynamic(() => import("@/features/payment/PaymentView"), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" className="container-page max-w-3xl pt-28">
      <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-stone-200" />
      <div className="mt-8 h-72 animate-pulse rounded-[var(--radius-lg)] bg-stone-200" />
    </div>
  ),
});

export function PaymentEntry({ id, returnStatus }: { id: string; returnStatus?: string }) {
  return <PaymentView id={id} returnStatus={returnStatus} />;
}

import type { Metadata } from "next";
import { PaymentEntry } from "./PaymentEntry";

export const metadata: Metadata = {
  title: "Paiement de l'acompte",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ statut?: string }> }) {
  const { id } = await params;
  const { statut } = await searchParams;
  return <PaymentEntry id={id} returnStatus={statut} />;
}

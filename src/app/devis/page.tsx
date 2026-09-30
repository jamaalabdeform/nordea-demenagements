import { pageMetadata } from "@/lib/seo";
import { QuoteEntry } from "./QuoteEntry";

export const metadata = pageMetadata({
  title: "Estimer mon déménagement",
  description: "Estimez le volume de votre déménagement pièce par pièce et recevez une proposition vérifiée par un conseiller.",
  path: "/devis",
});

type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 100);

export default async function DevisPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <QuoteEntry
      callback={one(sp.rappel) === "1"}
      params={{ from: one(sp.de), to: one(sp.vers), housing: one(sp.logement), formula: one(sp.formule) }}
    />
  );
}

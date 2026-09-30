import { company } from "@/config/company";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-page max-w-3xl pb-section pt-40">
      <h1 className="font-display text-4xl">{title}</h1>
      {company.isDemo && (
        <p className="mt-6 rounded-[var(--radius-md)] bg-stone-100 p-4 text-sm text-stone-600">
          Site de démonstration : les informations entre crochets seront complétées avec les données réelles de l&apos;entreprise.
        </p>
      )}
      <div className="mt-10 space-y-4 text-[0.9375rem] leading-relaxed text-ink-2 [&_h2]:pt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink">{children}</div>
    </div>
  );
}

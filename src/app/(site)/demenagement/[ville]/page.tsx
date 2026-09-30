import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { company } from "@/config/company";
import { routes, site } from "@/config/site";
import { locationBySlug, publishedLocations } from "@/data/locations";
import { JsonLd } from "@/components/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RouteForm } from "@/features/quote/RouteForm";
import { breadcrumbJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";
import { HowItWorks } from "@/sections/HowItWorks";
import { Faq } from "@/sections/Faq";
import { FinalCta } from "@/sections/FinalCta";

/**
 * Page locale SEO — servie à l'URL /demenagement-{ville} (rewrite dans next.config.ts).
 * Seules les villes `published` avec un contenu spécifique sont générées :
 * pas de pages dupliquées à faible valeur.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLocations.map((l) => ({ ville: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const loc = locationBySlug(ville);
  if (!loc) return {};
  return pageMetadata({
    title: `Déménagement à ${loc.name}`,
    description: `Déménageur à ${loc.name} (${loc.postalCode}) : inventaire en ligne, accès et stationnement anticipés, devis vérifié par un conseiller. Départ ou arrivée à ${loc.name}.`,
    path: routes.city(loc.slug),
  });
}

export default async function CityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const loc = locationBySlug(ville);
  if (!loc?.content || !loc.published) notFound();
  const c = loc.content;

  return (
    <>
      <JsonLd data={{ ...organizationJsonLd(), "@id": `${site.url}${routes.city(loc.slug)}#business`, areaServed: { "@type": "City", name: loc.name } }} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: `Déménagement à ${loc.name}`, path: routes.city(loc.slug) }])} />

      <section className="pt-[4.5rem]">
        <div className="container-page grid gap-12 pb-20 pt-12 md:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Fil d'Ariane" className="text-xs text-stone-600">
              <ol className="flex gap-2">
                <li>
                  <Link href="/" className="hover:text-ink">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page">Déménagement à {loc.name}</li>
              </ol>
            </nav>
            <h1 className="font-display mt-8 text-5xl [font-weight:360]">
              Déménager à {loc.name}, <em className="text-forest-700">sans improviser.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-stone-600">{c.intro}</p>
            <RouteForm className="mt-10 max-w-[36rem]" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-[var(--radius-lg)] bg-paper p-8 shadow-[var(--shadow-hairline)]">
              <p className="eyebrow text-stone-600">Quartiers desservis</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.neighbourhoods.map((n) => (
                  <li key={n} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm">
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-stone-600">
                {company.name} · {company.address.street}, {company.address.postalCode} {company.address.city}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="acces-title" className="bg-paper py-section">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <h2 id="acces-title" className="font-display text-4xl lg:col-span-5">
            Les accès à {loc.name}, anticipés dès le devis.
          </h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="space-y-5">
              {c.access.map((a) => (
                <li key={a} className="flex gap-4 text-[1.0625rem]">
                  <Check className="mt-1 size-5 shrink-0 text-forest-500" strokeWidth={1.8} aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-stone-600">{c.note}</p>
            <ButtonLink href={routes.quote + `?de=${encodeURIComponent(loc.name)}`} className="mt-10" arrow>
              {site.cta.primary}
            </ButtonLink>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Faq />
      <FinalCta />
    </>
  );
}

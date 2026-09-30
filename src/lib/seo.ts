import type { Metadata } from "next";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { locations } from "@/data/locations";
import { faq } from "@/data/faq";

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export function pageMetadata({ title, description, path, noindex }: { title?: string; description?: string; path: string; noindex?: boolean }): Metadata {
  const desc = description ?? site.seo.description;
  return {
    title: title ?? { absolute: site.seo.defaultTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: absoluteUrl(path),
      siteName: company.name,
      title: title ?? site.seo.defaultTitle,
      description: desc,
    },
    twitter: { card: "summary_large_image", title: title ?? site.seo.defaultTitle, description: desc },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

/**
 * schema.org — MovingCompany (sous-type de HomeAndConstructionBusiness).
 * Volontairement sans AggregateRating ni Review : aucun avis réel à ce stade.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${site.url}/#organization`,
    name: company.name,
    url: site.url,
    telephone: company.phone.e164,
    email: company.email,
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: company.address.geo.lat, longitude: company.address.geo.lng },
    openingHoursSpecification: company.hours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      ...locations.map((l) => ({ "@type": "City", name: l.name })),
      { "@type": "Country", name: "France" },
    ],
    sameAs: Object.values(company.social).filter(Boolean),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

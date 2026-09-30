import type { MetadataRoute } from "next";
import { site, routes } from "@/config/site";
import { publishedLocations } from "@/data/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}${routes.quote}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...publishedLocations.map((l) => ({ url: `${site.url}${routes.city(l.slug)}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

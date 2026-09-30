import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locations } from "@/data/locations";
import { routes } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Zones() {
  return (
    <section id="zones" aria-labelledby="zones-title" className="py-section">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            id="zones-title"
            index="09"
            eyebrow="Zones d'intervention"
            title="Basés à Lille. Partout en France."
            lead="Nous connaissons les rues de la métropole et du bassin minier. Pour les trajets plus longs, le même interlocuteur suit votre dossier jusqu'à la livraison."
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-ink/10 text-[0.9375rem]">
              {locations.map((l) => (
                <li key={l.slug} className="border-b border-ink/10">
                  {l.published ? (
                    <Link href={routes.city(l.slug)} className="group flex items-center justify-between py-3.5 font-medium text-ink">
                      {l.name}
                      <ArrowUpRight className="size-4 text-stone-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-700" strokeWidth={1.6} aria-hidden />
                    </Link>
                  ) : (
                    <span className="flex py-3.5 text-ink-2">{l.name}</span>
                  )}
                </li>
              ))}
              <li className="col-span-2 py-3.5 text-stone-600">Et vers toute la France, sur devis.</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <RegionMap />
        </Reveal>
      </div>
    </section>
  );
}

/** Carte stylisée : positions relatives, pas de fond cartographique lourd */
function RegionMap() {
  const lille = locations.find((l) => l.slug === "lille")!;
  return (
    <figure className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] bg-forest-900">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" role="img" aria-label="Carte des villes desservies autour de Lille">
        <defs>
          <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.35" fill="rgba(251,249,244,.13)" />
          </pattern>
          <radialGradient id="glow">
            <stop offset="0" stopColor="rgba(207,122,85,.35)" />
            <stop offset="1" stopColor="rgba(207,122,85,0)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#dots)" />
        {/* frontière belge, tracé simplifié */}
        <path d="M0 22 C 18 18, 30 26, 44 16 S 70 8, 78 14 S 92 30, 100 40" fill="none" stroke="rgba(251,249,244,.18)" strokeWidth="0.4" strokeDasharray="1.2 1.2" />
        <text x="84" y="22" fill="rgba(251,249,244,.35)" fontSize="2.6" letterSpacing="0.3">BELGIQUE</text>
        <circle cx={lille.map.x} cy={lille.map.y} r="30" fill="url(#glow)" />
        {locations.map((l) =>
          l.slug === "lille" ? null : (
            <line key={l.slug} x1={lille.map.x} y1={lille.map.y} x2={l.map.x} y2={l.map.y} stroke="rgba(251,249,244,.14)" strokeWidth="0.3" />
          ),
        )}
        {locations.map((l) => {
          const main = l.slug === "lille";
          return (
            <g key={l.slug}>
              <circle cx={l.map.x} cy={l.map.y} r={main ? 1.6 : 0.9} fill={main ? "#cf7a55" : "rgba(251,249,244,.85)"} />
              {main && <circle cx={l.map.x} cy={l.map.y} r="3.4" fill="none" stroke="#cf7a55" strokeWidth="0.3" opacity=".6" />}
              <text
                x={l.map.x > 70 ? l.map.x - 2 : l.map.x + (main ? 3.2 : 2)}
                y={l.map.y + 1}
                textAnchor={l.map.x > 70 ? "end" : "start"}
                fill={main ? "#fbf9f4" : "rgba(251,249,244,.7)"}
                fontSize={main ? 3.4 : 2.6}
                fontWeight={main ? 600 : 400}
              >
                {l.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="absolute bottom-5 left-6 text-xs text-paper/50">Nord · Pas-de-Calais — schéma indicatif</figcaption>
    </figure>
  );
}

import Link from "next/link";
import { company, mailHref, telHref } from "@/config/company";
import { routes, site } from "@/config/site";
import { locations } from "@/data/locations";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-marine-900 text-paper">
      <div className="container-page grid gap-14 pb-10 pt-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-xs text-sm text-paper/65">{company.baseline}</p>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-paper/50">Contact</h2>
          <address className="mt-5 space-y-2 text-sm not-italic text-paper/85">
            <p>
              {company.address.street}
              <br />
              {company.address.postalCode} {company.address.city}
            </p>
            <p className="pt-2">
              <a href={telHref} className="num underline-offset-4 hover:underline">
                {company.phone.display}
              </a>
              <br />
              <a href={mailHref} className="underline-offset-4 hover:underline">
                {company.email}
              </a>
            </p>
            <p className="pt-2 text-paper/60">{company.hours.display}</p>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-paper/50">Zones</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-paper/85">
            {locations.map((l) => (
              <li key={l.slug}>
                {l.published ? (
                  <Link href={routes.city(l.slug)} className="underline-offset-4 hover:underline">
                    {l.name}
                  </Link>
                ) : (
                  l.name
                )}
              </li>
            ))}
            <li className="col-span-2 text-paper/60">et toute la France</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-paper/50">Demande</h2>
          <ul className="mt-5 space-y-2 text-sm text-paper/85">
            <li>
              <Link href={routes.quote} className="underline-offset-4 hover:underline">
                {site.cta.primary}
              </Link>
            </li>
            <li>
              <Link href={`${routes.quote}?rappel=1`} className="underline-offset-4 hover:underline">
                {site.cta.secondary}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page">
      <div className="flex flex-col gap-4 border-t border-paper/10 py-7 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {company.name}
          {site.flags.demoNotice && <span> · Maquette — coordonnées provisoires</span>}
        </p>
        <ul className="flex gap-6">
          <li>
            <Link href={routes.legal} className="hover:text-paper">
              Mentions légales
            </Link>
          </li>
          <li>
            <Link href={routes.privacy} className="hover:text-paper">
              Confidentialité
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </footer>
  );
}

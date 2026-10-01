import { Briefcase, Gem, Home, Music, Route, Truck, Warehouse, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/site";
import { services, type Service } from "@/data/services";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: Record<Service["icon"], LucideIcon> = {
  home: Home,
  briefcase: Briefcase,
  route: Route,
  warehouse: Warehouse,
  gem: Gem,
  piano: Music,
  truck: Truck,
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper py-section">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="services-title"
              index="04"
              eyebrow="Services"
              title="Du studio au plateau de bureaux."
              lead="Chaque demande est différente. Nous adaptons l'équipe, le véhicule et le matériel à ce que vous déménagez."
            />
            <Link
              href={`${routes.quote}?besoin=transport`}
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-marine-700 underline decoration-marine-700/25 underline-offset-[6px] transition-colors hover:decoration-marine-700"
            >
              Quelques meubles à transporter ? Demander un transport
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden />
            </Link>
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-ink/8 shadow-[var(--shadow-hairline)] sm:grid-cols-2 lg:col-span-8">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal as="li" key={s.id} delay={(i % 2) * 0.06} className="group bg-paper p-8 transition-colors duration-500 hover:bg-ivory lg:p-10">
                <Icon className="size-6 text-marine-500 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-10 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-stone-600">{s.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

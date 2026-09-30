import { Briefcase, Gem, Home, Music, Route, Warehouse, type LucideIcon } from "lucide-react";
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
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-ink/8 shadow-[var(--shadow-hairline)] sm:grid-cols-2 lg:col-span-8">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal as="li" key={s.id} delay={(i % 2) * 0.06} className="group bg-paper p-8 transition-colors duration-500 hover:bg-ivory lg:p-10">
                <Icon className="size-6 text-forest-500 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5" strokeWidth={1.4} aria-hidden />
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

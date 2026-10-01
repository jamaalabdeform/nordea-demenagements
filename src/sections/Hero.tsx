import { Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import { site } from "@/config/site";
import { MediaSlot } from "@/components/MediaSlot";
import { HeroVan } from "@/components/HeroVan";
import { media } from "@/config/media";
import { Reveal } from "@/components/ui/Reveal";
import { RouteForm } from "@/features/quote/RouteForm";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pt-[4.5rem]">
      <div className="container-page grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:min-h-[min(56rem,calc(100svh-4.5rem))] lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-8">
        <div className="lg:col-span-6 lg:pr-6">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-stone-600">
              <span aria-hidden className="size-1.5 rounded-full bg-lagon-600" />
              Déménagement & transport · Lille et toute la France
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 id="hero-title" className="font-display mt-7 text-[clamp(2.75rem,1.6rem+2.9vw,4.25rem)] leading-[0.98] text-ink [font-weight:360]">
              Un déménagement sans mauvaises <em className="text-marine-700 [font-weight:340]">surprises.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[30rem] text-lg text-stone-600 md:text-xl">
              Estimez votre volume en quelques minutes. Nous nous occupons du reste.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10 max-w-[36rem]">
            <RouteForm />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 pl-2 text-sm text-stone-600">
              <a href={telHref} className="group inline-flex items-center gap-2 font-medium text-ink underline-offset-4 hover:underline">
                <Phone className="size-4 text-marine-500" strokeWidth={1.6} aria-hidden />
                {site.cta.advisor}
              </a>
              <span aria-hidden className="hidden h-3 w-px bg-ink/15 sm:block" />
              <span>{company.hours.short}</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6">
          <figure className="relative mx-auto w-full max-w-[34rem] lg:ml-auto lg:mr-0">
            <MediaSlot
              id="hero"
              priority
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="aspect-[5/4] rounded-[var(--radius-lg)] shadow-[var(--shadow-float)] sm:aspect-[4/5] sm:[border-radius:999px_999px_var(--radius-lg)_var(--radius-lg)]"
            />
            <HeroVan className="absolute -bottom-[16%] left-[8%] z-10 w-[92%] sm:-bottom-[14%] sm:-left-[8%] sm:w-[94%] lg:-left-[16%] lg:w-[96%]" />
            {!media.van.poster && (
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-1 text-xs text-stone-600">
                <span>Protection du mobilier avant chargement</span>
                <span className="num hidden sm:inline">50°37′ N — 3°03′ E</span>
              </figcaption>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

import { Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import { routes, site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { MediaSlot } from "@/components/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section id="cta-final" aria-labelledby="cta-title" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-marine-900">
        <MediaSlot id="arrival" sizes="100vw" className="absolute inset-0 opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-marine-900 via-marine-900/80 to-marine-900/40" />
        <div className="container-page relative z-[2] py-28 text-center md:py-40">
          <Reveal>
            <h2 id="cta-title" className="font-display mx-auto max-w-3xl text-5xl text-paper [font-weight:340]">
              Votre nouveau départ commence ici.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-md text-lg text-paper/70">Quelques minutes pour décrire votre projet. Un conseiller s&apos;occupe du reste.</p>
          </Reveal>
          <Reveal delay={0.14} className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={routes.quote} variant="inverse" size="lg" arrow>
              {site.cta.primary}
            </ButtonLink>
            <a href={telHref} className="inline-flex h-14 items-center gap-2 rounded-full px-7 text-paper shadow-[inset_0_0_0_1px_rgb(251_249_244/0.28)] transition-shadow hover:shadow-[inset_0_0_0_1px_rgb(251_249_244/0.6)]">
              <Phone className="size-4" strokeWidth={1.6} aria-hidden />
              <span className="num">{company.phone.display}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

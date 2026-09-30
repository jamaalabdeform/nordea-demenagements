import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";
import { Hero } from "@/sections/Hero";
import { Reassurance } from "@/sections/Reassurance";
import { HowItWorks } from "@/sections/HowItWorks";
import { SimulatorTeaser } from "@/sections/SimulatorTeaser";
import { Formulas } from "@/sections/Formulas";
import { Services } from "@/sections/Services";
import { Trust } from "@/sections/Trust";
import { Transparency } from "@/sections/Transparency";
import { Gallery } from "@/sections/Gallery";
import { Testimonials } from "@/sections/Testimonials";
import { Zones } from "@/sections/Zones";
import { Faq } from "@/sections/Faq";
import { FinalCta } from "@/sections/FinalCta";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <Hero />
      <Reassurance />
      <HowItWorks />
      <SimulatorTeaser />
      <Formulas />
      <Services />
      <Trust />
      <Transparency />
      <Gallery />
      <Testimonials />
      <Zones />
      <Faq />
      <FinalCta />
    </>
  );
}

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { routes, site } from "@/config/site";

export default function NotFound() {
  return (
    <main id="contenu" className="container-page flex min-h-dvh max-w-xl flex-col items-center justify-center text-center">
      <Link href="/">
        <Logo />
      </Link>
      <p className="eyebrow mt-14 text-lagon-600">Page introuvable</p>
      <h1 className="font-display mt-4 text-4xl">Cette page a déménagé… ou n&apos;a jamais existé.</h1>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="secondary">
          Retour à l&apos;accueil
        </ButtonLink>
        <ButtonLink href={routes.quote} arrow>
          {site.cta.primary}
        </ButtonLink>
      </div>
    </main>
  );
}

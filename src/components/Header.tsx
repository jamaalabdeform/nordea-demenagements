"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import { routes, site } from "@/config/site";
import { duration, ease } from "@/config/motion";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { ButtonLink } from "./ui/Button";
import { Logo } from "./Logo";

const nav = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#formules", label: "Formules" },
  { href: "/#services", label: "Services" },
  { href: "/#zones", label: "Zones" },
  { href: "/#questions", label: "Questions" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
        scrolled || open ? "bg-ivory/85 shadow-[0_1px_0_rgb(20_26_34/0.07)] backdrop-blur-xl backdrop-saturate-150" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name} — accueil`} className="rounded-md" onClick={() => setOpen(false)}>
          <Logo className="h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3.5 py-2 text-sm text-ink-2 transition-colors hover:bg-stone-100 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            onClick={() => track("phone_click", { location: "header" })}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink md:inline-flex"
          >
            <Phone className="size-4 text-marine-500" strokeWidth={1.6} aria-hidden />
            <span className="num">{company.phone.display}</span>
          </a>
          <span className="hidden sm:block">
            <ButtonLink href={routes.quote} size="sm" onClick={() => track("cta_click", { location: "header" })}>
              {site.cta.primary}
            </ButtonLink>
          </span>
          <button
            type="button"
            className="relative -mr-2 grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className={cn("absolute h-[1.5px] w-5 bg-ink transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span aria-hidden className={cn("absolute h-[1.5px] w-5 bg-ink transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="overflow-hidden bg-ivory lg:hidden"
          >
            <nav aria-label="Navigation mobile" className="container-page flex h-full flex-col pb-8 pt-4">
              <ul className="divide-y divide-ink/8">
                {nav.map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i + 0.08, duration: duration.base, ease: ease.out }}>
                    <Link href={item.href} onClick={() => setOpen(false)} className="font-display block py-4 text-3xl">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3">
                <ButtonLink href={routes.quote} size="lg" arrow onClick={() => setOpen(false)}>
                  {site.cta.primary}
                </ButtonLink>
                <a href={telHref} className="flex h-14 items-center justify-center gap-2 rounded-full text-base shadow-[var(--shadow-hairline)]">
                  <Phone className="size-4 text-marine-500" strokeWidth={1.6} aria-hidden />
                  <span className="num">{company.phone.display}</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { telHref } from "@/config/company";
import { routes, site } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { Arrow } from "./ui/Button";

/**
 * Barre d'action persistante sur mobile. Apparaît une fois le hero dépassé,
 * se retire à l'approche du CTA final pour ne pas doubler le message.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const final = document.getElementById("cta-final");
    let heroOut = false;
    let finalIn = false;
    const update = () => setVisible(heroOut && !finalIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === final) finalIn = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (final) io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,opacity] duration-500 ease-[var(--ease-out)] md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="flex gap-2 rounded-full bg-marine-900/95 p-1.5 shadow-[var(--shadow-float)] backdrop-blur">
        <a
          href={telHref}
          tabIndex={visible ? 0 : -1}
          onClick={() => track("phone_click", { location: "mobile_bar" })}
          className="grid size-12 shrink-0 place-items-center rounded-full text-paper shadow-[inset_0_0_0_1px_rgb(251_249_244/0.2)]"
          aria-label="Appeler un conseiller"
        >
          <Phone className="size-[18px]" strokeWidth={1.6} />
        </a>
        <Link
          href={routes.quote}
          tabIndex={visible ? 0 : -1}
          onClick={() => track("cta_click", { location: "mobile_bar" })}
          className="group/btn flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-paper text-[0.9375rem] font-medium text-marine-900 active:scale-[0.98]"
        >
          {site.cta.mobile}
          <Arrow />
        </Link>
      </div>
    </div>
  );
}

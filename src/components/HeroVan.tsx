"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { media } from "@/config/media";
import { cn } from "@/lib/format";

/**
 * Fourgon SAMYO détouré (logo déjà appliqué en perspective par
 * scripts/build-van.py), posé en avant du visuel du hero.
 * N'affiche rien tant que `media.van.poster` n'est pas renseigné
 * (fichier attendu : /public/media/samyo-van.webp, fond transparent).
 * Entrée douce depuis la droite, désactivée si l'utilisateur réduit les animations.
 */
export function HeroVan({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const photo = media.van.poster as string | null;
  if (!photo) return null;

  return (
    <motion.div
      className={cn("pointer-events-none select-none", className)}
      initial={reduce ? false : { x: 48, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        {/* ombre au sol */}
        {/* ombre au sol, dans l'axe des roues (vue de trois quarts) */}
        <svg viewBox="0 0 1133 655" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <filter id="van-ground" x="-30%" y="-200%" width="160%" height="500%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <ellipse cx="640" cy="585" rx="470" ry="46" transform="rotate(-13 640 585)" fill="#0b2545" opacity="0.26" filter="url(#van-ground)" />
          <ellipse cx="640" cy="580" rx="400" ry="18" transform="rotate(-13 640 580)" fill="#0b2545" opacity="0.22" filter="url(#van-ground)" />
        </svg>
        <Image src={photo} alt={media.van.alt} width={1133} height={655} priority sizes="(min-width: 1024px) 32rem, 80vw" className="relative h-auto w-full" />
      </div>
    </motion.div>
  );
}

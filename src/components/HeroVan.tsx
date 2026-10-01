"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { media } from "@/config/media";
import { cn } from "@/lib/format";
import { DESCRIPTOR_PATH, WORDMARK_PATH } from "./logo-paths";

/**
 * Photo détourée du fourgon SAMYO, posée en avant du visuel du hero.
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
        <VanLivery />
      </div>
    </motion.div>
  );
}

/**
 * Marquage SAMYO appliqué sur le flanc. Le fourgon est vu de trois quarts :
 * la matrice incline légèrement le logo pour suivre la fuite de la caisse.
 * Coordonnées calées sur l'image de 1133 × 655 px.
 */
function VanLivery() {
  const marine = "#17467f";
  return (
    <svg viewBox="0 0 1133 655" className="absolute inset-0 size-full mix-blend-multiply" aria-hidden>
      <g transform="matrix(1.45 -0.075 0 1.45 664 300)">
        <path d="M13.4 29.5H24a4.75 4.75 0 0 0 0-9.5h-8a4.75 4.75 0 0 1 0-9.5h10.4" fill="none" stroke={marine} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.6" cy="29.5" r="2.35" fill="none" stroke={marine} strokeWidth="2" />
        <circle cx="30.6" cy="10.5" r="3.1" fill="#45c0b5" />
        <path d={WORDMARK_PATH} fill={marine} />
        <path d={DESCRIPTOR_PATH} fill={marine} fillOpacity="0.8" />
      </g>
    </svg>
  );
}

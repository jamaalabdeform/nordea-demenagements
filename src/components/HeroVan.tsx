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
        <div aria-hidden className="absolute inset-x-[4%] -bottom-[3%] h-[9%] rounded-[50%] bg-marine-900/30 blur-[10px]" />
        <Image src={photo} alt={media.van.alt} width={1092} height={466} priority sizes="(min-width: 1024px) 32rem, 80vw" className="relative h-auto w-full" />
        <VanLivery />
      </div>
    </motion.div>
  );
}

/**
 * Marquage SAMYO appliqué sur le flanc (vue de profil, donc sans
 * perspective) : vectoriel et en « multiply » pour épouser les reflets de
 * la tôle. Coordonnées calées sur l'image de 1092 × 466 px.
 */
function VanLivery() {
  const marine = "#17467f";
  return (
    <svg viewBox="0 0 1092 466" className="absolute inset-0 size-full mix-blend-multiply" aria-hidden>
      <g transform="translate(722 84) scale(1.5)">
        <path d="M13.4 29.5H24a4.75 4.75 0 0 0 0-9.5h-8a4.75 4.75 0 0 1 0-9.5h10.4" fill="none" stroke={marine} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.6" cy="29.5" r="2.35" fill="none" stroke={marine} strokeWidth="2" />
        <circle cx="30.6" cy="10.5" r="3.1" fill="#45c0b5" />
        <path d={WORDMARK_PATH} fill={marine} />
        <path d={DESCRIPTOR_PATH} fill={marine} fillOpacity="0.8" />
      </g>
      <text x="801" y="178" fill={marine} fillOpacity="0.75" fontSize="15" letterSpacing="0.8" style={{ fontFamily: "var(--font-instrument), sans-serif" }}>
        samyo-demenagement.fr
      </text>
      <circle cx="470" cy="252" r="6" fill="none" stroke="#45c0b5" strokeWidth="3.4" />
      <path d="M478 252 H1004" stroke="#45c0b5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="1014" cy="252" r="7.5" fill="#45c0b5" />
    </svg>
  );
}

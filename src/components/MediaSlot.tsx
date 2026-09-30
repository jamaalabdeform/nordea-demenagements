"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { media, type FallbackScene, type MediaId } from "@/config/media";
import { site } from "@/config/site";
import { cn } from "@/lib/format";

/**
 * Emplacement média universel.
 * - vidéo : chargée seulement à l'approche du viewport, en pause hors écran,
 *   version mobile dédiée, jamais lue si « réduire les animations » est actif
 * - image : next/image (AVIF/WebP, tailles responsives)
 * - rien : composition graphique de repli (voir <Scene>)
 */
export function MediaSlot({
  id,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  children,
}: {
  id: MediaId;
  className?: string;
  priority?: boolean;
  sizes?: string;
  children?: React.ReactNode;
}) {
  const asset = media[id];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(priority);
  const video = asset.video as { webm?: string; mp4?: string; mobileMp4?: string } | null;
  const hasVideo = !!video && !reduce;

  useEffect(() => {
    if (!hasVideo || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  const poster = asset.poster as string | null;

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-stone-200", className)} data-asset={asset.brief}>
      {poster ? (
        <Image src={poster} alt={asset.alt} fill priority={priority} sizes={sizes} className="object-cover" />
      ) : (
        <Scene kind={asset.fallback} label={asset.alt} />
      )}

      {hasVideo && near && (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          aria-hidden
        >
          {video?.mobileMp4 && <source src={video.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
          {video?.webm && <source src={video.webm} type="video/webm" />}
          {video?.mp4 && <source src={video.mp4} type="video/mp4" />}
        </video>
      )}

      {children}

      {site.flags.showAssetSlotLabels && !poster && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-medium text-paper">{asset.brief}</span>
      )}
    </div>
  );
}

/**
 * Compositions de repli : lumière, matière, architecture — jamais d'icône ni
 * de clipart. Elles évoquent le sujet sans prétendre être une photo.
 */
function Scene({ kind, label }: { kind: FallbackScene; label: string }) {
  const common = "absolute inset-0 grain";
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true };

  switch (kind) {
    case "window-light":
      return (
        <div className={common} {...a11y} style={{ background: "linear-gradient(168deg,#efe6d6 0%,#e3d5bf 55%,#cdbb9f 100%)" }}>
          {/* ombre portée d'une fenêtre à petits bois */}
          <div
            className="absolute -right-[12%] top-[8%] h-[78%] w-[70%] origin-top-right -skew-x-[18deg] opacity-80 blur-[6px]"
            style={{
              background:
                "linear-gradient(90deg,transparent 0 47%,rgba(120,96,64,.18) 47% 53%,transparent 53%),linear-gradient(0deg,transparent 0 48%,rgba(120,96,64,.18) 48% 54%,transparent 54%),linear-gradient(180deg,rgba(255,250,238,.95),rgba(255,246,228,.55))",
            }}
          />
          {/* sol */}
          <div className="absolute inset-x-0 bottom-0 h-[26%]" style={{ background: "linear-gradient(180deg,#b9a384 0%,#a58d6c 100%)" }} />
          <div className="absolute inset-x-0 bottom-[26%] h-px bg-[#8f7a5c]/40" />
          {/* lumière rasante sur le sol */}
          <div className="absolute bottom-[4%] right-[6%] h-[16%] w-[58%] -skew-x-[30deg] bg-[#f6ecd9]/55 blur-md" />
          {/* volumes : cartons empilés, silhouettes douces */}
          <div className="absolute bottom-[20%] left-[12%] h-[17%] w-[20%] rounded-[3px] bg-[#b98f62] shadow-[inset_0_-10px_20px_rgba(0,0,0,.08)]" />
          <div className="absolute bottom-[37%] left-[14%] h-[12%] w-[15%] rounded-[3px] bg-[#c9a276] shadow-[inset_0_-8px_16px_rgba(0,0,0,.06)]" />
          <div className="absolute bottom-[20%] left-[33%] h-[11%] w-[13%] rounded-[3px] bg-[#a98056]" />
          <div className="absolute bottom-[25%] left-[20%] h-[1.5%] w-[4%] bg-[#e8d9bf]/70" />
        </div>
      );
    case "morning":
      return (
        <div className={common} {...a11y} style={{ background: "radial-gradient(120% 90% at 85% 10%,#fbf3e2 0%,#ecdfc8 38%,#d7c6ab 100%)" }}>
          <div className="absolute right-[10%] top-0 h-[70%] w-[34%] bg-gradient-to-b from-white/70 to-white/0 blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-[#c6b192] to-[#b39c7b]" />
          <div className="absolute bottom-[3%] right-[4%] h-[14%] w-[44%] -skew-x-[34deg] bg-[#fbf1dd]/60 blur-lg" />
        </div>
      );
    case "street":
      return (
        <div className={common} {...a11y} style={{ background: "linear-gradient(180deg,#d9d3c8 0%,#c9c1b3 34%,#7b4a37 34.2%,#6c3f2f 100%)" }}>
          {/* façades en brique : rangées suggérées, pas dessinées */}
          <div
            className="absolute inset-x-0 bottom-[18%] top-[34%] opacity-30"
            style={{ background: "repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 1px,transparent 1px 9px)" }}
          />
          {[8, 30, 52, 74].map((l) => (
            <div key={l} className="absolute top-[44%] h-[22%] w-[10%] rounded-t-[40%] bg-[#2d2723]/70" style={{ left: `${l}%` }} />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#4a4541]" />
          {/* volume du camion en ombre */}
          <div className="absolute bottom-[10%] left-[18%] h-[34%] w-[56%] rounded-[6px] bg-[#f1ece2] shadow-[0_18px_30px_-12px_rgba(0,0,0,.5)]" />
          <div className="absolute bottom-[10%] left-[70%] h-[24%] w-[14%] rounded-[6px_14px_6px_6px] bg-[#e6e0d4]" />
          <div className="absolute bottom-[6%] left-[24%] size-[7%] rounded-full bg-[#1e1c1b]" />
          <div className="absolute bottom-[6%] left-[62%] size-[7%] rounded-full bg-[#1e1c1b]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
        </div>
      );
    case "quilt":
      return (
        <div
          className={common}
          {...a11y}
          style={{
            background:
              "radial-gradient(90% 70% at 30% 20%,rgba(255,255,255,.22),transparent 60%),repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 2px,transparent 2px 38px),repeating-linear-gradient(-45deg,rgba(0,0,0,.12) 0 2px,transparent 2px 38px),linear-gradient(160deg,#4f6272 0%,#3a4b58 60%,#2c3943 100%)",
          }}
        >
          {/* sangle */}
          <div className="absolute inset-y-0 left-[58%] w-[7%] bg-gradient-to-r from-[#1b1f22] via-[#2a2f33] to-[#1b1f22] opacity-90" />
          <div className="absolute left-[56.5%] top-[46%] h-[9%] w-[10%] rounded-[3px] bg-[#9aa3a8] shadow-[0_4px_10px_rgba(0,0,0,.35)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
        </div>
      );
    case "hands":
      return (
        <div className={common} {...a11y} style={{ background: "linear-gradient(150deg,#d4b48c 0%,#c39c70 50%,#a98159 100%)" }}>
          {/* rabats de carton et ruban */}
          <div className="absolute inset-x-[-10%] top-[46%] h-[9%] -rotate-[4deg] bg-[#e9dcc3]/80 shadow-[0_1px_0_rgba(255,255,255,.4)]" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#7d5c3c]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(255,244,222,.5),transparent)]" />
        </div>
      );
  }
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore } from "react";
import { animate, useMotionValue, useReducedMotion, useTransform, motion } from "motion/react";
import type { Vehicle } from "@/data/furnitureCatalog";
import { cn, formatNumber1 } from "@/lib/format";
import { filledCells, fillRatio } from "./cargo";
import { IsoCargo } from "./IsoCargo";

const CargoScene = dynamic(() => import("./CargoScene"), { ssr: false });

/**
 * Choix du rendu :
 * - WebGL si écran large + pointeur fin + WebGL disponible + pas de réduction des animations
 * - sinon, vue isométrique SVG (même logique de remplissage)
 */
function subscribeMq(cb: () => void) {
  const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function canUse3d() {
  if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
let webglCache: boolean | null = null;
function use3d() {
  const reduce = useReducedMotion();
  const wide = useSyncExternalStore(
    subscribeMq,
    () => (webglCache ??= canUse3d()) && window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches,
    () => false,
  );
  return wide && !reduce;
}

export function VolumeVisual({
  volume,
  vehicle,
  tone = "light",
  prefer3d = true,
  className,
}: {
  volume: number;
  vehicle: Vehicle;
  tone?: "light" | "dark";
  prefer3d?: boolean;
  className?: string;
}) {
  const webgl = use3d() && prefer3d;
  const filled = filledCells(volume, vehicle);
  return (
    <div className={cn("relative", className)}>
      {webgl ? (
        <div className="absolute inset-0">
          <CargoScene filled={filled} />
        </div>
      ) : (
        <IsoCargo filled={filled} tone={tone} className="absolute inset-0 m-auto size-full" />
      )}
    </div>
  );
}

/** Compteur animé : la valeur « roule » vers sa cible, chiffres tabulaires */
export function VolumeCounter({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatNumber1(v));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { type: "spring", stiffness: 90, damping: 22 });
    return () => controls.stop();
  }, [value, mv, reduce]);

  return (
    <span className={cn("num inline-flex items-baseline", className)}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{formatNumber1(value)}</span>
      <span className="ml-[0.18em] text-[0.5em] tracking-normal">m³</span>
    </span>
  );
}

export function FillGauge({ volume, vehicle, tone = "light" }: { volume: number; vehicle: Vehicle; tone?: "light" | "dark" }) {
  const ratio = fillRatio(volume, vehicle);
  return (
    <div>
      <div className={cn("h-1 overflow-hidden rounded-full", tone === "dark" ? "bg-paper/15" : "bg-ink/8")}>
        <div
          className="h-full rounded-full bg-lagon-600 transition-[width] duration-700 ease-[var(--ease-out)]"
          style={{ width: `${Math.max(ratio * 100, volume > 0 ? 2 : 0)}%` }}
        />
      </div>
      <p className={cn("mt-2 flex justify-between text-xs", tone === "dark" ? "text-paper/60" : "text-stone-600")}>
        <span>{vehicle.label} · indicatif</span>
        <span className="num">{Math.round(ratio * 100)} %</span>
      </p>
    </div>
  );
}

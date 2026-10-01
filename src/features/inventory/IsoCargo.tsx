"use client";

import { useMemo } from "react";
import { cells, GRID } from "./cargo";

/**
 * Vue isométrique SVG du remplissage — légère, nette, sans WebGL.
 * Utilisée sur mobile, en « réduire les animations », et en attendant le
 * chargement de la scène 3D.
 */
const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;

function project(x: number, y: number, z: number, s: number) {
  return [(x - z) * C30 * s, (x + z) * S30 * s - y * s] as const;
}

const pts = (arr: ReadonlyArray<readonly [number, number]>) => arr.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(" ");

export function IsoCargo({ filled, tone = "light", className }: { filled: number; tone?: "light" | "dark"; className?: string }) {
  // dimensions de cellule (proportions d'une caisse de porteur)
  const sx = 1;
  const sy = 0.62;
  const sz = 0.62;
  const s = 22;

  const drawOrder = useMemo(() => [...cells].sort((a, b) => a.x + a.z - (b.x + b.z) || a.y - b.y || a.x - b.x), []);

  const P = (x: number, y: number, z: number) => project(x * sx, y * sy, z * sz, s);

  const X = GRID.x, Y = GRID.y, Z = GRID.z;
  const floor = [P(0, 0, 0), P(X, 0, 0), P(X, 0, Z), P(0, 0, Z)];
  const backWall = [P(0, 0, 0), P(X, 0, 0), P(X, Y, 0), P(0, Y, 0)];
  const cabWall = [P(0, 0, 0), P(0, 0, Z), P(0, Y, Z), P(0, Y, 0)];

  const all = [floor, backWall, cabWall].flat();
  const minX = Math.min(...all.map((p) => p[0]), P(X, Y, Z)[0], P(0, Y, Z)[0]) - 8;
  const maxX = Math.max(...all.map((p) => p[0]), P(X, 0, Z)[0]) + 8;
  const minY = Math.min(...all.map((p) => p[1]), P(X, Y, Z)[1]) - 8;
  const maxY = Math.max(...all.map((p) => p[1]), P(X, 0, Z)[1]) + 8;

  const dark = tone === "dark";
  const line = dark ? "rgba(251,249,244,.35)" : "rgba(23,70,127,.45)";
  const faint = dark ? "rgba(251,249,244,.06)" : "rgba(23,70,127,.05)";

  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className={className} aria-hidden>
      {/* parois du fond */}
      <polygon points={pts(floor)} fill={faint} stroke={line} strokeWidth={0.6} />
      <polygon points={pts(backWall)} fill={faint} stroke={line} strokeWidth={0.6} />
      <polygon points={pts(cabWall)} fill={dark ? "rgba(251,249,244,.1)" : "rgba(23,70,127,.09)"} stroke={line} strokeWidth={0.6} />

      {drawOrder.map((c) => {
        const on = c.order < filled;
        const x0 = c.x, y0 = c.y, z0 = c.z;
        const g = 0.06; // interstice entre caisses
        const a = [x0 + g, y0 + g, z0 + g] as const;
        const b = [x0 + 1 - g, y0 + 1 - g, z0 + 1 - g] as const;
        const top = [P(a[0], b[1], a[2]), P(b[0], b[1], a[2]), P(b[0], b[1], b[2]), P(a[0], b[1], b[2])];
        const right = [P(b[0], a[1], a[2]), P(b[0], b[1], a[2]), P(b[0], b[1], b[2]), P(b[0], a[1], b[2])];
        const left = [P(a[0], a[1], b[2]), P(b[0], a[1], b[2]), P(b[0], b[1], b[2]), P(a[0], b[1], b[2])];
        const l = 0.94 + c.tint * 0.08;
        return (
          <g
            key={c.order}
            style={{
              opacity: on ? 1 : 0,
              transform: on ? "translateY(0)" : "translateY(-6px)",
              transition: `opacity 380ms var(--ease-out) ${on ? (c.order % 16) * 12 : 0}ms, transform 480ms var(--ease-out) ${on ? (c.order % 16) * 12 : 0}ms`,
            }}
          >
            <polygon points={pts(top)} fill={shade("#dcbc92", l)} />
            <polygon points={pts(left)} fill={shade("#bf9366", l)} />
            <polygon points={pts(right)} fill={shade("#a57a50", l)} />
          </g>
        );
      })}

      {/* arêtes avant de la caisse, par-dessus le chargement */}
      <polyline points={pts([P(X, 0, 0), P(X, 0, Z), P(0, 0, Z)])} fill="none" stroke={line} strokeWidth={0.8} />
      <polyline points={pts([P(X, Y, 0), P(X, Y, Z), P(0, Y, Z)])} fill="none" stroke={line} strokeWidth={0.8} strokeDasharray="2 2.5" />
      <line x1={P(X, 0, Z)[0]} y1={P(X, 0, Z)[1]} x2={P(X, Y, Z)[0]} y2={P(X, Y, Z)[1]} stroke={line} strokeWidth={0.8} strokeDasharray="2 2.5" />
    </svg>
  );
}

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}

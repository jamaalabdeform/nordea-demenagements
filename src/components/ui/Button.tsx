import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverse-ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] " +
  "transition-[background-color,color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] " +
  "active:scale-[0.975] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-paper shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_1px_2px_rgb(17_36_30/0.25)] hover:bg-forest-900",
  secondary: "bg-paper text-ink shadow-[var(--shadow-hairline)] hover:bg-white hover:shadow-[0_0_0_1px_rgb(26_28_27/0.18)]",
  ghost: "text-ink hover:bg-stone-100",
  inverse: "bg-paper text-forest-900 hover:bg-white",
  "inverse-ghost": "text-paper shadow-[inset_0_0_0_1px_rgb(251_249_244/0.28)] hover:shadow-[inset_0_0_0_1px_rgb(251_249_244/0.6)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Flèche qui glisse légèrement au survol — seul ornement des CTA */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("size-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover/btn:translate-x-0.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string };

export function Button({ variant, size, arrow, children, className, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({ variant, size, arrow, children, className, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

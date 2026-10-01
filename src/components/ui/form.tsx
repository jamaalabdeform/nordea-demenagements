"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";
import { spring } from "@/config/motion";

/* ───────────────────────── Champ texte ───────────────────────── */

export const inputClass =
  "h-14 w-full rounded-[var(--radius-md)] bg-paper px-4 text-[1rem] text-ink shadow-[var(--shadow-hairline)] outline-none transition-[box-shadow,background-color] duration-200 placeholder:text-stone-500 " +
  "hover:shadow-[0_0_0_1px_rgb(20_26_34/0.2)] focus:bg-white focus:shadow-[0_0_0_1.5px_var(--color-marine-500),0_0_0_5px_rgb(44_103_168/0.14)] focus-visible:outline-none " +
  "aria-[invalid=true]:shadow-[0_0_0_1.5px_var(--color-danger)]";

export const TextField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; optional?: boolean }
>(function TextField({ label, hint, error, optional, className, id: idProp, ...props }, ref) {
  const auto = useId();
  const id = idProp ?? auto;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-stone-600">Facultatif</span>}
      </label>
      <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={describedBy} className={cn(inputClass, "mt-2")} {...props} />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-stone-600">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
});

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-danger" role="alert">
      {message}
    </motion.p>
  );
}

/* ─────────────────── Choix segmentés (radios) ─────────────────── */

export function Segmented<T extends string>({
  legend,
  value,
  onChange,
  options,
  columns,
  hint,
}: {
  legend: string;
  value: T | null;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  columns?: string;
  hint?: string;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      {hint && <p className="mt-1 text-xs text-stone-600">{hint}</p>}
      <div className={cn("mt-3 grid gap-2", columns ?? "grid-cols-2 sm:flex sm:flex-wrap")}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative flex min-h-12 cursor-pointer select-none items-center justify-center rounded-full px-4 py-2 text-center text-[0.9375rem] leading-tight transition-[background-color,color,box-shadow] duration-200",
                "has-[:focus-visible]:shadow-[0_0_0_2px_var(--color-ivory),0_0_0_4px_var(--color-marine-500)]",
                checked ? "bg-marine-700 font-medium text-paper" : "bg-paper text-ink shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(20_26_34/0.25)]",
              )}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─────────────────── Compteur quantité (− n +) ─────────────────── */

export function QtyStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
  size?: "md" | "sm";
}) {
  const btn = cn(
    "grid shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow,transform] duration-150 active:scale-90 disabled:opacity-30 disabled:active:scale-100",
    size === "md" ? "size-11" : "size-9",
  );
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <button
        type="button"
        className={cn(btn, value > 0 ? "bg-stone-100 text-ink hover:bg-stone-200" : "text-stone-500")}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Retirer : ${label}`}
      >
        <Minus className="size-4" strokeWidth={1.8} />
      </button>
      <span className={cn("num w-8 text-center text-[1.0625rem] font-semibold tabular-nums", value === 0 && "text-stone-500")} aria-live="polite">
        <motion.span key={value} initial={{ y: value ? -6 : 0, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={spring.press} className="inline-block">
          {value}
        </motion.span>
      </span>
      <button
        type="button"
        className={cn(btn, "bg-marine-700 text-paper hover:bg-marine-900")}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Ajouter : ${label}`}
      >
        <Plus className="size-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}

/* ─────────────────── Carte de choix (radio ou case) ─────────────────── */

export function ChoiceCard({
  selected,
  onClick,
  title,
  detail,
  children,
  role = "radio",
  className,
}: {
  selected: boolean;
  onClick: () => void;
  title: ReactNode;
  detail?: ReactNode;
  children?: ReactNode;
  role?: "radio" | "checkbox";
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={spring.press}
      className={cn(
        "relative flex w-full flex-col items-start rounded-[var(--radius-md)] p-5 text-left transition-[background-color,box-shadow,color] duration-200",
        selected
          ? "bg-marine-700 text-paper shadow-[0_10px_30px_-12px_rgb(11_37_69/0.55)]"
          : "bg-paper text-ink shadow-[var(--shadow-hairline)] hover:shadow-[0_0_0_1px_rgb(20_26_34/0.22),var(--shadow-soft)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute right-4 top-4 grid size-5 place-items-center rounded-full transition-all duration-200",
          selected ? "bg-paper text-marine-700" : "shadow-[inset_0_0_0_1.5px_rgb(20_26_34/0.18)]",
        )}
      >
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className="pr-7 text-[1.0625rem] font-semibold">{title}</span>
      {detail && <span className={cn("mt-1 text-sm", selected ? "text-paper/70" : "text-stone-600")}>{detail}</span>}
      {children}
    </motion.button>
  );
}

/* ─────────────────── Case à cocher ─────────────────── */

export function Checkbox({
  checked,
  onChange,
  children,
  className,
  invalid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  className?: string;
  invalid?: boolean;
}) {
  return (
    <label className={cn("group flex cursor-pointer items-start gap-3 text-[0.9375rem]", className)}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" aria-invalid={invalid} />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] transition-all duration-200 peer-focus-visible:shadow-[0_0_0_2px_var(--color-ivory),0_0_0_4px_var(--color-marine-500)]",
          checked ? "bg-marine-700 text-paper" : cn("bg-paper", invalid ? "shadow-[inset_0_0_0_1.5px_var(--color-danger)]" : "shadow-[inset_0_0_0_1.5px_rgb(20_26_34/0.25)] group-hover:shadow-[inset_0_0_0_1.5px_rgb(20_26_34/0.45)]"),
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

"use client";

import { useActionState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { FieldError, inputClass } from "@/components/ui/form";
import { cn } from "@/lib/format";
import { login } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main id="contenu" className="grid min-h-dvh place-items-center bg-forest-900 px-4">
      <form action={action} className="w-full max-w-sm rounded-[var(--radius-lg)] bg-paper p-8 shadow-[var(--shadow-float)]">
        <Logo />
        <h1 className="font-display mt-8 text-3xl">Espace entreprise</h1>
        <p className="mt-2 text-sm text-stone-600">Suivi des demandes de devis.</p>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="code" className="mt-8 block text-sm font-medium">
          Code d&apos;accès
        </label>
        <input id="code" name="code" type="password" autoComplete="current-password" required className={cn(inputClass, "mt-2")} aria-invalid={!!state?.error} />
        <FieldError message={state?.error} />
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending} arrow>
          Entrer
        </Button>
        <p className="mt-6 text-center text-xs text-stone-500">Démo — code : nordea-demo</p>
      </form>
    </main>
  );
}

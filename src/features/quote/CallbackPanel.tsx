"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { company, telHref } from "@/config/company";
import { routes } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox, FieldError, Segmented, TextField } from "@/components/ui/form";
import { leadRepository, type Lead } from "@/features/admin/leads";
import { attribution, track } from "@/lib/analytics";
import { emptyDraft } from "./types";
import { phoneRegex } from "./schema";
import { Confirmation } from "./Confirmation";

const schema = z.object({
  firstName: z.string().trim().min(1, "Indiquez votre prénom"),
  phone: z.string().trim().regex(phoneRegex, "Ce numéro ne semble pas valide (ex. 06 12 34 56 78)"),
  slot: z.enum(["matin", "midi", "apres-midi", "soir", "indifferent"]),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour être rappelé" }),
});
type Values = z.infer<typeof schema>;

const slots: Array<{ value: Values["slot"]; label: string }> = [
  { value: "matin", label: "Matin" },
  { value: "midi", label: "Midi" },
  { value: "apres-midi", label: "Après-midi" },
  { value: "soir", label: "Fin de journée" },
  { value: "indifferent", label: "Peu importe" },
];

/** « Être rappelé » : le chemin court, pour ceux qui préfèrent parler à quelqu'un */
export function CallbackPanel() {
  const [done, setDone] = useState<{ reference: string; leadId: string; firstName: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, control, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { slot: "indifferent" },
  });

  async function onSubmit(v: Values) {
    setServerError(null);
    try {
      const attr = attribution();
      const res = await fetch("/api/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "callback", callback: v, attribution: attr }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      const draft = emptyDraft();
      draft.contact = { firstName: v.firstName, lastName: "", phone: v.phone, email: "", message: `Demande de rappel — créneau : ${slots.find((s) => s.value === v.slot)?.label}`, consent: true };
      const lead: Lead = {
        id: crypto.randomUUID(),
        reference: data.reference,
        createdAt: new Date().toISOString(),
        status: "a-rappeler",
        origin: "site",
        volume: 0,
        specialItem: false,
        quote: draft,
        notes: "",
        reviewReasons: ["Demande de rappel : inventaire à établir par téléphone"],
        timeline: [{ at: new Date().toISOString(), type: "created", text: "Demande de rappel reçue" }],
        attribution: attr,
      };
      leadRepository.add(lead);
      track("callback_requested", { slot: v.slot });
      setDone({ reference: data.reference, leadId: lead.id, firstName: v.firstName });
    } catch {
      setServerError(`L'envoi n'a pas abouti. Vous pouvez aussi nous appeler au ${company.phone.display}.`);
    }
  }

  if (done) return <Confirmation {...done} message="" kind="callback" />;

  return (
    <div className="min-h-dvh">
      <header className="container-page flex h-[4.25rem] items-center">
        <Link href="/" aria-label={`${company.name} — accueil`}>
          <Logo compact />
        </Link>
      </header>
      <main id="contenu" className="container-page grid gap-12 pb-20 pt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-stone-600">Être rappelé</p>
          <h1 className="font-display mt-4 text-4xl">Parlons de votre déménagement.</h1>
          <p className="mt-5 max-w-md text-lg text-stone-600">Laissez-nous votre numéro, un conseiller vous rappelle pour faire le point avec vous. Aucun engagement.</p>
          <p className="mt-8 text-sm text-stone-600">
            Ou appelez-nous directement au{" "}
            <a href={telHref} className="num font-medium text-ink underline underline-offset-4">
              {company.phone.display}
            </a>
            <br />
            {company.hours.display}
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-7 rounded-[var(--radius-lg)] bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:col-span-6 lg:col-start-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Prénom" autoComplete="given-name" error={formState.errors.firstName?.message} {...register("firstName")} />
            <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" error={formState.errors.phone?.message} {...register("phone")} />
          </div>
          <Controller control={control} name="slot" render={({ field }) => <Segmented legend="Quand préférez-vous être appelé ?" value={field.value} onChange={field.onChange} options={slots} />} />
          <div>
            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <Checkbox checked={!!field.value} onChange={field.onChange} invalid={!!formState.errors.consent}>
                  <span className="text-sm text-ink-2">J&apos;accepte d&apos;être recontacté par {company.name} au sujet de mon déménagement.</span>
                </Checkbox>
              )}
            />
            <FieldError message={formState.errors.consent?.message} />
          </div>
          {serverError && (
            <p role="alert" className="rounded-[var(--radius-md)] bg-brick-100/70 px-4 py-3 text-sm font-medium text-brick-600">
              {serverError}
            </p>
          )}
          <div className="flex flex-col gap-4 border-t border-ink/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <Link href={routes.quote} className="text-sm text-stone-600 underline decoration-ink/20 underline-offset-4 hover:text-ink">
              Je préfère estimer mon volume en ligne
            </Link>
            <Button type="submit" size="lg" arrow disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Envoi…" : "Être rappelé"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

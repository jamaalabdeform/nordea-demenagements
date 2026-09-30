"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Checkbox, FieldError, TextField, inputClass } from "@/components/ui/form";
import { routes } from "@/config/site";
import { company } from "@/config/company";
import { cn } from "@/lib/format";
import { contactSchema, type ContactValues } from "../schema";
import type { QuoteDraft } from "../types";

export const CONTACT_FORM_ID = "contact-form";

/**
 * Coordonnées — demandées en dernier, une fois que l'utilisateur a investi
 * du temps dans son inventaire (et compris ce qu'il va recevoir).
 */
export function ContactStep({ draft, onValid }: { draft: QuoteDraft; onValid: (v: ContactValues) => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { ...draft.contact, consent: draft.contact.consent as true },
  });

  return (
    <form id={CONTACT_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Prénom" autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
        <TextField label="Nom" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
        <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" error={errors.phone?.message} {...register("phone")} />
        <TextField label="E-mail" type="email" inputMode="email" autoComplete="email" placeholder="vous@exemple.fr" error={errors.email?.message} {...register("email")} />
      </div>

      <div>
        <label htmlFor="message" className="flex items-baseline justify-between text-sm font-medium text-ink">
          Un détail à nous signaler ?<span className="text-xs font-normal text-stone-600">Facultatif</span>
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Accès particulier, objet non listé, contrainte horaire…"
          className={cn(inputClass, "mt-2 h-auto resize-y py-3.5")}
          {...register("message")}
        />
      </div>

      <div className="pt-2">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox checked={!!field.value} onChange={(v) => field.onChange(v)} invalid={!!errors.consent}>
              <span className="text-sm text-ink-2">
                J&apos;accepte que {company.name} utilise ces informations pour établir mon devis et me recontacter à ce sujet.{" "}
                <Link href={routes.privacy} className="underline underline-offset-2" target="_blank">
                  Politique de confidentialité
                </Link>
              </span>
            </Checkbox>
          )}
        />
        <FieldError message={errors.consent?.message} />
      </div>

      <p className="flex items-center gap-2 text-xs text-stone-600">
        <Lock className="size-3.5" strokeWidth={1.8} aria-hidden />
        Vos coordonnées ne sont ni revendues, ni utilisées pour de la prospection.
      </p>
    </form>
  );
}

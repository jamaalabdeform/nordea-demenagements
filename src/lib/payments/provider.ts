import { paymentConfig } from "@/config/payment.config";

/**
 * Abstraction du prestataire de paiement. Pour changer de prestataire
 * (Stripe, PayPlug, Mollie, Lyra…), implémenter `PaymentProvider` et
 * l'exposer dans `getPaymentProvider()`.
 */
export interface CheckoutRequest {
  leadId: string;
  reference: string;
  /** Montant en euros TTC */
  amount: number;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export type CheckoutResult = { mode: "demo" } | { mode: "redirect"; url: string; providerRef: string };

export interface PaymentProvider {
  createCheckout(req: CheckoutRequest): Promise<CheckoutResult>;
}

const demoProvider: PaymentProvider = {
  async createCheckout() {
    return { mode: "demo" };
  },
};

/** Stripe Checkout via l'API REST — pas de SDK, aucune donnée carte ne transite par notre serveur */
function stripeProvider(secret: string): PaymentProvider {
  return {
    async createCheckout(req) {
      const body = new URLSearchParams({
        mode: "payment",
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        client_reference_id: req.leadId,
        "metadata[leadId]": req.leadId,
        "metadata[reference]": req.reference,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": paymentConfig.currency,
        "line_items[0][price_data][unit_amount]": String(Math.round(req.amount * 100)),
        "line_items[0][price_data][product_data][name]": `Acompte — dossier ${req.reference}`,
        locale: "fr",
      });
      if (req.customerEmail) body.set("customer_email", req.customerEmail);

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const json = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
      if (!res.ok || !json.url || !json.id) throw new Error(json.error?.message ?? "stripe_error");
      return { mode: "redirect", url: json.url, providerRef: json.id };
    },
  };
}

export function getPaymentProvider(): PaymentProvider {
  const secret = process.env.STRIPE_SECRET_KEY;
  return secret ? stripeProvider(secret) : demoProvider;
}

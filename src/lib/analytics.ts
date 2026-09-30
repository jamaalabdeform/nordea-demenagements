/**
 * Couche analytics — un seul point d'entrée `track()` pour tout le site.
 *
 * Aujourd'hui : push dans `window.dataLayer` (prêt pour Google Tag Manager →
 * GA4, Google Ads, Meta Pixel…) + compteur local pour l'entonnoir affiché
 * dans /admin-demo.
 *
 * Demain : ajouter un adaptateur (Meta CAPI, PostHog, serveur interne) dans
 * `adapters` sans toucher aux composants.
 */

export const QUOTE_EVENTS = [
  "quote_started",
  "origin_completed",
  "destination_completed",
  "inventory_started",
  "inventory_completed",
  "special_item_added",
  "contact_completed",
  "quote_submitted",
] as const;

export type QuoteEvent = (typeof QUOTE_EVENTS)[number];
export type AnalyticsEvent = QuoteEvent | "cta_click" | "callback_requested" | "phone_click";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

type Adapter = (event: AnalyticsEvent, props: EventProps) => void;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const FUNNEL_KEY = "nordea:funnel";

const adapters: Adapter[] = [
  // Google Tag Manager / GA4 / Ads
  (event, props) => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props, ...attribution() });
  },
  // Entonnoir local (démo)
  (event) => {
    try {
      const counts = JSON.parse(localStorage.getItem(FUNNEL_KEY) ?? "{}") as Record<string, number>;
      counts[event] = (counts[event] ?? 0) + 1;
      localStorage.setItem(FUNNEL_KEY, JSON.stringify(counts));
    } catch {
      /* stockage indisponible : on ignore */
    }
  },
  // Debug
  (event, props) => {
    if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, props);
  },
];

/** Événements « une fois par session » : évite de gonfler l'entonnoir en navigant */
const once = new Set<string>();

export function track(event: AnalyticsEvent, props: EventProps = {}, opts: { oncePerSession?: boolean } = {}) {
  if (typeof window === "undefined") return;
  if (opts.oncePerSession) {
    const key = `nordea:once:${event}`;
    try {
      if (once.has(key) || sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* noop */
    }
    once.add(key);
  }
  for (const adapter of adapters) {
    try {
      adapter(event, props);
    } catch {
      /* un adaptateur défaillant ne doit jamais casser le parcours */
    }
  }
}

export function readFunnel(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(FUNNEL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/* ───────────── Attribution marketing (UTM, gclid, fbclid) ───────────── */

const ATTR_KEY = "nordea:attribution";
const ATTR_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

/** À appeler une fois au chargement : mémorise la source de la première visite de la session */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Record<string, string> = { landing: window.location.pathname, referrer: document.referrer };
    for (const p of ATTR_PARAMS) {
      const v = params.get(p);
      if (v) data[p] = v;
    }
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export function attribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

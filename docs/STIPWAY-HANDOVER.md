# NORDÉA — Dossier de passation STIPway

Démo commerciale d'un écosystème digital pour déménageur : site vitrine orienté conversion, simulateur de volume et de devis, back-office de suivi des demandes, paiement d'acompte.
**La marque NORDÉA DÉMÉNAGEMENTS est fictive.** Coordonnées, avis et leads d'exemple sont des données de démonstration.

---

## 1. Démarrage

```bash
npm install
cp .env.example .env.local   # facultatif en démo
npm run dev                  # http://localhost:3000
npm run build && npm start   # production locale
npm run lint && npm run typecheck
```

| Route | Rôle |
|---|---|
| `/` | Homepage (13 sections) |
| `/devis` | Simulateur (paramètres : `de`, `vers`, `logement`, `formule`, `rappel=1`) |
| `/demenagement-lille` | Page SEO locale (rewrite → `/demenagement/[ville]`) |
| `/admin-demo` | Back-office (code : `nordea-demo`, variable `ADMIN_DEMO_CODE`) |
| `/paiement/[id]` | Paiement de l'acompte (lien généré dans l'admin) |
| `/api/quote` | Réception des demandes (devis et rappel) |
| `/api/payments/checkout` · `/api/payments/webhook` | Paiement Stripe |

### Scénario de démonstration conseillé (≈ 6 min)
1. Homepage → hero : saisir **Lille → Paris** → Continuer
2. **T3** → pièces pré-cochées → Inventaire → **Pré-remplir** → ajuster 2 meubles (le camion 3D se remplit)
3. Objets particuliers : **Piano droit** → message « étude spécifique »
4. Accès départ : 3e étage, ascenseur, gabarit « je ne sais pas », stationnement « non »
5. Date, formule Confort, options → coordonnées → récapitulatif → **Recevoir mon devis**
6. Sur la confirmation : lien discret **« Démo · voir cette demande côté entreprise »** → la fiche lead apparaît instantanément avec les **points à vérifier**
7. Dans la fiche : saisir un montant → **Générer le lien de paiement** → ouvrir le lien → payer (simulation) → retour admin : statut **Accepté**
8. « Réinitialiser la démo » dans l'admin avant chaque rendez-vous

---

## 2. Architecture

```
src/
  app/
    (site)/            homepage, pages locales, pages légales (header + footer)
    devis/             simulateur (rendu client, skeleton de chargement)
    admin-demo/        login (server action + cookie) et espace protégé
    paiement/[id]/     page de paiement client
    api/               quote, payments/checkout, payments/webhook
    sitemap.ts robots.ts opengraph-image.tsx icon.svg
  proxy.ts             protection /admin-demo (ex-« middleware » dans Next 16)
  config/              company, site, media, motion, pricing.config, payment.config
  data/                furnitureCatalog, services, locations, faq, cities,
                       testimonials.demo, leads.demo
  components/          Header, Footer, MobileCta, MediaSlot, Logo, ui/*
  sections/            une section de homepage par fichier
  features/
    quote/             QuoteFlow, étapes, schéma zod, brouillon persistant, récap
    inventory/         InventoryPicker, calcul du volume, vues 3D / isométrique
    admin/             dépôt des leads, tableau de bord, fiche lead
    payment/           page de paiement
  lib/                 analytics, pricing/ (moteur + règles), payments/, seo, format
creative/              prompts Higgsfield
docs/                  ce document, informations client à collecter
```

**Stack :** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS 4 (tokens `@theme`), Motion, React Three Fiber (chargé à la demande), React Hook Form + Zod 4, Lucide. Polices auto-hébergées (Newsreader, Instrument Sans) via `next/font/local`.

---

## 3. Remplacer l'identité

| Élément | Fichier |
|---|---|
| Nom, adresse, téléphone, e-mail, horaires, réseaux, mentions | `src/config/company.ts` (source unique : header, footer, schema.org, pages légales) |
| Logo | `src/components/Logo.tsx` (garder l'API `tone`/`compact`) + `src/app/icon.svg` |
| Couleurs, typographies, rayons, ombres | `src/app/globals.css` → bloc `@theme` |
| Polices | `src/fonts/` + `src/app/layout.tsx` |
| Libellés des CTA | `src/config/site.ts` → `cta` |
| Mentions « démo » | `company.isDemo`, `site.flags.demoNotice` |
| Visuels | `src/config/media.ts` (voir §9) |

---

## 4. Design system

- **Palette « brique & forêt » :** ivoire `#f5f1e8`, papier `#fbf9f4`, pierre, anthracite `#1a1c1b`, vert de confiance `forest-700 #1d3a31` (CTA, états actifs), accent brique `brick-600 #a9492a` (réservé aux repères : index de section, alertes objets spécifiques). Tous les textes secondaires utilisent `stone-600` (AA sur ivoire).
- **Typographie :** titres en Newsreader (serif éditoriale, graisse 300–380), interface en Instrument Sans, chiffres tabulaires (`.num`).
- **Utilitaires maison :** `container-page`, `py-section`, `font-display`, `eyebrow`, `num`, `grain`.
- **Mouvement :** `src/config/motion.ts`. Révélations uniques au scroll (18 px, 700 ms), transitions d'étapes (320 ms), ressorts réservés aux retours tactiles et au compteur de volume. Tout est neutralisé avec `prefers-reduced-motion`.

---

## 5. Catalogue mobilier & volume

- `src/data/furnitureCatalog.ts` : pièces → meubles (`id`, `label`, `volume` en m³, `hint`), objets spécifiques, types de logement (fourchettes indicatives, pièces par défaut), **inventaires types** (bouton « Pré-remplir »), véhicules indicatifs.
- **Toutes les valeurs sont indicatives** et doivent être remplacées par la grille du client. Les `id` sont stables : on peut modifier les volumes sans casser les dossiers existants.
- `src/features/inventory/volume.ts` : fonctions pures (`totalVolume`, `roomVolume`, `suggestVehicle`…), utilisées aussi bien côté client que côté API.

### Visualisation du chargement
- `cargo.ts` : grille 10 × 4 × 4 cellules. Remplissage du fond de caisse vers les portes, du sol vers le plafond.
- **Desktop** (≥ 1024 px, pointeur fin, WebGL) : `CargoScene.tsx` (R3F, une InstancedMesh, chargée en différé).
- **Mobile et animations réduites** : `IsoCargo.tsx` (SVG isométrique, aucune dépendance 3D).

---

## 6. Fonctionnement du simulateur

11 étapes regroupées en 5 phases (Projet · Inventaire · Accès · Date & options · Envoi), définies dans `features/quote/steps.ts` avec leur validation (`validateStep` renvoie un message d'aide plutôt que de désactiver le bouton).

- Brouillon persisté en `sessionStorage` (`useQuoteDraft`) : un rechargement ne fait rien perdre.
- Paramètres d'entrée : hero (`de`, `vers`), aperçu simulateur (`logement`), formules (`formule`), rappel (`rappel=1`).
- Coordonnées demandées **en dernier**, validées par Zod (`schema.ts`, schéma partagé avec l'API).
- Objets spécifiques → drapeau `specialItem` sur le lead et message « étude spécifique ».
- Envoi : `POST /api/quote` → validation → `PricingEngine` → webhook optionnel → enregistrement du lead → confirmation.

---

## 7. Règles tarifaires futures — `PricingEngine`

- `src/config/pricing.config.ts` : **toutes les valeurs sont `null`**, mode `"demo"`. Aucun prix n'est inventé.
- `src/lib/pricing/rules.ts` : une règle par facteur (volume × formule, distance, étages sans ascenseur, portage, accès, options, objets spécifiques, saison et flexibilité). Chaque règle ignore sa partie tant que la valeur est absente et remonte un **point à vérifier**.
- `src/lib/pricing/engine.ts` : orchestration, multiplicateur global, minimum de facturation. `reviewPoints()` alimente la fiche lead de l'admin.
- **Mise en production :** renseigner la configuration, brancher un `DistanceProvider` (Google Distance Matrix, OSRM…), passer `mode: "live"`, puis afficher une fourchette ou un prix selon la politique commerciale du client.

---

## 8. Back-office & paiement

- **Leads** : `features/admin/leads.ts` définit l'interface `LeadRepository`. L'implémentation démo est `LocalLeadRepository` (localStorage, 5 leads d'exemple). En production : implémentation API (Supabase/Postgres, CRM) avec la même interface. Statuts : Nouveau → À rappeler → Devis préparé → Devis envoyé → Relance → Accepté / Perdu.
- **Fiche lead** : coordonnées, logistique, inventaire par pièce, objets spécifiques, points à vérifier, notes, historique, source marketing (UTM, gclid, fbclid).
- **Accès** : `proxy.ts` + cookie httpOnly. À remplacer par une vraie authentification.
- **Acompte** : le conseiller saisit le montant TTC et le pourcentage → lien `/paiement/[id]` → carte (Stripe Checkout hébergé) ou virement. Sans `STRIPE_SECRET_KEY`, le paiement est **simulé** et aucune donnée bancaire n'est collectée. Le webhook `/api/payments/webhook` vérifie la signature Stripe : c'est lui qui doit faire foi en production.
- ⚠️ En production, le montant de l'acompte doit être relu **côté serveur** depuis la base, jamais transmis par le navigateur.

---

## 9. Médias & Higgsfield

- `src/config/media.ts` déclare chaque emplacement (`hero`, `truck`, `protection`, `carry`, `arrival`, `volume`).
- `<MediaSlot>` : image via `next/image`, vidéo WebM/MP4 avec version mobile, chargement à l'approche de l'écran, pause hors écran, poster, respect de `prefers-reduced-motion`. Sans fichier, il affiche une composition graphique de repli (lumière, matière), jamais une icône.
- Les prompts de production sont dans `creative/higgsfield-prompts.md`, avec les spécifications d'export.
- `site.flags.showAssetSlotLabels = true` affiche le nom de chaque emplacement, pour une revue interne.

---

## 10. Analytics

`src/lib/analytics.ts` : un seul point d'entrée, `track(event, props)`.
- Événements du tunnel : `quote_started`, `origin_completed`, `destination_completed`, `inventory_started`, `inventory_completed`, `special_item_added`, `contact_completed`, `quote_submitted`, plus `cta_click`, `phone_click` et `callback_requested`.
- Adaptateurs : `dataLayer` (GTM → GA4, Google Ads, Meta Pixel), compteur local (entonnoir de l'admin), debug en développement.
- Attribution capturée en session (UTM, `gclid`, `fbclid`, landing, referrer) et jointe à chaque lead.
- GTM se charge uniquement si `NEXT_PUBLIC_GTM_ID` est défini. **Prévoir un bandeau de consentement (CMP) avant d'activer tout traceur publicitaire.**

---

## 11. SEO

- Métadonnées par page (`pageMetadata`), canonical, Open Graph, Twitter, image OG générée.
- schema.org : `MovingCompany` (adresse, horaires, zones), `FAQPage`, `BreadcrumbList` sur les pages locales. **Aucun `Review` ni `AggregateRating`** tant qu'il n'y a pas d'avis réels.
- Pages locales : `/demenagement-{ville}`, générées **uniquement** pour les villes `published: true` qui ont un contenu spécifique (`src/data/locations.ts`). Les autres villes restent listées sans page, pour éviter les pages pauvres.
- `sitemap.xml` et `robots.txt` (admin, API et paiement exclus). Pages légales en `noindex` tant que `isDemo` est vrai.
- HTML sémantique, un seul `h1` par page, lien d'évitement, focus visibles.

---

## 12. Évolutions prévues par l'architecture

| Besoin | Point d'entrée |
|---|---|
| CRM, e-mail, SMS, WhatsApp | `LEAD_WEBHOOK_URL` (Make, n8n, Zapier) puis intégration directe dans `/api/quote` |
| Landing pages Ads | réutiliser les sections + `RouteForm` ; l'attribution est déjà capturée |
| Retargeting / Meta CAPI | nouvel adaptateur dans `lib/analytics.ts` |
| Avis clients | remplacer `testimonials.demo.ts` par une source Google Business |
| Base de données | nouvelle implémentation de `LeadRepository` |
| Tarification automatique | `pricing.config.ts` + `DistanceProvider` |
| Paiement | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (ou autre `PaymentProvider`) |

---

## 13. Déploiement (Vercel)

1. Importer le repo `jamaalabdeform/nordea-demenagements` sur vercel.com (framework détecté : Next.js, aucune configuration spécifique).
2. Variables d'environnement (facultatives en démo) : `NEXT_PUBLIC_SITE_URL`, `ADMIN_DEMO_CODE`, `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_GTM_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_ENABLED`.
3. Chaque push sur `main` redéploie automatiquement.

**Limite connue de la démo :** les leads vivent dans le navigateur. Pour la présentation, remplir le devis et ouvrir l'admin **sur le même appareil**.

---

## 14. Revue finale « human designer »

Passes effectuées : hiérarchie, espacements, typographie, couleur, profondeur, interactions, responsive (390 / 768 / 1440 px), simplification.
Décisions notables :
- Aucune statistique inventée : la réassurance repose sur des bénéfices qualitatifs.
- Aucun prix affiché : le moteur est prêt, mais le message de prise en charge le remplace.
- Promesses de délai retirées (« rappel sous 24 h », « prix annoncé = prix payé ») tant qu'elles ne sont pas validées par le client.
- 3D réservée au seul endroit où elle informe (le remplissage du camion), avec un équivalent SVG léger sur mobile.
- Emplacements médias sans faux visuels : des compositions sobres plutôt que des photos stock ou des images IA non vérifiées.

# SAMYO Déménagement & Transport — dossier de passation STIPway

Maquette fonctionnelle de l'écosystème digital de SAMYO : site vitrine orienté conversion, **calculateur de volume et demande de devis** (déménagement complet ou transport de quelques objets), et back-office de suivi des demandes.

- **Pas de paiement en ligne.** Les acomptes sont encaissés hors site, par exemple avec un lien SumUp envoyé au client. L'admin permet seulement de cocher « acompte encaissé ».
- **Coordonnées provisoires.** L'adresse, le téléphone, les horaires et les mentions légales sont des valeurs à remplacer (voir `docs/CLIENT-INFO-NEEDED.md`).

Autres documents : [`CHARTE-GRAPHIQUE.md`](CHARTE-GRAPHIQUE.md) · [`DOMAINE-HEBERGEMENT.md`](DOMAINE-HEBERGEMENT.md) · [`CLIENT-INFO-NEEDED.md`](CLIENT-INFO-NEEDED.md) · [`../creative/higgsfield-prompts.md`](../creative/higgsfield-prompts.md)

---

## 1. Démarrage

```bash
npm install
cp .env.example .env.local   # facultatif
npm run dev                  # http://localhost:3000
npm run build && npm start   # production locale
npm run lint && npm run typecheck
```

| Route | Rôle |
|---|---|
| `/` | Homepage (13 sections) |
| `/devis` | Calculateur et demande de devis (paramètres : `de`, `vers`, `logement`, `formule`, `besoin=transport`, `rappel=1`) |
| `/demenagement-lille` | Page SEO locale (rewrite → `/demenagement/[ville]`) |
| `/admin-demo` | Back-office (code : `samyo-demo`, variable `ADMIN_DEMO_CODE`) |
| `/api/quote` | Réception des demandes (devis et rappel) |

### Scénario de présentation (≈ 5 min)
1. Hero : **Lille → Paris** → Continuer → **T3** → pièces pré-cochées
2. Inventaire → **Pré-remplir** → ajuster deux meubles (le camion se remplit en 3D)
3. Objets particuliers : **Piano droit** → message « étude spécifique »
4. Accès : 3e étage, gabarit d'ascenseur « je ne sais pas », stationnement « non »
5. Date, formule, options → coordonnées → récapitulatif → **Recevoir mon devis**
6. Sur la confirmation, lien discret **« Démo · voir cette demande côté entreprise »** : la fiche apparaît avec ses **points à vérifier**
7. Dans la fiche : saisir le montant du devis → « Devis envoyé » → cocher « Acompte encaissé » (hors site, via SumUp) → statut **Accepté**
8. Montrer le parcours court : section Services → « Quelques meubles à transporter ? »
9. Avant chaque rendez-vous : « Réinitialiser la démo » dans l'admin

---

## 2. Architecture

```
src/
  app/
    (site)/            homepage, pages locales, pages légales (header + footer)
    devis/             calculateur (rendu client, skeleton de chargement)
    admin-demo/        login (server action + cookie) et espace protégé
    api/quote/         réception des demandes
    sitemap.ts robots.ts opengraph-image.tsx icon.svg
  proxy.ts             protection de /admin-demo (ex-« middleware » dans Next 16)
  config/              company, site, media, motion, pricing.config
  data/                furnitureCatalog, services, locations, faq, cities,
                       testimonials.demo, leads.demo
  components/          Header, Footer, MobileCta, MediaSlot, Logo (+ logo-paths), ui/*
  sections/            une section de homepage par fichier
  features/
    quote/             QuoteFlow, étapes, schéma zod, brouillon persistant, récapitulatif
    inventory/         InventoryPicker, calcul du volume, vues 3D et isométrique
    admin/             dépôt des leads, tableau de bord, fiche lead
  lib/                 analytics, pricing/ (moteur + règles), seo, format
public/brand/          logos SVG (couleur, blanc, symbole, symbole carré)
scripts/build-logo.py  génération du lettrage vectorisé du logo
```

**Stack :** Next.js 16 (App Router, `output: "standalone"`), React 19, TypeScript strict, Tailwind CSS 4 (tokens `@theme`), Motion, React Three Fiber (chargé à la demande), React Hook Form + Zod 4, Lucide. Polices auto-hébergées (Newsreader, Instrument Sans).

---

## 3. Identité

| Élément | Fichier |
|---|---|
| Nom, adresse, téléphone, e-mail, horaires, réseaux, mentions | `src/config/company.ts` (source unique) |
| Logo (site) | `src/components/Logo.tsx` : symbole + lettrage vectorisé |
| Logos à exporter (devis, camion, réseaux) | `public/brand/*.svg` |
| Couleurs, typographies, rayons, ombres | `src/app/globals.css` → `@theme` |
| Libellés des CTA | `src/config/site.ts` → `cta` |
| Mentions « maquette » | `company.isDemo`, `site.flags.demoNotice` |

Détails de la charte : `docs/CHARTE-GRAPHIQUE.md`.

---

## 4. Calculateur

### Deux parcours
- **Déménagement** (11 étapes) : besoin et trajet → logement → pièces → inventaire → objets particuliers → accès départ → accès arrivée → date → formule et options → coordonnées → récapitulatif.
- **Transport d'objets** (9 étapes) : le logement et les pièces sont sautés, l'inventaire propose une liste d'objets courants et les formules sont masquées. La logique est dans `activeSteps()` (`features/quote/steps.ts`).

### Volumes
- `src/data/furnitureCatalog.ts` : pièces → meubles (`id`, `label`, `volume` en m³), liste « transport », objets spécifiques, types de logement, inventaires types (bouton « Pré-remplir »), véhicules indicatifs. **Toutes les valeurs sont indicatives** et doivent être remplacées par la grille de SAMYO.
- `src/features/inventory/volume.ts` : fonctions pures, partagées entre le client et l'API.
- Visualisation : grille de chargement (`cargo.ts`), en 3D WebGL sur desktop (`CargoScene.tsx`) et en SVG isométrique sur mobile ou avec les animations réduites (`IsoCargo.tsx`).

### Comportements
- Brouillon conservé en `sessionStorage` : un rechargement ne fait rien perdre.
- Validation par étape avec un message d'aide plutôt qu'un bouton grisé. Coordonnées validées par Zod (schéma partagé avec l'API).
- Les objets spécifiques posent le drapeau `specialItem` et affichent « étude spécifique ».

---

## 5. Tarifs — `PricingEngine`

- `src/config/pricing.config.ts` : toutes les valeurs sont à `null` et le mode est `"demo"`. **Aucun prix n'est inventé** : le client reçoit le message « un conseiller vérifie votre demande ».
- `src/lib/pricing/rules.ts` contient une règle par facteur : volume × formule, distance, étages sans ascenseur, portage, accès, options, objets spécifiques, saison et dates flexibles. Tant qu'une valeur manque, la règle ne chiffre rien et signale un point à vérifier.
- **Pour activer le calcul du prix :** renseigner la grille de SAMYO, brancher un `DistanceProvider` (Google Distance Matrix, OSRM…) et passer en `mode: "live"`. On choisit ensuite d'afficher une fourchette ou un prix.

---

## 6. Back-office

- `features/admin/leads.ts` : interface `LeadRepository`. L'implémentation actuelle stocke les leads dans le navigateur (localStorage, avec 6 leads d'exemple). En production, il suffit d'une implémentation API (Supabase/Postgres, CRM) qui respecte la même interface.
- **Statuts :** Nouveau → À rappeler → Devis préparé → Devis envoyé → Relance → Accepté / Perdu.
- **Fiche lead :** coordonnées, type de demande, logistique, inventaire par pièce, objets spécifiques, points à vérifier, notes, historique, source marketing (UTM, gclid, fbclid), **suivi du devis** (montant envoyé, acompte encaissé hors site).
- **Accès :** `proxy.ts` et un cookie httpOnly. À remplacer par une vraie authentification avant toute mise en production.

---

## 7. Médias & Higgsfield

- `src/config/media.ts` déclare chaque emplacement. `<MediaSlot>` gère image, vidéo WebM/MP4, version mobile, chargement différé et `prefers-reduced-motion`. Sans fichier, une composition de repli s'affiche.
- Prompts de production : `creative/higgsfield-prompts.md`. Le compte Higgsfield connecté n'avait pas de crédits, donc aucun asset n'a été généré.

---

### Fourgon du hero
- Composant `src/components/HeroVan.tsx` : photo détourée (fond transparent) et marquage SAMYO vectoriel appliqué sur le flanc (`VanLivery`, calé sur une image de 1092 × 466 px de profil).
- L'image est lue depuis `NEXT_PUBLIC_VAN_IMAGE` (ex. `/media/samyo-van.webp`). Sans cette variable, le fourgon n'apparaît pas.
- L'aperçu de maquette (Shutterstock n° 2451028223, filigrané) est **exclu du dépôt**. Une fois la licence achetée : détourer le fichier HD (`rembg`, modèle `isnet-general-use`), le déposer dans `public/media/`, définir la variable, puis recaler `VanLivery` si le cadrage change.

## 8. Analytics

`track(event, props)` dans `src/lib/analytics.ts`. Événements : `quote_started`, `origin_completed`, `destination_completed`, `inventory_started`, `inventory_completed`, `special_item_added`, `contact_completed`, `quote_submitted`, `cta_click`, `phone_click`, `callback_requested`.
Ils sont envoyés au `dataLayer` (GTM → GA4, Google Ads, Meta) et à l'entonnoir de l'admin. L'attribution (UTM, gclid, fbclid) est jointe à chaque lead. GTM ne se charge que si `NEXT_PUBLIC_GTM_ID` est défini. **Un bandeau de consentement est obligatoire avant tout traceur publicitaire.**

---

## 9. SEO

- Métadonnées, canonical, Open Graph et image OG générée.
- schema.org `MovingCompany`, `FAQPage` et `BreadcrumbList`. Aucun `Review` ni `AggregateRating` tant qu'il n'y a pas d'avis réels.
- Pages locales `/demenagement-{ville}` générées uniquement pour les villes `published` qui ont un vrai contenu (`src/data/locations.ts`).
- `sitemap.xml` et `robots.txt` (admin et API exclus).

---

## 10. Déploiement

Voir `docs/DOMAINE-HEBERGEMENT.md` : Vercel ou VPS OVH, configuration DNS, variables d'environnement.

---

## 11. Choix de conception

- Le bleu marine porte la confiance (CTA, sections sombres). Le turquoise reste un accent ponctuel (repères, pastille d'arrivée du logo) et n'est jamais utilisé en aplat.
- Les contraintes à vérifier sont signalées en ambre, les erreurs en rouge : on ne mélange pas les couleurs de marque et les signaux.
- Aucune statistique, aucun avis ni aucun prix inventé. Les témoignages sont présentés comme des exemples.
- La 3D n'est utilisée qu'à un seul endroit, celui où elle informe : le remplissage du camion.

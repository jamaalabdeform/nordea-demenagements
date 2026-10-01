# Nom de domaine & hébergement

## 1. Nom de domaine

À vérifier puis réserver chez OVHcloud (ou un autre registrar). La disponibilité n'a pas pu être contrôlée depuis l'environnement de développement.

| Priorité | Domaine | Commentaire |
|---|---|---|
| 1 | **samyo-demenagement.fr** | Recommandé. Reprend l'expression exacte, bon pour le référencement local français |
| 2 | samyo-demenagement.com | À réserver en complément, redirigé vers le .fr |
| 3 | samyo-transport.fr | Pour l'activité transport, redirigé vers le .fr |
| — | samyo-demenagements.fr | Variante au pluriel, à réserver pour protéger la marque |

Le site est déjà configuré pour `samyo-demenagement.fr` : adresse e-mail `contact@samyo-demenagement.fr`, URL canonique, sitemap. Si un autre domaine est retenu, il suffit de modifier `NEXT_PUBLIC_SITE_URL` et `company.email`.

**E-mail :** l'offre « Email Pro » d'OVH (ou Google Workspace / Microsoft 365) sur le même domaine, avec les enregistrements SPF, DKIM et DMARC configurés pour que les devis n'arrivent pas en indésirables.

## 2. Hébergement — deux options

Le site utilise Next.js avec des fonctions serveur (réception des devis, espace entreprise protégé). Il lui faut donc un hébergement capable d'exécuter **Node.js**. Une offre « Hébergement Web » mutualisée classique (PHP) ne convient pas.

### Option A — Vercel + domaine OVH (recommandée)
- Le plan gratuit suffit pour démarrer. HTTPS, CDN et déploiement automatique à chaque modification sont inclus.
- Étapes :
  1. vercel.com → New Project → importer le dépôt GitHub → Deploy
  2. Settings → Domains → ajouter `samyo-demenagement.fr` et `www.samyo-demenagement.fr`
  3. Dans l'espace OVH, zone DNS : enregistrement `A` sur `@` vers `76.76.21.21`, et `CNAME` sur `www` vers `cname.vercel-dns.com`. Vercel affiche les valeurs exactes à utiliser.
  4. Ajouter les variables d'environnement (voir §3)
- Le nom de domaine et les e-mails restent chez OVH : seul le site est servi par Vercel.

### Option B — Tout chez OVH (VPS)
- Un VPS OVH d'entrée de gamme suffit (par exemple 2 vCPU et 4 Go de RAM).
- Le projet est déjà compilé en mode autonome (`output: "standalone"`) :

```bash
# sur le VPS (Ubuntu), Node 22 installé
git clone <dépôt> samyo && cd samyo
npm ci && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
# lancer avec PM2 (redémarrage automatique)
npm i -g pm2
PORT=3000 pm2 start .next/standalone/server.js --name samyo && pm2 save && pm2 startup
```

- Mettre Nginx en reverse proxy devant le port 3000, et obtenir le certificat HTTPS avec Certbot (Let's Encrypt).
- Zone DNS OVH : enregistrement `A` sur `@` et sur `www` vers l'adresse IP du VPS.
- Les mises à jour (système, Node, sécurité) sont à votre charge. C'est la principale différence avec l'option A.

## 3. Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.samyo-demenagement.fr` |
| `ADMIN_DEMO_CODE` | Code d'accès à l'espace entreprise (à changer) |
| `LEAD_WEBHOOK_URL` | Facultatif : envoi de chaque demande vers un CRM, Make, n8n ou un e-mail |
| `NEXT_PUBLIC_GTM_ID` | Facultatif : Google Tag Manager (avec un bandeau de consentement) |

## 4. Avant la mise en ligne réelle
- [ ] Remplacer les coordonnées provisoires (`src/config/company.ts`)
- [ ] Remplacer le stockage local des leads par une base ou un CRM (`LeadRepository`)
- [ ] Mettre en place une vraie authentification pour l'espace entreprise
- [ ] Compléter les mentions légales et la politique de confidentialité
- [ ] Ajouter un bandeau de consentement si des outils publicitaires sont activés
- [ ] Passer `company.isDemo` et `site.flags.demoNotice` à `false`

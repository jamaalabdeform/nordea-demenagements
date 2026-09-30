# Informations à demander au déménageur

Checklist pour passer de la démo NORDÉA (marque fictive) au site réel. Chaque ligne indique **où** l'information sera branchée.

## 1. Identité
- [ ] Nom commercial, raison sociale, forme juridique → `src/config/company.ts`
- [ ] Logo vectoriel (SVG/AI/PDF), variantes clair/foncé, pictogramme seul → `src/components/Logo.tsx`
- [ ] Couleurs et typographies existantes, s'il y en a (sinon on conserve la direction proposée) → `src/app/globals.css` (`@theme`)
- [ ] Signature / slogan, s'il en existe un
- [ ] Nom de domaine et accès DNS

## 2. Coordonnées
- [ ] Adresse du siège et des éventuels dépôts
- [ ] Téléphone commercial (et numéro mobile/WhatsApp si utilisé)
- [ ] E-mail de réception des demandes
- [ ] Horaires d'ouverture et de joignabilité téléphonique
- [ ] Comptes réseaux sociaux, fiche Google Business Profile

## 3. Zones d'intervention
- [ ] Villes et départements couverts en priorité
- [ ] Distance maximale / longue distance / international
- [ ] Pour chaque ville à publier en SEO : quartiers, contraintes d'accès connues, délais d'autorisation de stationnement, références locales → `src/data/locations.ts`

## 4. Prestations
- [ ] Liste des services réellement proposés (particuliers, pros, longue distance, garde-meubles, monte-meubles, nettoyage…) → `src/data/services.ts`
- [ ] Services **non** proposés (pour ne rien promettre à tort)
- [ ] Options facturables et leur description → `quoteOptions`

## 5. Formules
- [ ] Noms, périmètre exact de chaque formule, ce qui est inclus / exclu → `formulas`
- [ ] Formule la plus vendue (mise en avant)

## 6. Tarifs & modèle de devis
- [ ] **Un modèle de devis réel** (PDF anonymisé) et, si possible, 3 à 5 devis récents
- [ ] Méthode de calcul : prix au m³ ? forfait ? par équipe/heure ? → `src/config/pricing.config.ts`
- [ ] Coefficient par formule
- [ ] Tarif kilométrique, forfait local (km inclus)
- [ ] Suppléments : étage sans ascenseur, portage > X m, monte-meubles, stationnement
- [ ] Saisonnalité (été, fin de mois, week-end) et remise pour dates flexibles
- [ ] Minimum de facturation
- [ ] TVA appliquée, affichage HT/TTC

## 7. Calcul des volumes
- [ ] Grille de volumes par meuble utilisée en interne → `src/data/furnitureCatalog.ts`
- [ ] Meubles à ajouter/retirer du catalogue
- [ ] Volume standard d'un carton, types de cartons fournis
- [ ] Marge de calage appliquée au volume

## 8. Coefficients & règles d'accès
- [ ] Seuils de distance de portage (<10 m, 10–30 m…) et impact
- [ ] Gestion des ascenseurs (gabarit minimal, poids)
- [ ] Qui demande l'autorisation de stationnement, délai, coût refacturé ?

## 9. Objets particuliers
- [ ] Liste des objets acceptés / refusés (piano, coffre-fort, billard, œuvres, moto…) → `specialItems`
- [ ] Process d'étude (visite, photos, sous-traitance ?)
- [ ] Tarifs ou fourchettes éventuels

## 10. Équipe & véhicules
- [ ] Taille de l'équipe, ancienneté, formation (uniquement des faits vérifiables)
- [ ] Flotte : types de véhicules et volumes utiles → `vehicles` (visualisation 3D)
- [ ] Matériel : monte-meubles, diables, sangles, housses…

## 11. Photos & vidéos
- [ ] Photos réelles de l'équipe, des camions, de chantiers (autorisations des personnes photographiées)
- [ ] Accord pour une journée de tournage, ou validation des assets Higgsfield → `creative/higgsfield-prompts.md`

## 12. Avis clients
- [ ] Accès à Google Business Profile, export des avis
- [ ] Autorisation d'utiliser nom/prénom et ville des clients cités → remplace `src/data/testimonials.demo.ts`
- [ ] Note moyenne et volume d'avis (seulement si vérifiables : sinon, rien n'est affiché)

## 13. Assurance
- [ ] Assureur, type de contrat (responsabilité, marchandises transportées), plafonds
- [ ] Déclaration de valeur : fonctionnement, document fourni au client
- [ ] Procédure en cas de dommage

## 14. Mentions légales & conformité
- [ ] SIRET, RCS, TVA intracommunautaire, capital
- [ ] Numéro d'inscription au registre des transporteurs (si applicable)
- [ ] Labels, certifications, fédérations **réellement** détenus (justificatifs)
- [ ] Directeur de la publication, hébergeur retenu
- [ ] Politique de confidentialité : durée de conservation, outils d'analyse → `src/app/(site)/confidentialite`

## 15. CGV
- [ ] Conditions générales de vente en vigueur (PDF)
- [ ] Conditions d'annulation, de report, pénalités

## 16. Paiement
- [ ] Taux d'acompte (actuellement 30 % proposé par défaut, **à valider**) → `src/config/payment.config.ts`
- [ ] Moyens acceptés : carte, virement, chèque, espèces, paiement en plusieurs fois
- [ ] RIB (titulaire, IBAN, BIC) pour le virement
- [ ] Compte Stripe (ou autre prestataire) : clés API, compte bancaire de versement
- [ ] Moment du solde (jour J, livraison, après)

## 17. Process commercial
- [ ] Qui traite les demandes, délai de rappel réaliste (ne sera affiché qu'une fois validé)
- [ ] Visite technique : quand est-elle systématique ?
- [ ] Étapes internes (statuts CRM actuels) → `LEAD_STATUSES` dans `src/features/admin/leads.ts`
- [ ] Outil CRM existant (pour connecter le webhook `LEAD_WEBHOOK_URL`)
- [ ] Délais de réservation habituels, période de forte demande

## 18. Marketing
- [ ] Comptes Google Ads, Meta Business, Google Tag Manager, GA4 (accès)
- [ ] Budget et villes prioritaires pour les campagnes
- [ ] Numéro de téléphone de suivi des appels (si call tracking)

# Charte graphique — SAMYO Déménagement & Transport

## Logo

**Idée :** le « S » de SAMYO est tracé comme un **itinéraire**. Le cercle ouvert en bas à gauche est le point de départ, la pastille turquoise en haut à droite est l'arrivée. On lit à la fois l'initiale de la marque et le métier : emmener quelque chose d'un point A à un point B, proprement.

| Fichier | Usage |
|---|---|
| `public/brand/samyo-logo.svg` | Version principale (bleu sur fond clair) |
| `public/brand/samyo-logo-blanc.svg` | Sur fond bleu marine, photo sombre, camion |
| `public/brand/samyo-symbole.svg` | Symbole seul (signature d'e-mail, tampon) |
| `public/brand/samyo-symbole-carre.svg` | Avatar réseaux sociaux, favicon, application |

- **Zone de protection :** laisser autour du logo une marge au moins égale à la hauteur du symbole divisée par deux.
- **Taille minimale :** 24 px de haut pour le logo complet. En dessous, utiliser le symbole seul.
- **À ne pas faire :** déformer le logo, changer la couleur de la pastille, l'ombrer, le poser sur un fond turquoise.
- **Camion :** logo blanc sur caisse bleu marine, ou logo bleu sur caisse blanche. Le symbole peut être agrandi sur les portes arrière.
- Le lettrage est vectorisé : les fichiers s'ouvrent dans Illustrator, Figma ou chez un imprimeur sans qu'il faille installer de police. Pour le régénérer : `python3 scripts/build-logo.py`.

## Couleurs

| Nom | Hex | Usage |
|---|---|---|
| Marine 900 | `#0B2545` | Sections sombres, pied de page, fond du symbole carré |
| **Marine 700** | `#17467F` | **Couleur principale** : logo, boutons, liens, états actifs |
| Marine 500 | `#2C67A8` | Icônes, focus |
| Marine 100 | `#D4E3F2` | Fonds d'information |
| **Lagon 400** | `#45C0B5` | **Accent** : pastille du logo, repères sur fond sombre |
| Lagon 600 | `#0D7570` | Accent lisible sur fond clair (numéros de section) |
| Lagon 100 | `#DDF3F0` | Badges légers |
| Ivoire | `#F5F4F0` | Fond de page |
| Papier | `#FBFBF9` | Cartes, formulaires |
| Encre | `#121922` | Texte principal |
| Pierre 600 | `#5F5C55` | Texte secondaire |

Règle de dosage : environ 70 % de neutres, 25 % de bleu, 5 % de turquoise. Le turquoise ne sert jamais de fond de bouton ni de couleur de texte courant.

Les couleurs fonctionnelles sont à part : **ambre** `#93560A` pour ce qui est à vérifier, **rouge** `#B42F2A` pour les erreurs.

## Typographies

- **Titres :** Newsreader (serif éditoriale, graisses 300 à 400). C'est elle qui donne au site un ton humain et posé.
- **Texte et interface :** Instrument Sans (400 à 600), avec des chiffres tabulaires pour les volumes et les montants.
- **Logo :** Instrument Sans Semibold, capitales espacées.

Les deux polices sont libres de droits (SIL Open Font License).

## Ton

Simple, précis, rassurant. On parle comme un conseiller au téléphone, pas comme une plaquette publicitaire.
À éviter : « révolutionnaire », « sans couture », « l'excellence au service de… », les superlatifs et les promesses chiffrées non vérifiées.

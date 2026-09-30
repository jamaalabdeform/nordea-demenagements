# Higgsfield — prompts de production des assets NORDÉA

> Statut : **non générés.** Higgsfield est bien connecté à la session de développement, mais le compte n'avait plus de crédits (solde : 0). Tous les emplacements sont prêts dans le site, avec des compositions de repli.
> Brancher un asset = déposer les fichiers dans `/public/media/` puis renseigner les chemins dans `src/config/media.ts`. Aucun autre fichier n'est à modifier.

## Règles communes (à coller en fin de chaque prompt)

```
Photographic, shot on 35mm film look, natural window light, soft shadows, shallow depth of field,
muted warm palette (ivory, stone grey, warm oak, deep green accents), French contemporary interior,
calm and methodical atmosphere, no text, no logos, no watermarks, no signage, no brand names,
no smiling at camera, no thumbs up, no uniforms with printed text, realistic hands with five fingers,
realistic proportions, no floating objects, no warped architecture.
```

**Négatif (si le modèle le permet) :**
`text, letters, logo, watermark, cartoon, 3d render, plastic skin, extra fingers, deformed hands, distorted faces, stock photo smile, orange, bright blue corporate, lens flare, oversaturated, HDR`

**Direction :** privilégier les **mains, silhouettes de dos, objets, plans larges**. Éviter les visages en gros plan : c'est ce qui trahit le plus vite l'IA.

**Contrôle qualité avant intégration :** doigts, texte parasite sur les cartons ou le camion, perspectives des fenêtres, sangles cohérentes, cartons pas trop parfaits. **Au moindre doute, on n'intègre pas.**

---

## ASSET 01 — Hero video

- **Emplacement :** `media.hero`, dans le cadre en arche du hero (portrait 4:5 sur desktop, 5:4 sur mobile)
- **Format :** 8 à 12 s en boucle, 1080×1350 (desktop) + 1080×1080 (mobile), sans son
- **Fichiers attendus :** `hero.webm` (VP9, ≤ 2,5 Mo), `hero.mp4` (H.264, ≤ 3 Mo), `hero-mobile.mp4` (≤ 1,5 Mo), `hero-poster.avif`

**Prompt (séquence de plans, image-to-video ou multi-shot) :**

```
Cinematic slow sequence inside a bright contemporary French apartment with tall windows, herringbone oak floor
and white walls, morning light. Shot 1: close-up of two hands wrapping a walnut sideboard in a thick grey moving
blanket, smoothing the fabric. Shot 2: hands closing a kraft cardboard box and running tape along the seam,
tape dispenser sound implied. Shot 3: medium shot from behind of a mover in a plain dark green work jacket
carrying a wrapped chair toward the door, unhurried. Shot 4: clean white moving truck interior, furniture neatly
strapped against the wall. Shot 5: arrival in an empty sunlit apartment, a box gently set down on the floor.
Very slow dolly and gentle handheld drift, 35mm, shallow depth of field, soft contrast, warm neutral grade.
```

**Poster (image fixe, même direction) :**

```
Still photograph, contemporary Lille apartment, tall window with thin mullions casting soft shadows on a
white wall, three kraft moving boxes stacked on an oak floor, a sideboard wrapped in a grey quilted moving
blanket, morning light, calm, editorial interior photography, 35mm, no people, no text.
```

## ASSET 02 — Transition « objets → volume → transport → nouveau logement »

- **Emplacement :** `media.volume` (réservé : section simulateur ou transition entre sections)
- **Format :** 6 s, 16:9 et 1:1, boucle parfaite, sans texte

```
Abstract minimal 3D motion, warm ivory background, soft studio light. Everyday objects (a chair, a lamp,
a stack of books, a vase) rendered in matte stone-grey clay material slowly fold and pack themselves into
simple kraft cubes; the cubes glide and stack neatly into a translucent rectangular volume shaped like a
truck cargo box; the volume slides gently to the right and dissolves into a sunlit empty room outline.
Slow ease-in-out, elegant, architectural, no text, no logos, muted palette with one terracotta accent.
```

## ASSET 03 — Camion dans une rue du Nord

- **Emplacement :** `media.truck` (galerie « Charger »)
- **Format :** image 4:3 + vidéo 6 s optionnelle

```
Wide cinematic shot of a clean, plain white moving truck (no logo, no lettering, no graphics) parked along
a quiet residential street in Lille, France: red-brick Flemish terraced houses with white window frames,
cobblestone details, overcast soft daylight, a few potted plants by doorsteps. Rear door open, a ramp down,
a mover seen from behind carrying a wrapped piece of furniture. Realistic scale, straight verticals,
35mm, muted colors.
```

> Le branding NORDÉA sur le camion sera ajouté **en compositing** (calque web ou retouche), jamais généré par l'IA.

## ASSET 04 — Protection des biens (macro)

- **Emplacement :** `media.protection` (section confiance + galerie « Protéger »)
- **Format :** image 4:5 et 16:10 ; vidéo macro 5 s optionnelle

```
Macro close-up photograph: a dresser wrapped in a thick grey-blue quilted moving blanket, secured with a
black ratchet strap and metal buckle, hands tightening the strap, visible fabric texture and stitching,
soft side light, shallow depth of field, calm and careful mood, 50mm macro, no text.
```

**Variante ASSET 04b — Préparer (`media.carry`) :**

```
Top-down close-up of hands sealing a kraft cardboard box with brown tape, a black marker lying next to it,
wooden floor, soft daylight, realistic hands, natural imperfections on the cardboard, no writing on the box.
```

## ASSET 05 — Nouveau départ

- **Emplacement :** `media.arrival` (galerie « Arriver » + fond du CTA final, en luminosité réduite)
- **Format :** image 16:9 et 4:5 ; vidéo 8 s optionnelle (lumière qui avance lentement sur le sol)

```
Empty bright apartment at sunrise, large windows, sheer curtains moving slightly, long warm light rays across
a pale oak floor, two moving boxes waiting near the wall, a single plant, a sense of relief and new beginning,
serene, minimal, editorial architecture photography, 24mm, no people, no text.
```

---

## Spécifications d'export

| Usage | Codec | Débit cible | Poids max |
|---|---|---|---|
| Desktop WebM | VP9, CRF 34, 24 fps | ~2 Mb/s | 2,5 Mo |
| Desktop MP4 | H.264 High, CRF 26, `+faststart` | ~2,5 Mb/s | 3 Mo |
| Mobile MP4 | H.264 Main, 720p | ~1,2 Mb/s | 1,5 Mo |
| Poster | AVIF qualité 55 (ou JPG 78) | — | 180 Ko |

```bash
ffmpeg -i hero.mov -an -vf "scale=1080:-2,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 hero.webm
ffmpeg -i hero.mov -an -vf "scale=1080:-2,fps=24" -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4
ffmpeg -i hero.mov -an -vf "scale=720:-2,fps=24" -c:v libx264 -profile:v main -crf 28 -movflags +faststart hero-mobile.mp4
```

Le composant `<MediaSlot>` charge la vidéo uniquement à l'approche de l'écran, la met en pause hors écran, sert la version mobile sous 768 px et ne lit jamais la vidéo si « réduire les animations » est activé.

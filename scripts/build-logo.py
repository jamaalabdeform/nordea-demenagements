"""
Génère les fichiers du logo SAMYO (lettrage vectorisé, sans dépendance de police).
Usage : pip install fonttools brotli && python3 scripts/build-logo.py
Sorties : public/brand/*.svg, src/app/icon.svg, src/components/logo-paths.ts
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "src/fonts/instrument-sans-latin-wght-normal.woff2"

MARINE = "#17467F"
LAGON = "#45C0B5"
WHITE = "#FFFFFF"


def text_path(text: str, wght: int, size: float, tracking: float, x0=0.0, baseline=0.0):
    font = TTFont(FONT)
    inst = instantiateVariableFont(font, {"wght": wght}, inplace=False)
    gs = inst.getGlyphSet()
    cmap = inst.getBestCmap()
    upm = inst["head"].unitsPerEm
    scale = size / upm
    pen = SVGPathPen(gs)
    x = x0
    hmtx = inst["hmtx"]
    for i, ch in enumerate(text):
        name = cmap[ord(ch)]
        adv = hmtx[name][0]
        tp = TransformPen(pen, (scale, 0, 0, -scale, x, baseline))
        gs[name].draw(tp)
        x += adv * scale
        if i < len(text) - 1:
            x += tracking * size
    return pen.getCommands(), x


# ── Symbole : un « S » dessiné comme un trajet. Départ en bas à gauche
#    (cercle ouvert), arrivée en haut à droite (pastille turquoise). 40 × 40.
def symbol(stroke=MARINE, accent=LAGON, origin_fill="none"):
    return f'''<path d="M13.4 29.5H24a4.75 4.75 0 0 0 0-9.5h-8a4.75 4.75 0 0 1 0-9.5h10.4" fill="none" stroke="{stroke}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="9.6" cy="29.5" r="2.35" fill="{origin_fill}" stroke="{stroke}" stroke-width="2"/>
<circle cx="30.6" cy="10.5" r="3.1" fill="{accent}"/>'''


word_d, word_w = text_path("SAMYO", 620, 26, 0.1, x0=52, baseline=26)
desc_d, desc_w = text_path("DÉMÉNAGEMENT & TRANSPORT", 560, 7.6, 0.16, x0=52.6, baseline=37.8)
width = max(word_w, desc_w) + 2


def logo(fg, accent, sym_stroke=None):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} 40" role="img" aria-label="SAMYO Déménagement &amp; Transport">
<g transform="translate(0 0)">{symbol(sym_stroke or fg, accent)}</g>
<path d="{word_d}" fill="{fg}"/>
<path d="{desc_d}" fill="{fg}" fill-opacity="0.72"/>
</svg>
'''


out = ROOT / "public/brand"
out.mkdir(parents=True, exist_ok=True)
(out / "samyo-logo.svg").write_text(logo(MARINE, LAGON))
(out / "samyo-logo-blanc.svg").write_text(logo(WHITE, LAGON))
(out / "samyo-symbole.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="SAMYO">{symbol()}</svg>\n')
square = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#0B2545"/>{symbol(WHITE, LAGON)}</svg>
'''
(out / "samyo-symbole-carre.svg").write_text(square)
(ROOT / "src/app/icon.svg").write_text(square)

ts = f'''// Fichier généré par scripts/build-logo.py — ne pas modifier à la main.
export const LOGO_WIDTH = {width:.1f};
export const WORDMARK_WIDTH = {word_w + 1:.1f};
export const WORDMARK_PATH = "{word_d}";
export const DESCRIPTOR_PATH = "{desc_d}";
'''
(ROOT / "src/components/logo-paths.ts").write_text(ts)
print("ok", round(width, 1))

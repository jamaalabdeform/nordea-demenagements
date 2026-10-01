"""
Applique le logo SAMYO en perspective sur le flanc du fourgon.
Entrées : creative/van/van-detoure.png (fourgon détouré, 1133 × 655)
          creative/van/logo-flanc.png  (logo bleu sur fond transparent)
Sortie  : public/media/samyo-van-logo.webp
Usage   : python3 scripts/build-van.py
Pour recaler le logo, ajuster QUAD (coins dans l'image du fourgon,
dans l'ordre haut-gauche, haut-droit, bas-droit, bas-gauche).
"""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
VAN = ROOT / "creative/van/van-detoure.png"
LOGO = ROOT / "creative/van/logo-flanc.png"
OUT = ROOT / "public/media/samyo-van-logo.webp"

# Zone vitrée/panneau gris du flanc (vue de trois quarts : le bord droit fuit)
QUAD = [(676, 136), (1080, 152), (1080, 232), (676, 246)]


def solve(a, b):
    """Résout un système linéaire 8×8 (élimination de Gauss)."""
    n = len(b)
    m = [row[:] + [b[i]] for i, row in enumerate(a)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(m[r][c]))
        m[c], m[p] = m[p], m[c]
        for r in range(n):
            if r != c:
                f = m[r][c] / m[c][c]
                m[r] = [x - f * y for x, y in zip(m[r], m[c])]
    return [m[i][n] / m[i][i] for i in range(n)]


def perspective_coeffs(dst, src):
    """Coefficients PIL : point de sortie (dst) -> point d'entrée (src)."""
    a, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return solve(a, b)


van = Image.open(VAN).convert("RGBA")
logo = Image.open(LOGO).convert("RGBA")
lw, lh = logo.size
coeffs = perspective_coeffs(QUAD, [(0, 0), (lw, 0), (lw, lh), (0, lh)])
warped = logo.transform(van.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)

# Fusion « produit » : le marquage prend les ombres et reflets de la carrosserie
base = van.convert("RGB")
ink = Image.new("RGB", van.size, (255, 255, 255))
ink.paste(warped.convert("RGB"), mask=warped.split()[3])
multiplied = ImageChops.multiply(base, ink)
alpha = warped.split()[3].point(lambda v: int(v * 0.96))
base.paste(multiplied, mask=alpha)

result = base.convert("RGBA")
result.putalpha(van.split()[3])
result.save(OUT, "WEBP", quality=90, method=6)
print("ok", OUT.relative_to(ROOT))

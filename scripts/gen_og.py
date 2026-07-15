#!/usr/bin/env python3
import base64
import pathlib
import subprocess
import urllib.request
from xml.sax.saxutils import escape

WORDMARK = "rmux"
ACCENT = "_"
SUBTITLE = "Linux kernel developer"
TAGLINE = "Strawberry, my PS4 kernel"
SUBLINE = "PS4 & pipa Linux kernels · PS5 Linux work"
HANDLE = "github.com/rmuxnet"
DEVICES = "PS4 · PS5 · pipa"
AVATAR_URL = "https://avatars.githubusercontent.com/u/116457149?s=400&v=4"
FONT = "JetBrainsMono Nerd Font Mono"

REPO = pathlib.Path(__file__).resolve().parent.parent
AVATAR_CACHE = REPO / "scripts" / ".avatar-cache"


def load_avatar_b64():
    try:
        data = urllib.request.urlopen(AVATAR_URL, timeout=15).read()
        AVATAR_CACHE.write_bytes(data)
    except Exception:
        if not AVATAR_CACHE.exists():
            raise
        data = AVATAR_CACHE.read_bytes()
    return base64.b64encode(data).decode()


def constellation():
    pts = [(70, 90, 2, .22), (240, 60, 1.5, .18), (430, 110, 2.5, .16),
           (690, 70, 2, .28), (900, 120, 1.5, .20), (1080, 70, 3, .26),
           (1150, 240, 2, .18), (120, 300, 1.5, .16), (60, 470, 2.5, .22),
           (300, 520, 2, .15), (520, 470, 1.5, .18), (760, 540, 2, .16),
           (980, 470, 2.5, .20), (1140, 520, 2, .18), (1170, 380, 1.5, .14),
           (420, 300, 1.5, .12), (840, 300, 2, .14), (980, 250, 1.5, .16)]
    return "\n  ".join(
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="#e8547a" opacity="{o}"/>'
        for x, y, r, o in pts)


def build_svg():
    avatar = load_avatar_b64()
    wm, ac = escape(WORDMARK), escape(ACCENT)
    sub, subl = escape(SUBTITLE), escape(SUBLINE)
    handle, devices = escape(HANDLE), escape(DEVICES)
    tail = escape(TAGLINE.split("Strawberry", 1)[1])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow1" cx="92%" cy="12%" r="60%">
      <stop offset="0%" stop-color="#e8547a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#e8547a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="8%" cy="95%" r="55%">
      <stop offset="0%" stop-color="#e8547a" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#e8547a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8547a" stop-opacity="0.0"/>
      <stop offset="50%" stop-color="#e8547a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ff7da0" stop-opacity="0.9"/>
    </linearGradient>
    <clipPath id="avclip"><rect x="92" y="150" width="180" height="180" rx="28"/></clipPath>
  </defs>

  <rect width="1200" height="630" fill="#000000"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  {constellation()}

  <rect x="22" y="22" width="1156" height="586" rx="22" fill="none" stroke="#1c1c1c" stroke-width="2"/>

  <image x="92" y="150" width="180" height="180" clip-path="url(#avclip)"
         xlink:href="data:image/png;base64,{avatar}"/>
  <rect x="92" y="150" width="180" height="180" rx="28" fill="none"
        stroke="#e8547a" stroke-opacity="0.55" stroke-width="2"/>

  <text x="304" y="240" font-family="{FONT}" font-weight="800" font-size="96"
        letter-spacing="-3" fill="#ffffff">{wm}<tspan fill="#e8547a">{ac}</tspan></text>
  <rect x="306" y="262" width="110" height="6" rx="3" fill="#e8547a"/>

  <text x="306" y="318" font-family="{FONT}" font-weight="500" font-size="30"
        fill="#e8547a" opacity="0.92">{sub}</text>

  <text x="94" y="436" font-family="{FONT}" font-weight="600" font-size="30" fill="#cccccc">
    <tspan fill="#e8547a">●  </tspan><tspan fill="#e8547a" font-weight="700">Strawberry</tspan>{tail}
  </text>
  <text x="94" y="482" font-family="{FONT}" font-weight="400" font-size="25" fill="#7a7a7a">
    {subl}
  </text>

  <text x="94" y="566" font-family="{FONT}" font-weight="700" font-size="27"
        fill="#e8547a">{handle}</text>
  <text x="1108" y="566" font-family="{FONT}" font-weight="400" font-size="23"
        fill="#666666" text-anchor="end">{devices}</text>

  <rect x="22" y="600" width="1156" height="6" rx="3" fill="url(#bar)"/>
</svg>'''
    return svg


def main():
    svg_path = REPO / "scripts" / "og.svg"
    png_path = REPO / "og.png"
    svg_path.write_text(build_svg())
    subprocess.run(
        ["rsvg-convert", "-w", "1200", "-h", "630", str(svg_path), "-o", str(png_path)],
        check=True,
    )
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

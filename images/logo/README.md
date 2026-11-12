# MoveWell logo — PNG files

All files have a **transparent background** except the social card, and all were
rendered from the same source shape used in the site header, so they match the live
design exactly.

---

## Pick the one you need

| File | Size | Use it for |
|---|---|---|
| **`logo-full-2400.png`** | 2400 × 522 | print, large banners, high-res everything |
| **`logo-full.png`** | 1200 × 261 | **the default** — website header, documents |
| `logo-full-800.png` | 800 × 174 | email signatures, slide decks |
| `logo-full-400.png` | 400 × 87 | small headers, tight spaces |
| `logo-full-white.png` | 1200 × 261 | dark backgrounds (white text) |
| `logo-full-white-2400/800/400.png` | same scale | dark backgrounds, other sizes |

## Icon only (no text) — square, rounded corners

| File | Size | Use it for |
|---|---|---|
| **`logo-icon.png`** | 1024 × 1024 | app icon, social profile picture, master copy |
| `logo-icon-512.png` | 512 × 512 | Android / PWA |
| `logo-icon-256.png` | 256 × 256 | Windows tile, general use |
| `logo-icon-180.png` | 180 × 180 | Apple touch icon |
| `logo-icon-128.png` | 128 × 128 | Chrome extension, small avatar |
| `logo-icon-64.png` | 64 × 64 | small avatar, list icon |
| `logo-icon-48.png` | 48 × 48 | browser tab (hi-dpi) |
| `logo-icon-32.png` | 32 × 32 | browser favicon |
| `logo-icon-16.png` | 16 × 16 | browser favicon (legacy) |

`logo-icon-light-*` are the inverted version — lime square, dark leaf — for dark
backgrounds and places that need more punch.

`favicon-32.png` and `favicon-16.png` are copies of the 32 and 16 px icons, named for
convenience.

## Two wordmark styles

The logo comes in two versions because the site uses the uppercase one and you may
prefer the other:

- **`logo-full*.png`** — `MOVEWELL` in capitals (what the website shows)
  1200 / 800 / 400 px wide, plus a 2400 px master
- **`logo-full-mixedcase*.png`** — `MoveWell` in mixed case
  1200 / 800 / 400 px wide

Both come in dark-text (for light backgrounds) and white (for dark backgrounds).

## Social sharing

`logo-og-1200x630.png` is a ready-made Open Graph card: the logo on the dark green
brand background with the tagline. This is the right size for link previews on
Facebook, LinkedIn, X, WhatsApp and Slack.

To use it, change the `og:image` tag in your pages from a photo to:

```html
<meta property="og:image" content="https://yourdomain.com/images/logo/logo-og-1200x630.png">
```

---

## Notes

- **Colours:** background `#17352a` (forest), glyph `#c9f24d` (volt green).
- **Typeface:** the wordmark uses the system sans stack
  (`-apple-system, Segoe UI, Roboto, Helvetica Neue, Arial`), the same as the site.
  It was rendered on a Mac-like environment, so it appears as SF Pro / Helvetica.
  If you need the exact same letterforms everywhere, use the SVG logo instead —
  `static/favicon.svg` for the mark, or ask for a vector version of the lockup.
- **Transparency:** the corner rounding on the icon is real transparency, not white,
  so it drops onto any background cleanly.
- **Changing the name:** these are flat PNGs. If the brand name changes, the files
  have to be regenerated — edit `qa-html/logo-src.html` and re-run
  `qa-html/render_logo.py`.

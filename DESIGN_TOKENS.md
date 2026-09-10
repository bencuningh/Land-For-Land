# Design tokens — sampled from land-for-land.com/careers

Source: a screenshot of the live careers page, plus a devtools Sources-panel
screenshot confirming the actual font requests (direct network access to
land-for-land.com was blocked by this session's egress policy, so colors are
visually sampled/eyedropped — treat hex values as close approximations — but
the two typefaces below are now confirmed, not guessed).

## Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F2F1EB` | Page background — warm, very light stone/cream, not pure white |
| `--ink` | `#362B1E` | Primary text — dark olive-brown/charcoal (headings, wordmark, values) |
| `--ink-muted` | `#726C5E` | Secondary text — muted taupe-gray (body copy, eyebrow labels, field labels) |
| `--hairline` | `#DAD7CC` | 1px rule color — light warm gray, barely-there |
| `--accent` | `#A8471F` | Single warm clay/rust accent — used sparingly (interactive controls, the one link/CTA). Not present in the sampled crop itself; the page reads almost monochrome, so this accent must stay restrained — never a full block of color, just a control, an underline, a small mark. |

The page itself is nearly monochrome (cream + olive-brown + muted gray). The
brief's accent is intentionally minimal — one warm clay tone, reserved for
things you click.

## Type — a three-font system, not one

1. **Wordmark serif** — "LAND FOR LAND" logo only. A classic, moderate-contrast
   serif, tracked out, all caps. Not used anywhere else on the page.
   Fallback stack: `"Georgia", "Iowan Old Style", "Times New Roman", serif`
   (a proper licensed match like Canela/Freight isn't available via
   Google Fonts CDN, so a Google Fonts serif — **Cormorant** or **Fraunces**
   at a heavier weight — is the practical substitute for this build).

2. **Monospace display/label** — eyebrows ("CAREERS – POSITION 01"), the big
   H1 ("GENERAL MANAGER OPERATING COFOUNDER"), and small field labels
   ("ROLE / LOCATION / START / FORMAT"). Wide, even letterforms, heavily
   tracked out, uppercase. This is the page's real signature — not a generic
   geometric sans.
   **Confirmed via devtools network request: Space Mono** (bold for the H1,
   regular for eyebrows/labels), loaded from fonts.googleapis.com /
   fonts.gstatic.com.

3. **Humanist sans** — body paragraphs and data values ("Late Founder",
   "ASAP", etc). Regular weight, sentence case, comfortable line-height,
   muted-gray color, no tracking.
   **Confirmed via devtools network request: DM Sans** (not Inter — corrected
   after seeing the actual font file request, `dmsans/v17`).

## Letter-spacing

- Eyebrows / field labels: wide tracking, ~`0.18em`, uppercase.
- H1 (mono, bold, uppercase): moderate tracking, ~`0.06em` — wide enough to
  breathe at large size, not so wide it fights the monospace rhythm.
- Wordmark: ~`0.08em`.
- Body copy: default (`normal`), sentence case, no transform.

## Rhythm

- Hairline rules: `1px solid var(--hairline)`, full content width, generous
  space above/below (roughly 64–96px depending on section weight).
- Generous whitespace throughout; content sits in a constrained column
  (~1100–1200px max-width) with wide side margins even on desktop.
- Header: wordmark left, EN/FR language switch right, hairline directly
  below, full-bleed.

## Carried into the microsite

- Background/ink/muted/hairline/accent tokens above, as CSS custom
  properties in `css/tokens.css`.
- Space Mono for eyebrows, chapter headings, nav/UI labels, and the numbered
  plan view.
- DM Sans for all narrative body copy.
- Fraunces (serif) reserved for one or two brand moments (e.g. the opening
  "Let me tell you..." and "I want to be part of your team." lines) to echo
  the wordmark without overusing it.
- Accent color used only for: the play/arrow controls, focus states, and the
  "See my plan" link — never as a background fill.

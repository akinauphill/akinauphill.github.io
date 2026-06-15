# akinauphill.github.io

Personal portfolio for **akinauphill** — a 22-year-old self-taught developer and
founder & co-owner of [KyotoServices](https://github.com/KyotoServices).

Built from the *akinauphill Design System*: an early-2000s neon-terminal aesthetic
rendered clean and modern — near-monochrome ink, a single neon-purple accent,
Space Grotesk + Space Mono, and a subtle CRT atmosphere.

## Structure

Static site, no build step — just open `index.html` (or serve the folder).

- `index.html` — markup for both surfaces: a long-scroll homepage (hero · stats ·
  about · stack · currently-building · contact) and a filterable projects page.
- `style.css` — the full design system: tokens (colors, type, spacing, effects),
  component classes, and the portfolio layout. Light/dark via `[data-theme]`.
- `script.js` — view switching (home ↔ projects), theme toggle, skill chips,
  project cards, category filtering, and the contact form.

## Features

- Dark / light theme toggle ("daylight terminal" light mode).
- Two views with a sticky nav and animated underlines.
- CRT atmosphere — dot-grid, scanlines and a drifting neon bloom (respects
  `prefers-reduced-motion`).
- Filterable projects (All / Minecraft / Web / Android) with a flagship panel.

Fonts load from the Google Fonts CDN (Space Grotesk, Space Mono).

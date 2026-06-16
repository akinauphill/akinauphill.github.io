# akinauphill.github.io

Personal portfolio for **akinauphill** — a 22-year-old self-taught developer and
founder & co-owner of [KyotoServices](https://github.com/KyotoServices).

Built from the *akinauphill Design System*: an early-2000s neon-terminal aesthetic
rendered clean and modern — near-monochrome ink, a single neon-purple accent,
Space Grotesk + Space Mono, and a subtle CRT atmosphere.

## Structure

Static site, no build step — just open `index.html` (or serve the folder).

- `index.html` — markup for both surfaces: a long-scroll homepage (hero · stats ·
  about · stack · currently-building · contact) and a projects page (grouped repos
  + gists).
- `style.css` — the full design system: tokens (colors, type, spacing, effects),
  component classes, the portfolio layout, and the switchable background FX.
  Light/dark via `[data-theme]`.
- `script.js` — view switching (home ↔ projects), theme toggle, skill chips,
  hybrid project/gist data (snapshot + live GitHub API), source filtering, and
  the background-FX switcher.

## Features

- Dark / light theme toggle ("daylight terminal" light mode).
- Two views with a sticky nav and animated underlines.
- **Matrix digital rain** — an ambient neon glyph-rain canvas behind the
  content: bright leading heads, fading trails, varied column speeds, and subtle
  cursor reactivity. Masked so the centre stays readable. Respects
  `prefers-reduced-motion` (renders a single static frame), pauses when the tab
  is hidden, and can be turned off with `?fx=off`.
- **Live GitHub data (hybrid)** — public repos and gists render instantly from a
  baked-in snapshot, then refresh from `api.github.com` (auto-tracks new repos).
  Public repos & forks link straight to the source; curated KyotoServices work
  stays private (shown, labeled, never linked). Cards show a language dot, stars,
  and last-updated time.
- Source-filtered projects (All / KyotoServices / Open source / Forks / Gists)
  with a flagship panel and a dedicated gists section.

Fonts load from the Google Fonts CDN (Space Grotesk, Space Mono).

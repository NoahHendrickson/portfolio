# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run typecheck` — `tsc -b` (strict, with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`)
- `npm run lint` — ESLint across the repo
- `npm run preview` — preview the production build

There is no test runner configured.

## Architecture

Single-page React 19 + Vite 8 portfolio. There is **no router library** — `src/App.tsx` reads `window.location.hash`, listens for `hashchange`, and switches the rendered tree. Internal links use hrefs like `#/work/invisible`. When adding a new route, extend the conditional in `App.tsx` and link to `#/your-route`.

Layout in `App.tsx` is a 60/40 split: left column (cream background) holds `Header` / `Hero` / `BottomNav` and content, right column hosts `ShaderEffect` (a WebGL animated gradient via the `shaders` package — `FlowingGradient` + `Dither`) with `InfoList` chips absolutely positioned over it. `About` is rendered below the viewport split for scroll.

`WorkPage.tsx` (the `#/work/...` route) is gated by a hardcoded password (`WORK_PASSWORD` constant) persisted in `sessionStorage` under `work-pages-unlocked`. This is a soft client-side gate — anything served to `/work/*` assets is still public, so don't put truly private material in `public/work/`.

## Styling conventions

- Tailwind v4 is wired via `@tailwindcss/vite` and imported in `src/index.css`, but **most components use inline `style={{ ... }}` objects, not Tailwind classes**. Match the surrounding file's style when editing — don't refactor inline styles to Tailwind unless asked.
- Color tokens live in two places that must stay in sync:
  - CSS vars in `src/index.css`: `--color-bg-primary` (#0f0e0e), `--color-text-primary` (#ecede6), `--color-orange` (#f95b1c).
  - Per-file constants near the top of components (`CREAM_BG = '#f5efe0'`, `TEXT_DARK = '#0f0e0e'`, `ORANGE = 'var(--color-orange)'`). New components should follow the same pattern.
- Font is `Geist Variable` from `@fontsource-variable/geist`, set globally on `body`.
- UI primitives come from the local-author package `@noey-17/yearn-ui` (e.g. `Button`); its stylesheet is imported once in `App.tsx` via `import '@noey-17/yearn-ui/style.css'`. Icons come from `@untitledui/icons` with per-icon imports (`@untitledui/icons/ArrowDown`).

## Assets

Images referenced as absolute paths (`/profile.jpg`, `/work/signup.png`) live in `public/`. URL-encode spaces in filenames when referencing them in JSX (`/work/ONB%20steps.png`).

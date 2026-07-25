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

Routes:

| Route | Renders |
|---|---|
| `#/` | Me tab — `Hero` plus `About` below the fold |
| `#/work` | Work tab — `WorkBento`, the project grid |
| `#/work/<slug>` | `ProjectStory` if `projects[slug].landing` is set, otherwise `ProjectLanding` (`src/data/projects.ts`) |
| `#/work/invisible` | `WorkPage` (the password-gated case study; checked before the slug lookup) |

Layout in `App.tsx` is a two-column split whose ratio is driven by the tab: the cream content column is 58.3% on Me and 84.7% on Work (`CONTENT_WIDTH`), animating between them, and the right column hosts `ShaderPanel` — `ShaderEffect` (a WebGL animated gradient via the `shaders` package — `FlowingGradient` + `Dither`) with the headline overlaid. Both column widths and the bento's ratios (673.84:514.49 columns, 343:294.2 rows) come from the July 2026 Figma file.

`Header` is the shared chrome on every page: the `TabBar` (Me / Work, orange underline on the active tab) with `ContactMenu` pinned right, and the profile row below. Pages that already pad themselves pass `barInset="0" contentInset="0"`; `showProfile={false}` drops the profile row.

Project pages come in two layouts. `ProjectLanding.tsx` is the generic one — stats row, `label`-railed sections, stack and status grids. `ProjectStory.tsx` is the screenshot-led one from the July 2026 Figma file: a title block beside the app, story sections whose media is a Chrome-framed screenshot (`BrowserFrame`, with `/work/browser-bar.png` as the chrome and the shot top-pinned and clipped to the frame's aspect), a wrapped wall of chat screenshots, and a closing orange card. A project opts into it by setting `landing` in `projects.ts`; the two feature screenshots overlap on a 1073×509 grid whose offsets are percentages, so the composition scales.

`WorkPage.tsx` (`#/work/invisible`) is gated by a hardcoded password (`WORK_PASSWORD` constant) persisted in `sessionStorage` under `work-pages-unlocked`. This is a soft client-side gate — anything served to `/work/*` assets is still public, so don't put truly private material in `public/work/`.

Project copy lives in `src/data/projects.ts`, not in components — `WorkBento`, `ProjectLanding` and `ProjectStory` all read from it, so adding a project is a data-only change plus one bento slot. The bento runs its own shorter copy and card screenshot off each project's `bento` field, separate from the landing page's `eyebrow` / `tagline`.

`WorkBento` cards come in three variants keyed to their slot: `wide` (text beside a screenshot that bleeds off the card's right edge), `compact` (screenshot over eyebrow + title, no tagline), and `tall`. Mobile drops the grid and renders every card as `compact`.

## Styling conventions

- Tailwind v4 is wired via `@tailwindcss/vite` and imported in `src/index.css`, but **most components use inline `style={{ ... }}` objects, not Tailwind classes**. Match the surrounding file's style when editing — don't refactor inline styles to Tailwind unless asked.
- Color tokens live in two places that must stay in sync:
  - CSS vars in `src/index.css`: `--color-bg-primary` (#0f0e0e), `--color-text-primary` (#ecede6), `--color-orange` (#f95b1c).
  - Per-file constants near the top of components (`CREAM_BG = '#f5efe0'`, `TEXT_DARK = '#0f0e0e'`, `ORANGE = 'var(--color-orange)'`). New components should follow the same pattern.
- Font is `Geist Variable` from `@fontsource-variable/geist`, set globally on `body`.
- UI primitives come from the local-author package `@noey-17/yearn-ui` (e.g. `Button`); its stylesheet is imported once in `App.tsx` via `import '@noey-17/yearn-ui/style.css'`. Icons come from `@untitledui/icons` with per-icon imports (`@untitledui/icons/ArrowDown`).

## Assets

Images referenced as absolute paths (`/profile.jpg`, `/work/signup.png`) live in `public/`. URL-encode spaces in filenames when referencing them in JSX (`/work/ONB%20steps.png`).

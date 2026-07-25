# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run typecheck` — `tsc -b` (strict, with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`)
- `npm run lint` — ESLint across the repo
- `npm run preview` — preview the production build
- `npm run storybook` — Storybook on :6006, documenting the design system
- `npm run build-storybook` — static Storybook to `storybook-static/`

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
- **Design tokens are the single source of truth**, declared as CSS vars in `src/index.css` and mirrored by the Figma "Mini Design System" page (file `5mDT1eQf2KBcET9dh6kPXd`, node `25:800`). Change one, change the other.
  - Colors: surfaces (`--color-bg-primary`, `-raised`, `-inverse`, `-cream`), text on the dark shell (`--color-text-primary`, `-secondary`, `-muted`, `-inverse`), ink on the cream column (`--color-ink`, `-secondary`, `-muted`), borders (`--color-border-subtle`, `-default`, `-ink`), accent (`--color-orange`, `-hover`, `--color-on-accent`).
  - Spacing: `--space-xs` (4) through `--space-5xl` (80). Radius: `--radius-sm` (6) through `--radius-4xl` (56), plus `--radius-full` for pills. Control heights: `--control-xs` (28), `--control-sm` (32), `--control-md` (36), `--control-lg` (40).
  - Per-file constants stay as the naming pattern, but they now point at vars (`const CREAM_BG = 'var(--color-bg-cream)'`), so no component re-declares a hex. New components should follow the same pattern.
  - `src/design-system/tokens.ts` exports the same tokens as typed objects for inline styles, plus the `type` ramp.
- Reach for a token rather than a raw px value for radii and gaps. The known exceptions are the 9px inner radius in `ProjectStory`'s `BrowserFrame` (an optical inset against its 8px outer frame), `borderRadius: '50%'` for true circles, and page-level gutters, which are layout rather than component spacing.
- Font is `Geist Variable` from `@fontsource-variable/geist`, set globally on `body`. The ramp lives in `tokens.ts` as `type['display-xl' | 'heading-l' | 'body-l' | 'label-m' | 'eyebrow' | ...]`.
- UI primitives come from the local-author package `@noey-17/yearn-ui` (e.g. `Button`); its stylesheet is imported once in `App.tsx` via `import '@noey-17/yearn-ui/style.css'`. Icons come from `@untitledui/icons` with per-icon imports (`@untitledui/icons/ArrowDown`).

## Design system

`src/design-system/` holds the code half of the system: `tokens.ts` (colors, spacing, radius, control heights, type ramp), `icons.ts` (the 17 Phosphor icons that exist as Figma components), `buttonStyles.ts` (the palette/state matrix shared by both buttons), `Button.tsx` and `IconButton.tsx`, and the `*.stories.tsx` files that document them. `docs.tsx` is story-only chrome and is not shipped in the app.

`IconButton` is a **separate component**, not a variant of `Button` — folding it in would have doubled the set to 54 variants and allowed the invalid icon-only-plus-label combination. It is circular (width locked to the control height), takes a required `label` prop that renders as `aria-label`, and shares `Button`'s palette through `buttonStyles.ts`, so the two cannot drift. Figma mirrors this with a separate `Icon Button` component set.

`Button.tsx` is the system's button and is what Storybook documents. It is sized by **fixed height** (`--control-xs/sm/md/lg` = 28/32/36/40) rather than vertical padding, so a row of buttons lines up regardless of label or icon; only the horizontal padding varies by size. Each size pairs a label style and an icon size in `SIZES` / `ICON_SIZE` — `xs` drops to a 12px label and a 14px icon so the icon stays in proportion. The live `ContactMenu` still uses `@noey-17/yearn-ui`'s `Button` — the two have not been reconciled, so don't assume changing one changes the other.

Icons are Phosphor at **duotone** weight. The weight is set once via `IconContext` in `src/main.tsx` (and in `.storybook/preview.tsx`) from `ICON_DEFAULTS` in `design-system/icons.ts` — don't pass `weight` at call sites. Each duotone icon is a 20%-opacity tint path behind a solid main path; the Figma `Icon / *` components mirror this with `Tint` and `Main` layers. A few app components still use `@untitledui/icons` (`ArrowDown`, `ArrowUpRight`, `Copy03`, …), which are not part of the system and are unaffected by the Phosphor context.

Storybook config is in `.storybook/`. `main.ts` strips the `figma-capture-dev-only` Vite plugin, which is for the app's `/send-to-figma` flow and has no business in Storybook.

## Assets

Images referenced as absolute paths (`/profile.jpg`, `/work/signup.png`) live in `public/`. URL-encode spaces in filenames when referencing them in JSX (`/work/ONB%20steps.png`).

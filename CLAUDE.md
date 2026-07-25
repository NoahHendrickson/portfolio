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
| `#/` | Me tab — `Hero`, then `Experience` and `LlmWall` below the fold |
| `#/work` | Design tab — `WorkList`, the filtered project list |
| `#/work/<slug>` | `ProjectStory` if `projects[slug].landing` is set, otherwise `ProjectLanding` (`src/data/projects.ts`) |
| `#/work/invisible` | `WorkPage` (the password-gated case study; checked before the slug lookup) |

The two tabs come from the **"R2 Dark" section** of the July 2026 Figma file (`5mDT1eQf2KBcET9dh6kPXd`, node `49:10903`), which turned the whole shell dark and replaced the Work bento with a list. The project pages below `#/work/<slug>` were **not** part of that section and are still on the older cream design.

`App.tsx` is one normally-scrolling dark page, not a fixed 100vh split. `ShaderPanel` — `ShaderEffect` (a WebGL animated gradient via the `shaders` package — `FlowingGradient` + `Dither`) with the headline overlaid — is absolutely positioned one viewport tall in the top-right corner and the page scrolls past it. The content column is 58.3vw on Me and 87.3vw on Design (`CONTENT_PCT`), animating between them; the shader is anchored at `left: 58.3vw; right: 0`, so widening the column slides it under the panel rather than squishing it. Both widths come from the Figma frames (881 and 1320 of 1512).

`Header` is the shared chrome on every page: the `TabBar` (Me / Design, orange underline on the active tab) with `ContactMenu` pinned right, and the profile row below. Pages that already pad themselves pass `barInset="0" contentInset="0"`; `showProfile={false}` drops the profile row, which is what the Design tab does. The **second tab is labelled "Design" but still routes to `#/work`**, so existing links keep resolving.

One deliberate divergence from the file: the Figma frames centre the tab bar in the content column on both tabs, which would slide it right by 14.5vw when the column widens. `TAB_SHIFT` in `App.tsx` cancels that out so the tabs hold still through the transition.

Project pages come in two layouts. `ProjectLanding.tsx` is the generic one — stats row, `label`-railed sections, stack and status grids. `ProjectStory.tsx` is the screenshot-led one from the July 2026 Figma file: a title block beside the app, story sections whose media is a Chrome-framed screenshot (`BrowserFrame`, with `/work/browser-bar.png` as the chrome and the shot top-pinned and clipped to the frame's aspect), a wrapped wall of chat screenshots, and a closing orange card. A project opts into it by setting `landing` in `projects.ts`; the two feature screenshots overlap on a 1073×509 grid whose offsets are percentages, so the composition scales.

`WorkPage.tsx` (`#/work/invisible`) is gated by a hardcoded password (`WORK_PASSWORD` constant) persisted in `sessionStorage` under `work-pages-unlocked`. This is a soft client-side gate — anything served to `/work/*` assets is still public, so don't put truly private material in `public/work/`.

Project copy lives in `src/data/projects.ts`, not in components — `ProjectLanding` and `ProjectStory` read from it, so adding a project page is a data-only change.

`WorkList.tsx` is the Design tab: a filter rail beside a divided list of rows. Unlike the pages above it, **its rows are declared in the file itself** (`forFun`, `career`, and the `FILTERS` array), pulling titles and taglines off `projects.ts` where they exist — the rows carry per-row copy, logos, links and screenshots that have no home in the `Project` type. Each row is a logo + title, one line of copy, a `View showcase` button when the project's page is designed, and an `IconButton` per external link. A row can put a screenshot in a fixed 260px column beside the copy (`frame: 'chrome'` adds `/work/browser-bar.png` above it, as `ProjectStory` does). The rail sits in a `max-content` grid column with an 80px gutter, matching the file's 80 / 194 / 1240 columns; mobile drops the grid, wraps the rail into a row, and hides the screenshots.

## Styling conventions

- Tailwind v4 is wired via `@tailwindcss/vite` and imported in `src/index.css`, but **most components use inline `style={{ ... }}` objects, not Tailwind classes**. Match the surrounding file's style when editing — don't refactor inline styles to Tailwind unless asked.
- **Design tokens are the single source of truth**, declared as CSS vars in `src/index.css` and mirrored by the Figma "Mini Design System" page (file `5mDT1eQf2KBcET9dh6kPXd`, node `25:800`). Change one, change the other.
  - Colors: surfaces (`--color-bg-primary`, `-raised`, `-inverse`, `-cream`), text on the dark shell (`--color-text-primary`, `-secondary`, `-muted`, `-inverse`), ink on the cream column (`--color-ink`, `-secondary`, `-muted`), borders (`--color-border-subtle`, `-default`, `-ink`), accent (`--color-orange`, `-hover`, `--color-on-accent`).
  - Spacing: `--space-xs` (4) through `--space-5xl` (80). Radius: `--radius-sm` (6) through `--radius-4xl` (56), plus `--radius-full` for pills. Control heights: `--control-xs` (28), `--control-sm` (32), `--control-md` (36), `--control-lg` (40).
  - Per-file constants stay as the naming pattern, but they now point at vars (`const CREAM_BG = 'var(--color-bg-cream)'`), so no component re-declares a hex. New components should follow the same pattern.
  - `src/design-system/tokens.ts` exports the same tokens as typed objects for inline styles, plus the `type` ramp.
- Reach for a token rather than a raw px value for radii and gaps. The known exceptions are the 9px inner radius in `ProjectStory`'s `BrowserFrame` (an optical inset against its 8px outer frame), `borderRadius: '50%'` for true circles, and page-level gutters, which are layout rather than component spacing.
- Font is `Geist Variable` from `@fontsource-variable/geist`, set globally on `body`. The ramp lives in `tokens.ts` as `type['display-xl' | 'heading-l' | 'body-l' | 'label-m' | 'eyebrow' | ...]`.
- Buttons come from `src/design-system/` (`Button`, `IconButton`) and icons from `@phosphor-icons/react`. `@noey-17/yearn-ui`'s stylesheet is still imported in `App.tsx`, but nothing renders its components any more; the cream project pages still import `@untitledui/icons` per-icon (`@untitledui/icons/ArrowDown`).

## Design system

`src/design-system/` holds the code half of the system: `tokens.ts` (colors, spacing, radius, control heights, type ramp), `icons.ts` (the 17 Phosphor icons that exist as Figma components), `buttonStyles.ts` (the palette/state matrix shared by both buttons), `Button.tsx` and `IconButton.tsx`, and the `*.stories.tsx` files that document them. `docs.tsx` is story-only chrome and is not shipped in the app.

`IconButton` is a **separate component**, not a variant of `Button` — folding it in would have doubled the set to 54 variants and allowed the invalid icon-only-plus-label combination. It is circular (width locked to the control height), takes a required `label` prop that renders as `aria-label`, and shares `Button`'s palette through `buttonStyles.ts`, so the two cannot drift. Figma mirrors this with a separate `Icon Button` component set.

`Button.tsx` is the system's button and is what Storybook documents. It is sized by **fixed height** (`--control-xs/sm/md/lg` = 28/32/36/40) rather than vertical padding, so a row of buttons lines up regardless of label or icon; only the horizontal padding varies by size. Each size pairs a label style and an icon size in `SIZES` / `ICON_SIZE` — `xs` drops to a 12px label and a 14px icon so the icon stays in proportion. `ContactMenu` and every control in `WorkList` use it; `@noey-17/yearn-ui`'s `Button` is no longer used anywhere, though the package's stylesheet is still imported in `App.tsx`.

Icons are Phosphor at **duotone** weight. The weight is set once via `IconContext` in `src/main.tsx` (and in `.storybook/preview.tsx`) from `ICON_DEFAULTS` in `design-system/icons.ts` — don't pass `weight` at call sites. Each duotone icon is a 20%-opacity tint path behind a solid main path; the Figma `Icon / *` components mirror this with `Tint` and `Main` layers. The cream project pages still use `@untitledui/icons` (`ArrowDown`, `ArrowNarrowLeft`, …), which are not part of the system and are unaffected by the Phosphor context.

Storybook config is in `.storybook/`. `main.ts` strips the `figma-capture-dev-only` Vite plugin, which is for the app's `/send-to-figma` flow and has no business in Storybook.

## Assets

Images referenced as absolute paths (`/profile.jpg`, `/work/signup.png`) live in `public/`. URL-encode spaces in filenames when referencing them in JSX (`/work/ONB%20steps.png`).

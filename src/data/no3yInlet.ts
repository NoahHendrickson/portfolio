/*
  The no3y Code page's mockups in the Inlet Black theme (Nov 14 2026), keyed by the Glass
  file each one replaces in `projects.ts`. The switch under the intro (`mockTheme.ts`) picks
  which set shows; a mockup with no entry here stays on its Glass version.

  Captured from the fork's desktop dev app on placeholder data (scripts and seed in
  ~/.t3-fork/scratch/no3y-capture/inlet/), at 4× and scaled down, since at 3× the sidebar's
  half pixel leaves a hairline seam where the open thread bridges into the panel. The window
  stands on the brand texture's "Cool fade" backdrop (Nov 15 2026, Figma h7PWAQCOhl8NwRoFTs3Cbu
  119:539, the render script's default) rather than Glass's fluted wallpaper; Inlet has no glass
  to show it through.
*/

export interface InletMedia {
  src: string
  poster?: string
  srcSet?: string
  aspect?: string
  alt?: string
}

export const NO3Y_INLET: Record<string, InletMedia> = {
  // The opener: the Glass clip's story re-recorded (take `focus-split.mjs`), 2560 × 1440.
  '/work/no3y-code/focus-mode-split.mp4': {
    src: '/work/no3y-inlet/focus-mode-split.mp4',
    poster: '/work/no3y-inlet/focus-mode-split-poster.jpg',
    alt: 'Focus mode in no3y Code on the Inlet Black theme: a working thread opens from the status-grouped sidebar, the sidebar collapses into tabs filtered to its project, and a second thread is dragged onto it to split the view',
  },
  // Focus mode: the Glass take's story re-recorded (take `focus-mode.mjs`), 2560 × 1440.
  '/work/no3y-code/focus-mode.mp4': {
    src: '/work/no3y-inlet/focus-mode.mp4',
    poster: '/work/no3y-inlet/focus-mode-poster.jpg',
    alt: 'Focus mode in no3y Code on the Inlet Black theme: the sidebar collapses into a row of thread tabs, switching tabs moves between working threads in different projects, the tabs filter to one project, and a second thread is dragged onto the first to split the view',
  },
  // Split agent: the Glass clip's story without real agents (take `split-agent.mjs`, Nov 15 2026):
  // the second agent is a seeded thread standing in for the one the app launched. The Glass
  // clip's pop-out window is gone from the app, so this one ends on the two side by side.
  '/work/no3y-code/split-agent.mp4': {
    src: '/work/no3y-inlet/split-agent.mp4',
    poster: '/work/no3y-inlet/split-agent-poster.jpg',
    alt: 'Split agent in no3y Code on the Inlet Black theme: while a thread builds the pricing cards, Split agent opens a second agent beside it on the same branch, a quick follow-up idea is sent there, and the second agent finishes while the first keeps working, the sidebar pairing the two on one row',
  },
  // The composer tiles (Nov 15 2026; `inlet/tiles/bake.mjs`): each state's composer cut out of
  // the window as a card with the window's rim and drop, on a corner of the Cool fade texture (the
  // left column's top-left, the right's bottom-right), at the Glass tiles' 680 × 380 and cuts.
  // Dictation and the thread pills stay on Glass for now.
  '/work/no3y-code/collage/usage.webp': {
    src: '/work/no3y-inlet/usage.webp',
    srcSet: '/work/no3y-inlet/usage-1020.webp 1020w, /work/no3y-inlet/usage-1360.webp 1360w, /work/no3y-inlet/usage.webp 2040w',
    alt: 'The usage popover hung from the composer’s meter in no3y Code on the Inlet Black theme, showing session and weekly limits for Codex and Claude',
  },
  '/work/no3y-code/collage/queue.webp': {
    src: '/work/no3y-inlet/queue.webp',
    srcSet: '/work/no3y-inlet/queue-1020.webp 1020w, /work/no3y-inlet/queue-1360.webp 1360w, /work/no3y-inlet/queue.webp 2040w',
    alt: 'A follow-up queued above the composer while the agent works, in no3y Code on the Inlet Black theme, with edit, Steer and remove controls',
  },
  '/work/no3y-code/collage/model.webp': {
    src: '/work/no3y-inlet/model.webp',
    srcSet: '/work/no3y-inlet/model-1020.webp 1020w, /work/no3y-inlet/model-1360.webp 1360w, /work/no3y-inlet/model.webp 2040w',
    alt: 'The model menu hung from the composer in no3y Code on the Inlet Black theme: a provider rail, the Claude models, a reasoning slider set to High and an Ultracode toggle',
  },
  '/work/no3y-code/collage/question.webp': {
    src: '/work/no3y-inlet/question.webp',
    srcSet: '/work/no3y-inlet/question-1020.webp 1020w, /work/no3y-inlet/question-1360.webp 1360w, /work/no3y-inlet/question.webp 2040w',
    alt: 'An agent’s question in place of the composer in no3y Code on the Inlet Black theme, with two options and a field for a custom answer',
  },
  // Scheduled tasks (Nov 15 2026; `inlet/takes/scheduled.mjs`, `inlet/tiles/still.mjs`): the new
  // automation form filled in like the Glass still, the window drawn as the clips draw it, on the
  // Cool fade texture, framed like the Glass one and running off the foot.
  '/work/no3y-code/collage/scheduled.webp': {
    src: '/work/no3y-inlet/scheduled.webp',
    alt: 'Creating an automation in no3y Code on the Inlet Black theme: a title, the project, agent instructions in a new worktree, a weekday schedule, and the model',
  },
  // Design mode (Nov 15 2026; take `design-mode.mjs`, the Glass take's story on the rebuilt Lumen
  // demo page). Captured at the window's own 2×: a device-metrics override re-scales the preview.
  // The main sidebar is collapsed because Inlet's maximized panel slides under it.
  '/work/no3y-code/design-mode-glass.mp4': {
    src: '/work/no3y-inlet/design-mode.mp4',
    poster: '/work/no3y-inlet/design-mode-poster.jpg',
    alt: 'Design mode in no3y Code on the Inlet Black theme: design mode turns on over the preview, the Start a scene button gets more padding and the heading is centred in the properties panel, canvas mode previews the page at MacBook 14 inch size, and the changes attach to the composer for the agent',
  },
  // Petals (Nov 15 2026; take `bot-return.mjs`): the Inlet take of the returning visit.
  '/work/no3y-code/petals.mp4': {
    src: '/work/no3y-inlet/petals.mp4',
    poster: '/work/no3y-inlet/petals-poster.jpg',
    alt: 'Petals in no3y Code on the Inlet Black theme: the UX feedback bot finishes its work and its card turns blue, its report says the shipping step is ready for review, a dev server link comes back for checking it, and after the go-ahead to merge the pull request turns purple and the thread moves to Idle',
  },
}

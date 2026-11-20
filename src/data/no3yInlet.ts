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

  Since Nov 19 2026 the stills (not the clips or the hero) each sit on their own variation of the
  Cool fade texture, the same one in Basic, so a theme switch changes only the window: the composer
  tiles blue-fade, the thread pills sweep-left, dictation three-corners, Scheduled high-tide. In the
  parallel-workflow bento only Scheduled keeps the texture: the Focus mode still sits on the
  texture's sky blue (#44aaf8) and the Split agent still on its green (#26b846), flat. The ten variations and their
  generator are ~/.t3-fork/scratch/no3y-capture/inlet/backdrops/variants/ (`flood.mjs`, the site's
  own glyphs and cell treatments, seeded); each bake takes one as BACKDROP=<file>.
*/

export interface InletMedia {
  src: string
  /** A clip's 10-bit HEVC, served before `src` where it plays (Nov 20 2026: H.264 bands the dark glass). */
  hevc?: string
  poster?: string
  srcSet?: string
  aspect?: string
  alt?: string
  /**
   * Captured to line up with its Glass version, frame for frame or pixel for pixel. Nothing reads
   * it since the page-wide Compare mode was taken out (Nov 16 2026); kept so it can come back.
   */
  aligned?: boolean
}

export const NO3Y_INLET: Record<string, InletMedia> = {
  // The opener: the Glass clip's story re-recorded (take `focus-split.mjs`), 2560 × 1440.
  '/work/no3y-code/focus-mode-split.mp4': {
    src: '/work/no3y-inlet/focus-mode-split.mp4',
    poster: '/work/no3y-inlet/focus-mode-split-poster.jpg',
    alt: 'Focus mode in no3y Code on the Inlet Black theme: a working thread opens from the status-grouped sidebar, the sidebar collapses into tabs filtered to its project, and a second thread is dragged onto it to split the view',
  },
  // Focus mode: the Glass take's story re-recorded (take `focus-mode.mjs`), 2560 × 1440. Since
  // Nov 16 2026 the Glass clip is the same script's Glass take (`THEME=glass`), so the pair lines up.
  '/work/no3y-code/focus-mode.mp4': {
    src: '/work/no3y-inlet/focus-mode.mp4',
    poster: '/work/no3y-inlet/focus-mode-poster.jpg',
    alt: 'Focus mode in no3y Code on the Inlet Black theme: the sidebar collapses into a row of thread tabs, switching tabs moves between working threads in different projects, the tabs filter to one project, and a second thread is dragged onto the first to split the view',
    aligned: true,
  },
  // Split agent: the Glass clip's story without real agents (take `split-agent.mjs`, Nov 15 2026):
  // the second agent is a seeded thread standing in for the one the app launched. The Glass
  // clip's pop-out window is gone from the app, so this one ends on the two side by side. The
  // Glass clip was re-recorded from the same script on Nov 16 2026, so the pair lines up.
  '/work/no3y-code/split-agent.mp4': {
    src: '/work/no3y-inlet/split-agent.mp4',
    poster: '/work/no3y-inlet/split-agent-poster.jpg',
    alt: 'Split agent in no3y Code on the Inlet Black theme: while a thread builds the pricing cards, Split agent opens a second agent beside it on the same branch, a quick follow-up idea is sent there, and the second agent finishes while the first keeps working, the sidebar pairing the two on one row',
    aligned: true,
  },
  // The composer tiles (Nov 15 2026; `inlet/tiles/bake.mjs`): each state's composer cut out of
  // the window as a card with the window's rim and drop, on a corner of the Cool fade texture (the
  // left column's top-left, the right's bottom-right), at the Glass tiles' 680 × 380 and cuts.
  // Each lines up with its Glass tile closely enough to be cut at a divider (Nov 16 2026).
  '/work/no3y-code/collage/usage.webp': {
    src: '/work/no3y-inlet/usage.webp',
    srcSet: '/work/no3y-inlet/usage-1020.webp 1020w, /work/no3y-inlet/usage-1360.webp 1360w, /work/no3y-inlet/usage.webp 2040w',
    alt: 'The usage popover hung from the composer’s meter in no3y Code on the Inlet Black theme, showing session and weekly limits for Codex and Claude',
    aligned: true,
  },
  '/work/no3y-code/collage/queue.webp': {
    src: '/work/no3y-inlet/queue.webp',
    srcSet: '/work/no3y-inlet/queue-1020.webp 1020w, /work/no3y-inlet/queue-1360.webp 1360w, /work/no3y-inlet/queue.webp 2040w',
    alt: 'A follow-up queued above the composer while the agent works, in no3y Code on the Inlet Black theme, with edit, Steer and remove controls',
    aligned: true,
  },
  '/work/no3y-code/collage/model.webp': {
    src: '/work/no3y-inlet/model.webp',
    srcSet: '/work/no3y-inlet/model-1020.webp 1020w, /work/no3y-inlet/model-1360.webp 1360w, /work/no3y-inlet/model.webp 2040w',
    alt: 'The model menu hung from the composer in no3y Code on the Inlet Black theme: a provider rail, the Claude models, a reasoning slider set to High and an Ultracode toggle',
    aligned: true,
  },
  '/work/no3y-code/collage/question.webp': {
    src: '/work/no3y-inlet/question.webp',
    srcSet: '/work/no3y-inlet/question-1020.webp 1020w, /work/no3y-inlet/question-1360.webp 1360w, /work/no3y-inlet/question.webp 2040w',
    alt: 'An agent’s question in place of the composer in no3y Code on the Inlet Black theme, with two options and a field for a custom answer',
    aligned: true,
  },
  // The cluster's two boxes (Nov 17 2026; `inlet/takes/extras.mjs`, `inlet/tiles/bake-extras.mjs`):
  // the thread pills as pieces on the backdrop's top-left, like the Glass banner's four, and the
  // composer's vessel mid-dictation (drawn by a capture-only stand-in, no mic or transcription) on
  // its bottom-right, each at the Glass banner's size and cuts.
  // The app's dictation is newer than the Glass banner's: a small level timeline in the control
  // row where the Glass one's waveform filled the field.
  '/work/no3y-code/collage/threads.webp': {
    src: '/work/no3y-inlet/threads.webp',
    srcSet: '/work/no3y-inlet/threads-1290.webp 1290w, /work/no3y-inlet/threads-1720.webp 1720w, /work/no3y-inlet/threads.webp 2580w',
    alt: 'Thread pills in no3y Code on the Inlet Black theme, in the open state: two sidebar cards, one needing input and one done, beside two collapsed-bar tabs, one working and one needing input',
  },
  '/work/no3y-code/collage/dictation-wide.webp': {
    src: '/work/no3y-inlet/dictation-wide.webp',
    srcSet: '/work/no3y-inlet/dictation-wide-1290.webp 1290w, /work/no3y-inlet/dictation-wide-1720.webp 1720w, /work/no3y-inlet/dictation-wide.webp 2580w',
    alt: 'The composer while dictating in no3y Code on the Inlet Black theme: a live level timeline beside the mic, with cancel and confirm in place of send',
  },
  // Scheduled tasks (Nov 15 2026; `inlet/takes/scheduled.mjs`, `inlet/tiles/still.mjs`): the new
  // automation form filled in like the Glass still, the window drawn as the clips draw it, on the
  // Cool fade texture, framed like the Glass one and running off the foot. Recaptured Nov 17 2026
  // off custom `508d490001`, which draws the composer's border.
  '/work/no3y-code/collage/scheduled.webp': {
    src: '/work/no3y-inlet/scheduled.webp',
    alt: 'Creating an automation in no3y Code on the Inlet Black theme: a title, the project, agent instructions in a new worktree, a weekday schedule, and the model',
  },
  // Design mode (Nov 15 2026; take `design-mode.mjs`, the Glass take's story on the rebuilt Lumen
  // demo page). Captured at the window's own 2×: a device-metrics override re-scales the preview.
  // The main sidebar is collapsed because Inlet's maximized panel slides under it. The Glass clip
  // was re-recorded from the same script on Nov 16 2026, rendered with this take's camera, so the
  // pair lines up (Glass's preview sits a few px lower inside the window, its stage inset).
  '/work/no3y-code/design-mode-glass.mp4': {
    src: '/work/no3y-inlet/design-mode.mp4',
    poster: '/work/no3y-inlet/design-mode-poster.jpg',
    alt: 'Design mode in no3y Code on the Inlet Black theme: design mode turns on over the preview, the Start a scene button gets more padding and the heading is centered in the properties panel, canvas mode previews the page at MacBook 14 inch size, and the changes attach to the composer for the agent',
    aligned: true,
  },
  // Petals (Nov 15 2026; take `bot-return.mjs`): the Inlet take of the returning visit. The
  // Glass take ran the same script, so the two line up frame for frame. Both re-recorded Nov 16
  // 2026 off custom 7f1fe1fc9e with the Basic take, so all three show the mascot in the chat header.
  '/work/no3y-code/petals.mp4': {
    src: '/work/no3y-inlet/petals.mp4',
    poster: '/work/no3y-inlet/petals-poster.jpg',
    alt: 'Petals in no3y Code on the Inlet Black theme: the UX feedback bot finishes its work and its card turns blue, its report says the shipping step is ready for review, a dev server link comes back for checking it, and after the go-ahead to merge the pull request turns purple and the thread moves to Idle',
    aligned: true,
  },
  // Stills of the Focus mode and Split agent clips (Nov 19 2026) for Prototype B's feature grid: each
  // take's last raw frame with the cursor patched out from an earlier frame, composited like its
  // clip (inlet/takes/still-render-inlet.mjs), 1920 × 1080.
  '/work/no3y-code/focus-mode-still.jpg': {
    src: '/work/no3y-inlet/focus-mode-still.jpg',
    alt: 'Focus mode in no3y Code on the Inlet theme: the sidebar collapsed into a row of thread tabs, and two threads split side by side, the second asking a question',
  },
  '/work/no3y-code/split-agent-still.jpg': {
    src: '/work/no3y-inlet/split-agent-still.jpg',
    alt: 'Split agent in no3y Code on the Inlet theme: the pricing cards thread still working beside a second agent on the same branch that added a savings badge, the sidebar pairing the two on one row',
  },
}

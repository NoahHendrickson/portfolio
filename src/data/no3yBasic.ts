import type { InletMedia } from './no3yInlet'

/*
  The no3y Code page's mockups in the Basic theme (Nov 16 2026), the fork's default since custom
  7f1fe1fc9e, in its Neutral Dark tone, keyed by the Glass file each one stands in for in
  `projects.ts`, like `NO3Y_INLET`. A mockup with no entry here shows its Glass version under Basic.

  Each clip is its Inlet take's script run with THEME=basic (~/.t3-fork/scratch/no3y-capture/inlet/
  takes/), rendered on the fluted wallpaper the Glass clips use (`render-basic.mjs`, the window
  buttons on Basic's 44px header) with the Inlet take's camera, so all three line up. The composer
  tiles and the Scheduled still are the Inlet ones' scripts with THEME=basic too (`takes/tiles.mjs`,
  `takes/scheduled.mjs`, then `tiles/bake.mjs` and `tiles/still.mjs`), on the fluted wallpaper.

  Since Nov 19 2026 the stills (not the clips or the hero) each sit on their own variation of the
  Cool fade texture, the same one in Basic, so a theme switch changes only the window: the composer
  tiles blue-fade, the thread pills sweep-left, dictation three-corners, Scheduled high-tide. In the
  parallel-workflow bento only Scheduled keeps the texture: the Focus mode still sits on the
  texture's sky blue (#44aaf8) and the Split agent still on its green (#26b846), flat. The ten variations and their
  generator are ~/.t3-fork/scratch/no3y-capture/inlet/backdrops/variants/ (`flood.mjs`, the site's
  own glyphs and cell treatments, seeded); each bake takes one as BACKDROP=<file>.
*/

export const NO3Y_BASIC: Record<string, InletMedia> = {
  // The composer tiles: each state's composer cut out as a card on a corner of its backdrop (the
  // blue-fade variation since Nov 19 2026, the fluted wallpaper before), at the Glass tiles' 680 × 380 and cuts.
  '/work/no3y-code/collage/usage.webp': {
    src: '/work/no3y-basic/usage.webp',
    srcSet: '/work/no3y-basic/usage-1020.webp 1020w, /work/no3y-basic/usage-1360.webp 1360w, /work/no3y-basic/usage.webp 2040w',
    alt: 'The usage popover from the composer’s meter in no3y Code on the Basic theme, showing session and weekly limits for Codex and Claude',
    aligned: true,
  },
  '/work/no3y-code/collage/queue.webp': {
    src: '/work/no3y-basic/queue.webp',
    srcSet: '/work/no3y-basic/queue-1020.webp 1020w, /work/no3y-basic/queue-1360.webp 1360w, /work/no3y-basic/queue.webp 2040w',
    alt: 'A follow-up queued above the composer while the agent works, in no3y Code on the Basic theme, with edit, Steer and remove controls',
    aligned: true,
  },
  '/work/no3y-code/collage/model.webp': {
    src: '/work/no3y-basic/model.webp',
    srcSet: '/work/no3y-basic/model-1020.webp 1020w, /work/no3y-basic/model-1360.webp 1360w, /work/no3y-basic/model.webp 2040w',
    alt: 'The model menu open from the composer in no3y Code on the Basic theme: a provider rail, the Claude models, a reasoning slider set to High and an Ultracode toggle',
    aligned: true,
  },
  '/work/no3y-code/collage/question.webp': {
    src: '/work/no3y-basic/question.webp',
    srcSet: '/work/no3y-basic/question-1020.webp 1020w, /work/no3y-basic/question-1360.webp 1360w, /work/no3y-basic/question.webp 2040w',
    alt: 'An agent’s question in place of the composer in no3y Code on the Basic theme, with two options and a field for a custom answer',
    aligned: true,
  },
  // The cluster's two boxes (Nov 17 2026; `inlet/takes/extras.mjs`, `inlet/tiles/bake-extras.mjs`):
  // the thread pills as pieces on the backdrop's top-left, like the Glass banner's four, and the
  // composer's vessel mid-dictation (drawn by a capture-only stand-in, no mic or transcription) on
  // its bottom-right, each at the Glass banner's size and cuts.
  '/work/no3y-code/collage/threads.webp': {
    src: '/work/no3y-basic/threads.webp',
    srcSet: '/work/no3y-basic/threads-1290.webp 1290w, /work/no3y-basic/threads-1720.webp 1720w, /work/no3y-basic/threads.webp 2580w',
    alt: 'Thread pills in no3y Code on the Basic theme, in the open state: two sidebar cards, one needing input and one done, beside two collapsed-bar tabs, one working and one needing input',
  },
  '/work/no3y-code/collage/dictation-wide.webp': {
    src: '/work/no3y-basic/dictation-wide.webp',
    srcSet: '/work/no3y-basic/dictation-wide-1290.webp 1290w, /work/no3y-basic/dictation-wide-1720.webp 1720w, /work/no3y-basic/dictation-wide.webp 2580w',
    alt: 'The composer while dictating in no3y Code on the Basic theme: a live level timeline beside the mic, with cancel and confirm in place of send',
  },
  // Scheduled tasks: the new automation form filled in, the window running off the foot.
  '/work/no3y-code/collage/scheduled.webp': {
    src: '/work/no3y-basic/scheduled.webp',
    alt: 'Creating an automation in no3y Code on the Basic theme: a title, the project, agent instructions in a new worktree, a weekday schedule, and the model',
  },
  // Petals re-recorded Nov 19 2026 off custom dea2c697a3 with the digest (take `bot-return.mjs`,
  // rendered on the fluted wallpaper like the hero; re-recorded the same evening off custom 1fbc3ac238 with the digest a step darker than the composer, a capture-only SHOWCASE-TEMP rule in the scratch worktree's theme.custom.basic.css): the bot's asks above its composer, answered by their
  // buttons. Glass and Inlet still show the earlier story, so this one no longer lines up with them.
  '/work/no3y-code/petals.mp4': {
    src: '/work/no3y-basic/petals.mp4',
    hevc: '/work/no3y-basic/petals-hevc.mp4',
    poster: '/work/no3y-basic/petals-poster.jpg',
    alt: 'Petals in no3y Code on the Basic theme in its Dark Cool tone, on the Jolly Petal piece: the UX feedback bot finishes and its card turns blue, its report says the shipping step is ready for review, and above its composer it asks two things; after a dev server link comes back, Merge on the first ask merges the pull request, which turns purple, and First error answers the second, leaving the digest all quiet',
  },
  '/work/no3y-code/focus-mode.mp4': {
    src: '/work/no3y-basic/focus-mode.mp4',
    poster: '/work/no3y-basic/focus-mode-poster.jpg',
    alt: 'Focus mode in no3y Code on the Basic theme: the sidebar collapses into a row of thread tabs, switching tabs moves between working threads in different projects, the tabs filter to one project, and a second thread is dragged onto the first to split the view',
    aligned: true,
  },
  '/work/no3y-code/split-agent.mp4': {
    src: '/work/no3y-basic/split-agent.mp4',
    poster: '/work/no3y-basic/split-agent-poster.jpg',
    alt: 'Split agent in no3y Code on the Basic theme: while a thread builds the pricing cards, Split agent opens a second agent beside it on the same branch, a quick follow-up idea is sent there, and the second agent finishes while the first keeps working, the sidebar pairing the two on one row',
    aligned: true,
  },
  '/work/no3y-code/design-mode-glass.mp4': {
    src: '/work/no3y-basic/design-mode.mp4',
    poster: '/work/no3y-basic/design-mode-poster.jpg',
    alt: 'Design mode in no3y Code on the Basic theme: design mode turns on over the preview, the Start a scene button gets more padding and the heading is centered in the properties panel, canvas mode previews the page at MacBook 14 inch size, and the changes attach to the composer for the agent',
    aligned: true,
  },
  // Stills of the Focus mode and Split agent clips (Nov 19 2026) for Prototype B's feature grid: each
  // take's last raw frame with the cursor patched out from an earlier frame, composited like its
  // clip (inlet/takes/still-render-basic.mjs), 1920 × 1080.
  '/work/no3y-code/focus-mode-still.jpg': {
    src: '/work/no3y-basic/focus-mode-still.jpg',
    alt: 'Focus mode in no3y Code on the Basic theme: the sidebar collapsed into a row of thread tabs, and two threads split side by side, the second asking a question',
  },
  '/work/no3y-code/split-agent-still.jpg': {
    src: '/work/no3y-basic/split-agent-still.jpg',
    alt: 'Split agent in no3y Code on the Basic theme: the pricing cards thread still working beside a second agent on the same branch that added a savings badge, the sidebar pairing the two on one row',
  },
}

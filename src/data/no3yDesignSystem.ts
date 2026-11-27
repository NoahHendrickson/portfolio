/*
  The no3y Code page's design-system section (Nov 19 2026): the fork's Basic UI kit in
  Figma (kUDQTOR0ndxERlBCqgy3nk), its Storybook and the Code Connect between them.
  Every box and value here was read out of the kit, not drawn by eye: part boxes are the
  layers' bounds in the component (Figma px), colours are the variables resolved per mode.
*/

const DS = '/work/no3y-code/design-system'

/** One labelled layer of a component, its box in the component's own Figma px. */
export type AnatomyPart = {
  label: string
  spec: string
  box: readonly [x: number, y: number, w: number, h: number]
  /** Which side of the component the numbered pin stands on. */
  pin: 'top' | 'bottom'
  /** Where along the component the pin stands, in Figma px (the box's middle when unset). */
  pinX?: number
}

export type AnatomyEntry = {
  id: string
  name: string
  /** What it is, in a line. */
  summary: string
  src: string
  /** The component's size in Figma px; the export is a multiple of it. */
  width: number
  height: number
  /** How large to draw it against its Figma size, before the stage caps it. */
  scale: number
  /** Where it lives in the fork. */
  source: string
  parts: AnatomyPart[]
}

export const ANATOMY: AnatomyEntry[] = [
  {
    id: 'thread-card',
    name: 'Thread card',
    summary: 'A thread in the sidebar. 10 statuses × default, hover and selected, plus a one-line compact card: 60 variants.',
    src: `${DS}/figma-thread-card.webp`,
    width: 239,
    height: 54,
    scale: 2.4,
    source: 'components/Sidebar.tsx · custom/SidebarV2StatusIndicator.tsx',
    parts: [
      { label: 'Title', spec: '14/18 in text/default. Done and idle titles dim to sidebar/muted-foreground.', box: [12, 8, 171, 18], pin: 'top' },
      { label: 'Elapsed', spec: '12/16, muted, while the thread works.', box: [189, 10, 20, 15], pin: 'top' },
      { label: 'Status mark', spec: 'A 14 × 14 box on the list’s axis, in status/working, input, done or failed.', box: [215, 10, 14, 14], pin: 'top' },
      { label: 'Where', spec: 'Device, project favicon and name, and branch, 12/16 in sidebar/muted-foreground.', box: [12, 30, 164, 16], pin: 'bottom' },
      { label: 'Model', spec: '11px, muted, pinned to the right.', box: [184, 31, 43, 15], pin: 'bottom' },
      { label: 'Card', spec: '239 × 54, 8px radius. Hover washes at state/hover, selected at state/selected.', box: [0, 0, 239, 54], pin: 'bottom', pinX: 4 },
    ],
  },
  {
    id: 'subagent-card',
    name: 'Subagent card',
    summary: 'Every subagent an agent starts, in the transcript. 4 statuses, open and folded.',
    src: `${DS}/figma-subagent.webp`,
    width: 736,
    height: 114,
    scale: 1.2,
    source: 'custom/ForkSubagentGroup.tsx',
    parts: [
      { label: 'Provider tile', spec: 'The provider’s mark in a 32px base/accent tile, 4px corners.', box: [12, 12, 32, 32], pin: 'top' },
      { label: 'Status badge', spec: 'A 14px badge on the tile’s corner: working, done, failed or stopped.', box: [32, 32, 14, 14], pin: 'bottom', pinX: 39 },
      { label: 'Title', spec: '14/16 medium. Falls back to the child thread’s title, then the task.', box: [52, 11, 558, 16], pin: 'top', pinX: 140 },
      { label: 'Model · effort', spec: '14/16, muted: what the subagent runs on.', box: [52, 29, 101, 16], pin: 'bottom', pinX: 110 },
      { label: 'Elapsed', spec: '12/16 medium.', box: [618, 20, 42, 16], pin: 'top' },
      { label: 'Chevron', spec: 'Folds and opens the well.', box: [668, 16, 24, 24], pin: 'top' },
      { label: 'Open thread', spec: 'Jumps to the subagent’s own thread.', box: [700, 16, 24, 24], pin: 'top' },
      { label: 'Well', spec: 'composer/prompt: the task, then what it’s doing now or its result.', box: [0, 56, 736, 58], pin: 'bottom', pinX: 420 },
    ],
  },
  {
    id: 'composer',
    name: 'Composer',
    summary: 'Where every turn starts: the project context over the prompt, with access, usage and the model under it.',
    src: `${DS}/figma-composer.webp`,
    width: 672,
    height: 148,
    scale: 1.25,
    source: 'components/chat/ChatComposer.tsx · custom/ComposerShell.tsx',
    parts: [
      { label: 'Context strip', spec: 'Project, checkout and branch chips in composer/chip.', box: [0, 0, 311, 24], pin: 'top' },
      { label: 'Prompt', spec: 'composer/prompt, 80px tall to start.', box: [0, 32, 672, 80], pin: 'top', pinX: 480 },
      { label: 'Submit', spec: 'message/action, 24px.', box: [640, 80, 24, 24], pin: 'top', pinX: 652 },
      { label: 'Access', spec: 'Full access in semantic/warning on its own tint.', box: [56, 120, 74, 20], pin: 'bottom' },
      { label: 'Vessel', spec: 'composer/vessel: the footer the prompt sits in.', box: [0, 112, 672, 36], pin: 'bottom', pinX: 300 },
      { label: 'Usage', spec: 'The usage meter, a short fill in a track.', box: [518, 120, 36, 20], pin: 'bottom' },
      { label: 'Model', spec: 'The model and its effort. Opens the model picker.', box: [558, 120, 106, 20], pin: 'bottom', pinX: 618 },
    ],
  },
  {
    id: 'petal-card',
    name: 'Petal card',
    summary: 'A Petal, one of the bots that watch your threads, in the sidebar’s Petals section.',
    src: `${DS}/figma-petal-card.webp`,
    width: 239,
    height: 44,
    scale: 2.4,
    source: 'custom/bots/SidebarV2BotsSection.tsx',
    parts: [
      { label: 'Mascot', spec: 'Pixel art on a 32px tile in its body colour at 50%.', box: [12, 6, 32, 32], pin: 'top' },
      { label: 'Name', spec: '14/18.', box: [52, 6, 39, 18], pin: 'top' },
      { label: 'Report', spec: '12/14, muted: what the Petal found.', box: [52, 25, 155, 14], pin: 'bottom' },
      { label: 'Status mark', spec: 'The thread card’s marks.', box: [215, 15, 12, 14], pin: 'top' },
      { label: 'Card', spec: '239 × 44, 8px radius, washing like a thread card.', box: [0, 0, 239, 44], pin: 'bottom', pinX: 4 },
    ],
  },
]

/** Counts read off the kit and the Storybook build on Nov 19 2026. */
export const KIT_STATS = [
  { value: '170', label: 'colour variables in Basic, each in 8 tone modes' },
  { value: '127', label: 'more for Glass and Inlet, under the same names' },
  { value: '272', label: 'icons, the app’s own Hugeicons glyphs' },
  { value: '326', label: 'Storybook stories, rendering the real components' },
] as const

export const STORYBOOK_SHOT = {
  // Nov 26 2026: Petal digest › Pull request states, off custom a4881c2dce (the controls panel hidden). It was
  // Composer cards › Stacked (`storybook-composer-cards.webp`) until then.
  src: `${DS}/storybook-petal-digest.webp`,
  alt: 'Storybook open on Fork / Petal digest / Pull request states in Flat Glass: the fork’s stories in the sidebar, and in the canvas a Petal’s ask for each pull request state, open (rework it or reply), draft (mark it ready), merged (delete the branch and worktree) and closed (open it again)',
  aspect: '2880 / 1800',
}

export const FIGMA_SUBAGENT = {
  src: `${DS}/figma-subagent.webp`,
  alt: 'The Subagent card component in Figma, working and open, with its task and current activity in the well',
  aspect: '736 / 114',
}

/** The Code Connect template behind the Subagent card (apps/fork-storybook/code-connect). */
/** What Dev Mode shows for the kit's PR status chip (Code Connect's StatusChip.figma.ts). */
export const CODE_CONNECT_SNIPPET = `import { ComposerPullRequestChip } from "~/custom/ComposerPullRequestChip";

<ComposerPullRequestChip
  threadRef={threadRef}
  branch={branch}
  cwd={cwd}
/>`

/** One of the kit's component frames, whole, as it sits on its page in Figma (Dark Neutral). */
export type KitFrame = {
  id: string
  name: string
  src: string
  /** The frame in Figma px; the export is 1200px tall. */
  width: number
  height: number
}

export const KIT_FRAMES: KitFrame[] = [
  { id: 'thread-card', name: 'Thread card', src: `${DS}/frame-thread-card.webp`, width: 1870, height: 1738 },
  { id: 'petal-card', name: 'Petal card', src: `${DS}/frame-petal-card.webp`, width: 1008, height: 480 },
  { id: 'subagent-card', name: 'Subagent card', src: `${DS}/frame-subagent-card.webp`, width: 1624, height: 1242 },
  { id: 'composer', name: 'Composer', src: `${DS}/frame-composer.webp`, width: 1008, height: 736 },
  { id: 'model-picker', name: 'Model picker', src: `${DS}/frame-model-picker.webp`, width: 1008, height: 719 },
  { id: 'changed-files', name: 'Changed files', src: `${DS}/frame-changed-files.webp`, width: 1564, height: 650 },
  { id: 'thread-status', name: 'Thread status', src: `${DS}/frame-thread-status.webp`, width: 1164, height: 406 },
  { id: 'petal-work-row', name: 'Petal work row', src: `${DS}/frame-petal-work-row.webp`, width: 1008, height: 640 },
  { id: 'petal-mascots', name: 'Petal mascots', src: `${DS}/frame-petal-mascots.webp`, width: 1008, height: 935 },
]

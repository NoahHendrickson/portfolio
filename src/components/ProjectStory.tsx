import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import Header from './Header'
import StoryCentered from './StoryCentered'
import StoryGallery from './StoryGallery'
import StorySplit from './StorySplit'
import { VARIANTS } from '../design-system/buttonStyles'
import Button from '../design-system/Button'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  PAGE_BG,
  TEXT,
  useGutter,
} from './storyStyles'
import type { Project } from '../data/projects'

/**
 * Screenshot-led project page (`#/work/<slug>` for any project with a `landing`
 * in `src/data/projects.ts`). The generic `ProjectLanding` — stats row, section
 * rail, stack and status — still serves everything else.
 *
 * This file is only the shell: page chrome, the back link, and the variant
 * switcher. The three layouts live in `StorySplit`, `StoryCentered` and
 * `StoryGallery`, and share their pieces through `storyParts.tsx`.
 */

const LAYOUTS = {
  split: { label: 'Split', render: StorySplit },
  centered: { label: 'Centered', render: StoryCentered },
  gallery: { label: 'Gallery', render: StoryGallery },
} as const

type LayoutId = keyof typeof LAYOUTS
const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[]

/**
 * TEMPORARY. The switcher is here so the three layouts can be compared side by
 * side before one is picked; delete `VariantTabs`, this key, and the two unused
 * layout files once that decision is made.
 */
const STORAGE_KEY = 'story-variant'

function useLayoutChoice() {
  const [layout, setLayout] = useState<LayoutId>(() => {
    // Persisted so switching between the two project pages keeps comparing the
    // same layout instead of resetting.
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved && saved in LAYOUTS ? (saved as LayoutId) : 'split'
  })

  return [
    layout,
    (next: LayoutId) => {
      sessionStorage.setItem(STORAGE_KEY, next)
      setLayout(next)
    },
  ] as const
}

export default function ProjectStory({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const [layout, setLayout] = useLayoutChoice()

  if (!project.landing) return null

  const Layout = LAYOUTS[layout].render

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        color: TEXT,
        paddingBottom: isMobile ? '60px' : '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3xl)',
      }}
    >
      <div style={{ padding: `0 ${gutter}`, display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
        <Header active="work" barInset="0" contentInset="0" showProfile={false} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: isMobile ? '12px' : '16px',
          }}
        >
          <BackLink />
          <VariantTabs layout={layout} onChange={setLayout} />
        </div>
      </div>

      <Layout project={project} />
    </div>
  )
}

/**
 * Styled as the design system's ghost pill so it reads the same as the Design
 * tab's controls, but kept an anchor — `Button` renders a <button>, and nesting
 * one inside a link is invalid. The palette is pulled from `buttonStyles` rather
 * than restated, so the two can't drift.
 */
function BackLink() {
  return (
    <a
      href="#/work"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.sm,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: `1px solid ${VARIANTS.ghost.default.borderColor}`,
        background: VARIANTS.ghost.default.background,
        color: VARIANTS.ghost.default.color,
        fontSize: type['label-m'].fontSize,
        fontWeight: type['label-m'].fontWeight,
        lineHeight: type['label-m'].lineHeight,
        textDecoration: 'none',
      }}
    >
      <ArrowLeft size={16} />
      Back
    </a>
  )
}

/** TEMPORARY — see `STORAGE_KEY` above. */
function VariantTabs({ layout, onChange }: { layout: LayoutId; onChange: (next: LayoutId) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} aria-label="Layout variant">
      {LAYOUT_IDS.map((id) => (
        <Button
          key={id}
          size="xs"
          variant={id === layout ? 'secondary' : 'ghost'}
          aria-pressed={id === layout}
          onClick={() => onChange(id)}
          style={id === layout ? undefined : { borderColor: 'transparent' }}
        >
          {LAYOUTS[id].label}
        </Button>
      ))}
    </div>
  )
}

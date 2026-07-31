import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import Header from './Header'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Project } from '../data/projects'
import Launch from './stat-builder/Launch'
import Stage from './stat-builder/Stage'
import Editorial from './stat-builder/Editorial'
import Sequence from './stat-builder/Sequence'
import { PAGE_BG, TEXT, useGutter } from './stat-builder/styles'

/**
 * Temporary redesign sandbox for `#/work/stat-builder`. Four product-page
 * compositions behind tabs next to Back so they can be compared before one
 * wins. The Forge keeps using `ProjectStory`. Delete the unused layouts and
 * this switcher once a direction is picked.
 */

const LAYOUTS = {
  launch: { label: 'Launch', render: Launch },
  stage: { label: 'Stage', render: Stage },
  editorial: { label: 'Editorial', render: Editorial },
  sequence: { label: 'Sequence', render: Sequence },
} as const

type LayoutId = keyof typeof LAYOUTS
const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[]

const STORAGE_KEY = 'stat-builder-variant'

function useLayoutChoice() {
  const [layout, setLayout] = useState<LayoutId>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved && saved in LAYOUTS ? (saved as LayoutId) : 'launch'
  })

  return [
    layout,
    (next: LayoutId) => {
      sessionStorage.setItem(STORAGE_KEY, next)
      setLayout(next)
    },
  ] as const
}

export default function StatBuilderShowcase({ project }: { project: Project }) {
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
      <div
        style={{
          padding: `0 ${gutter}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3xl)',
        }}
      >
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

      <div
        key={layout}
        style={{
          animation: 'sb-fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <Layout project={project} />
      </div>
    </div>
  )
}

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
        width: 'fit-content',
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

function VariantTabs({
  layout,
  onChange,
}: {
  layout: LayoutId
  onChange: (next: LayoutId) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Layout variants"
      style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}
    >
      {LAYOUT_IDS.map((id) => (
        <Button
          key={id}
          size="sm"
          variant={layout === id ? 'secondary' : 'ghost'}
          aria-selected={layout === id}
          role="tab"
          onClick={() => onChange(id)}
        >
          {LAYOUTS[id].label}
        </Button>
      ))}
    </div>
  )
}

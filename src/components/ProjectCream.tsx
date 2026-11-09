import { Fragment, type ReactNode } from 'react'
import SidebarPlayground from './No3ySidebar'
import { CreamBlock, CreamCopy, CreamMedia, CreamPage, CreamProse, type CreamRow } from './Cream'
import Reveal from './Reveal'
import { SheetClip, SheetFacts, SheetImg, SheetIntro } from './Sheet'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CREAM, creamMetrics } from '../creamStyle'
import { FACTS_WIDTH, SHEET_HEADING } from '../sheetStyle'
import type { CreamRules, Project, StorySection } from '../data/projects'

const INK = 'var(--color-ink)'

/** Something on the bare dark, or a row suspended in cream. */
type Item = { free: ReactNode } | CreamRow

/**
 * A project page on the cream lattice (Nov 9 2026, on trial, `landing.cream`):
 * the home bento's look carried onto a project. no3y Code came first, so only
 * the section kinds it uses are drawn (`feature`, `grid`). The intro and the
 * copy sit straight on the dark; the mockups and the live sidebar are suspended
 * in cream, and showpieces with no copy between them share one block. On a
 * phone the facts drop under the opener's copy, which keeps the hero above the fold.
 */
export default function ProjectCream({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const landing = project.landing
  if (!landing) return null
  const { sheet, showcase, hero, sections } = landing
  const { inset } = creamMetrics(isMobile)
  const facts = sheet?.facts ?? []
  const links = [...(hero.cta ? [{ label: hero.cta.label, href: hero.cta.href }] : []), ...(hero.links ?? [])]
  const top = isMobile ? 8 : 24
  const foot = isMobile ? 32 : 64

  const intro = (
    <Reveal style={{ flex: '1 1 0', minWidth: 0 }}>
      <SheetIntro
        icon={sheet?.icon}
        title={project.title}
        helper={landing.eyebrow}
        description={hero.body ?? [project.summary]}
        links={links}
        padding={`${top}px ${inset}px ${foot}px`}
      />
    </Reveal>
  )
  const factsColumn = facts.length > 0 && (
    <Reveal
      delay={90}
      style={
        isMobile
          ? { padding: `0 ${inset}px ${foot}px` }
          : { flex: `0 0 ${FACTS_WIDTH}px`, boxSizing: 'border-box', padding: `${top}px ${inset}px ${foot}px 0` }
      }
    >
      <SheetFacts facts={facts} />
    </Reveal>
  )

  // Which gaps carry on past the cream, by the heading of the copy they belong to.
  const rulesFor = (heading?: string): CreamRules => (heading && landing.cream?.rules[heading]) || {}
  const openerRules = rulesFor(showcase?.copy?.heading)

  const items: Item[] = [
    {
      free: isMobile ? (
        intro
      ) : (
        <div style={{ display: 'flex' }}>
          {intro}
          {factsColumn}
        </div>
      ),
    },
    ...(showcase?.video
      ? [
          {
            rule: openerRules.above,
            below: openerRules.copy,
            node: (
              <CreamMedia delay={160}>
                <SheetClip video={showcase.video} priority />
              </CreamMedia>
            ),
          },
        ]
      : []),
    ...(showcase?.copy ? [{ free: <CreamCopy heading={showcase.copy.heading} body={showcase.copy.body} /> }] : []),
    ...(isMobile && factsColumn ? [{ free: factsColumn }] : []),
    ...sections.flatMap((section) =>
      sectionItems(section, rulesFor(section.kind === 'feature' ? section.heading : undefined), isMobile),
    ),
  ]

  return <CreamPage accent={landing.accent}>{toBlocks(items)}</CreamPage>
}

/** Runs of cream rows become one block each; everything else stands on the dark. */
function toBlocks(items: Item[]): ReactNode[] {
  const out: ReactNode[] = []
  let run: CreamRow[] = []
  const flush = () => {
    if (run.length > 0) out.push(<CreamBlock key={out.length} rows={run} />)
    run = []
  }
  for (const item of items) {
    if ('free' in item) {
      flush()
      out.push(<Fragment key={out.length}>{item.free}</Fragment>)
    } else {
      run.push(item)
    }
  }
  flush()
  return out
}

function sectionItems(section: StorySection, rules: CreamRules, isMobile: boolean): Item[] {
  const { gap, pad, radius } = creamMetrics(isMobile)

  if (section.kind === 'grid') {
    return [
      {
        rule: rules.above,
        node: (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', gap }}>
            {section.shots.map((shot, i) => (
              // A row arrives together, so its second tile trails the first.
              <CreamMedia key={shot.src} delay={isMobile ? 0 : (i % 2) * 90}>
                <SheetImg shot={shot} />
              </CreamMedia>
            ))}
          </div>
        ),
      },
    ]
  }

  if (section.kind !== 'feature') return []

  // The live sidebar: its copy and controls on a solid cream cell, in ink, the
  // stage in another. The cream runs straight into the block's, so it has no corner.
  if (section.sidebarPlayground) {
    return [
      {
        rule: rules.above,
        node: (
          <SidebarPlayground
            options={section.sidebarPlayground}
            copy={
              <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
                <Reveal>
                  <h2 style={SHEET_HEADING}>{section.heading}</h2>
                </Reveal>
                {section.body && <CreamProse body={section.body} color={INK} />}
              </div>
            }
            radius={`${radius}px`}
            isMobile={isMobile}
            cell={{ gap, style: { background: CREAM, color: INK, padding: pad } }}
          />
        ),
      },
    ]
  }

  const copy: Item = { free: <CreamCopy heading={section.heading} body={section.body} /> }
  if (!section.video && !section.shot) return [copy]
  return [
    {
      rule: rules.above,
      below: rules.copy,
      node: (
        <CreamMedia>
          {section.video ? (
            <SheetClip video={section.video} />
          ) : (
            section.shot && <SheetImg shot={{ src: section.shot.src, alt: section.shot.alt, aspect: section.shot.aspect }} />
          )}
        </CreamMedia>
      ),
    },
    copy,
  ]
}

import { useState, type CSSProperties } from 'react'
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import IconButton from '../design-system/IconButton'
import { color, type } from '../design-system/tokens'
import { projects } from '../data/projects'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The Design tab. A filter rail on the left, a divided list of entries on the
 * right — each one a logo, title and muted blurb on one line, then the links.
 * List rows match Figma node `104:2934` (July 2026 file).
 */

type Link = { kind: 'site' | 'repo'; href: string }

type Row = {
  id: string
  title: string
  /** Logo beside the title. Sized to fit a 16px box, so wordless marks stay legible. */
  logo?: { src: string; width: number; height: number }
  /** Tight line under the title (role + dates). Sits closer than `body`. */
  subhead?: string
  body?: string
  /** `#/...` route for the "View" button. Omitted while the page is undesigned. */
  showcase?: string
  links: Link[]
}

type Filter = { id: string; label: string; rows: Row[] }

const forFun: Row[] = [
  {
    id: 'stat-builder',
    title: projects['stat-builder'].title,
    logo: { src: '/work/logos/stat-builder.png', width: 16, height: 16 },
    body: 'A Destiny 2 armor optimizer for Armor 3.0.',
    showcase: '#/work/stat-builder',
    links: [
      { kind: 'site', href: 'https://d2-stat-builder-dusky.vercel.app/' },
      { kind: 'repo', href: 'https://github.com/NoahHendrickson/d2-stat-builder' },
    ],
  },
  {
    id: 'phanttom',
    title: projects.phanttom.title,
    logo: { src: '/work/logos/phanttom.png', width: 12, height: 17 },
    body: 'My fork of ghostty because i wanted vertical tabs with additional information, and it sounded like fun.',
    showcase: '#/work/phanttom',
    links: [{ kind: 'repo', href: 'https://github.com/NoahHendrickson/phanttom' }],
  },
  {
    id: 'forge',
    title: projects.forge.title,
    logo: { src: '/work/logos/forge.svg', width: 13.333, height: 16 },
    body: 'Experimental Figma-style design mode for your own app and coding agent',
    showcase: '#/work/forge',
    links: [{ kind: 'repo', href: 'https://github.com/NoahHendrickson/the-forge' }],
  },
  {
    id: 'armory',
    title: projects.armory.title,
    logo: { src: '/work/logos/armory.png', width: 16, height: 16 },
    body: 'Command palette style filter and search for Destiny 2 the video game weapons.',
    links: [
      { kind: 'site', href: 'https://noeyarmory.vercel.app/' },
      { kind: 'repo', href: 'https://github.com/NoahHendrickson/noeyarmory' },
    ],
  },
]

const career: Row[] = [
  {
    id: 'invisible',
    title: 'Senior Product Designer - Invisible Technologies',
    subhead: 'Aug 2022 – July 2026.',
    showcase: '#/work/invisible',
    links: [],
  },
]

const FILTERS: Filter[] = [
  { id: 'fun', label: 'Personal projects', rows: forFun },
  { id: 'career', label: 'Career', rows: career },
  { id: 'graphic', label: 'Graphic Design', rows: [] },
]

export default function WorkList() {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(FILTERS[0].id)
  const active = FILTERS.find((f) => f.id === activeId) ?? FILTERS[0]

  const rail = (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        flexWrap: isMobile ? 'wrap' : undefined,
        alignItems: 'flex-start',
        gap: '8px',
      }}
    >
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          size="xs"
          // The active filter is the one filled pill in the rail; the rest read as
          // plain labels until hovered, so the rail stays quiet beside the list.
          variant={filter.id === activeId ? 'secondary' : 'ghost'}
          onClick={() => setActiveId(filter.id)}
          aria-pressed={filter.id === activeId}
          style={filter.id === activeId ? undefined : { borderColor: 'transparent' }}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )

  const list = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {active.rows.length === 0 ? (
        <p
          key={`${activeId}-empty`}
          className="tab-content-in"
          style={{ margin: 0, fontSize: type['body-s'].fontSize, color: color.text.muted }}
        >
          Nothing here yet — still digging through the archive.
        </p>
      ) : (
        active.rows.map((row, i) => (
          <ProjectRow key={row.id} row={row} index={i} isMobile={isMobile} />
        ))
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {rail}
        {list}
      </div>
    )
  }

  // 114px rail + an 80px gutter, matching the Figma file's 80 / 194 / 1240 columns.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: '80px' }}>
      {rail}
      {list}
    </div>
  )
}

const ROW_STAGGER_MS = 60

const titleStyle: CSSProperties = {
  fontSize: type['body-l'].fontSize,
  fontWeight: 400,
  lineHeight: 1.6,
  letterSpacing: '-0.16px',
  color: color.text.primary,
  whiteSpace: 'nowrap',
}

function ProjectRow({
  row,
  index,
  isMobile,
}: {
  row: Row
  index: number
  isMobile: boolean
}) {
  const bodyStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    flex: '1 1 0',
    fontSize: type['body-l'].fontSize,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '-0.16px',
    color: color.text.muted,
    // Desktop matches the file's single-line row; mobile lets the blurb wrap.
    ...(isMobile
      ? {}
      : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
  }

  return (
    <div
      className="tab-content-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${color.border.subtle}`,
        // Cascades each row after the previous when the Design tab (or filter) mounts.
        animationDelay: `${index * ROW_STAGGER_MS}ms`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: row.subhead ? '4px' : 0, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '8px',
            minWidth: 0,
            flexWrap: isMobile ? 'wrap' : undefined,
          }}
        >
          {row.logo && (
            <img
              src={row.logo.src}
              alt=""
              style={{
                width: `${row.logo.width}px`,
                height: `${row.logo.height}px`,
                display: 'block',
                flexShrink: 0,
                marginTop: isMobile ? '4px' : undefined,
              }}
            />
          )}
          <span style={titleStyle}>{row.title}</span>
          {row.body && <p style={bodyStyle}>{row.body}</p>}
        </div>
        {row.subhead && (
          <p
            style={{
              margin: 0,
              fontSize: type['body-s'].fontSize,
              fontWeight: 400,
              lineHeight: 1.5,
              color: color.text.muted,
            }}
          >
            {row.subhead}
          </p>
        )}
      </div>

      {(row.showcase || row.links.length > 0) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.showcase && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => { window.location.hash = row.showcase! }}
            >
              View
            </Button>
          )}
          {row.links.map((link) => (
            <IconButton
              key={link.href}
              size="xs"
              variant="ghost"
              label={link.kind === 'site' ? `${row.title} — live site` : `${row.title} — source on GitHub`}
              icon={link.kind === 'site' ? <ArrowSquareOut size={14} /> : <GithubLogo size={14} />}
              onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import IconButton from '../design-system/IconButton'
import { color, type } from '../design-system/tokens'
import { projects } from '../data/projects'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The Design tab. A filter rail on the left, a divided list of entries on the
 * right — each one a logo, a line of copy, and the links that go with it. This
 * replaced the bento grid in the July 2026 redesign.
 */

type Link = { kind: 'site' | 'repo'; href: string }

type Row = {
  id: string
  title: string
  /** Logo beside the title. Sized to fit a 16px box, so wordless marks stay legible. */
  logo?: { src: string; width: number; height: number }
  body: string
  /** `#/...` route for the "View showcase" button. Omitted while the page is undesigned. */
  showcase?: string
  links: Link[]
  /** Screenshot beside the copy. `chrome` puts the browser bar above it. */
  media?: { src: string; alt: string; aspect: string; frame?: 'chrome' | 'plain' }
}

type Filter = { id: string; label: string; rows: Row[] }

const forFun: Row[] = [
  {
    id: 'stat-builder',
    title: projects['stat-builder'].title,
    logo: { src: '/work/logos/stat-builder.png', width: 16, height: 16 },
    body: 'A Destiny 2 armor optimizer for Armor 3.0. Sign in with Bungie, set targets for the six stats, add the constraints for your build: exotic, set bonuses, fragments, mods, and the optimizer searches your own vault and returns the exact pieces to equip.',
    showcase: '#/work/stat-builder',
    links: [
      { kind: 'site', href: 'https://d2-stat-builder-dusky.vercel.app/' },
      { kind: 'repo', href: 'https://github.com/NoahHendrickson/d2-stat-builder' },
    ],
    media: {
      src: '/work/stat-builder/table.png',
      alt: 'The D2 Stat Builder results table',
      aspect: '259.5 / 177.4',
      frame: 'chrome',
    },
  },
  {
    id: 'phanttom',
    title: projects.phanttom.title,
    logo: { src: '/work/logos/phanttom.png', width: 12, height: 17 },
    body: 'My fork of ghostty because i wanted vertical tabs with additional information, and it sounded like fun.',
    showcase: '#/work/phanttom',
    links: [{ kind: 'repo', href: 'https://github.com/NoahHendrickson/phanttom' }],
    media: {
      src: '/work/phanttom/hero.png',
      alt: 'Phanttom’s vertical tab sidebar',
      aspect: '263 / 185',
    },
  },
  {
    id: 'forge',
    title: projects.forge.title,
    logo: { src: '/work/logos/forge.svg', width: 13.333, height: 16 },
    body: projects.forge.bento.tagline ?? projects.forge.tagline,
    showcase: '#/work/forge',
    links: [{ kind: 'repo', href: 'https://github.com/NoahHendrickson/the-forge' }],
  },
  {
    id: 'armory',
    title: projects.armory.title,
    logo: { src: '/work/logos/armory.png', width: 16, height: 16 },
    body: projects.armory.bento.tagline ?? projects.armory.tagline,
    links: [
      { kind: 'site', href: 'https://noeyarmory.vercel.app/' },
      { kind: 'repo', href: 'https://github.com/NoahHendrickson/noeyarmory' },
    ],
  },
]

const career: Row[] = [
  {
    id: 'invisible',
    title: 'Invisible Technologies',
    body: 'Senior Product Designer, Aug 2022 – July 2026. Lead design on Meridial, Invisible’s talent marketplace for AI training work, plus the 0-1 launch of the Annotations platform.',
    showcase: '#/work/invisible',
    links: [],
  },
]

const FILTERS: Filter[] = [
  { id: 'fun', label: 'For fun projects', rows: forFun },
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
        active.rows.map((row, i) => <ProjectRow key={row.id} row={row} index={i} />)
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

function ProjectRow({ row, index }: { row: Row; index: number }) {
  const isMobile = useIsMobile()

  const copy = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.logo && (
            <img
              src={row.logo.src}
              alt=""
              style={{ width: `${row.logo.width}px`, height: `${row.logo.height}px`, display: 'block' }}
            />
          )}
          <span
            style={{
              fontSize: type['body-l'].fontSize,
              fontWeight: 400,
              lineHeight: 1.6,
              letterSpacing: '-0.16px',
              color: color.text.primary,
            }}
          >
            {row.title}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            maxWidth: '721px',
            fontSize: type['body-s'].fontSize,
            fontWeight: 400,
            lineHeight: 1.5,
            color: color.text.primary,
          }}
        >
          {row.body}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {row.showcase && (
          <Button size="xs" variant="ghost" onClick={() => { window.location.hash = row.showcase! }}>
            View showcase
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
    </div>
  )

  return (
    <div
      className="tab-content-in"
      style={{
        display: 'grid',
        // Copy takes the row; a screenshot, when there is one, sits in a fixed
        // 260px column beside it — the width it has in the Figma file.
        gridTemplateColumns: !isMobile && row.media ? 'minmax(0, 1fr) 260px' : 'minmax(0, 1fr)',
        gap: '32px',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: `1px solid ${color.border.subtle}`,
        // Cascades each row after the previous when the Design tab (or filter) mounts.
        animationDelay: `${index * ROW_STAGGER_MS}ms`,
      }}
    >
      {copy}
      {row.media && !isMobile && <Screenshot media={row.media} />}
    </div>
  )
}

function Screenshot({ media }: { media: NonNullable<Row['media']> }) {
  return (
    <div style={{ borderRadius: '6px', overflow: 'hidden', border: `1px solid ${color.border.subtle}` }}>
      {media.frame === 'chrome' && (
        <img src="/work/browser-bar.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      )}
      {/* Top-pinned and clipped, so a full-page capture shows its first screenful. */}
      <div style={{ width: '100%', aspectRatio: media.aspect, overflow: 'hidden' }}>
        <img src={media.src} alt={media.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </div>
  )
}

import { useState, type CSSProperties } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import Header from './Header'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const PAGE_BG = color.bg.primary
const TEXT = color.text.primary
const BODY = color.text.secondary
const ORANGE = color.accent.default

const WORK_PASSWORD = 'noah2026'
const UNLOCK_KEY = 'work-pages-unlocked'

type Project = {
  title: string
  body: string
  /** When set, shows a ghost View button like the Design tab list. */
  href?: string
}

type Props = {
  title: string
  /** Role line under the page title. */
  subtitle?: string
  description?: string
  projects?: Project[]
}

const DEFAULT_PROJECTS: Project[] = [
  {
    title: 'Revitalizing Meridial’s onboarding flow',
    body: 'A deep research and user behavior focused project that meaningfully improved user experience and business outcomes',
    href: '#/work/invisible/onboarding',
  },
  {
    title: 'Project 2',
    body: 'Coming soon.',
  },
]

const titleStyle: CSSProperties = {
  fontSize: type['heading-m'].fontSize,
  fontWeight: type['heading-m'].fontWeight,
  lineHeight: type['heading-m'].lineHeight,
  letterSpacing: type['heading-m'].letterSpacing,
  color: color.text.primary,
}

export default function WorkPage({ title, subtitle, description, projects = DEFAULT_PROJECTS }: Props) {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCK_KEY) === 'true',
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === WORK_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, 'true')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        color: TEXT,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? space.xl : space['2xl'],
        paddingBottom: isMobile ? '60px' : '120px',
        overflowX: 'clip',
      }}
    >
      <Header active="work" showProfile={false} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? space.xl : space['2xl'],
          padding: isMobile ? `0 20px` : `0 80px`,
          flex: unlocked ? undefined : 1,
          minWidth: 0,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <a
          href="#/work"
          style={{
            alignSelf: 'flex-start',
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
            whiteSpace: 'nowrap',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </a>

        {unlocked ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: space.md,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(28px, 8vw, 80px)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: TEXT,
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: BODY,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {description && (
              <p
                style={{
                  margin: 0,
                  maxWidth: '720px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: BODY,
                }}
              >
                {description}
              </p>
            )}

            <div
              style={{
                marginTop: isMobile ? space.xl : space['2xl'],
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {projects.map((project) => (
                <ProjectRow key={project.title} project={project} isMobile={isMobile} />
              ))}
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: space.lg,
              maxWidth: '360px',
              width: '100%',
            }}
          >
            <label
              htmlFor="work-password"
              style={{
                fontSize: type['heading-m'].fontSize,
                fontWeight: type['heading-m'].fontWeight,
                color: TEXT,
              }}
            >
              Enter password to view work
            </label>
            <input
              id="work-password"
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              autoFocus
              style={{
                padding: `${space.md} ${space.lg}`,
                fontSize: type['body-m'].fontSize,
                fontFamily: 'inherit',
                border: `1px solid ${error ? ORANGE : color.border.default}`,
                borderRadius: radius.md,
                background: color.bg.raised,
                color: TEXT,
                outline: 'none',
              }}
            />
            {error && (
              <span style={{ color: ORANGE, fontSize: type['body-s'].fontSize }}>
                Incorrect password
              </span>
            )}
            <Button type="submit" variant="secondary" size="lg" style={{ width: '100%' }}>
              Unlock
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

/** Same divided-row rhythm as the Design tab's For fun list. */
function ProjectRow({ project, isMobile }: { project: Project; isMobile: boolean }) {
  const bodyStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    fontSize: type['body-l'].fontSize,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '-0.16px',
    color: color.text.muted,
    ...(isMobile
      ? {}
      : {
          flex: '1 1 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }),
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${color.border.subtle}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          // Long project titles (e.g. onboarding) can't sit beside the blurb on a
          // phone — stack them so neither column forces horizontal overflow.
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: '8px',
          minWidth: 0,
        }}
      >
        <span style={{ ...titleStyle, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
          {project.title}
        </span>
        <p style={bodyStyle}>{project.body}</p>
      </div>

      {project.href != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              if (project.href && project.href.startsWith('#/')) {
                window.location.hash = project.href
              }
            }}
          >
            View
          </Button>
        </div>
      )}
    </div>
  )
}

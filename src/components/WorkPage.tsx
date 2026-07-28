import { useState } from 'react'
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
const CARD_BG = color.bg.raised
const LIGHT_CARD_BG = '#e5e5e5'

const WORK_PASSWORD = 'noah2026'
const UNLOCK_KEY = 'work-pages-unlocked'

type ProjectImage = {
  src: string
  alt?: string
  left: string
  top: string
  width: string
  shadow?: 'sm' | 'lg' | 'none'
}

type Project = {
  title: string
  image?: string
  imageAlt?: string
  images?: ProjectImage[]
  accent?: string
  cardBg?: string
  cta?: { label: string; href: string }
}

type Props = {
  title: string
  description?: string
  projects?: Project[]
}

const DEFAULT_PROJECTS: Project[] = [
  {
    title: 'Streamlining a Fragmented Marketplace Onboarding',
    accent: ORANGE,
    cardBg: LIGHT_CARD_BG,
    cta: { label: 'Check it out', href: '#' },
    images: [
      {
        src: '/work/signup.png',
        alt: 'Marketplace skills selection',
        left: '26px',
        top: '120px',
        width: '55%',
        shadow: 'sm',
      },
      {
        src: '/work/ONB%20steps.png',
        alt: 'Marketplace onboarding dashboard',
        left: '296px',
        top: '54px',
        width: '68%',
        shadow: 'none',
      },
    ],
  },
  { title: 'Project 2' },
]

export default function WorkPage({ title, description, projects = DEFAULT_PROJECTS }: Props) {
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
                gap: isMobile ? space['3xl'] : space['5xl'],
              }}
            >
              {projects.map((project) => (
                <ProjectRow key={project.title} project={project} />
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

function ProjectRow({ project }: { project: Project }) {
  if (project.accent) {
    return <AccentedRow project={project} />
  }
  return <PlainRow project={project} />
}

function PlainRow({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const cardBg = project.cardBg ?? CARD_BG
  return (
    <div
      style={
        isMobile
          ? { display: 'flex', flexDirection: 'column', gap: space.xl }
          : {
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
              gap: space['4xl'],
              alignItems: 'center',
            }
      }
    >
      <h2
        style={{
          margin: 0,
          fontSize: isMobile ? '24px' : '30px',
          fontWeight: 500,
          lineHeight: 1.2,
          color: TEXT,
          maxWidth: '510px',
        }}
      >
        {project.title}
      </h2>
      <CardSurface project={project} cardBg={cardBg} radius={isMobile ? radius['3xl'] : radius['4xl']} />
    </div>
  )
}

function AccentedRow({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const cardBg = project.cardBg ?? CARD_BG
  return (
    <div
      style={{
        background: project.accent,
        borderRadius: isMobile ? radius['3xl'] : radius['4xl'],
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        width: '100%',
        gap: isMobile ? '20px' : '40px',
        boxShadow:
          '0px 32px 64px -12px rgba(0,0,0,0.14), 0px 5px 5px -2.5px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          flex: isMobile ? undefined : '1 1 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: space.xl,
          padding: isMobile ? '24px 20px 0' : '20px 20px 20px 40px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(24px, 2.4vw, 30px)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: color.accent.onAccent,
          }}
        >
          {project.title}
        </h2>
        {project.cta && (
          <a
            href={project.cta.href}
            style={{
              alignSelf: 'flex-start',
              background: color.bg.inverse,
              color: color.text.inverse,
              padding: isMobile ? '8px 14px' : '8px 16px',
              borderRadius: radius.full,
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: 500,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {project.cta.label}
          </a>
        )}
      </div>
      <div style={isMobile ? { width: '100%', padding: '0 12px 12px' } : { flex: '0 0 60%' }}>
        <CardSurface project={project} cardBg={cardBg} radius={isMobile ? '20px' : '40px'} />
      </div>
    </div>
  )
}

function CardSurface({
  project,
  cardBg,
  radius: cardRadius,
}: {
  project: Project
  cardBg: string
  radius: string
}) {
  const isMobile = useIsMobile()
  const isLight = cardBg === LIGHT_CARD_BG
  const hasLayered = project.images && project.images.length > 0
  const primaryImage = hasLayered
    ? project.images!.reduce((a, b) => (parseFloat(b.width) > parseFloat(a.width) ? b : a))
    : null

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: cardRadius,
        aspectRatio: isMobile ? 'auto' : '793 / 456',
        minHeight: isMobile ? '200px' : undefined,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile && hasLayered ? '20px' : 0,
      }}
    >
      {hasLayered ? (
        isMobile ? (
          <img
            src={primaryImage!.src}
            alt={primaryImage!.alt ?? ''}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          project.images!.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt ?? ''}
              style={{
                position: 'absolute',
                left: img.left,
                top: img.top,
                width: img.width,
                filter:
                  img.shadow === 'lg'
                    ? 'drop-shadow(0 22px 27px rgba(0,0,0,0.08)) drop-shadow(0 9px 9px rgba(0,0,0,0.03)) drop-shadow(0 3px 3px rgba(0,0,0,0.04))'
                    : img.shadow === 'sm'
                      ? 'drop-shadow(0 11px 13px rgba(0,0,0,0.08)) drop-shadow(0 4px 4px rgba(0,0,0,0.03)) drop-shadow(0 1.6px 1.6px rgba(0,0,0,0.04))'
                      : 'none',
              }}
            />
          ))
        )
      ) : project.image ? (
        <img
          src={project.image}
          alt={project.imageAlt ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            color: isLight ? color.ink.muted : color.text.muted,
            fontSize: '30px',
            fontWeight: 500,
          }}
        >
          placeholder
        </span>
      )}
    </div>
  )
}

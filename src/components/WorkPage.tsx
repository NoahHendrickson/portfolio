import { useState } from 'react'
import { ArrowNarrowLeft } from '@untitledui/icons/ArrowNarrowLeft'
import Header from './Header'
import { useIsMobile } from '../hooks/useIsMobile'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'
const ORANGE = 'var(--color-orange)'
const CARD_BG = '#313131'
const LIGHT_CARD_BG = '#e5e5e5'
const BUTTON_LIGHT = '#ecede6'

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
        background: CREAM_BG,
        color: TEXT_DARK,
        padding: isMobile ? '24px 20px 60px' : '40px 80px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '24px' : '40px',
      }}
    >
      <Header />
      <a
        href="#/"
        style={{
          color: ORANGE,
          fontSize: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          width: 'fit-content',
        }}
      >
        <ArrowNarrowLeft width={16} height={16} />
        Back
      </a>

      {unlocked ? (
        <>
          <h1
            style={{
              margin: isMobile ? '24px 0 0' : '40px 0 0',
              fontSize: 'clamp(28px, 8vw, 80px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
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
                color: TEXT_DARK,
              }}
            >
              {description}
            </p>
          )}

          <div
            style={{
              marginTop: isMobile ? '24px' : '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '48px' : '80px',
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
            gap: '16px',
            maxWidth: '360px',
            width: '100%',
          }}
        >
          <label
            htmlFor="work-password"
            style={{ fontSize: '20px', fontWeight: 500 }}
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
              padding: '12px 16px',
              fontSize: '16px',
              border: `1px solid ${error ? ORANGE : 'rgba(0,0,0,0.2)'}`,
              borderRadius: '8px',
              background: 'transparent',
              color: TEXT_DARK,
              outline: 'none',
            }}
          />
          {error && (
            <span style={{ color: ORANGE, fontSize: '14px' }}>
              Incorrect password
            </span>
          )}
          <button
            type="submit"
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 500,
              background: TEXT_DARK,
              color: CREAM_BG,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Unlock
          </button>
        </form>
      )}
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
          ? { display: 'flex', flexDirection: 'column', gap: '24px' }
          : {
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
              gap: '60px',
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
          color: TEXT_DARK,
          maxWidth: '510px',
        }}
      >
        {project.title}
      </h2>
      <CardSurface project={project} cardBg={cardBg} radius={isMobile ? '32px' : '56px'} />
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
        borderRadius: isMobile ? '32px' : '56px',
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
          gap: '20px',
          padding: isMobile ? '24px 20px 0' : '20px 20px 20px 40px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(24px, 2.4vw, 30px)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: '#ffffff',
          }}
        >
          {project.title}
        </h2>
        {project.cta && (
          <a
            href={project.cta.href}
            style={{
              alignSelf: 'flex-start',
              background: BUTTON_LIGHT,
              color: TEXT_DARK,
              padding: isMobile ? '8px 14px' : '8px 16px',
              borderRadius: '1000px',
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
  radius,
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
        borderRadius: radius,
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
            color: isLight ? '#888' : '#ffffff',
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

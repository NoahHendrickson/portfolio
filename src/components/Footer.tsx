import { useEffect, useRef, useState } from 'react'
import { ArrowSquareOut, Check, Copy } from '@phosphor-icons/react'
import { color, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The shared page footer, from the July 2026 file (`5mDT1eQf2KBcET9dh6kPXd`,
 * node `58:2190`). Up to three columns on an 80px pad with a 120px gutter
 * between them: the two tabs (omitted on Me), the project pages, and the two
 * ways to reach me.
 *
 * It closes every page — the two tabs in `App.tsx` and the story pages — so it
 * sits outside the Me tab's narrow content column and runs the full width.
 *
 * One divergence from the file: it seats the "Back to" links 12px under their
 * heading and the other two columns 32px under theirs, which leaves the first
 * column's links visibly high. All three run on 32 here.
 */

const EMAIL = 'Noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'

type Logo = { src: string; width: number; height: number }

const BACK_TO = [
  { label: 'Me', href: '#/' },
  { label: 'Design', href: '#/work' },
]

/**
 * Moonfang Armory has no story page yet — `#/work/armory` still falls through to
 * the cream `ProjectLanding` — so it points at the live site until it gets one.
 * The current story page is omitted from the list so you don't jump to yourself.
 */
const JUMP_TO: { label: string; href: string; logo: Logo }[] = [
  {
    label: 'Phanttom',
    href: '#/work/phanttom',
    logo: { src: '/work/logos/phanttom.png', width: 12, height: 17 },
  },
  {
    label: 'The Forge',
    href: '#/work/forge',
    logo: { src: '/work/logos/forge.svg', width: 13.333, height: 16 },
  },
  {
    label: 'D2 Stat Builder',
    href: '#/work/stat-builder',
    logo: { src: '/work/logos/stat-builder.png', width: 16, height: 16 },
  },
  {
    label: 'Moonfang Armory',
    href: 'https://noeyarmory.vercel.app/',
    logo: { src: '/work/logos/armory.png', width: 16, height: 16 },
  },
]

export default function Footer({ includeStatBuilder = true }: { includeStatBuilder?: boolean } = {}) {
  const isMobile = useIsMobile()
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const jumpTo = JUMP_TO.filter(
    (link) => link.href !== hash && (includeStatBuilder || link.href !== '#/work/stat-builder'),
  )

  // On Me there is nowhere to "go back" — hide the tab column entirely.
  const isMe = hash === '' || hash === '#' || hash === '#/'

  return (
    <footer
      style={{
        boxSizing: 'border-box',
        width: '100%',
        background: color.bg.primary,
        padding: isMobile ? '48px 20px' : '80px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: isMobile ? '40px' : '120px',
        alignItems: 'flex-start',
      }}
    >
      {!isMe && (
        <Column heading="Back to" width={153}>
          {BACK_TO.map((link) => (
            <FooterLink key={link.href} href={link.href} label={link.label} />
          ))}
        </Column>
      )}

      <Column heading="Jump to" width={153}>
        {jumpTo.map((link) => (
          <FooterLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={
              <img
                src={link.logo.src}
                alt=""
                style={{ width: `${link.logo.width}px`, height: `${link.logo.height}px`, display: 'block' }}
              />
            }
          />
        ))}
      </Column>

      <Column heading="Get in touch">
        <FooterLink
          href={LINKEDIN_URL}
          label="LinkedIn"
          icon={<ArrowSquareOut size={24} />}
        />
        <CopyEmail />
      </Column>
    </footer>
  )
}

/** `width` is the file's column measure — the last column just takes its content. */
function Column({ heading, width, children }: { heading: string; width?: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'], minWidth: width }}>
      <h2 style={{ margin: 0, ...type['heading-l'], color: color.text.muted }}>{heading}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>{children}</div>
    </div>
  )
}

/** The icon column is 24px wide whether or not the row has one, so labels line up. */
const ICON_BOX = 24

/** Shared by the links and the copy button, so the <button> can't drift from the <a>s. */
const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space.md,
  ...type['body-l'],
  color: color.text.primary,
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
  whiteSpace: 'nowrap',
}

function IconSlot({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <span
      style={{
        width: `${ICON_BOX}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  )
}

function FooterLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  const external = !href.startsWith('#')

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={rowStyle}
    >
      <IconSlot>{icon}</IconSlot>
      {label}
    </a>
  )
}

/** The email row copies rather than navigates, so the icon confirms in place. */
function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  return (
    <button
      type="button"
      style={rowStyle}
      aria-label={`Copy ${EMAIL}`}
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL)
        setCopied(true)
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => setCopied(false), 1200)
      }}
    >
      <IconSlot>
        {copied ? <Check size={24} color={color.accent.default} /> : <Copy size={24} />}
      </IconSlot>
      {EMAIL}
    </button>
  )
}

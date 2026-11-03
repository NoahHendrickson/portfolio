import { useEffect, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Copy, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import { resolveOpacity, resolvePalette } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

/**
 * The `md` control's 24 a side read loose on a row of short labels with
 * icons, so these run the `sm` control's 16 at the `md` height.
 */
const PILL_PAD = space.lg

/**
 * The row of contact pills under the Hi tab's tl;dr: the email, LinkedIn and
 * GitHub. The email pill reads "Email me!" with a copy icon after it; a click
 * copies the address and swaps the icon for a check, the way
 * the Contact tab and the name popover do, rather than opening a mail client
 * the visitor may not have set up. The two links open a tab.
 */
export default function ContactButtons() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
      <Button
        variant="secondary"
        size="md"
        style={{ padding: `0 ${PILL_PAD}` }}
        aria-label={copied ? 'Email copied' : `Copy email, ${EMAIL}`}
        trailingIcon={copied ? <Check size={20} color={color.accent.default} /> : <Copy size={20} />}
        onClick={() => {
          navigator.clipboard?.writeText(EMAIL)
          setCopied(true)
        }}
      >
        Email me!
      </Button>
      <LinkPill href={LINKEDIN_URL} icon={<LinkedinLogo size={20} />}>
        LinkedIn
      </LinkPill>
      <LinkPill href={GITHUB_URL} icon={<GithubLogo size={20} />}>
        GitHub
      </LinkPill>
    </div>
  )
}

/**
 * An outbound link dressed as the `md` ghost button. `Button` renders a
 * `<button>`, so this pulls its palette and opacity from `buttonStyles` rather
 * than nesting one in an anchor.
 */
function LinkPill({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const state = hovered ? 'hover' : 'default'
  const palette = resolvePalette('ghost', state)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space.sm,
        height: control.md,
        boxSizing: 'border-box',
        padding: `0 ${PILL_PAD}`,
        borderRadius: radius.full,
        border: `1px solid ${palette.borderColor}`,
        background: palette.background,
        color: palette.color,
        opacity: resolveOpacity('ghost', state),
        ...type['label-l'],
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
    >
      <span style={{ display: 'inline-flex' }} aria-hidden>
        {icon}
      </span>
      {children}
      <span style={{ display: 'inline-flex', color: color.text.muted }} aria-hidden>
        <ArrowUpRight size={16} />
      </span>
    </a>
  )
}

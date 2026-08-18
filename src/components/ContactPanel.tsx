import { useEffect, useState } from 'react'
import { Check, Copy, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { SectionHeading } from './Experience'
import { color, space } from '../design-system/tokens'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space.sm,
  padding: 0,
  border: 'none',
  background: 'none',
  color: color.text.secondary,
  fontFamily: 'inherit',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  letterSpacing: '-0.2px',
  cursor: 'pointer',
  textDecoration: 'none',
}

/**
 * The Contact tab — the same email / LinkedIn / GitHub set the header's
 * ContactMenu drops down, laid out as a panel like the other tabs' content.
 * The email row copies to the clipboard and confirms with a check rather than
 * navigating, the way the old footer's did.
 */
export default function ContactPanel() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.xl,
        maxWidth: '700px',
      }}
    >
      <SectionHeading title="Get in touch" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, alignItems: 'flex-start' }}>
        <button
          type="button"
          style={rowStyle}
          onClick={() => {
            navigator.clipboard?.writeText(EMAIL)
            setCopied(true)
          }}
        >
          {copied ? <Check size={16} color={color.accent.default} /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : EMAIL}</span>
        </button>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={rowStyle}>
          <LinkedinLogo size={16} />
          <span>LinkedIn</span>
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={rowStyle}>
          <GithubLogo size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </section>
  )
}

import { useState, type FormEvent } from 'react'
import Header from './Header'
import Button from '../design-system/Button'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PROJECT_MOBILE_PAD, shellPad } from '../layout'
import { unlock } from '../workGate'

const TEXT = color.text.primary
const BODY = color.text.secondary
const ORANGE = color.accent.default

const WORK_PASSWORD = 'noah2026'

/** Password form shown in place of a locked Invisible case study. */
export default function WorkGate({ onUnlock }: { onUnlock: () => void }) {
  const isMobile = useIsMobile()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const pad = isMobile ? PROJECT_MOBILE_PAD : shellPad()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (input !== WORK_PASSWORD) {
      setError(true)
      return
    }
    unlock()
    onUnlock()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        color: TEXT,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? space.xl : space['2xl'],
        paddingBottom: isMobile ? '60px' : '120px',
        overflowX: 'clip',
      }}
    >
      <Header leading="back" showProfile={false} barInset={pad} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? space.xl : space['2xl'],
          // Shared gutter, so Back/Contact don't jump when the page unlocks.
          padding: `0 ${pad}`,
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
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
            <p style={{ margin: 0, fontSize: type['body-s'].fontSize, color: BODY }}>
              Reach out on LinkedIn to get access.
            </p>
          </div>
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
      </div>
    </div>
  )
}

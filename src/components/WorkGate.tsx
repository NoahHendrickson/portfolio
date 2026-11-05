import { useState, type FormEvent } from 'react'
import { SheetPage } from './Sheet'
import Button from '../design-system/Button'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { FILL, INTRO_PAD, RULE, SHEET_HEADING, TEXT, TEXT_SOFT } from '../sheetStyle'
import { unlock } from '../workGate'

const ORANGE = color.accent.default

const WORK_PASSWORD = 'noah2026'

const EMAIL = 'noahjames017@gmail.com'

/**
 * Password form shown in place of a locked Invisible case study, on the ruled
 * sheet the studies run (`Sheet.tsx`): the header, then the form in a cell on
 * the intro's padding, so Back and Contact sit where they will once it unlocks.
 * The form is centred in its cell, and asks for an email rather than a
 * LinkedIn message (Nov 5 2026).
 */
export default function WorkGate({
  onUnlock,
}: {
  onUnlock: () => void
  /**
   * Ignored: the sheet places Back and Contact itself. Kept so callers that
   * still pass the inset their page used compile unchanged.
   */
  barInset?: string
}) {
  const isMobile = useIsMobile()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

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
    <SheetPage>
      <div
        style={{
          background: FILL,
          padding: isMobile ? `${space['4xl']} ${space.xl}` : `${space['5xl']} ${INTRO_PAD}`,
          borderBottom: RULE,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space.lg,
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
            <label htmlFor="work-password" style={SHEET_HEADING}>
              This one needs a password
            </label>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: SHEET_HEADING.lineHeight, color: TEXT_SOFT }}>
              <a href={`mailto:${EMAIL}`} style={{ color: TEXT, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Email me
              </a>{' '}
              and I’ll send it your way.
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
              // 16 everywhere: iOS Safari zooms the page into any field under
              // 16px when it takes focus, and leaves it zoomed after it unlocks.
              fontSize: '16px',
              fontFamily: 'inherit',
              border: error ? `1px solid ${ORANGE}` : RULE,
              borderRadius: radius.md,
              background: color.bg.raised,
              color: TEXT,
              outline: 'none',
            }}
          />
          {error && <span style={{ color: ORANGE, fontSize: type['body-s'].fontSize }}>Not quite. Try again?</span>}
          <Button type="submit" variant="secondary" size="lg" style={{ width: '100%' }}>
            Unlock
          </Button>
        </form>
      </div>
    </SheetPage>
  )
}

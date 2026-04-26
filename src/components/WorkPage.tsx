import { useState } from 'react'
import { ArrowNarrowLeft } from '@untitledui/icons/ArrowNarrowLeft'
import Header from './Header'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'
const ORANGE = 'var(--color-orange)'

const WORK_PASSWORD = 'noah2026'
const UNLOCK_KEY = 'work-pages-unlocked'

type Props = {
  title: string
}

export default function WorkPage({ title }: Props) {
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
        padding: '80px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
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
              margin: 0,
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: '20px', opacity: 0.6 }}>
            Work coming soon.
          </p>
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

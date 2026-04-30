import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@noey-17/yearn-ui'
import { Copy03 } from '@untitledui/icons/Copy03'
import { LinkedinLogo, GithubLogo } from '@phosphor-icons/react'
import { useIsMobile } from '../hooks/useIsMobile'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

function FilledCaretDown() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M0.5 0.5h11L6 7.5z" />
    </svg>
  )
}

function DiamondDots({ opacity = '0.35' }: { opacity?: string }) {
  const dotStyle: React.CSSProperties = {
    width: '4px',
    height: '4px',
    backgroundColor: `rgba(15,14,14,${opacity})`,
    position: 'absolute',
  }
  return (
    <div style={{ position: 'relative', width: '12px', height: '12px', transform: 'rotate(45deg)' }}>
      <div style={{ ...dotStyle, top: '4px', left: '0' }} />
      <div style={{ ...dotStyle, top: '0', left: '4px' }} />
      <div style={{ ...dotStyle, top: '4px', left: '8px' }} />
      <div style={{ ...dotStyle, top: '8px', left: '4px' }} />
    </div>
  )
}

export default function Header() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const profileSize = isMobile ? 56 : 80

  const [copiedNonce, setCopiedNonce] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const copiedVisible = copiedNonce > 0

  useEffect(() => {
    if (!isOpen) return
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (!copiedVisible) return
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    const timeout = setTimeout(() => setCopiedNonce(0), 1000)
    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(timeout)
    }
  }, [copiedNonce, copiedVisible])

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 6px 8px 10px',
    borderRadius: '6px',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#d4d4d4',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    textDecoration: 'none',
  }

  const copyToClipboard = (value: string, e: React.MouseEvent) => {
    navigator.clipboard?.writeText(value)
    setCursorPos({ x: e.clientX, y: e.clientY })
    setCopiedNonce(n => n + 1)
    setIsOpen(false)
  }

  return (
    <div className="flex items-start justify-between">
      {/* Profile photo + decorative dots + pixel flower */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
        <img
          src="/profile.jpg"
          alt="Noah"
          style={{
            width: `${profileSize}px`,
            height: `${profileSize}px`,
            borderRadius: isMobile ? '14px' : '20px',
            objectFit: 'cover',
          }}
        />
        {!isMobile && (
          <div
            className="flex flex-col items-center justify-between py-1"
            style={{ height: '80px' }}
          >
            <DiamondDots />
            <DiamondDots />
            <DiamondDots />
            <DiamondDots />
          </div>
        )}
        <img
          src="/pixel-flower.png"
          alt=""
          style={{ width: `${profileSize}px`, height: `${profileSize}px`, objectFit: 'contain' }}
        />
      </div>

      {/* Contact button + dropdown */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <Button
          variant="secondary"
          size="md"
          trailingIcon={
            <span
              style={{
                display: 'inline-flex',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            >
              <FilledCaretDown />
            </span>
          }
          className="!bg-[#f95b1c] !text-white !border-[#f95b1c] hover:!bg-[#f95b1c]/90"
          onClick={() => setIsOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          Contact
        </Button>
        {isOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: '280px',
              maxWidth: isMobile ? 'calc(100vw - 40px)' : undefined,
              backgroundColor: '#1d1f1e',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '24px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 20px 24px -4px rgba(0,0,0,0.4), 0 8px 8px -4px rgba(0,0,0,0.3)',
              zIndex: 10,
            }}
          >
            <button
              type="button"
              role="menuitem"
              style={itemStyle}
              onClick={(e) => copyToClipboard(EMAIL, e)}
            >
              <Copy03 width={16} height={16} />
              <span>{EMAIL}</span>
            </button>
            <div
              style={{
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                margin: '4px 0',
              }}
            />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              style={itemStyle}
              onClick={() => setIsOpen(false)}
            >
              <LinkedinLogo size={16} weight="duotone" />
              <span>LinkedIn</span>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              style={itemStyle}
              onClick={() => setIsOpen(false)}
            >
              <GithubLogo size={16} weight="duotone" />
              <span>GitHub</span>
            </a>
          </div>
        )}
      </div>

      {copiedVisible && (
        <>
          <style>{`* { cursor: none !important; }`}</style>
          <div
            style={{
              position: 'fixed',
              top: cursorPos.y,
              left: cursorPos.x,
              transform: 'translate(-50%, -50%)',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: '#1d1f1e',
              color: '#ecede6',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              border: '1px solid rgba(255,255,255,0.16)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              zIndex: 1000,
              whiteSpace: 'nowrap',
            }}
          >
            Copied!
          </div>
        </>
      )}
    </div>
  )
}

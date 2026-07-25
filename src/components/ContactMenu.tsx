import React, { useEffect, useRef, useState } from 'react'
import { CaretDown, Copy, LinkedinLogo, GithubLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

export default function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
    gap: 'var(--space-sm)',
    padding: '8px 6px 8px 10px',
    borderRadius: 'var(--radius-sm)',
    width: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
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
    <div ref={menuRef} style={{ position: 'relative' }}>
      <Button
        variant="primary"
        size="sm"
        trailingIcon={
          <CaretDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          />
        }
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
            maxWidth: 'calc(100vw - 40px)',
            backgroundColor: 'var(--color-bg-raised)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-2xl)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
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
            <Copy size={16} />
            <span>{EMAIL}</span>
          </button>
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--color-border-subtle)',
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
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-raised)',
              color: 'var(--color-bg-inverse)',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              border: '1px solid var(--color-border-default)',
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

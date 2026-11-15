import React, { useEffect, useState } from 'react'
import { CaretDown, Copy, LinkedinLogo, GithubLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import { space } from '../design-system/tokens'
import HungMenu, { MenuDivider, MenuRow } from './HungMenu'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

/*
  Contact's menu hangs from its button the Inlet way (Nov 12 2026): button and
  menu one shape in the accent, morphing open. The shape and its motion are
  `HungMenu`, which the home rail's mobile dropdown shares; here it hangs flush
  with the button's right side and reaches past its left.
*/

export default function ContactMenu() {
  const [copiedNonce, setCopiedNonce] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const copiedVisible = copiedNonce > 0

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

  const copyToClipboard = (value: string, e: React.MouseEvent, close: () => void) => {
    navigator.clipboard?.writeText(value)
    setCursorPos({ x: e.clientX, y: e.clientY })
    setCopiedNonce(n => n + 1)
    close()
  }

  return (
    <>
      <HungMenu
        align="right"
        minWidth={280}
        trigger={({ isOpen, toggle, held }) => (
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
            onClick={toggle}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            // 12 a side rather than 16, to match the Back pill (Nov 4 2026).
            style={{ paddingInline: space.md, position: 'relative', zIndex: 10, ...held }}
          >
            Contact
          </Button>
        )}
      >
        {(close) => (
          <>
            <MenuRow onClick={(e) => copyToClipboard(EMAIL, e, close)}>
              <Copy size={16} weight="fill" />
              <span>{EMAIL}</span>
            </MenuRow>
            <MenuDivider />
            <MenuRow href={LINKEDIN_URL} onClick={close}>
              <LinkedinLogo size={16} weight="fill" />
              <span>LinkedIn</span>
            </MenuRow>
            <MenuRow href={GITHUB_URL} onClick={close}>
              <GithubLogo size={16} weight="fill" />
              <span>GitHub</span>
            </MenuRow>
          </>
        )}
      </HungMenu>

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
    </>
  )
}

import { type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { navigate } from './navigation'

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

/**
 * Internal link that keeps SPA navigation on plain clicks, while still
 * supporting middle-click / open-in-new-tab via the real `href`.
 */
export default function AppLink({
  href,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !isPlainLeftClick(event)) return
        event.preventDefault()
        navigate(href)
      }}
    />
  )
}

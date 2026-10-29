/**
 * The box, in viewport px, that a panel opened from `el` can show in: the
 * visible viewport, narrowed by every ancestor that clips — a scroll
 * container clips on both axes even if it only scrolls one — to its padding
 * box. The visual viewport, where there is one, so a phone's toolbars don't
 * count as room.
 */
export function visibleBox(el: HTMLElement) {
  const view = window.visualViewport
  let left = 0
  let right = window.innerWidth
  let top = view ? view.offsetTop : 0
  let bottom = view ? view.offsetTop + view.height : window.innerHeight
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(node)
    if (overflowX === 'visible' && overflowY === 'visible') continue
    const rect = node.getBoundingClientRect()
    const x = rect.left + node.clientLeft
    const y = rect.top + node.clientTop
    left = Math.max(left, x)
    right = Math.min(right, x + node.clientWidth)
    top = Math.max(top, y)
    bottom = Math.min(bottom, y + node.clientHeight)
  }
  return { left, right, top, bottom }
}

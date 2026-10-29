/**
 * The horizontal span, in viewport px, that a panel opened from `el` can show
 * in: the viewport, narrowed by every ancestor that clips — a scroll
 * container clips on both axes even if it only scrolls one — to its padding
 * box.
 */
export function visibleSpan(el: HTMLElement): [number, number] {
  let min = 0
  let max = window.innerWidth
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(node)
    if (overflowX === 'visible' && overflowY === 'visible') continue
    const rect = node.getBoundingClientRect()
    const left = rect.left + node.clientLeft
    min = Math.max(min, left)
    max = Math.min(max, left + node.clientWidth)
  }
  return [min, max]
}

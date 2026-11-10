/*
  Light / dark. The theme is `data-theme` on <html>, which the colour tokens in
  `index.css` key off. An inline script in `index.html` sets it from the same
  storage key before first paint, so the page never flashes the other theme.
  Light is the default (Nov 9 2026): only a stored "dark" gives dark.
*/

export type Theme = 'dark' | 'light'

const KEY = 'theme'
const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function subscribeToTheme(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setTheme(theme: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = theme
    listeners.forEach((listener) => listener())
  }
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Private windows can refuse storage; the switch still holds for this page.
  }
  // A cross-fade where the browser has one, since nearly every colour changes.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!still && document.startViewTransition) document.startViewTransition(apply)
  else apply()
}

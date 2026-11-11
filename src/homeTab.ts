/**
 * The home page's hover-tabs (Figma section `321:38613`). The whole page
 * lives on `/`, so the active tab is session state rather than a path — it
 * survives refresh and Back from a project page, but a shared link always
 * opens on Me. The projects run under Me's copy, so there is no Work tab.
 */
export type HomeTab = 'me' | 'design' | 'been' | 'contact' | 'lols' | 'texture'

/** Texture, the pixel-texture playground, is a reference kept off the published site: dev server only. */
export const HOME_TAB_IDS: HomeTab[] = ['me', 'been', 'design', 'contact', 'lols', ...(import.meta.env.DEV ? (['texture'] as const) : [])]

const HOME_TAB_KEY = 'home-tab'

export function readHomeTab(): HomeTab {
  const tab = sessionStorage.getItem(HOME_TAB_KEY)
  return HOME_TAB_IDS.includes(tab as HomeTab) ? (tab as HomeTab) : 'me'
}

export function writeHomeTab(tab: HomeTab) {
  sessionStorage.setItem(HOME_TAB_KEY, tab)
}

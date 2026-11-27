/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** D2 Conflux's origin for the live component playground; defaults to the live site. */
  readonly VITE_CONFLUX_ORIGIN?: string
  /** Dev only: 1, or a Cinnabar Studio URL, previews the site in Cinnabar Studio's live fonts (src/cinnabarLive.ts). */
  readonly VITE_CINNABAR_LIVE?: string
}

declare module '@noey-17/yearn-ui'

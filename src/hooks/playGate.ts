import { createContext } from 'react'

/**
 * Whether a clip inside may start yet. True outside any gate; a card that wants its
 * clip held until it has finished arriving provides false until then (`CurvedCard`).
 */
export const PlayGate = createContext(true)

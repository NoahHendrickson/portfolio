import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { IconContext } from '@phosphor-icons/react'
import './index.css'
import App from './App'
import ThemeToggle from './components/ThemeToggle'
import PrototypeToggle from './components/PrototypeToggle'
import { ICON_DEFAULTS } from './design-system/icons'
import { redirectHashRoute } from './navigation'

redirectHashRoute()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Duotone is the system's icon weight — set once here so no call site has to pass it. */}
    <IconContext.Provider value={ICON_DEFAULTS}>
      <App />
      <ThemeToggle />
      {/* Hi's A / B prototype switch, on the dev server only. */}
      {import.meta.env.DEV && <PrototypeToggle />}
    </IconContext.Provider>
    <Analytics />
  </StrictMode>,
)

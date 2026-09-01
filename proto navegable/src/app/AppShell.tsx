import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useForcedViewport } from '@/core/session/forcedViewport'
import { ChatBubble } from '@/shared/layout/ChatBubble'
import { Footer } from '@/shared/layout/Footer'
import { Header } from '@/shared/layout/Header'
import { Sidebar } from '@/shared/layout/Sidebar'
import { cn } from '@/shared/lib/cn'
import { HubAccessButton } from './HubAccessButton'
import styles from './AppShell.module.css'

/**
 * Chrome de la aplicación: header fijo, sidebar (riel desktop / cajón mobile)
 * y contenido. Es el punto de partida de cualquier pantalla nueva sobre esta
 * base — no tiene navegación real, sólo el chrome visual de MiCorreo.
 *
 * La clase `force-mobile` (global, no un módulo CSS) se agrega acá cuando
 * el switch "Responsive" del panel "Casos de uso" está activo. Header,
 * Sidebar y este mismo componente tienen reglas `:global(.force-mobile)`
 * en sus `.module.css` que replican el estado real de `max-width: 767.98px`
 * sin depender del ancho real de la ventana — ver
 * `core/session/forcedViewport.ts`.
 */
export function AppShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isResponsive } = useForcedViewport()

  return (
    <div className={cn(isResponsive && 'force-mobile')}>
      <Header onToggleSidebar={() => setIsDrawerOpen(true)} />
      <Sidebar isDrawerOpen={isDrawerOpen} onCloseDrawer={() => setIsDrawerOpen(false)} />

      <div className={styles.shell}>
        <div className={styles.main}>
          <Outlet />
        </div>
        <Footer />
      </div>

      <ChatBubble />
      <HubAccessButton />
    </div>
  )
}

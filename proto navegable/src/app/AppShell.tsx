import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ChatBubble } from '@/shared/layout/ChatBubble'
import { Footer } from '@/shared/layout/Footer'
import { Header } from '@/shared/layout/Header'
import { Sidebar } from '@/shared/layout/Sidebar'
import { HubAccessButton } from './HubAccessButton'
import styles from './AppShell.module.css'

/**
 * Chrome de la aplicación: header fijo, sidebar (riel desktop / cajón mobile)
 * y contenido. Es el punto de partida de cualquier pantalla nueva sobre esta
 * base — no tiene navegación real, sólo el chrome visual de MiCorreo.
 */
export function AppShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
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
    </>
  )
}

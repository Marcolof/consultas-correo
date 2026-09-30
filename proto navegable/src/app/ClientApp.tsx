import { useState } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useForcedViewport } from '@/core/session/forcedViewport'
import { ChatBubble } from '@/shared/layout/ChatBubble'
import { Footer } from '@/shared/layout/Footer'
import { Header } from '@/shared/layout/Header'
import { Sidebar } from '@/shared/layout/Sidebar'
import { cn } from '@/shared/lib/cn'
import { AyudaPage } from '@/v3/pages/AyudaPage'
import { FormularioPage } from '@/v3/pages/FormularioPage'
import { AppProviders } from './providers'
import styles from './AppShell.module.css'

/**
 * App del paquete para cliente: sólo V3, con rutas por hash (`#/v3`) para
 * que funcione abriendo el HTML con doble clic (sin servidor).
 *
 * Es a propósito una copia reducida de `AppShell` + `AppRouter`: no importa
 * `HubAccessButton` (que trae el enlace al Hub publicado) ni las páginas de
 * V1/V2, así nada de eso queda dentro del bundle que se entrega.
 */
function ClientShell() {
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
    </div>
  )
}

export function ClientApp() {
  return (
    <HashRouter>
      <AppProviders>
        <Routes>
          <Route element={<ClientShell />}>
            <Route path="v3" element={<AyudaPage />} />
            <Route path="v3/formulario" element={<FormularioPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/v3" replace />} />
        </Routes>
      </AppProviders>
    </HashRouter>
  )
}

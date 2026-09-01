import type { ReactNode } from 'react'
import { ToastProvider } from '@/shared/ui/Toast'

export interface AppProvidersProps {
  readonly children: ReactNode
}

/**
 * Providers globales de la base. Hoy sólo la cola de notificaciones
 * (`ToastProvider`, usada por `Alert`/`Toast`). Si la pantalla real necesita
 * sesión, feature flags, etc., se agregan acá.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>
}

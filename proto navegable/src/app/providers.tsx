import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ActiveUseCaseContext, DEFAULT_ACTIVE_PROFILE } from '@/core/session/activeUseCase'
import type { ActiveUseCaseContextValue } from '@/core/session/activeUseCase'
import { ForcedViewportContext } from '@/core/session/forcedViewport'
import type { ForcedViewportContextValue } from '@/core/session/forcedViewport'
import { ToastProvider } from '@/shared/ui/Toast'

export interface AppProvidersProps {
  readonly children: ReactNode
}

/**
 * Providers globales de la base: la cola de notificaciones
 * (`ToastProvider`, usada por `Alert`/`Toast`), el "caso de uso" activo
 * (qué perfil de usuario se simula — `core/session/activeUseCase.ts`) y el
 * modo responsive forzado (`core/session/forcedViewport.ts`).
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [profileId, setProfileId] = useState(DEFAULT_ACTIVE_PROFILE)
  const [isResponsive, setIsResponsive] = useState(false)

  const activeUseCaseValue: ActiveUseCaseContextValue = useMemo(
    () => ({ profileId, setProfileId }),
    [profileId],
  )

  const forcedViewportValue: ForcedViewportContextValue = useMemo(
    () => ({ isResponsive, setIsResponsive }),
    [isResponsive],
  )

  return (
    <ActiveUseCaseContext.Provider value={activeUseCaseValue}>
      <ForcedViewportContext.Provider value={forcedViewportValue}>
        <ToastProvider>{children}</ToastProvider>
      </ForcedViewportContext.Provider>
    </ActiveUseCaseContext.Provider>
  )
}

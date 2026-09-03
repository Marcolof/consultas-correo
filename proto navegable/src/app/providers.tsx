import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ActiveUseCaseContext, DEFAULT_ACTIVE_PROFILE } from '@/core/session/activeUseCase'
import type { ActiveUseCaseContextValue } from '@/core/session/activeUseCase'
import { ForcedViewportContext } from '@/core/session/forcedViewport'
import type { ForcedViewportContextValue } from '@/core/session/forcedViewport'
import { readQueryParam } from '@/core/session/deepLink'
import { USER_PROFILES } from '@/core/gestiones/categories'
import { ToastProvider } from '@/shared/ui/Toast'

export interface AppProvidersProps {
  readonly children: ReactNode
}

/**
 * Providers globales de la base: la cola de notificaciones
 * (`ToastProvider`, usada por `Alert`/`Toast`), el "caso de uso" activo
 * (qué perfil de usuario se simula — `core/session/activeUseCase.ts`) y el
 * modo responsive forzado (`core/session/forcedViewport.ts`).
 *
 * `profileId` e `isResponsive` aceptan un valor inicial por query string
 * (`?profile=franquicias`, `?responsive=1`) — ver `core/session/deepLink.ts`.
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [profileId, setProfileId] = useState(() => {
    const fromUrl = readQueryParam('profile')
    return USER_PROFILES.some((p) => p.id === fromUrl)
      ? (fromUrl as typeof DEFAULT_ACTIVE_PROFILE)
      : DEFAULT_ACTIVE_PROFILE
  })
  const [isResponsive, setIsResponsive] = useState(() => readQueryParam('responsive') === '1')

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

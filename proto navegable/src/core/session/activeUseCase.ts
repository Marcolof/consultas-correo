/**
 * "Caso de uso" activo del prototipo: qué perfil de usuario se está
 * simulando (Individuo / Franquicias / Fulfillment).
 *
 * Es un mecanismo de PROTOTIPO, no de producción: no hay autenticación real
 * ni permisos — es la forma de mostrar cómo cambia el listado de Reclamos
 * según el perfil, controlable desde el panel "Casos de uso" del botón
 * flotante (ver `app/HubAccessButton.tsx`). Pensado para escalar: el día que
 * haya más perfiles o condiciones, se agregan acá y en
 * `core/reclamos/reasonProfiles.ts`, sin tocar el mecanismo de contexto.
 */
import { createContext, useContext } from 'react'
import { DEFAULT_RECLAMO_PROFILE } from '@/core/reclamos/reasonProfiles'
import type { ReasonProfileId } from '@/core/reclamos/reasonProfiles'

export interface ActiveUseCaseContextValue {
  readonly profileId: ReasonProfileId
  readonly setProfileId: (id: ReasonProfileId) => void
}

export const ActiveUseCaseContext = createContext<ActiveUseCaseContextValue | null>(null)

export const DEFAULT_ACTIVE_PROFILE = DEFAULT_RECLAMO_PROFILE

/** Acceso al caso de uso activo. Falla fuerte si falta el provider. */
export function useActiveUseCase(): ActiveUseCaseContextValue {
  const context = useContext(ActiveUseCaseContext)
  if (context === null) {
    throw new Error('useActiveUseCase() necesita estar dentro de un <ActiveUseCaseProvider>.')
  }
  return context
}

/**
 * "Caso de uso" activo del prototipo: qué tipo de usuario se está
 * simulando (Individuo / Pyme / Franquicias / Fulfillment).
 *
 * Es un mecanismo de PROTOTIPO, no de producción: no hay autenticación real
 * ni permisos — es la forma de mostrar cómo cambian las categorías (chips)
 * visibles en "Mis gestiones" según el tipo de usuario, controlable desde
 * el panel "Casos de uso" del botón flotante (ver `app/HubAccessButton.tsx`).
 * La regla de visibilidad vive en `core/gestiones/categories.ts` (dato,
 * no lógica hardcodeada): agregar un tipo de usuario nuevo o cambiar qué
 * categorías ve cada uno es editar `data/categorias-gestiones.json`, sin
 * tocar este archivo.
 */
import { createContext, useContext } from 'react'
import { DEFAULT_USER_PROFILE } from '@/core/gestiones/categories'
import type { UserProfileId } from '@/core/gestiones/categories'

export interface ActiveUseCaseContextValue {
  readonly profileId: UserProfileId
  readonly setProfileId: (id: UserProfileId) => void
}

export const ActiveUseCaseContext = createContext<ActiveUseCaseContextValue | null>(null)

export const DEFAULT_ACTIVE_PROFILE = DEFAULT_USER_PROFILE

/** Acceso al caso de uso activo. Falla fuerte si falta el provider. */
export function useActiveUseCase(): ActiveUseCaseContextValue {
  const context = useContext(ActiveUseCaseContext)
  if (context === null) {
    throw new Error('useActiveUseCase() necesita estar dentro de un <ActiveUseCaseProvider>.')
  }
  return context
}

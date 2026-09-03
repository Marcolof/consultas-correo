/**
 * Switches del panel "Casos de uso" para mostrar, a demanda, las
 * categorías que hoy están ocultas por no tener contenido real todavía
 * (ver `HIDDEN_BY_DEFAULT_CATEGORY_IDS` en `core/gestiones/categories.ts`).
 *
 * Es tooling de prototipo, no una preferencia de usuario real: por defecto
 * ambas categorías quedan ocultas (chip + "Todos"); activar un switch las
 * agrega a las dos partes a la vez, porque comparten la misma fuente
 * (`visibleCategories` en `ReclamosListPage.tsx`).
 */
import { createContext, useContext } from 'react'

export interface CategoryTogglesContextValue {
  readonly showPaqueteriaInternacional: boolean
  readonly setShowPaqueteriaInternacional: (value: boolean) => void
  readonly showComunicacionesDigitales: boolean
  readonly setShowComunicacionesDigitales: (value: boolean) => void
}

export const CategoryTogglesContext = createContext<CategoryTogglesContextValue | null>(null)

/** Acceso a los switches de categorías ocultas. Falla fuerte si falta el provider. */
export function useCategoryToggles(): CategoryTogglesContextValue {
  const context = useContext(CategoryTogglesContext)
  if (context === null) {
    throw new Error('useCategoryToggles() necesita estar dentro de un <CategoryTogglesContext.Provider>.')
  }
  return context
}

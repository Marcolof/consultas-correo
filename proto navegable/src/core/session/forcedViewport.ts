/**
 * "Modo responsive" forzado del prototipo — previsualiza el layout mobile
 * (sidebar colapsado, header vacío salvo hamburguesa) sin necesidad de
 * angostar la ventana real. Es tooling de prototipo (panel "Casos de uso"),
 * no un comportamiento real de MiCorreo.
 *
 * Se aplica agregando la clase global `force-mobile` en `AppShell` (ver
 * `AppShell.tsx`); los `.module.css` de Header/Sidebar/AppShell tienen
 * reglas `:global(.force-mobile) ...` que replican exactamente el mismo
 * estado que el breakpoint real (`max-width: 767.98px`), para que no haya
 * divergencia entre "mobile real" y "mobile forzado".
 */
import { createContext, useContext } from 'react'

export interface ForcedViewportContextValue {
  readonly isResponsive: boolean
  readonly setIsResponsive: (value: boolean) => void
}

export const ForcedViewportContext = createContext<ForcedViewportContextValue | null>(null)

export function useForcedViewport(): ForcedViewportContextValue {
  const context = useContext(ForcedViewportContext)
  if (context === null) {
    throw new Error('useForcedViewport() necesita estar dentro de un <ForcedViewportContext.Provider>.')
  }
  return context
}

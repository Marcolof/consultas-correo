import { useEffect, useRef, useState } from 'react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { useForcedViewport } from '@/core/session/forcedViewport'
import { readQueryParam } from '@/core/session/deepLink'
import { USER_PROFILES } from '@/core/gestiones/categories'
import { ChipGroup } from '@/shared/ui/ChipGroup'
import { Modal } from '@/shared/ui/Modal'
import { Switch } from '@/shared/ui/Switch'
import { cn } from '@/shared/lib/cn'
import styles from './HubAccessButton.module.css'

/**
 * URL del Hub del proyecto (ver Reclamos claude/hub/index.html).
 * Deployado en Vercel (proyecto "consultas-correo-v1", Root Directory="hub").
 */
const HUB_URL = 'https://consultas-correo-v1.vercel.app/'

function GridIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

/**
 * Acceso flotante a herramientas del prototipo (NO es chrome de producción
 * de MiCorreo — es tooling de este proyecto, separado a propósito del
 * `ChatBubble`, que sí replica el sitio real).
 *
 * Al tocarlo despliega 2 opciones:
 *   1. "Volver al Hub" — navega al Hub del proyecto.
 *   2. "Casos de uso" — abre un panel con 2 secciones:
 *      - "Usuarios": simula el tipo de usuario activo (Individuo / Pyme /
 *        Franquicias / Fulfillment), que determina qué categorías (chips)
 *        se ven en el listado de "Mis gestiones" — ver
 *        `core/gestiones/categories.ts` (`visibleCategoriesForProfile`).
 *      - "Pantalla": switch "Responsive" que fuerza el layout mobile
 *        (sidebar colapsado, header vacío salvo hamburguesa) sin necesidad
 *        de angostar la ventana real — ver `core/session/forcedViewport.ts`.
 *
 * (2026-09-02, restaurado el mismo día que se había sacado): la sección
 * "Usuarios" había quedado superada por las 7 categorías fijas, pero el
 * usuario aclaró que el tipo de usuario SÍ sigue impactando qué categorías
 * son visibles — sólo que ahora son 4 tipos (se agregó "Pyme") y la
 * visibilidad es sobre categorías, no sobre el eje motivo×perfil anterior
 * (`core/reclamos/*`, que sigue sin usarse).
 */
export function HubAccessButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(() => readQueryParam('useCases') === '1')
  const menuRef = useRef<HTMLDivElement>(null)
  const { profileId, setProfileId } = useActiveUseCase()
  const { isResponsive, setIsResponsive } = useForcedViewport()

  useEffect(() => {
    if (!isMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current !== null && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label="Herramientas del prototipo"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <GridIcon />
      </button>

      {isMenuOpen && (
        <div className={styles.menu} role="menu">
          <a
            href={HUB_URL}
            className={cn(styles.menuItem)}
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Volver al Hub
          </a>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setIsUseCasesOpen(true)
              setIsMenuOpen(false)
            }}
          >
            Casos de uso
          </button>
        </div>
      )}

      <Modal
        isOpen={isUseCasesOpen}
        onClose={() => setIsUseCasesOpen(false)}
        title="Casos de uso"
        size="md"
      >
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Usuarios</h3>
          <ChipGroup
            items={USER_PROFILES}
            activeId={profileId}
            onChange={setProfileId}
            ariaLabel="Tipo de usuario activo"
          />
        </div>

        <hr className={styles.sectionDivider} />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Pantalla</h3>
          <Switch
            id="responsive-toggle"
            label="Responsive"
            description="Muestra el front en modo mobile sin cambiar el tamaño de la ventana."
            checked={isResponsive}
            onChange={setIsResponsive}
          />
        </div>

        {/* Futuras secciones van acá, como hermanas de "Usuarios" y "Pantalla". */}
      </Modal>
    </div>
  )
}

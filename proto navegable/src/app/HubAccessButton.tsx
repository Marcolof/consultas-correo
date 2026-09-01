import styles from './HubAccessButton.module.css'

/** URL local del Hub del proyecto (ver Reclamos claude/hub/index.html). */
const HUB_URL = 'http://localhost:4311/hub/'

/**
 * Botón flotante de acceso al Hub del proyecto.
 *
 * NO es chrome de producción de MiCorreo — es tooling de este prototipo,
 * separado a propósito del `ChatBubble` (que sí replica el sitio real).
 *
 * Por ahora sólo navega al Hub. La idea a futuro es que este mismo botón
 * abra un modal con dos opciones: "Volver al Hub" y "Casos de uso" (un
 * panel de tweaks). Cuando eso exista, reemplazar el `<a>` de acá por un
 * botón que abra ese modal, reutilizando `shared/ui/Modal`.
 */
export function HubAccessButton() {
  return (
    <a
      href={HUB_URL}
      className={styles.button}
      aria-label="Volver al Hub del proyecto"
      title="Volver al Hub"
    >
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      </svg>
    </a>
  )
}

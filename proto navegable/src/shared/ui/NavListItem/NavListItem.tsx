import { cn } from '@/shared/lib/cn'
import styles from './NavListItem.module.css'

export interface NavListItemProps {
  readonly label: string
  readonly onClick?: () => void
  readonly className?: string
}

function ArrowRightIcon() {
  return (
    <svg
      className={styles.arrow}
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8.146 2.646a.5.5 0 0 1 .708 0l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708L12.293 8.5H2.5a.5.5 0 0 1 0-1h9.793L8.146 3.354a.5.5 0 0 1 0-.708z" />
    </svg>
  )
}

/**
 * Fila clickeable de una lista: label a la izquierda, flecha a la derecha.
 * No sabe a dónde lleva — quien lo usa decide el `onClick` (navegar, abrir
 * un detalle, etc.).
 */
export function NavListItem({ label, onClick, className }: NavListItemProps) {
  return (
    <button type="button" className={cn(styles.item, className)} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      <ArrowRightIcon />
    </button>
  )
}

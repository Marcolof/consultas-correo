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
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.293 4.29289C11.6835 3.90237 12.3165 3.90237 12.707 4.29289L19.707 11.2929C20.0976 11.6834 20.0976 12.3164 19.707 12.707L12.707 19.707C12.3165 20.0975 11.6835 20.0975 11.293 19.707C10.9024 19.3164 10.9024 18.6834 11.293 18.2929L16.5859 12.9999H5C4.44772 12.9999 4 12.5522 4 11.9999C4 11.4476 4.44772 10.9999 5 10.9999H16.5859L11.293 5.70696L11.2246 5.63078C10.9043 5.23801 10.9269 4.65901 11.293 4.29289Z" />
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

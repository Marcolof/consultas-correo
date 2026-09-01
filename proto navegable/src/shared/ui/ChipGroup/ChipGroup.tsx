import { cn } from '@/shared/lib/cn'
import styles from './ChipGroup.module.css'

export interface ChipItem<TId extends string> {
  readonly id: TId
  readonly label: string
}

export interface ChipGroupProps<TId extends string> {
  readonly items: readonly ChipItem<TId>[]
  readonly activeId: TId
  readonly onChange: (id: TId) => void
  readonly ariaLabel?: string
  readonly className?: string
}

/**
 * Filtro de selección única en píldoras (p. ej. "Tipos de Reclamos").
 *
 * Distinto de `Tabs`: el ítem activo es un fondo azul de marca sólido, no
 * amarillo — Tabs navega entre paneles, ChipGroup filtra/segmenta una lista.
 * No sabe qué representa cada `id`: quien lo usa decide el universo de
 * opciones (por eso es genérico en `TId`).
 */
export function ChipGroup<TId extends string>({
  items,
  activeId,
  onChange,
  ariaLabel,
  className,
}: ChipGroupProps<TId>) {
  return (
    <div className={cn(styles.group, className)} role="group" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            className={cn(styles.chip, isActive && styles.chipActive)}
            aria-pressed={isActive}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

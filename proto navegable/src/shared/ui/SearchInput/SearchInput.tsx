import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './SearchInput.module.css'

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id' | 'type' | 'value' | 'onChange'
>

export interface SearchInputProps extends NativeInputProps {
  readonly id: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder?: string
  readonly ariaLabel?: string
  readonly className?: string
}

function SearchIcon() {
  return (
    <svg className={styles.icon} width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.398 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Buscador de una sola línea. A diferencia de `Input`, no lleva label
 * flotante: es un patrón distinto (placeholder siempre visible), no una
 * variante del mismo componente — por eso no comparte `Field`.
 */
export function SearchInput({
  id,
  value,
  onChange,
  placeholder = 'Buscar…',
  ariaLabel,
  className,
  ...rest
}: SearchInputProps) {
  return (
    <div className={cn(styles.wrap, className)}>
      <SearchIcon />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={styles.input}
        {...rest}
      />
    </div>
  )
}

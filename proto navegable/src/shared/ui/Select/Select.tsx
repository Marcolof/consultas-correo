import { useState } from 'react'
import type { SelectHTMLAttributes } from 'react'
import type { SelectOption } from '@/core/types/common'
import { cn } from '@/shared/lib/cn'
import { Field, fieldControlClasses, fieldDescribedBy } from '@/shared/ui/Field'
import styles from './Select.module.css'

type NativeSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'className' | 'id' | 'aria-describedby' | 'children'
>

export interface SelectProps extends NativeSelectProps {
  readonly id: string
  readonly label: string
  readonly options: readonly SelectOption[]
  readonly error?: string | null
  readonly hint?: string
  /** Marca el marco en rojo sin mostrar texto de apoyo (ver `Input`). */
  readonly invalid?: boolean
  readonly tooltip?: string
  readonly className?: string
  /**
   * Texto de la opción vacía. El original usa `"-"` con value `"-1"`.
   * Pasar `null` si el select no debe ofrecer opción vacía.
   */
  readonly placeholderOption?: string | null
  readonly placeholderOptionValue?: string
  /**
   * Con el select vacío y sin foco, el label descansa en el lugar del texto
   * (como en un `Input`) y sube al enfocar o al elegir. La opción vacía sigue
   * en la lista, pero su texto no se ve con el desplegable cerrado.
   * Requiere `value` controlado.
   */
  readonly labelEnReposo?: boolean
}

/**
 * Desplegable con label flotante.
 *
 * A diferencia del `Input`, el label de un `<select>` está SIEMPRE arriba: el
 * control muestra una opción desde el principio, así que no existe el estado
 * "vacío" que en un input mantiene el label centrado. Es el mismo criterio del
 * CSS original (`.form-floating > .form-select ~ label`).
 */
export function Select({
  id,
  label,
  options,
  error,
  hint,
  invalid = false,
  tooltip,
  className,
  placeholderOption = '-',
  placeholderOptionValue = '-1',
  labelEnReposo = false,
  onFocus,
  onBlur,
  ...rest
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasError = error !== undefined && error !== null && error !== ''
  const showInvalid = hasError || invalid
  const hasHint = hint !== undefined && hint !== ''
  const vacio = labelEnReposo && rest.value !== undefined && String(rest.value) === placeholderOptionValue
  const reposo = vacio && !isFocused

  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
      className={className}
      floatLabel={!reposo}
      labelActive={isFocused}
    >
      <select
        id={id}
        title={tooltip}
        aria-invalid={showInvalid || undefined}
        aria-describedby={fieldDescribedBy(id, { hasHint, hasError })}
        className={cn(
          fieldControlClasses.control,
          styles.select,
          reposo && styles.selectReposo,
          showInvalid && fieldControlClasses.controlInvalid,
        )}
        onFocus={(event) => {
          setIsFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsFocused(false)
          onBlur?.(event)
        }}
        {...rest}
      >
        {placeholderOption !== null && (
          <option value={placeholderOptionValue}>{placeholderOption}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

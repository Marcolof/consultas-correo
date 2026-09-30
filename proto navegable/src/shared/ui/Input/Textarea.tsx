import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Field, fieldControlClasses, fieldDescribedBy } from '@/shared/ui/Field'
import styles from './Textarea.module.css'

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'id' | 'aria-describedby'
>

export interface TextareaProps extends NativeTextareaProps {
  readonly id: string
  readonly label: string
  readonly error?: string | null
  readonly hint?: string
  readonly tooltip?: string
  readonly className?: string
  /**
   * Muestra `caracteres / maxLength` en la base del campo. Requiere
   * `maxLength` y un `value` controlado.
   */
  readonly showCounter?: boolean
}

/**
 * Área de texto con label flotante. Vive junto a `Input` porque comparte todo
 * su comportamiento; sólo cambia el alto y la posición de reposo del label.
 */
export function Textarea({
  id,
  label,
  error,
  hint,
  tooltip,
  className,
  placeholder,
  showCounter = false,
  ...rest
}: TextareaProps) {
  const hasError = error !== undefined && error !== null && error !== ''
  const hasHint = hint !== undefined && hint !== ''
  const conContador = showCounter && rest.maxLength !== undefined
  const largo = typeof rest.value === 'string' ? rest.value.length : 0

  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
      labelVariant="textarea"
      className={className}
      adornment={
        conContador ? (
          <span className={styles.contador} aria-live="polite">
            {largo}/{rest.maxLength}
          </span>
        ) : undefined
      }
    >
      <textarea
        id={id}
        placeholder={placeholder ?? label}
        title={tooltip}
        aria-invalid={hasError || undefined}
        aria-describedby={fieldDescribedBy(id, { hasHint, hasError })}
        className={cn(
          fieldControlClasses.control,
          fieldControlClasses.controlTextarea,
          hasError && fieldControlClasses.controlInvalid,
          conContador && styles.conContador,
        )}
        {...rest}
      />
    </Field>
  )
}

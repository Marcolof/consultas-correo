/**
 * Tipos transversales de la base de UI.
 *
 * Sólo lo mínimo que consumen los primitivos de `shared/ui`. Este proyecto es
 * chrome + design system: no modela entidades de negocio (envíos, reclamos,
 * etc.) — eso lo agrega cada pantalla que se construya sobre esta base.
 */

/** Opción de un `Select`. */
export interface SelectOption {
  readonly value: string
  readonly label: string
  readonly disabled?: boolean
}

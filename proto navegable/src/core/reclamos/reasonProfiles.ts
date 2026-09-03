/**
 * Motivos de reclamo por perfil de usuario.
 *
 * Fuente de verdad: definición funcional provista por el usuario el
 * 2026-09-01 (ver `documentation/motivos-reclamo-por-perfil.md` en la raíz
 * del proyecto). El JSON de acá (`data/motivos-reclamo-por-perfil.json`) es
 * la única copia — consolidado 2026-09-02, antes también vivía duplicado
 * en `documentation/data/`.
 *
 * SUPERSEDED (2026-09-02): esta regla ya no filtra nada en la pantalla de
 * "Mis gestiones" — ver `core/gestiones/categories.ts`.
 */
import rawData from './data/motivos-reclamo-por-perfil.json'

/** Perfiles de usuario definidos hoy. Ampliable — ver el JSON fuente. */
export type ReasonProfileId = 'fulfillment' | 'franquicias' | 'individuo'

export interface ReclamoReason {
  readonly id: string
  readonly label: string
  readonly profiles: readonly ReasonProfileId[]
}

interface RawReason {
  readonly label: string
  readonly profiles: readonly string[]
}

interface RawData {
  readonly reasons: Readonly<Record<string, RawReason>>
}

const data = rawData as RawData

/** Todos los motivos de reclamo, con los perfiles que los ven. */
export const RECLAMO_REASONS: readonly ReclamoReason[] = Object.entries(data.reasons).map(
  ([id, reason]) => ({
    id,
    label: reason.label,
    profiles: reason.profiles as readonly ReasonProfileId[],
  }),
)

/**
 * Perfiles disponibles para filtrar/simular, en el orden en que se muestran
 * en la UI (chips de "Tipos de Reclamos" y panel "Casos de uso").
 */
export const RECLAMO_PROFILES: readonly { readonly id: ReasonProfileId; readonly label: string }[] = [
  { id: 'individuo', label: 'Individuo' },
  { id: 'franquicias', label: 'Franquicias' },
  { id: 'fulfillment', label: 'Fulfillment' },
]

export const DEFAULT_RECLAMO_PROFILE: ReasonProfileId = 'individuo'

/** Filtro del listado: un perfil puntual, o `'todos'` (sin filtrar). */
export type ReclamoReasonFilter = ReasonProfileId | 'todos'

/** Motivos visibles para un filtro dado. `'todos'` devuelve el listado completo. */
export function reasonsForFilter(filter: ReclamoReasonFilter): readonly ReclamoReason[] {
  if (filter === 'todos') return RECLAMO_REASONS
  return RECLAMO_REASONS.filter((reason) => reason.profiles.includes(filter))
}

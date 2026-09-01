/**
 * Visibilidad de perfiles entre sí — quién puede VER qué chips de tipo de
 * reclamo, según el perfil de usuario activo. Es una regla de negocio
 * DISTINTA de "qué motivos ve cada perfil" (`reasonProfiles.ts`): acá no se
 * trata de qué datos se muestran, sino de qué OPCIONES DE FILTRO existen
 * para ese usuario.
 *
 * Fuente de verdad: definición funcional provista por el usuario el
 * 2026-09-01 (ver `documentation/motivos-reclamo-por-perfil.md`, sección
 * "Visibilidad de perfiles entre sí"). Mismo criterio que
 * `reasonProfiles.ts`: el JSON de acá es una copia deliberada de
 * `documentation/data/visibilidad-perfiles.json` — sin build step
 * compartido, hay que mantenerlas sincronizadas a mano.
 *
 * Reglas de hoy (pueden cambiar — están en datos, no hardcodeadas):
 *   - Individuo sólo ve "Todos" e "Individuo".
 *   - Franquicias ve "Todos", "Individuo" y "Franquicias".
 *   - Fulfillment ve "Todos", "Individuo" y "Fulfillment".
 * (Todo perfil ve su propio chip + "Todos" + "Individuo"; nadie ve el chip
 * de un perfil ajeno que no sea Individuo.)
 */
import rawVisibility from './data/visibilidad-perfiles.json'
import type { ReasonProfileId, ReclamoReasonFilter } from './reasonProfiles'

interface RawVisibility {
  readonly visibility: Readonly<Record<string, readonly string[]>>
}

const data = rawVisibility as RawVisibility

const VISIBLE_FILTERS_BY_PROFILE = data.visibility as Readonly<
  Record<ReasonProfileId, readonly ReclamoReasonFilter[]>
>

/**
 * Chips de tipo de reclamo visibles para un perfil activo dado.
 * `'todos'` es siempre parte del resultado en la definición actual, pero no
 * se asume acá — si algún día un perfil no lo incluyera, esta función igual
 * refleja el dato tal cual está definido.
 */
export function visibleFiltersForProfile(profileId: ReasonProfileId): readonly ReclamoReasonFilter[] {
  return VISIBLE_FILTERS_BY_PROFILE[profileId] ?? ['todos']
}

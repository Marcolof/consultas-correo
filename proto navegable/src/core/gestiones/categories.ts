/**
 * Categorías de "Mis gestiones" (antes: perfiles de usuario) y, dentro de
 * ellas, qué categorías ve cada tipo de usuario.
 *
 * Fuente de verdad: `documentation/mis-gestiones-categorias.md` +
 * `data/categorias-gestiones.json` (schema_version 3, "base de datos" de 2
 * niveles pensada para que un dev la edite directamente):
 *
 *   Nivel 1 — `profile_category_visibility`: qué categorías (chips) ve cada
 *   tipo de usuario (Individuo, Pyme, Franquicias, Fulfillment).
 *   Nivel 2 — `categories`: qué gestiones agrupa cada categoría, cada una
 *   con `tags` de búsqueda (máx. 50, generados por Claude — no son un dato
 *   de negocio confirmado). Los ítems de Fulfillment y Franquicias llevan
 *   además el tag literal 'fulfillment'/'franquicia': buscar esa palabra
 *   muestra todas las gestiones de esa categoría sin tocar el chip — no es
 *   una regla de código aparte, es sólo un tag más matcheado igual que el
 *   resto (ver `itemsForFilter`/`ReclamosListPage.tsx`, que busca sobre
 *   `label` + `tags`).
 *
 * Reemplaza, para el listado de "Mis gestiones", al mecanismo anterior de
 * perfil de usuario (`core/reclamos/reasonProfiles.ts`/`profileVisibility.ts`),
 * que queda sin usar pero no se borra — dato de negocio real, sólo superado.
 * Sólo 2 de las 7 categorías tienen contenido confirmado por el negocio
 * (Franquicias, Fulfillment); el resto es inferido por intuición o
 * inventado — ver `source` en el dato.
 */
import rawData from './data/categorias-gestiones.json'

export type CategorySource = 'confirmed' | 'inferred' | 'invented'

export interface GestionItem {
  readonly id: string
  readonly label: string
  readonly invented: boolean
  readonly tags: readonly string[]
}

export interface GestionCategory {
  readonly id: string
  readonly label: string
  readonly order: number
  readonly source: CategorySource
  readonly items: readonly GestionItem[]
}

export type UserProfileId = 'individuo' | 'pyme' | 'franquicias' | 'fulfillment'

export interface UserProfile {
  readonly id: UserProfileId
  readonly label: string
}

interface RawData {
  readonly categories: readonly GestionCategory[]
  readonly user_types: readonly UserProfile[]
  readonly profile_category_visibility: Readonly<Record<string, readonly string[]>>
}

const data = rawData as RawData

/** Las 7 categorías, en el orden en que se muestran los chips. */
export const GESTION_CATEGORIES: readonly GestionCategory[] = [...data.categories].sort(
  (a, b) => a.order - b.order,
)

/** Tipos de usuario definidos hoy. Ampliable — ver el JSON fuente. */
export const USER_PROFILES: readonly UserProfile[] = data.user_types

export const DEFAULT_USER_PROFILE: UserProfileId = 'individuo'

export type CategoryFilter = string | 'todos'

export const DEFAULT_CATEGORY_FILTER: CategoryFilter = 'todos'

/**
 * Gestiones visibles para un filtro dado, dentro de las categorías que el
 * tipo de usuario activo puede ver. `'todos'` NO es "todas las gestiones
 * del sistema" — es la unión de las categorías visibles para ESE usuario.
 * Por eso recibe `visibleCategories` (ya filtradas por perfil vía
 * `visibleCategoriesForProfile`) en vez de operar siempre sobre
 * `GESTION_CATEGORIES` completo: un individuo/pyme nunca debe ver
 * gestiones de Franquicias/Fulfillment, ni siquiera con "Todos".
 */
export function itemsForFilter(
  filter: CategoryFilter,
  visibleCategories: readonly GestionCategory[],
): readonly GestionItem[] {
  if (filter === DEFAULT_CATEGORY_FILTER) {
    return visibleCategories.flatMap((category) => category.items)
  }
  return visibleCategories.find((category) => category.id === filter)?.items ?? []
}

/**
 * Categorías (chips) visibles para un tipo de usuario, en el orden
 * canónico de `GESTION_CATEGORIES` — no en el orden del array del JSON de
 * visibilidad. "Todos" no forma parte de este cálculo: es universal, se
 * agrega aparte en la UI.
 */
export function visibleCategoriesForProfile(profileId: UserProfileId): readonly GestionCategory[] {
  const visibleIds = data.profile_category_visibility[profileId] ?? []
  return GESTION_CATEGORIES.filter((category) => visibleIds.includes(category.id))
}

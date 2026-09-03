import { useEffect, useMemo, useState } from 'react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { useCategoryToggles } from '@/core/session/categoryToggles'
import { readQueryParam } from '@/core/session/deepLink'
import {
  DEFAULT_CATEGORY_FILTER,
  applyUnavailableCategoryToggles,
  itemsForFilter,
  visibleCategoriesForProfile,
} from '@/core/gestiones/categories'
import type { CategoryFilter } from '@/core/gestiones/categories'
import { SECTION_LABEL, ITEM_LABEL_SINGULAR, ITEM_LABEL_PLURAL } from '@/core/gestiones/sectionLabel'
import { PageContainer, PageHeader } from '@/shared/layout'
import { ChipGroup, EmptyState, NavListItem, SearchInput } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import styles from './ReclamosListPage.module.css'

interface FilterChipConfig {
  readonly id: CategoryFilter
  readonly label: string
}

const DEFAULT_FILTER: CategoryFilter = DEFAULT_CATEGORY_FILTER

const ACCENTED_CHARS: Readonly<Record<string, string>> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ñ: 'n',
}

/** Sin diacríticos y en minúscula, para que la búsqueda ignore acentos. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .split('')
    .map((char) => ACCENTED_CHARS[char] ?? char)
    .join('')
}

/**
 * Listado de "Mis gestiones" (nombre reformulado el 2026-09-02; antes
 * "Reclamos" — ver `core/gestiones/sectionLabel.ts`).
 *
 * Buscador + chips de categoría + listado. Las 7 categorías y sus
 * gestiones salen de `core/gestiones/categories.ts` (dato real, no
 * maqueta) — pero sólo Franquicias y Fulfillment tienen contenido
 * confirmado por el negocio hoy; el resto es agrupación por intuición o
 * directamente contenido inventado (marcado como tal en su propio label).
 * Ver `documentation/mis-gestiones-categorias.md`.
 *
 * Paquetería Internacional y Mis Comunicaciones Digitales (2026-09-03)
 * están OCULTAS por defecto (chip + gestiones fuera de "Todos") porque su
 * contenido es 100% inventado — se muestran sólo si se activa su switch en
 * "Casos de uso" (`useCategoryToggles`,
 * `applyUnavailableCategoryToggles`).
 *
 * El tipo de usuario activo (Individuo/Pyme/Franquicias/Fulfillment,
 * simulado desde "Casos de uso") decide qué categorías (chips) son
 * visibles — no cuál viene elegida: el filtro arranca siempre en "Todos",
 * y si el chip elegido deja de estar disponible al cambiar de usuario,
 * vuelve solo a "Todos" (mismo patrón que la versión anterior con
 * perfiles, ahora sobre categorías — ver `core/gestiones/categories.ts`).
 *
 * IMPORTANTE: "Todos" NO es "todas las gestiones del sistema" — es la
 * unión de las categorías visibles para el usuario activo. Un individuo
 * o pyme nunca ve gestiones de Franquicias/Fulfillment, ni siquiera con
 * "Todos" seleccionado (corregido 2026-09-02: `itemsForFilter` recibe
 * `visibleCategories`, no opera sobre el universo completo de categorías).
 */
export function ReclamosListPage() {
  const { profileId } = useActiveUseCase()
  const { showPaqueteriaInternacional, showComunicacionesDigitales } = useCategoryToggles()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<CategoryFilter>(() => readQueryParam('category') ?? DEFAULT_FILTER)
  const [search, setSearch] = useState(() => readQueryParam('q') ?? '')

  const visibleCategories = useMemo(() => {
    const byProfile = visibleCategoriesForProfile(profileId)
    const enabledUnavailable = new Set<string>()
    if (showPaqueteriaInternacional) enabledUnavailable.add('paqueteria_internacional')
    if (showComunicacionesDigitales) enabledUnavailable.add('mis_comunicaciones_digitales')
    return applyUnavailableCategoryToggles(byProfile, enabledUnavailable)
  }, [profileId, showPaqueteriaInternacional, showComunicacionesDigitales])
  const chips: readonly FilterChipConfig[] = useMemo(
    () => [
      { id: DEFAULT_CATEGORY_FILTER, label: 'Todos' },
      ...visibleCategories.map((category) => ({ id: category.id, label: category.label })),
    ],
    [visibleCategories],
  )

  // Si al cambiar de tipo de usuario la categoría elegida deja de estar
  // visible, volvemos a "Todos" (siempre disponible).
  useEffect(() => {
    if (!chips.some((chip) => chip.id === filter)) {
      setFilter(DEFAULT_FILTER)
    }
  }, [chips, filter])

  const items = useMemo(
    () => itemsForFilter(filter, visibleCategories),
    [filter, visibleCategories],
  )

  const visibleItems = useMemo(() => {
    const allWords = normalize(search.trim())
      .split(/\s+/)
      .filter((word) => word !== '')
    if (allWords.length === 0) return items

    // Palabras de relleno ("no", "me", "la"...) no deben tapar un match real
    // en el resto de la frase — sólo cuentan las de 3+ letras. Si la frase
    // entera es de relleno (raro), se cae a buscar con todas igual.
    const words = allWords.filter((word) => word.length >= 3)
    const effectiveWords = words.length > 0 ? words : allWords

    return items
      .map((item) => {
        const haystack = [normalize(item.label), ...item.tags.map(normalize)]
        const matchCount = effectiveWords.filter((word) => haystack.some((field) => field.includes(word))).length
        return { item, matchCount }
      })
      // Con que UNA palabra de la frase matchee alcanza — así "no me acepta
      // pago" encuentra la gestión aunque "no"/"me"/"acepta" no sean tags.
      .filter(({ matchCount }) => matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(({ item }) => item)
  }, [items, search])

  const countLabel = `${String(visibleItems.length)} ${visibleItems.length === 1 ? ITEM_LABEL_SINGULAR : ITEM_LABEL_PLURAL}`

  return (
    <PageContainer>
      <PageHeader title={SECTION_LABEL} />

      <SearchInput
        id="buscar-gestiones"
        value={search}
        onChange={setSearch}
        placeholder={`Buscar ${ITEM_LABEL_PLURAL}…`}
        className={styles.search}
      />

      <ChipGroup
        items={chips}
        activeId={filter}
        onChange={setFilter}
        ariaLabel="Categorías de gestión"
        className={styles.chips}
      />

      <div className={styles.countRow}>
        <p className={styles.count}>{countLabel}</p>
        {filter !== DEFAULT_FILTER && (
          <button type="button" className={styles.clearFilter} onClick={() => setFilter(DEFAULT_FILTER)}>
            Limpiar filtro
          </button>
        )}
      </div>

      <div className={styles.list}>
        {visibleItems.length === 0 ? (
          <EmptyState
            title={`No encontramos ${ITEM_LABEL_PLURAL}`}
            description="Probá con otra búsqueda o cambiá la categoría."
          />
        ) : (
          visibleItems.map((item) => (
            <NavListItem
              key={item.id}
              label={item.label}
              onClick={() =>
                showToast(`"${item.label}" — pantalla de detalle todavía no implementada.`, 'info')
              }
            />
          ))
        )}
      </div>
    </PageContainer>
  )
}

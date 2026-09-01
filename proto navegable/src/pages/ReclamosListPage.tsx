import { useEffect, useMemo, useState } from 'react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { RECLAMO_PROFILES, reasonsForFilter } from '@/core/reclamos/reasonProfiles'
import type { ReclamoReasonFilter } from '@/core/reclamos/reasonProfiles'
import { visibleFiltersForProfile } from '@/core/reclamos/profileVisibility'
import { PageContainer, PageHeader } from '@/shared/layout'
import { ChipGroup, EmptyState, NavListItem, SearchInput } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import styles from './ReclamosListPage.module.css'

interface FilterChipConfig {
  readonly id: ReclamoReasonFilter
  readonly label: string
}

/** Universo completo de chips, en el orden canónico en que se muestran. */
const ALL_FILTER_CHIPS: readonly FilterChipConfig[] = [
  { id: 'todos', label: 'Todos' },
  ...RECLAMO_PROFILES,
]

const DEFAULT_FILTER: ReclamoReasonFilter = 'todos'

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
 * Listado de motivos de reclamo.
 *
 * Réplica de la imagen de referencia: buscador + chips de "Tipos de
 * Reclamos" + listado. Los chips visibles, los motivos y el conteo son
 * datos reales (`core/reclamos/reasonProfiles.ts` +
 * `core/reclamos/profileVisibility.ts`), no maqueta.
 *
 * El filtro arranca siempre en "Todos" (como la imagen de referencia). El
 * "caso de uso" activo (panel del botón flotante) NO decide qué chip viene
 * elegido — decide qué chips EXISTEN para ese usuario: por ejemplo, un
 * usuario Individuo sólo puede ver "Todos" e "Individuo", nunca los chips
 * de Franquicias o Fulfillment. Si cambiás de caso de uso y el chip que
 * tenías elegido deja de ser visible, se vuelve a "Todos".
 */
export function ReclamosListPage() {
  const { profileId } = useActiveUseCase()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<ReclamoReasonFilter>(DEFAULT_FILTER)
  const [search, setSearch] = useState('')

  const visibleFilterIds = useMemo(() => visibleFiltersForProfile(profileId), [profileId])
  const visibleChips = useMemo(
    () => ALL_FILTER_CHIPS.filter((chip) => visibleFilterIds.includes(chip.id)),
    [visibleFilterIds],
  )

  // Si al cambiar de caso de uso el chip elegido deja de estar disponible,
  // volvemos a "Todos" (siempre visible en la definición actual).
  useEffect(() => {
    if (!visibleFilterIds.includes(filter)) {
      setFilter(DEFAULT_FILTER)
    }
  }, [visibleFilterIds, filter])

  const reasons = useMemo(() => reasonsForFilter(filter), [filter])

  const visibleReasons = useMemo(() => {
    const query = normalize(search.trim())
    if (query === '') return reasons
    return reasons.filter((reason) => normalize(reason.label).includes(query))
  }, [reasons, search])

  const countLabel = `${String(visibleReasons.length)} ${visibleReasons.length === 1 ? 'consulta' : 'consultas'}`

  return (
    <PageContainer>
      <PageHeader title="Reclamos" />

      <SearchInput
        id="buscar-reclamos"
        value={search}
        onChange={setSearch}
        placeholder="Buscar reclamos…"
        className={styles.search}
      />

      <h2 className={styles.sectionTitle}>Tipos de Reclamos</h2>

      <ChipGroup
        items={visibleChips}
        activeId={filter}
        onChange={setFilter}
        ariaLabel="Tipos de reclamos"
        className={styles.chips}
      />

      <p className={styles.count}>{countLabel}</p>

      <div className={styles.list}>
        {visibleReasons.length === 0 ? (
          <EmptyState
            title="No encontramos reclamos"
            description="Probá con otra búsqueda o cambiá el filtro de tipo de reclamo."
          />
        ) : (
          visibleReasons.map((reason) => (
            <NavListItem
              key={reason.id}
              label={reason.label}
              onClick={() =>
                showToast(`"${reason.label}" — pantalla de detalle todavía no implementada.`, 'info')
              }
            />
          ))
        )}
      </div>
    </PageContainer>
  )
}

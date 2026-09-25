/**
 * Datos y reglas de V3 — "Ayuda y soporte".
 *
 * Las agrupaciones son MOCK (ver `_advertencia` en `data/ayuda.json`), pero
 * dos cosas NO se reinventan acá, se consultan en su fuente canónica:
 *
 *  - qué categorías ve cada tipo de usuario (`visibleCategoriesForProfile`);
 *  - los tags de búsqueda de cada gestión documentada (`GESTION_CATEGORIES`).
 *
 * Así V3 se comporta igual que V1 y V2 frente al tipo de usuario simulado y
 * al buscador, aunque agrupe distinto.
 */
import { GESTION_CATEGORIES, visibleCategoriesForProfile } from '@/core/gestiones/categories'
import type { UserProfileId } from '@/core/gestiones/categories'
import { CURRENT_USER } from '@/core/user'
import data from '../data/ayuda.json'

export type IconoV3 =
  | 'paquete'
  | 'pago'
  | 'plataforma'
  | 'otras'
  | 'reloj'
  | 'mapa'
  | 'paquete-danado'
  | 'factura'
  | 'stock'
  | 'reclamo-nuevo'
  | 'franquicia'
  | 'fulfillment'

export interface ItemAyuda {
  readonly id: string
  readonly label: string
  /** Label de la gestión documentada a la que corresponde, o null si no existe. */
  readonly gestion: string | null
  /** Categoría documentada: decide la visibilidad por tipo de usuario. */
  readonly categoria: string | null
  /** Sólo para items sin gestión documentada (no tienen de dónde heredar tags). */
  readonly tags?: readonly string[]
}

export interface GrupoAyuda {
  readonly id: string
  readonly titulo: string
  /** Lo único que muestra la tarjeta: los items se ven recién al entrar. */
  readonly descripcion: string
  readonly icono: IconoV3
  readonly items: readonly ItemAyuda[]
}

interface AccesoCrudo {
  readonly id: string
  readonly icono: IconoV3
  readonly item?: string
  readonly label?: string
  readonly categoria?: string
}

export interface AccesoRapido {
  readonly id: string
  readonly icono: IconoV3
  readonly label: string
  /** Sin item ni categoría, el atajo abre el formulario sin asunto elegido. */
  readonly itemId: string | null
  /** Atajo propio de un tipo de usuario: lista todas las gestiones de esa categoría. */
  readonly categoria: string | null
}

const GRUPOS = data.grupos as readonly GrupoAyuda[]
const ACCESOS = data.accesos_rapidos as readonly AccesoCrudo[]

const TAGS_DOCUMENTADOS: ReadonlyMap<string, readonly string[]> = new Map(
  GESTION_CATEGORIES.flatMap((categoria) =>
    categoria.items.map((item) => [item.label, item.tags] as const),
  ),
)

function categoriasVisibles(perfil: UserProfileId): ReadonlySet<string> {
  return new Set(visibleCategoriesForProfile(perfil).map((categoria) => categoria.id))
}

function esVisible(item: ItemAyuda, visibles: ReadonlySet<string>): boolean {
  return item.categoria === null || visibles.has(item.categoria)
}

/** Grupos con sólo los items que ese tipo de usuario puede ver. Un grupo vacío no se muestra. */
export function gruposVisibles(perfil: UserProfileId): readonly GrupoAyuda[] {
  const visibles = categoriasVisibles(perfil)
  return GRUPOS.map((grupo) => ({
    ...grupo,
    items: grupo.items.filter((item) => esVisible(item, visibles)),
  })).filter((grupo) => grupo.items.length > 0)
}

export function findGrupoVisible(
  id: string | undefined,
  perfil: UserProfileId,
): GrupoAyuda | null {
  if (id === undefined) return null
  return gruposVisibles(perfil).find((grupo) => grupo.id === id) ?? null
}

export interface ItemEncontrado {
  readonly item: ItemAyuda
  readonly grupo: GrupoAyuda
}

/** Busca un item por id, pero sólo si el tipo de usuario puede verlo. */
export function findItemVisible(
  id: string | undefined,
  perfil: UserProfileId,
): ItemEncontrado | null {
  if (id === undefined) return null
  for (const grupo of gruposVisibles(perfil)) {
    const item = grupo.items.find((candidato) => candidato.id === id)
    if (item !== undefined) return { item, grupo }
  }
  return null
}

export function accesosVisibles(perfil: UserProfileId): readonly AccesoRapido[] {
  const visibles = categoriasVisibles(perfil)
  return ACCESOS.flatMap((acceso): AccesoRapido[] => {
    if (acceso.categoria !== undefined) {
      return visibles.has(acceso.categoria)
        ? [{ id: acceso.id, icono: acceso.icono, label: acceso.label ?? '', itemId: null, categoria: acceso.categoria }]
        : []
    }
    if (acceso.item === undefined) {
      return [{ id: acceso.id, icono: acceso.icono, label: acceso.label ?? '', itemId: null, categoria: null }]
    }
    const encontrado = findItemVisible(acceso.item, perfil)
    return encontrado === null
      ? []
      : [{ id: acceso.id, icono: acceso.icono, label: encontrado.item.label, itemId: acceso.item, categoria: null }]
  })
}

/** Todos los items de una categoría documentada, estén en el grupo que estén. */
export function itemsDeCategoria(categoria: string, perfil: UserProfileId): readonly ItemEncontrado[] {
  if (!categoriasVisibles(perfil).has(categoria)) return []
  return gruposVisibles(perfil).flatMap((grupo) =>
    grupo.items.filter((item) => item.categoria === categoria).map((item) => ({ item, grupo })),
  )
}

const ACENTOS: Readonly<Record<string, string>> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .split('')
    .map((letra) => ACENTOS[letra] ?? letra)
    .join('')
}

/**
 * Mismo criterio que V1 y V2: sin acentos, se ignoran palabras de 1-2
 * letras, alcanza con que una palabra significativa coincida, y se ordena
 * por cuántas coinciden.
 */
export function buscar(consulta: string, perfil: UserProfileId): readonly ItemEncontrado[] {
  const todas = normalizar(consulta.trim()).split(/\s+/).filter((palabra) => palabra !== '')
  if (todas.length === 0) return []
  const significativas = todas.filter((palabra) => palabra.length >= 3)
  const palabras = significativas.length > 0 ? significativas : todas

  return gruposVisibles(perfil)
    .flatMap((grupo) => grupo.items.map((item) => ({ item, grupo })))
    .map((encontrado) => {
      const { item, grupo } = encontrado
      const campos = [
        item.label,
        item.gestion ?? '',
        grupo.titulo,
        ...(item.gestion === null ? [] : (TAGS_DOCUMENTADOS.get(item.gestion) ?? [])),
        ...(item.tags ?? []),
      ].map(normalizar)
      const coincidencias = palabras.filter((palabra) =>
        campos.some((campo) => campo.includes(palabra)),
      ).length
      return { encontrado, coincidencias }
    })
    .filter(({ coincidencias }) => coincidencias > 0)
    .sort((a, b) => b.coincidencias - a.coincidencias)
    .map(({ encontrado }) => encontrado)
}

export interface DatoCuenta {
  readonly label: string
  readonly valor: string
}

/** Datos del usuario registrado. En producción vienen de la sesión. */
export function datosDeCuenta(): readonly DatoCuenta[] {
  const cuenta = data.cuenta
  return [
    { label: 'Nombre completo', valor: `${CURRENT_USER.firstName} ${CURRENT_USER.lastName}` },
    { label: 'Correo electrónico', valor: cuenta.email },
    { label: 'Dirección', valor: cuenta.direccion },
    { label: 'Localidad', valor: cuenta.localidad },
    { label: 'Código postal', valor: cuenta.codigoPostal },
    { label: 'Provincia', valor: cuenta.provincia },
    { label: 'Tipo de documento', valor: cuenta.tipoDocumento },
    { label: 'Número de documento', valor: cuenta.numeroDocumento },
  ]
}

/** Asunto que viaja con el reclamo: el nombre documentado si existe, si no el de la referencia. */
export function asuntoDe(item: ItemAyuda): string {
  return item.gestion ?? item.label
}

let proximoCaso = 3001

/** Alta simulada: no hay backend, sólo devuelve un número de caso. */
export function enviarConsulta(): string {
  const caso = `RC-2026-${String(proximoCaso)}`
  proximoCaso += 1
  return caso
}

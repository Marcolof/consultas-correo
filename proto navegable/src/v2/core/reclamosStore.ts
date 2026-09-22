/**
 * Reclamos generados durante el recorrido, en memoria.
 *
 * Existe sólo para que la pantalla de confirmación pueda mostrar el caso
 * recién creado. NO hay pantalla de seguimiento ni listado de reclamos: el
 * HTML de producción tampoco la tiene (ver sección 2 de
 * `documentation/brief-consultas-reclamos.md`), y el alcance de V2 es el
 * camino hasta generar el reclamo, no lo que pasa después.
 */

export interface ReclamoV2 {
  readonly id: string
  readonly motivoLabel: string
  readonly creadoEl: string
  readonly envioNumero?: string
  readonly valores: Readonly<Record<string, string>>
}

const reclamos = new Map<string, ReclamoV2>()
let proximoNumero = 1001

export interface NuevoReclamo {
  readonly motivoLabel: string
  readonly envioNumero?: string
  readonly valores: Readonly<Record<string, string>>
}

/** Alta de un reclamo. Devuelve el creado, ya con número de caso. */
export function crearReclamo(nuevo: NuevoReclamo): ReclamoV2 {
  const reclamo: ReclamoV2 = {
    id: `RC-2026-${String(proximoNumero)}`,
    motivoLabel: nuevo.motivoLabel,
    creadoEl: new Date().toLocaleDateString('es-AR'),
    envioNumero: nuevo.envioNumero,
    valores: nuevo.valores,
  }

  proximoNumero += 1
  reclamos.set(reclamo.id, reclamo)

  return reclamo
}

export function findReclamo(id: string | undefined): ReclamoV2 | null {
  if (id === undefined) return null
  return reclamos.get(id) ?? null
}

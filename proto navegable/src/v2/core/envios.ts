/**
 * Envíos de la propuesta V2 — la ENTIDAD desde la que nace el reclamo.
 *
 * Todo el contenido de `data/envios.json` es inventado: V2 necesita una
 * pantalla donde el usuario ya esté trabajando (sus envíos) para poder
 * mostrar que el reclamo arranca ahí y no en una sección aparte. No hay
 * ningún dato real de MiCorreo detrás.
 */
import type { BadgeTone } from '@/shared/ui/Badge'
import data from '../data/envios.json'

export type EstadoEnvioId = 'en_transito' | 'demorado' | 'entrega_fallida' | 'entregado'

export interface EventoEnvio {
  readonly fecha: string
  readonly detalle: string
}

export interface EstadoEnvio {
  readonly id: EstadoEnvioId
  readonly label: string
  readonly tono: BadgeTone
  /** Si el estado, por sí solo, ya indica que algo salió mal. */
  readonly esProblema: boolean
}

export interface Envio {
  readonly id: string
  readonly numero: string
  readonly descripcion: string
  readonly destinatario: string
  readonly direccion: string
  readonly localidad: string
  readonly fechaDespacho: string
  readonly entregaEstimada: string
  readonly fechaEntrega?: string
  readonly receptor?: string
  readonly estado: EstadoEnvioId
  readonly eventos: readonly EventoEnvio[]
}

export const ENVIOS = data.envios as readonly Envio[]

const ESTADOS = data.estados as readonly EstadoEnvio[]

export function findEnvio(id: string | undefined): Envio | null {
  if (id === undefined) return null
  return ENVIOS.find((envio) => envio.id === id) ?? null
}

export function estadoDe(envio: Envio): EstadoEnvio {
  const estado = ESTADOS.find((candidato) => candidato.id === envio.estado)
  if (estado === undefined) {
    throw new Error(`Estado desconocido "${envio.estado}" en el envío ${envio.id}.`)
  }
  return estado
}

/** Último movimiento del seguimiento, ya formateado para mostrar. */
export function ultimoEvento(envio: Envio): string {
  const evento = envio.eventos[0]
  return evento === undefined ? '—' : `${evento.fecha} · ${evento.detalle}`
}

/**
 * Contexto con el que arranca el asistente cuando se entra desde un envío.
 *
 * Es la clave de por qué la entrada contextual no necesita un árbol propio:
 * entrar desde un envío es simplemente empezar con varias respuestas ya
 * dadas, así que las preguntas correspondientes se saltean solas.
 */
export function contextoDeEnvio(envio: Envio): Readonly<Record<string, string>> {
  const contexto: Record<string, string> = {
    tema: 'paqueteria_nacional',
    envioId: envio.id,
    numero: envio.numero,
    destinatario: envio.destinatario,
    direccion: `${envio.direccion} — ${envio.localidad}`,
    entregaEstimada: envio.entregaEstimada,
    ultimoEvento: ultimoEvento(envio),
    estado: envio.estado,
  }
  if (envio.fechaEntrega !== undefined) contexto['fechaEntrega'] = envio.fechaEntrega
  if (envio.receptor !== undefined) contexto['receptor'] = envio.receptor
  return contexto
}

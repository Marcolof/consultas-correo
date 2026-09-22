/**
 * Formularios de V2.
 *
 * Un formulario declara UNA sola lista de campos. Los que tienen `contexto`
 * se resuelven contra lo que el asistente ya averiguó:
 *
 *   - si el contexto tiene ese dato → se muestra precargado, de sólo lectura;
 *   - si no lo tiene → se le pide al usuario, como cualquier otro campo.
 *
 * Por eso el mismo formulario sirve para quien entró desde un envío (llega
 * con medio formulario resuelto) y para quien llegó contestando preguntas
 * sin estar logueado (lo completa entero), sin mantener dos definiciones.
 */
import type { SelectOption } from '@/core/types/common'
import data from '../data/formularios.json'

export type FormularioId =
  | 'demora'
  | 'entrega'
  | 'contenido'
  | 'gestion'
  | 'facturacion'
  | 'cuenta'
  | 'sellos'
  | 'otro'

export type TipoCampo = 'text' | 'textarea' | 'select' | 'radio'

export interface CampoFormulario {
  readonly id: string
  readonly tipo: TipoCampo
  readonly label: string
  readonly requerido: boolean
  readonly hint?: string
  readonly opciones?: readonly SelectOption[]
  /** Clave del contexto que puede responder este campo por el usuario. */
  readonly contexto?: string
}

export interface Formulario {
  readonly titulo: string
  readonly campos: readonly CampoFormulario[]
}

const FORMULARIOS = data.formularios as Readonly<Record<string, Formulario>>

export function findFormulario(id: FormularioId): Formulario | null {
  return FORMULARIOS[id] ?? null
}

export interface DatoPrecargado {
  readonly label: string
  readonly valor: string
}

export interface CamposDelFormulario {
  /** Ya resueltos por el contexto: se muestran, no se piden. */
  readonly precargados: readonly DatoPrecargado[]
  /** Lo único que el usuario tiene que completar. */
  readonly pedidos: readonly CampoFormulario[]
}

export function separarCampos(
  formulario: Formulario,
  contexto: Readonly<Record<string, string>>,
): CamposDelFormulario {
  const precargados: DatoPrecargado[] = []
  const pedidos: CampoFormulario[] = []

  for (const campo of formulario.campos) {
    const valor = campo.contexto === undefined ? undefined : contexto[campo.contexto]
    if (valor !== undefined && valor !== '') {
      precargados.push({ label: campo.label, valor })
    } else {
      pedidos.push(campo)
    }
  }

  return { precargados, pedidos }
}

/** Ids de los campos obligatorios que quedaron vacíos. */
export function camposFaltantes(
  pedidos: readonly CampoFormulario[],
  valores: Readonly<Record<string, string>>,
): readonly string[] {
  return pedidos
    .filter((campo) => campo.requerido && (valores[campo.id] ?? '').trim() === '')
    .map((campo) => campo.id)
}

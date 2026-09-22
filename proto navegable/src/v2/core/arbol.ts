/**
 * Motor del asistente guiado de V2.
 *
 * El árbol vive entero en `data/arbol.json` y este archivo sólo lo recorre:
 * agregar, sacar o reordenar una rama es editar el JSON, no tocar React.
 *
 * Tres ideas sostienen todo:
 *
 *  1. El árbol es un diccionario PLANO de nodos que se apuntan por id. No
 *     está anidado, así un mismo nodo (p. ej. "no tengo cuenta") existe una
 *     sola vez aunque le lleguen varias ramas.
 *  2. Cada respuesta deja un dato en un CONTEXTO acumulado. Ese contexto
 *     después acorta el formulario final.
 *  3. Una pregunta cuya respuesta YA está en el contexto se saltea sola. Es
 *     lo que hace que el mismo árbol sirva para el usuario anónimo (que
 *     contesta "¿tenés cuenta?") y para el que entró desde un envío (que no
 *     la ve nunca).
 *
 * El recorrido se reconstruye entero desde la URL (`?p=op1,op2`), así que
 * cualquier paso es enlazable y recargable, y volver atrás es recortar esa
 * lista.
 */
import type { FormularioId } from './formularios'
import type { IconoId } from './iconos'
import data from '../data/arbol.json'

export type Contexto = Readonly<Record<string, string>>

export interface OpcionNodo {
  readonly id: string
  readonly label: string
  readonly descripcion?: string
  readonly icono?: IconoId
  readonly next: string
  readonly guarda?: Readonly<Record<string, string>>
  readonly tags?: readonly string[]
  /** La opción se oculta si el contexto tiene ese campo con otro valor. */
  readonly visibleSi?: Readonly<Record<string, readonly string[]>>
  /**
   * Categoría de gestiones que representa esta opción.
   *
   * Si el contexto trae `categoriasVisibles`, la opción sólo se muestra
   * cuando su categoría está en esa lista. Quién arma esa lista es el
   * asistente, leyendo la regla de visibilidad por tipo de usuario desde su
   * fuente canónica (`core/gestiones/categories.ts`) — la regla NO se copia
   * acá, para no tener dos versiones de lo mismo.
   */
  readonly categoria?: string
}

/** Clave del contexto con las categorías que el usuario activo puede ver. */
export const CLAVE_CATEGORIAS_VISIBLES = 'categoriasVisibles'

export interface NodoPregunta {
  readonly tipo: 'pregunta'
  readonly texto: string
  /** Campo del contexto que responde esta pregunta (habilita el salteo). */
  readonly guardaEn?: string
  readonly opciones: readonly OpcionNodo[]
}

export interface NodoFormulario {
  readonly tipo: 'formulario'
  readonly formulario: FormularioId
}

export type Nodo = NodoPregunta | NodoFormulario

const NODOS = data.nodos as Readonly<Record<string, Nodo>>
const INICIO = data.inicio

/** Tope de saltos, por si una edición del JSON deja un ciclo. */
const MAX_SALTOS = 20

export function findNodo(id: string): Nodo | null {
  return NODOS[id] ?? null
}

/** Opciones que aplican al contexto actual. Sin dato en contexto, se ven todas. */
export function opcionesVisibles(
  nodo: NodoPregunta,
  contexto: Contexto,
): readonly OpcionNodo[] {
  const categoriasVisibles = contexto[CLAVE_CATEGORIAS_VISIBLES]?.split(',')

  return nodo.opciones.filter((opcion) => {
    if (
      opcion.categoria !== undefined &&
      categoriasVisibles !== undefined &&
      !categoriasVisibles.includes(opcion.categoria)
    ) {
      return false
    }

    if (opcion.visibleSi === undefined) return true
    return Object.entries(opcion.visibleSi).every(([campo, valores]) => {
      const actual = contexto[campo]
      return actual === undefined || valores.includes(actual)
    })
  })
}

/**
 * Opción que el contexto ya responde por sí solo, si la hay.
 *
 * Sólo aplica a preguntas que declaran `guardaEn`: si ese campo ya tiene
 * valor, se busca la opción que lo hubiera guardado.
 */
function respuestaImplicita(nodo: NodoPregunta, contexto: Contexto): OpcionNodo | null {
  if (nodo.guardaEn === undefined) return null
  const valor = contexto[nodo.guardaEn]
  if (valor === undefined) return null
  return nodo.opciones.find((opcion) => opcion.guarda?.[nodo.guardaEn ?? ''] === valor) ?? null
}

export interface PasoRecorrido {
  readonly nodoId: string
  readonly pregunta: string
  readonly respuesta: string
  /** Lo resolvió el contexto, no el usuario: no se puede editar. */
  readonly automatico: boolean
  /** Cuántas respuestas manuales hay que conservar para volver acá. */
  readonly corteDelCamino: number
}

export interface Recorrido {
  readonly nodoId: string
  readonly nodo: Nodo | null
  readonly contexto: Contexto
  readonly pasos: readonly PasoRecorrido[]
  /**
   * Las opciones del camino que realmente se pudieron aplicar. Puede ser más
   * corto que el camino de la URL si una opción dejó de estar visible; hay
   * que usar éste para agregar el paso siguiente, no el de la URL.
   */
  readonly caminoAplicado: readonly string[]
  /** El camino de la URL tenía una opción que ya no aplica. */
  readonly caminoTruncado: boolean
}

function aplicar(contexto: Contexto, opcion: OpcionNodo): Contexto {
  return opcion.guarda === undefined ? contexto : { ...contexto, ...opcion.guarda }
}

/**
 * Reconstruye el estado del asistente desde cero.
 *
 * `camino` son los ids de las opciones elegidas por el usuario, en orden
 * (los pasos automáticos no ocupan lugar). `contextoInicial` es lo que ya se
 * sabe antes de empezar: el envío desde el que se entró, el tipo de usuario
 * logueado, etc.
 */
export function recorrer(
  camino: readonly string[],
  contextoInicial: Contexto = {},
): Recorrido {
  let nodoId = INICIO
  let contexto: Contexto = contextoInicial
  const pasos: PasoRecorrido[] = []
  let indiceManual = 0
  let caminoTruncado = false

  for (let saltos = 0; saltos < MAX_SALTOS; saltos += 1) {
    const nodo = NODOS[nodoId]
    if (nodo === undefined || nodo.tipo !== 'pregunta') break

    const implicita = respuestaImplicita(nodo, contexto)
    if (implicita !== null) {
      pasos.push({
        nodoId,
        pregunta: nodo.texto,
        respuesta: implicita.label,
        automatico: true,
        corteDelCamino: indiceManual,
      })
      contexto = aplicar(contexto, implicita)
      nodoId = implicita.next
      continue
    }

    const elegida = camino[indiceManual]
    if (elegida === undefined) break

    const opcion = opcionesVisibles(nodo, contexto).find((candidata) => candidata.id === elegida)
    if (opcion === undefined) {
      // La opción guardada en la URL no existe o dejó de aplicar: paramos acá
      // en vez de adivinar, y avisamos para poder decirlo en pantalla.
      caminoTruncado = true
      break
    }

    pasos.push({
      nodoId,
      pregunta: nodo.texto,
      respuesta: opcion.label,
      automatico: false,
      corteDelCamino: indiceManual,
    })
    contexto = aplicar(contexto, opcion)
    nodoId = opcion.next
    indiceManual += 1
  }

  return {
    nodoId,
    nodo: NODOS[nodoId] ?? null,
    contexto,
    pasos,
    caminoAplicado: camino.slice(0, indiceManual),
    caminoTruncado,
  }
}

/**
 * Atajos del inicio: los "otros caminos" que resuelven la duda sin recorrer
 * las preguntas.
 *
 * Un acceso rápido salta a un nodo del MISMO árbol (con `camino`, el mismo
 * formato que la URL) o a otra pantalla (`ruta`). No son una estructura
 * aparte: son posiciones del árbol a las que se llega de un clic.
 */
export interface AccesoRapido {
  readonly id: string
  readonly label: string
  readonly descripcion?: string
  readonly icono: IconoId
  readonly camino?: readonly string[]
  readonly ruta?: string
}

export const ACCESOS_RAPIDOS = data.accesos_rapidos as readonly AccesoRapido[]

export interface EntradaBuscador {
  /** Camino completo de opciones manuales hasta la hoja. */
  readonly camino: readonly string[]
  /** Label de la última opción: lo que el usuario reconoce como "su" caso. */
  readonly titulo: string
  /** Las preguntas atravesadas, para mostrar de dónde sale el resultado. */
  readonly ruta: readonly string[]
  /** Todo lo indexable de ese camino (labels + tags), ya concatenado. */
  readonly indice: readonly string[]
}

/**
 * Todas las hojas alcanzables, con el camino que lleva a cada una.
 *
 * Es lo que hace que el buscador y el recorrido ramificado sean dos caminos
 * al MISMO árbol: buscar no abre otra estructura, salta a un nodo de ésta.
 */
export function indiceDeHojas(contexto: Contexto = {}): readonly EntradaBuscador[] {
  const entradas: EntradaBuscador[] = []

  const visitar = (
    id: string,
    camino: readonly string[],
    ruta: readonly string[],
    indice: readonly string[],
    vistos: readonly string[],
  ) => {
    if (vistos.includes(id)) return
    const nodo = NODOS[id]
    if (nodo === undefined) return

    if (nodo.tipo !== 'pregunta') {
      const titulo = ruta[ruta.length - 1]
      if (titulo !== undefined) entradas.push({ camino, ruta, titulo, indice })
      return
    }

    // El índice se arma con las mismas reglas de visibilidad que la pantalla:
    // si el usuario activo no ve Fulfillment, buscar "stock" no debe
    // encontrarlo.
    for (const opcion of opcionesVisibles(nodo, contexto)) {
      visitar(
        opcion.next,
        [...camino, opcion.id],
        [...ruta, opcion.label],
        [...indice, opcion.label, ...(opcion.tags ?? [])],
        [...vistos, id],
      )
    }
  }

  visitar(INICIO, [], [], [], [])
  return entradas
}

/**
 * Dirección de la próxima transición entre vistas de V3.
 *
 * Se fija justo antes de navegar: entrar a algo (tarjeta, atajo, formulario)
 * es "adelante" y el contenido llega desde la derecha; "← Volver" es "atras"
 * y llega desde la izquierda. La primera carga sube desde abajo.
 */
export type Direccion = 'entrada' | 'adelante' | 'atras'

let direccion: Direccion = 'entrada'

export function irAdelante(): void {
  direccion = 'adelante'
}

export function irAtras(): void {
  direccion = 'atras'
}

export function direccionActual(): Direccion {
  return direccion
}

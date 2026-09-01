/**
 * Usuario de sesión — versión mínima.
 *
 * El proyecto de referencia resuelve esto con un motor de roles/permisos
 * completo (para simular distintos escenarios de demo). Esta base sólo
 * necesita ALGO que mostrar en el header ("Hola, Nombre" + inicial del
 * avatar): no es funcionalidad, es chrome. Cuando la pantalla real tenga
 * sesión, reemplazar este módulo por la fuente de verdad correspondiente.
 */
export interface SessionUser {
  readonly firstName: string
  readonly lastName: string
}

export const CURRENT_USER: SessionUser = {
  firstName: 'Rodrigo',
  lastName: 'Correo',
}

/** Inicial que se muestra en el círculo del header (`.letra-circulo`). */
export function userInitial(user: SessionUser): string {
  return user.firstName.charAt(0).toUpperCase()
}

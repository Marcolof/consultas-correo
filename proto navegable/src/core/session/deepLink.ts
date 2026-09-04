/**
 * Lector de query string para dejar el prototipo en un estado inicial
 * puntual sin tocar nada a mano — pensado para embeber el prototipo real
 * en un iframe (ej. la presentación navegable del Hub) y que cada slide
 * muestre un estado distinto: perfil activo, categoría, búsqueda o modo
 * responsive.
 *
 * No es un mecanismo de producción ni cambia el comportamiento normal:
 * sin query params, el prototipo arranca exactamente igual que siempre
 * (perfil Individuo, "Todos", sin búsqueda, no responsive).
 *
 * Params soportados:
 *   ?profile=individuo|pyme|franquicias|fulfillment
 *   ?category=<id de categoría>|todos
 *   ?q=<texto de búsqueda>
 *   ?responsive=1
 *   ?useCases=1 (abre el panel "Casos de uso" ya desplegado)
 *   ?paqueteriaInternacional=1 (muestra la categoría, oculta por defecto)
 *   ?comunicacionesDigitales=1 (ídem, para Mis Comunicaciones Digitales)
 *   ?userMenuOpen=1 (abre el dropdown "Mi cuenta" del header ya desplegado)
 */
export function readQueryParam(name: string): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(name)
}

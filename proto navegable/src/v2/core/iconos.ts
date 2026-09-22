/**
 * Ids de ícono que puede declarar una opción o un acceso rápido.
 *
 * Son nombres semánticos, no nombres de Lucide: el dato (`arbol.json`) dice
 * "qué representa" y `components/Icono.tsx` decide con qué ícono dibujarlo.
 * Así cambiar de librería no obliga a tocar el árbol.
 */
export type IconoId =
  | 'cuenta'
  | 'sin-cuenta'
  | 'paquete'
  | 'franquicia'
  | 'fulfillment'
  | 'oficio'
  | 'reclamo-nuevo'
  | 'envios'
  | 'reloj'
  | 'mapa'
  | 'factura'
  | 'paquete-danado'

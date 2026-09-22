import {
  Boxes,
  Clock,
  FilePlus2,
  MapPin,
  Package,
  PackageX,
  Receipt,
  Scale,
  Store,
  Truck,
  User,
  UserX,
  type LucideIcon,
} from 'lucide-react'
import type { IconoId } from '../core/iconos'

/**
 * Íconos de las tarjetas de V2, con Lucide.
 *
 * El árbol declara ids semánticos (`core/iconos.ts`) y acá se resuelven a un
 * ícono concreto: el dato no conoce la librería, así cambiarla no obliga a
 * tocar `arbol.json`.
 */
const ICONOS: Readonly<Record<IconoId, LucideIcon>> = {
  cuenta: User,
  'sin-cuenta': UserX,
  paquete: Package,
  franquicia: Store,
  fulfillment: Boxes,
  oficio: Scale,
  'reclamo-nuevo': FilePlus2,
  envios: Truck,
  reloj: Clock,
  mapa: MapPin,
  factura: Receipt,
  'paquete-danado': PackageX,
}

export interface IconoProps {
  readonly id: IconoId
  readonly className?: string
}

export function Icono({ id, className }: IconoProps) {
  const Dibujo = ICONOS[id]
  return <Dibujo className={className} size={28} strokeWidth={1.5} aria-hidden="true" />
}

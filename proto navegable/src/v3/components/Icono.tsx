import {
  Boxes,
  CircleHelp,
  Clock,
  CreditCard,
  FilePlus2,
  MapPin,
  MonitorCog,
  Package,
  PackageX,
  Receipt,
  Store,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import type { IconoV3 } from '../core/ayuda'

/**
 * Íconos de V3. Propios y no importados de V2 para que cada versión se pueda
 * borrar sin romper la otra. Reemplazan los emojis de la imagen de
 * referencia: se toma la información, no el estilo.
 */
const ICONOS: Readonly<Record<IconoV3, LucideIcon>> = {
  paquete: Package,
  pago: CreditCard,
  plataforma: MonitorCog,
  otras: CircleHelp,
  reloj: Clock,
  mapa: MapPin,
  'paquete-danado': PackageX,
  factura: Receipt,
  stock: Boxes,
  'reclamo-nuevo': FilePlus2,
  franquicia: Store,
  fulfillment: Warehouse,
}

export interface IconoProps {
  readonly id: IconoV3
  readonly size?: number
  readonly className?: string
}

export function Icono({ id, size = 24, className }: IconoProps) {
  const Dibujo = ICONOS[id]
  return <Dibujo className={className} size={size} strokeWidth={1.5} aria-hidden="true" />
}

/**
 * Búsqueda de envíos de V3 — paso previo al formulario en las gestiones de
 * envío (ver `ItemAyuda.envio`).
 *
 * Los filtros replican los de la pantalla de producción (`/reclamosform`,
 * relevada el 2026-09-30): TN, destinatario, rango de fechas y provincia /
 * sucursal de origen y destino. Los envíos son MOCK: producción no devolvió
 * resultados en dev, así que los valores siguen el formato de la tabla del
 * diseño de Figma (nodo 13826:86982).
 */

/** Un movimiento del modal "Seguimientos" (producción: "Movimientos del envío"). */
export interface MovimientoEnvio {
  /** `dd-mm-yyyy hh:mm`, el formato del modal de producción. */
  readonly fecha: string
  readonly planta: string
  readonly historia: string
  readonly estado: string
}

export interface Envio {
  readonly tn: string
  /** ISO local, `yyyy-mm-ddThh:mm:ss`. */
  readonly fecha: string
  readonly estado: string
  readonly cargadoPor: string
  readonly destinatario: string
  readonly provinciaOrigen: string
  readonly sucursalOrigen: string
  readonly provinciaDestino: string
  readonly sucursalDestino: string
  readonly modalidad: string
  // --- Detalle (modal "Detalles del envío" y formulario de reclamo) ---
  readonly origenTipo: string
  readonly origenMail: string
  readonly destinoCalle: string
  readonly destinoAltura: string
  readonly destinoLocalidad: string
  readonly destinoCodigoPostal: string
  readonly telefono: string
  readonly celular: string
  readonly tipoEntrega: 'sucursal' | 'domicilio'
  readonly tipoProducto: string
  /** Código corto del producto, como lo muestra el formulario de reclamo ("EP"). */
  readonly codigoProducto: string
  readonly pesoKg: number
  readonly largoCm: number
  readonly anchoCm: number
  readonly altoCm: number
  readonly valorContenido: number
  readonly precio: number
  readonly movimientos: readonly MovimientoEnvio[]
}

export interface FiltrosEnvio {
  readonly tn: string
  readonly destinatario: string
  /** `yyyy-mm-dd` o vacío. */
  readonly desde: string
  readonly hasta: string
  readonly provinciaOrigen: string
  readonly sucursalOrigen: string
  readonly provinciaDestino: string
  readonly sucursalDestino: string
}

export type ClaveFiltro = keyof FiltrosEnvio

export const FILTROS_VACIOS: FiltrosEnvio = {
  tn: '',
  destinatario: '',
  desde: '',
  hasta: '',
  provinciaOrigen: '',
  sucursalOrigen: '',
  provinciaDestino: '',
  sucursalDestino: '',
}

/** Nombre corto de cada filtro, para los chips y la URL. */
export const FILTRO_META: Readonly<Record<ClaveFiltro, { readonly label: string; readonly param: string }>> = {
  tn: { label: 'TN', param: 'tn' },
  destinatario: { label: 'Destinatario', param: 'dest' },
  desde: { label: 'Fecha desde', param: 'desde' },
  hasta: { label: 'Fecha hasta', param: 'hasta' },
  provinciaOrigen: { label: 'Provincia de origen', param: 'po' },
  sucursalOrigen: { label: 'Sucursal de origen', param: 'so' },
  provinciaDestino: { label: 'Provincia de destino', param: 'pd' },
  sucursalDestino: { label: 'Sucursal de destino', param: 'sd' },
}

export const CLAVES_FILTRO = Object.keys(FILTRO_META) as readonly ClaveFiltro[]

/** Las 24 provincias del desplegable de producción, en el mismo orden. */
export const PROVINCIAS: readonly string[] = [
  'BUENOS AIRES', 'CAPITAL FEDERAL', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CORDOBA', 'CORRIENTES',
  'ENTRE RIOS', 'FORMOSA', 'JUJUY', 'LA PAMPA', 'LA RIOJA', 'MENDOZA', 'MISIONES', 'NEUQUEN',
  'RIO NEGRO', 'SALTA', 'SAN JUAN', 'SAN LUIS', 'SANTA CRUZ', 'SANTA FE', 'SANTIAGO DEL ESTERO',
  'TIERRA DEL FUEGO', 'TUCUMAN',
]

/** Sucursales mock: sólo las de las provincias que aparecen en los envíos de ejemplo. */
const SUCURSALES: Readonly<Record<string, readonly string[]>> = {
  'CAPITAL FEDERAL': ['LA PAZ M0040', 'ABASTO C0013', 'PALERMO C0021', 'CABALLITO C0034'],
  'BUENOS AIRES': ['25 DE MAYO B0101', 'LA PLATA B0200', 'PEHUAJO B0655', 'MAR DEL PLATA B0701'],
  CORDOBA: ['CORDOBA CENTRO X0001', 'VILLA CARLOS PAZ X0150'],
  'SANTA FE': ['ROSARIO S0002', 'SANTA FE CENTRO S0010'],
  MENDOZA: ['MENDOZA CENTRO M0001', 'GODOY CRUZ M0012'],
  CORRIENTES: ['CORRIENTES CENTRO W0001', 'GOYA W0030'],
}

export function sucursalesDe(provincia: string): readonly string[] {
  return SUCURSALES[provincia] ?? []
}

const ESTADOS = ['CADUCA', 'ENTREGADO', 'EN TRÁNSITO', 'EN SUCURSAL', 'EN DISTRIBUCIÓN', 'DEVUELTO']
const CARGADO_POR = ['Sofia Rios', 'Rodrigo Correo', 'Integración API']
const DESTINATARIOS = ['Lucía Gómez', 'Martín Pérez', 'Carla Díaz', 'Juan Ibarra', 'Ana Suárez', 'Pablo Ruiz']
const RUTAS: readonly (readonly [string, string, string, string])[] = [
  ['CAPITAL FEDERAL', 'LA PAZ M0040', 'CAPITAL FEDERAL', 'ABASTO C0013'],
  ['CAPITAL FEDERAL', 'PALERMO C0021', 'BUENOS AIRES', '25 DE MAYO B0101'],
  ['BUENOS AIRES', 'LA PLATA B0200', 'CORDOBA', 'CORDOBA CENTRO X0001'],
  ['BUENOS AIRES', 'PEHUAJO B0655', 'SANTA FE', 'ROSARIO S0002'],
  ['CORDOBA', 'VILLA CARLOS PAZ X0150', 'MENDOZA', 'MENDOZA CENTRO M0001'],
  ['SANTA FE', 'SANTA FE CENTRO S0010', 'CORRIENTES', 'GOYA W0030'],
  ['CAPITAL FEDERAL', 'CABALLITO C0034', 'BUENOS AIRES', 'MAR DEL PLATA B0701'],
]

function pad(valor: number): string {
  return String(valor).padStart(2, '0')
}

const PRODUCTOS = [
  { nombre: 'PAQ.AR EXPRESO', codigo: 'EP' },
  { nombre: 'PAQ.AR CLÁSICO', codigo: 'CP' },
] as const
const CALLES = ['Av. Rivadavia', 'San Martín', 'Mitre', 'Belgrano', 'Sarmiento', 'Av. Colón']
const CODIGOS_POSTALES = ['1406', '6660', '5000', '2000', '5500', '3450']

/** Historial de movimientos según el estado actual del envío (mock). */
function movimientosDe(estado: string, fecha: string, sucursalOrigen: string, sucursalDestino: string): readonly MovimientoEnvio[] {
  const dia = `${fecha.slice(8, 10)}-${fecha.slice(5, 7)}-${fecha.slice(0, 4)}`
  const hora = fecha.slice(11, 16)
  const pasos: MovimientoEnvio[] = [
    { fecha: `${dia} ${hora}`, planta: 'CORREO ARGENTINO', historia: 'PREIMPOSICION', estado: '' },
  ]
  if (estado === 'CADUCA') return pasos
  pasos.push({ fecha: `${dia} 18:10`, planta: sucursalOrigen, historia: 'ADMISION', estado: 'EN PROCESO' })
  if (estado === 'EN SUCURSAL' || estado === 'EN TRÁNSITO' || estado === 'EN DISTRIBUCIÓN' || estado === 'ENTREGADO' || estado === 'DEVUELTO') {
    pasos.push({ fecha: `${dia} 23:45`, planta: 'CTP MONTE GRANDE', historia: 'EN TRANSITO', estado: 'EN PROCESO' })
  }
  if (estado === 'EN SUCURSAL' || estado === 'EN DISTRIBUCIÓN' || estado === 'ENTREGADO' || estado === 'DEVUELTO') {
    pasos.push({ fecha: `${dia} 23:59`, planta: sucursalDestino, historia: 'LLEGADA A SUCURSAL', estado: 'EN SUCURSAL' })
  }
  if (estado === 'EN DISTRIBUCIÓN' || estado === 'ENTREGADO') {
    pasos.push({ fecha: `${dia} 23:59`, planta: sucursalDestino, historia: 'EN DISTRIBUCION', estado: 'EN PROCESO' })
  }
  if (estado === 'ENTREGADO') {
    pasos.push({ fecha: `${dia} 23:59`, planta: sucursalDestino, historia: 'ENTREGADO', estado: 'ENTREGADO' })
  }
  if (estado === 'DEVUELTO') {
    pasos.push({ fecha: `${dia} 23:59`, planta: sucursalOrigen, historia: 'DEVUELTO AL REMITENTE', estado: 'DEVUELTO' })
  }
  return pasos
}

/** 24 envíos deterministas entre enero y septiembre de 2026. */
const ENVIOS: readonly Envio[] = Array.from({ length: 24 }, (_, i) => {
  const ruta = RUTAS[i % RUTAS.length] ?? RUTAS[0]!
  const mes = 1 + ((i * 3) % 9)
  const dia = 1 + ((i * 7) % 27)
  const hora = 8 + (i % 10)
  const producto = PRODUCTOS[i % PRODUCTOS.length] ?? PRODUCTOS[0]
  const tipoEntrega = i % 2 === 0 ? 'sucursal' : 'domicilio'
  const lado = 15 + ((i * 4) % 20)
  const fecha = `2026-${pad(mes)}-${pad(dia)}T${pad(hora)}:${pad((i * 13) % 60)}:${pad((i * 29) % 60)}`
  const estado = ESTADOS[i % ESTADOS.length] ?? 'CADUCA'
  return {
    tn: `0005002824${String(70 + i).padStart(2, '0')}AAI4G32C4${String(i).padStart(2, '0')}`,
    fecha,
    estado,
    cargadoPor: CARGADO_POR[i % CARGADO_POR.length] ?? 'Sofia Rios',
    destinatario: DESTINATARIOS[i % DESTINATARIOS.length] ?? 'Lucía Gómez',
    provinciaOrigen: ruta[0],
    sucursalOrigen: ruta[1],
    provinciaDestino: ruta[2],
    sucursalDestino: ruta[3],
    modalidad: tipoEntrega === 'sucursal' ? 'Envío Pickup SUC' : 'Envío a domicilio',
    origenTipo: i % 3 === 0 ? 'Pickup' : 'Sucursal',
    origenMail: 'rodrigo.correo@ejemplo.com',
    destinoCalle: tipoEntrega === 'domicilio' ? (CALLES[i % CALLES.length] ?? '') : '',
    destinoAltura: tipoEntrega === 'domicilio' ? String(100 + i * 37) : '',
    destinoLocalidad: ruta[3].replace(/ [A-Z]\d{4}$/, ''),
    destinoCodigoPostal: CODIGOS_POSTALES[i % CODIGOS_POSTALES.length] ?? '1406',
    telefono: `4${String(334455 + i * 111).slice(0, 6)}`,
    celular: `11 ${String(22334455 + i * 1013).slice(0, 8)}`,
    tipoEntrega,
    tipoProducto: producto.nombre,
    codigoProducto: producto.codigo,
    pesoKg: 1 + ((i * 3) % 30),
    largoCm: lado,
    anchoCm: lado,
    altoCm: 10 + ((i * 5) % 25),
    valorContenido: 5000 * (1 + (i % 10)),
    precio: 6500 + i * 1873.42,
    movimientos: movimientosDe(estado, fecha, ruta[1], ruta[3]),
  }
})

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function hayFiltros(filtros: FiltrosEnvio): boolean {
  return CLAVES_FILTRO.some((clave) => filtros[clave] !== '')
}

export function filtrarEnvios(filtros: FiltrosEnvio): readonly Envio[] {
  return ENVIOS.filter((envio) => {
    const dia = envio.fecha.slice(0, 10)
    if (filtros.tn !== '' && !normalizar(envio.tn).includes(normalizar(filtros.tn))) return false
    if (filtros.destinatario !== '' && !normalizar(envio.destinatario).includes(normalizar(filtros.destinatario))) return false
    if (filtros.desde !== '' && dia < filtros.desde) return false
    if (filtros.hasta !== '' && dia > filtros.hasta) return false
    if (filtros.provinciaOrigen !== '' && envio.provinciaOrigen !== filtros.provinciaOrigen) return false
    if (filtros.sucursalOrigen !== '' && envio.sucursalOrigen !== filtros.sucursalOrigen) return false
    if (filtros.provinciaDestino !== '' && envio.provinciaDestino !== filtros.provinciaDestino) return false
    if (filtros.sucursalDestino !== '' && envio.sucursalDestino !== filtros.sucursalDestino) return false
    return true
  })
}

export function findEnvio(tn: string | undefined): Envio | null {
  if (tn === undefined) return null
  return ENVIOS.find((envio) => envio.tn === tn) ?? null
}

/** `yyyy-mm-dd` → `dd/mm/yyyy`. */
export function fechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.slice(0, 10).split('-')
  return `${dia ?? ''}/${mes ?? ''}/${anio ?? ''}`
}

/** `yyyy-mm-ddThh:mm:ss` → `dd/mm/yyyy hh:mm:ss`, como en la tabla de producción. */
export function fechaHora(iso: string): string {
  return `${fechaCorta(iso)} ${iso.slice(11, 19)}`
}

/** Valor legible de un filtro para su chip. */
export function valorDeFiltro(clave: ClaveFiltro, valor: string): string {
  return clave === 'desde' || clave === 'hasta' ? fechaCorta(valor) : valor
}

const PESOS = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** `54208.08` → `54208,08` (como el modal de detalle de producción). */
export function decimal(valor: number): string {
  return PESOS.format(valor).replace(/\./g, '')
}

/** `54208.08` → `$54.208,08` (como el formulario de reclamo de producción). */
export function pesos(valor: number): string {
  return `$${PESOS.format(valor)}`
}

export interface DatoReclamo {
  readonly label: string
  readonly valor: string
}

export interface SeccionReclamo {
  readonly titulo: string
  readonly datos: readonly DatoReclamo[]
}

/**
 * Datos del destinatario y del servicio que el formulario de reclamo de
 * producción precarga desde el envío elegido (relevado el 2026-09-30). Los
 * del remitente salen de la cuenta, en `ReclamoEnvioPage`.
 */
export function seccionesDelEnvio(envio: Envio): readonly SeccionReclamo[] {
  const domicilio = [envio.destinoCalle, envio.destinoAltura].filter((parte) => parte !== '').join(' ')
  return [
    {
      titulo: 'Datos del destinatario',
      datos: [
        { label: 'Nombre completo', valor: envio.destinatario },
        { label: 'Domicilio completo', valor: domicilio === '' ? '—' : domicilio },
        { label: 'Localidad', valor: envio.destinoLocalidad },
        { label: 'Código postal', valor: envio.destinoCodigoPostal },
        { label: 'Provincia', valor: envio.provinciaDestino },
      ],
    },
    {
      titulo: 'Datos del servicio',
      datos: [
        { label: 'TN', valor: envio.tn },
        { label: 'Importe abonado', valor: pesos(envio.precio) },
        { label: 'Valor del contenido', valor: String(envio.valorContenido) },
        { label: 'Tipo de producto', valor: envio.codigoProducto },
      ],
    },
  ]
}

/** "PAQ.AR EXPRESO" → "Paq.ar Expreso", como aparece en el asunto de producción. */
export function nombreProducto(envio: Envio): string {
  return envio.tipoProducto
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase())
}

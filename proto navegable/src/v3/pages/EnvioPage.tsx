import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Search,
  Settings2,
  X,
} from 'lucide-react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { PageContainer } from '@/shared/layout'
import { cn } from '@/shared/lib/cn'
import { Button, DatePicker, EmptyState, Input, Select } from '@/shared/ui'
import { findItemVisible } from '../core/ayuda'
import { DetalleEnvioModal, SeguimientoEnvioModal } from '../components/EnvioModales'
import {
  CLAVES_FILTRO,
  FILTRO_META,
  FILTROS_VACIOS,
  PROVINCIAS,
  filtrarEnvios,
  fechaHora,
  hayFiltros,
  sucursalesDe,
  valorDeFiltro,
} from '../core/envios'
import type { ClaveFiltro, Envio, FiltrosEnvio } from '../core/envios'
import { direccionActual, irAdelante, irAtras } from '../core/transicion'
import v3 from './v3.module.css'
import styles from './envio.module.css'

/**
 * Búsqueda del envío (V3) — paso previo al reclamo en las gestiones de
 * envío. Diseño: Figma "Mi Correo 2.0", "Estado default" (13826:86552) y
 * "Con búsqueda" (13826:86982), componente "Filtros reclamos" (13818:80453).
 *
 * Cambios respecto de producción, pedidos por el usuario el 2026-09-30:
 *  - la navegación hacia atrás vive en el título (flecha);
 *  - los filtros arrancan visibles y se pueden colapsar con "Filtros"
 *    (con animación de alto y de sus elementos internos);
 *  - al aplicarlos, el panel se colapsa y los filtros activos quedan como
 *    chips que se pueden quitar de a uno;
 *  - la pantalla ocupa el ancho disponible (PageContainer `wide`).
 *
 * Se mantienen de producción: el calendario (estilo global), las opciones
 * del menú de cada envío (Reclamo, Detalle, Seguimientos) y los modales de
 * Detalle y Seguimientos tal cual.
 *
 * Estado en la URL: `?g=` (gestión) y un parámetro por filtro aplicado
 * (ver `FILTRO_META`), así volver desde el reclamo conserva la búsqueda.
 */

const FILAS_POR_PAGINA = [10, 20, 50]

function leerFiltros(params: URLSearchParams): FiltrosEnvio {
  const filtros: Record<ClaveFiltro, string> = { ...FILTROS_VACIOS }
  for (const clave of CLAVES_FILTRO) filtros[clave] = params.get(FILTRO_META[clave].param) ?? ''
  return filtros
}

const opcion = (valor: string) => ({ value: valor, label: valor })

export function EnvioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profileId } = useActiveUseCase()

  const gestionId = searchParams.get('g') ?? undefined
  const gestion = findItemVisible(gestionId, profileId)
  const aplicados = leerFiltros(searchParams)
  const conFiltros = hayFiltros(aplicados)

  const [borrador, setBorrador] = useState<FiltrosEnvio>(aplicados)
  const [expandido, setExpandido] = useState(!conFiltros)
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)
  const [porPagina, setPorPagina] = useState(10)
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<Envio | null>(null)
  const [seguimiento, setSeguimiento] = useState<Envio | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Cierra el menú de la fila al hacer clic afuera o con Escape.
  useEffect(() => {
    if (menuAbierto === null) return
    const alClic = (event: MouseEvent) => {
      if (menuRef.current !== null && !menuRef.current.contains(event.target as Node)) setMenuAbierto(null)
    }
    const alTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuAbierto(null)
    }
    document.addEventListener('mousedown', alClic)
    document.addEventListener('keydown', alTecla)
    return () => {
      document.removeEventListener('mousedown', alClic)
      document.removeEventListener('keydown', alTecla)
    }
  }, [menuAbierto])

  const volver = () => {
    irAtras()
    const indice = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (indice > 0) void navigate(-1)
    else void navigate('/v3')
  }

  if (gestion === null || gestion.item.envio !== true) {
    return (
      <PageContainer>
        <EmptyState
          title="Esta gestión no está disponible"
          description="No corresponde a tu tipo de cuenta."
          action={
            <Button variant="secondary" onClick={() => { irAtras(); void navigate('/v3') }}>
              Volver al inicio
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const guardarEnUrl = (filtros: FiltrosEnvio) => {
    const params = new URLSearchParams({ g: gestion.item.id })
    for (const clave of CLAVES_FILTRO) {
      if (filtros[clave] !== '') params.set(FILTRO_META[clave].param, filtros[clave])
    }
    setSearchParams(params, { replace: true })
    setPagina(1)
  }

  const cambiar = (clave: ClaveFiltro, valor: string) => {
    setBorrador((previo) => {
      const siguiente = { ...previo, [clave]: valor }
      // La sucursal depende de la provincia: si cambia la provincia, se limpia.
      if (clave === 'provinciaOrigen') siguiente.sucursalOrigen = ''
      if (clave === 'provinciaDestino') siguiente.sucursalDestino = ''
      return siguiente
    })
  }

  const aplicar = () => {
    guardarEnUrl(borrador)
    if (hayFiltros(borrador)) setExpandido(false)
  }

  const limpiar = () => {
    setBorrador(FILTROS_VACIOS)
    guardarEnUrl(FILTROS_VACIOS)
    setExpandido(true)
  }

  const quitar = (clave: ClaveFiltro) => {
    const siguiente = { ...aplicados, [clave]: '' }
    if (clave === 'provinciaOrigen') siguiente.sucursalOrigen = ''
    if (clave === 'provinciaDestino') siguiente.sucursalDestino = ''
    setBorrador(siguiente)
    guardarEnUrl(siguiente)
    if (!hayFiltros(siguiente)) setExpandido(true)
  }

  const iniciarReclamo = (tn: string) => {
    irAdelante()
    void navigate(`/v3/reclamo-envio?g=${gestion.item.id}&tn=${tn}`)
  }

  const resultados = conFiltros
    ? [...filtrarEnvios(aplicados)].sort((a, b) =>
        orden === 'asc' ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha),
      )
    : []
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * porPagina
  const visibles = resultados.slice(inicio, inicio + porPagina)
  const chips = CLAVES_FILTRO.filter((clave) => aplicados[clave] !== '')
  // Cambia con cada búsqueda: vuelve a disparar la animación de entrada.
  const claveBusqueda = searchParams.toString()
  const mostrarChips = !expandido && conFiltros

  return (
    <PageContainer width="wide">
      <div className={cn(styles.pagina, v3[direccionActual()])}>
        <header className={styles.titulo}>
          <button type="button" className={styles.volver} onClick={volver} aria-label="Volver">
            <ArrowLeft size={28} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div className={styles.tituloTexto}>
            <h1 className={styles.h1}>Reclamos</h1>
            <p className={styles.bajada}>
              Por favor, buscá el envío con inconvenientes para luego iniciar el reclamo.
            </p>
          </div>
        </header>

        <section className={styles.filtros} aria-label="Filtros de búsqueda">
          <div className={styles.toggleFila}>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expandido}
              aria-controls="panel-filtros"
              onClick={() => setExpandido((valor) => !valor)}
            >
              <Settings2 size={20} strokeWidth={1.75} aria-hidden="true" />
              Filtros
              <ChevronDown
                size={20}
                strokeWidth={1.75}
                aria-hidden="true"
                className={cn(styles.chevron, expandido && styles.chevronAbierto)}
              />
            </button>
          </div>

          {/* Panel de filtros: se pliega animando el alto (grid 0fr ↔ 1fr). */}
          <div className={cn(styles.plegable, expandido && styles.plegableAbierto)} aria-hidden={!expandido}>
            <div className={styles.plegableInterior}>
              <form
                id="panel-filtros"
                className={styles.panel}
                inert={!expandido}
                onSubmit={(event) => {
                  event.preventDefault()
                  aplicar()
                }}
              >
                <div className={styles.campos}>
                  <Input
                    id="f-tn"
                    label="TN"
                    placeholder="Introducir código TN"
                    floatLabel
                    value={borrador.tn}
                    onChange={(event) => cambiar('tn', event.target.value)}
                  />
                  <Input
                    id="f-dest"
                    label="Destinatario"
                    value={borrador.destinatario}
                    onChange={(event) => cambiar('destinatario', event.target.value)}
                  />
                  <DatePicker
                    id="f-desde"
                    label="Fecha desde"
                    max={borrador.hasta}
                    value={borrador.desde}
                    onChange={(valor) => cambiar('desde', valor)}
                  />
                  <DatePicker
                    id="f-hasta"
                    label="Fecha hasta"
                    min={borrador.desde}
                    value={borrador.hasta}
                    onChange={(valor) => cambiar('hasta', valor)}
                  />
                  <Select
                    id="f-po"
                    label="Provincia de origen"
                    options={PROVINCIAS.map(opcion)}
                    placeholderOption="Todas..."
                    placeholderOptionValue=""
                    value={borrador.provinciaOrigen}
                    onChange={(event) => cambiar('provinciaOrigen', event.target.value)}
                  />
                  <Select
                    id="f-so"
                    label="Sucursal de origen"
                    options={sucursalesDe(borrador.provinciaOrigen).map(opcion)}
                    placeholderOption="Seleccionar ..."
                    placeholderOptionValue=""
                    disabled={borrador.provinciaOrigen === ''}
                    value={borrador.sucursalOrigen}
                    onChange={(event) => cambiar('sucursalOrigen', event.target.value)}
                  />
                  <Select
                    id="f-pd"
                    label="Provincia de destino"
                    options={PROVINCIAS.map(opcion)}
                    placeholderOption="Todas..."
                    placeholderOptionValue=""
                    value={borrador.provinciaDestino}
                    onChange={(event) => cambiar('provinciaDestino', event.target.value)}
                  />
                  <Select
                    id="f-sd"
                    label="Sucursal de destino"
                    options={sucursalesDe(borrador.provinciaDestino).map(opcion)}
                    placeholderOption="Seleccionar ..."
                    placeholderOptionValue=""
                    disabled={borrador.provinciaDestino === ''}
                    value={borrador.sucursalDestino}
                    onChange={(event) => cambiar('sucursalDestino', event.target.value)}
                  />
                </div>
                <div className={styles.acciones}>
                  <Button variant="secondary" size="sm" onClick={limpiar}>
                    Limpiar filtro
                  </Button>
                  <Button type="submit" size="sm">
                    Aplicar filtro
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Filtros aplicados: aparecen cuando el panel se pliega. */}
          <div className={cn(styles.plegable, mostrarChips && styles.plegableAbierto)} aria-hidden={!mostrarChips}>
            <div className={styles.plegableInterior}>
              <div className={styles.panelChips} inert={!mostrarChips}>
                <ul key={claveBusqueda} className={styles.chips} aria-label="Filtros aplicados">
                  {chips.map((clave, indice) => (
                    <li
                      key={clave}
                      className={styles.chip}
                      style={{ animationDelay: `${String(80 + indice * 50)}ms` }}
                    >
                      <span>
                        {FILTRO_META[clave].label}: {valorDeFiltro(clave, aplicados[clave])}
                      </span>
                      <button
                        type="button"
                        className={styles.chipQuitar}
                        onClick={() => quitar(clave)}
                        aria-label={`Quitar filtro ${FILTRO_META[clave].label}`}
                      >
                        <X size={14} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" onClick={limpiar}>
                  Limpiar filtro
                </Button>
              </div>
            </div>
          </div>
        </section>

        {!conFiltros ? (
          <div className={styles.vacio}>
            <span className={styles.vacioIcono} aria-hidden="true">
              <Search size={24} strokeWidth={1.75} />
            </span>
            <p className={styles.vacioTitulo}>Aún no hay resultados</p>
            <p className={styles.vacioTexto}>Utilizá los filtros para encontrar resultados</p>
          </div>
        ) : resultados.length === 0 ? (
          <div key={claveBusqueda} className={cn(styles.vacio, styles.aparecer)}>
            <span className={styles.vacioIcono} aria-hidden="true">
              <Search size={24} strokeWidth={1.75} />
            </span>
            <p className={styles.vacioTitulo}>No encontramos envíos con esos filtros</p>
            <p className={styles.vacioTexto}>Probá quitando alguno o cambiando las fechas.</p>
          </div>
        ) : (
          <section key={claveBusqueda} className={cn(styles.resultados, styles.aparecer)} aria-label="Envíos encontrados">
            <p className={styles.contador}>
              {resultados.length} {resultados.length === 1 ? 'envío' : 'envíos'}
            </p>
            <div className={styles.tablaScroll}>
              <div className={styles.tabla} role="table">
                <div className={cn(styles.fila, styles.cabecera)} role="row">
                  <div role="columnheader" className={styles.celda}>
                    <button
                      type="button"
                      className={styles.ordenar}
                      onClick={() => setOrden((valor) => (valor === 'asc' ? 'desc' : 'asc'))}
                      aria-label={`Ordenar por fecha, ${orden === 'asc' ? 'más recientes primero' : 'más antiguos primero'}`}
                    >
                      Fecha
                      {orden === 'asc' ? (
                        <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <div role="columnheader" className={styles.celda}>TN</div>
                  <div role="columnheader" className={styles.celda}>Estado</div>
                  <div role="columnheader" className={styles.celda}>Envío cargado por</div>
                  <div role="columnheader" className={styles.celda}>Origen</div>
                  <div role="columnheader" className={styles.celda}>Destino</div>
                </div>

                {visibles.map((envio, indice) => (
                  <div
                    key={envio.tn}
                    role="row"
                    className={cn(
                      styles.fila,
                      indice % 2 === 0 && styles.filaSombreada,
                      menuAbierto === envio.tn && styles.filaConMenu,
                    )}
                  >
                    <div role="cell" className={cn(styles.celda, styles.celdaFecha)}>
                      <div
                        className={styles.menuWrap}
                        ref={menuAbierto === envio.tn ? menuRef : undefined}
                      >
                        <button
                          type="button"
                          className={cn(styles.menuBoton, menuAbierto === envio.tn && styles.menuBotonAbierto)}
                          aria-label={`Acciones del envío ${envio.tn}`}
                          aria-haspopup="menu"
                          aria-expanded={menuAbierto === envio.tn}
                          onClick={() => setMenuAbierto((actual) => (actual === envio.tn ? null : envio.tn))}
                        >
                          <EllipsisVertical size={22} strokeWidth={2} aria-hidden="true" />
                        </button>
                        {menuAbierto === envio.tn && (
                          <div role="menu" className={styles.menu}>
                            <button
                              type="button"
                              role="menuitem"
                              className={styles.menuItem}
                              onClick={() => iniciarReclamo(envio.tn)}
                            >
                              Reclamo
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className={styles.menuItem}
                              onClick={() => {
                                setMenuAbierto(null)
                                setDetalle(envio)
                              }}
                            >
                              Detalle
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className={styles.menuItem}
                              onClick={() => {
                                setMenuAbierto(null)
                                setSeguimiento(envio)
                              }}
                            >
                              Seguimientos
                            </button>
                          </div>
                        )}
                      </div>
                      {fechaHora(envio.fecha)}
                    </div>
                    <div role="cell" className={styles.celda}>{envio.tn}</div>
                    <div role="cell" className={styles.celda}>{envio.estado}</div>
                    <div role="cell" className={styles.celda}>{envio.cargadoPor}</div>
                    <div role="cell" className={styles.celda}>
                      {envio.provinciaOrigen} {envio.sucursalOrigen}
                    </div>
                    <div role="cell" className={styles.celda}>
                      {envio.provinciaDestino} {envio.sucursalDestino} {envio.modalidad}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.paginador}>
              <p className={styles.paginadorTexto}>
                Mostrando {inicio + 1}–{inicio + visibles.length} de {resultados.length} • Página{' '}
                {paginaActual} de {totalPaginas}
              </p>
              <div className={styles.paginadorControles}>
                <label className={styles.paginadorTexto} htmlFor="filas-por-pagina">
                  Filas por página:
                </label>
                <select
                  id="filas-por-pagina"
                  className={styles.filasSelect}
                  value={porPagina}
                  onChange={(event) => {
                    setPorPagina(Number(event.target.value))
                    setPagina(1)
                  }}
                >
                  {FILAS_POR_PAGINA.map((valor) => (
                    <option key={valor} value={valor}>
                      {valor}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.paginaBoton}
                  onClick={() => setPagina(paginaActual - 1)}
                  disabled={paginaActual <= 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.paginaBoton}
                  onClick={() => setPagina(paginaActual + 1)}
                  disabled={paginaActual >= totalPaginas}
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <DetalleEnvioModal envio={detalle} onClose={() => setDetalle(null)} />
      <SeguimientoEnvioModal envio={seguimiento} onClose={() => setSeguimiento(null)} />
    </PageContainer>
  )
}

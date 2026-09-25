import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { PageContainer, PageHeader } from '@/shared/layout'
import { EmptyState, SearchInput } from '@/shared/ui'
import { accesosVisibles, buscar, findGrupoVisible, gruposVisibles, itemsDeCategoria } from '../core/ayuda'
import { Icono } from '../components/Icono'
import { direccionActual, irAdelante, irAtras } from '../core/transicion'
import styles from './v3.module.css'

/**
 * Inicio de V3.
 *
 * Las 4 tarjetas son el primer nivel: se tocan enteras y sólo muestran una
 * descripción. Recién al entrar a una aparecen sus subtemas, que son los
 * que llevan al formulario. Se mantiene de V2 el buscador (con su demora,
 * su cruz y su "← Volver") y la fila de accesos rápidos.
 *
 * Estado en la URL: `?t=<grupo>` para el tema abierto y `?q=` para la
 * búsqueda. Elegir un subtema abre `/v3/formulario?g=<id>`.
 */

/** Lo que tarda el resultado en aparecer. Sólo para que el loader se vea. */
const DEMORA_BUSQUEDA_MS = 350

export function AyudaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profileId } = useActiveUseCase()
  const [buscando, setBuscando] = useState(false)

  const consulta = searchParams.get('q') ?? ''
  const hayBusqueda = consulta.trim() !== ''
  // Si el tipo de usuario cambia y el tema abierto queda vacío, se vuelve
  // solo al inicio: `findGrupoVisible` ya no lo encuentra.
  const grupoAbierto = findGrupoVisible(searchParams.get('t') ?? undefined, profileId)

  useEffect(() => {
    if (!hayBusqueda) {
      setBuscando(false)
      return
    }
    setBuscando(true)
    const temporizador = setTimeout(() => setBuscando(false), DEMORA_BUSQUEDA_MS)
    return () => clearTimeout(temporizador)
  }, [consulta, hayBusqueda])

  const setConsulta = (valor: string) => {
    if (valor === '') irAtras()
    else if (!hayBusqueda) irAdelante()
    setSearchParams(valor === '' ? {} : { q: valor }, { replace: true })
  }

  const abrirTema = (grupoId: string | null) => {
    if (grupoId === null) irAtras()
    else irAdelante()
    setSearchParams(grupoId === null ? {} : { t: grupoId })
  }

  const abrirFormulario = (itemId: string | null) => {
    irAdelante()
    void navigate(itemId === null ? '/v3/formulario' : `/v3/formulario?g=${itemId}`)
  }

  const resultados = hayBusqueda ? buscar(consulta, profileId) : []
  const vista = hayBusqueda ? 'busqueda' : grupoAbierto !== null ? 't:' + grupoAbierto.id : 'c:' + (searchParams.get('c') ?? '')
  const animacion = styles[direccionActual()]

  // Atajo propio del tipo de usuario (Franquicias / Fulfillment): junta todas
  // sus gestiones, que en V3 quedan repartidas entre varios grupos.
  const accesoCategoria = accesosVisibles(profileId).find(
    (acceso) => acceso.categoria !== null && acceso.categoria === searchParams.get('c'),
  )
  const itemsCategoria = accesoCategoria?.categoria
    ? itemsDeCategoria(accesoCategoria.categoria, profileId)
    : []

  if (!hayBusqueda && accesoCategoria !== undefined) {
    return (
      <PageContainer>
        <PageHeader title="Ayuda y soporte" />
        <div key={vista} className={`${styles.stack} ${animacion}`}>
          <button type="button" className={styles.volver} onClick={() => abrirTema(null)}>
            ← Volver
          </button>
          <div className={styles.temaHead}>
            <Icono id={accesoCategoria.icono} className={styles.grupoIcono} />
            <h2 className={styles.temaTitulo}>{accesoCategoria.label}</h2>
          </div>
          <div className={styles.lista}>
            {itemsCategoria.map(({ item, grupo }) => (
              <button
                key={item.id}
                type="button"
                className={styles.fila}
                onClick={() => abrirFormulario(item.id)}
              >
                <span>
                  <span className={styles.filaLabel}>{item.label}</span>
                  <span className={styles.filaRuta}>{grupo.titulo}</span>
                </span>
                <span className={styles.filaFlecha} aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Ayuda y soporte" />

      <SearchInput
        id="buscar-ayuda"
        value={consulta}
        onChange={setConsulta}
        onClear={() => setConsulta('')}
        placeholder="¿Con qué servicio podemos ayudarte?"
        className={styles.search}
      />

      {hayBusqueda ? (
        <div key={vista} className={`${styles.stack} ${animacion}`}>
          {buscando ? (
            <p className={styles.cargando}>
              <span className={styles.spinner} aria-hidden="true" />
              Buscando…
            </p>
          ) : (
            <>
              <button type="button" className={styles.volver} onClick={() => setConsulta('')}>
                ← Volver
              </button>

              {resultados.length === 0 ? (
                <EmptyState
                  title="No encontramos nada con esas palabras"
                  description="Probá con otras palabras."
                />
              ) : (
                <>
                  <p className={styles.contador}>
                    {`${String(resultados.length)} ${resultados.length === 1 ? 'resultado' : 'resultados'}`}
                  </p>
                  <div className={styles.lista}>
                    {resultados.map(({ item, grupo }) => (
                      <button
                        key={item.id}
                        type="button"
                        className={styles.fila}
                        onClick={() => abrirFormulario(item.id)}
                      >
                        <span>
                          <span className={styles.filaLabel}>{item.label}</span>
                          <span className={styles.filaRuta}>{grupo.titulo}</span>
                        </span>
                        <span className={styles.filaFlecha} aria-hidden="true">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ) : grupoAbierto !== null ? (
        <div key={vista} className={`${styles.stack} ${animacion}`}>
          <button type="button" className={styles.volver} onClick={() => abrirTema(null)}>
            ← Volver
          </button>

          <div className={styles.temaHead}>
            <Icono id={grupoAbierto.icono} className={styles.grupoIcono} />
            <h2 className={styles.temaTitulo}>{grupoAbierto.titulo}</h2>
          </div>

          <div className={styles.lista}>
            {grupoAbierto.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.fila}
                onClick={() => abrirFormulario(item.id)}
              >
                <span className={styles.filaLabel}>{item.label}</span>
                <span className={styles.filaFlecha} aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div key={vista} className={`${styles.stack} ${animacion}`}>
          <div className={styles.grupos}>
            {gruposVisibles(profileId).map((grupo) => (
              <button
                key={grupo.id}
                type="button"
                className={styles.grupo}
                onClick={() => abrirTema(grupo.id)}
              >
                <span className={styles.grupoBadge}>
                  <Icono id={grupo.icono} size={24} />
                </span>
                <span className={styles.grupoTexto}>
                  <span className={styles.grupoTitulo}>{grupo.titulo}</span>
                  <span className={styles.grupoDesc}>{grupo.descripcion}</span>
                </span>
              </button>
            ))}
          </div>

          <section className={styles.accesos}>
            <h2 className={styles.accesosTitulo}>¿Buscás algo puntual?</h2>
            <div className={styles.accesosGrilla}>
              {accesosVisibles(profileId).map((acceso) => (
                <button
                  key={acceso.id}
                  type="button"
                  className={styles.acceso}
                  onClick={() =>
                    acceso.categoria !== null
                      ? (irAdelante(), setSearchParams({ c: acceso.categoria }))
                      : abrirFormulario(acceso.itemId)
                  }
                >
                  <Icono id={acceso.icono} size={22} className={styles.accesoIcono} />
                  <span className={styles.accesoLabel}>{acceso.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  )
}

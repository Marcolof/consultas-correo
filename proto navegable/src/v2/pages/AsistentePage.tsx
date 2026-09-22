import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/shared/layout'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { visibleCategoriesForProfile } from '@/core/gestiones/categories'
import { Alert, Button, EmptyState, SearchInput } from '@/shared/ui'
import {
  ACCESOS_RAPIDOS,
  CLAVE_CATEGORIAS_VISIBLES,
  opcionesVisibles,
  recorrer,
} from '../core/arbol'
import type { NodoPregunta, OpcionNodo } from '../core/arbol'
import { buscar } from '../core/buscador'
import { contextoDeEnvio, findEnvio } from '../core/envios'
import { Icono } from '../components/Icono'
import { ReclamoFormulario } from '../components/ReclamoFormulario'
import styles from './v2.module.css'

/**
 * Pantalla única de V2: el asistente guiado.
 *
 * Dos maneras de llegar a lo mismo, que conviven acá:
 *
 *   - escribir en el buscador → resultados directos (atajo);
 *   - elegir entre pocas tarjetas → el árbol va podando hasta la hoja.
 *
 * Los dos caminos terminan en el MISMO nodo del mismo árbol, igual que los
 * accesos rápidos del pie: un resultado de búsqueda no abre otra pantalla,
 * deja el recorrido donde habría quedado eligiendo tarjeta por tarjeta.
 *
 * Todo el estado vive en la URL:
 *   ?p=op1,op2   respuestas elegidas, en orden
 *   ?q=texto     búsqueda activa
 *   ?envio=ID    se entró desde un envío (siembra el contexto)
 */

/** Lo que tarda el resultado en aparecer. Sólo para que el loader se vea. */
const DEMORA_BUSQUEDA_MS = 350

export function AsistentePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profileId } = useActiveUseCase()

  const camino = (searchParams.get('p') ?? '').split(',').filter((paso) => paso !== '')
  const consulta = searchParams.get('q') ?? ''
  const envio = findEnvio(searchParams.get('envio') ?? undefined)

  // Qué agrupaciones puede ver el tipo de usuario activo (el que se simula
  // desde el panel "Casos de uso"). La regla es la misma que usa V1 y vive en
  // `core/gestiones/categories.ts`: acá sólo se consulta, no se reescribe.
  const contextoInicial = {
    ...(envio === null ? {} : contextoDeEnvio(envio)),
    [CLAVE_CATEGORIAS_VISIBLES]: visibleCategoriesForProfile(profileId)
      .map((categoria) => categoria.id)
      .join(','),
  }

  const recorrido = recorrer(camino, contextoInicial)
  // Si al cambiar de tipo de usuario una opción del camino dejó de estar
  // visible, el recorrido se corta ahí: el paso siguiente se agrega sobre lo
  // que realmente se aplicó, no sobre el camino viejo de la URL.
  const caminoVigente = recorrido.caminoAplicado

  const [buscando, setBuscando] = useState(false)

  // El resultado existe al instante (es un filtro en memoria): la espera es
  // deliberada, para que se entienda que la búsqueda está trabajando.
  useEffect(() => {
    if (consulta.trim() === '') {
      setBuscando(false)
      return
    }
    setBuscando(true)
    const temporizador = setTimeout(() => setBuscando(false), DEMORA_BUSQUEDA_MS)
    return () => clearTimeout(temporizador)
  }, [consulta])

  const actualizar = (cambios: { camino?: readonly string[]; consulta?: string }) => {
    const proximos = new URLSearchParams()
    if (envio !== null) proximos.set('envio', envio.id)

    const proximoCamino = cambios.camino ?? caminoVigente
    if (proximoCamino.length > 0) proximos.set('p', proximoCamino.join(','))

    const proximaConsulta = cambios.consulta ?? (cambios.camino === undefined ? consulta : '')
    if (proximaConsulta !== '') proximos.set('q', proximaConsulta)

    setSearchParams(proximos, { replace: true })
  }

  const hayBusqueda = consulta.trim() !== ''
  const resultados = hayBusqueda ? buscar(consulta, contextoInicial) : []

  // Un atajo que apunta a una gestión sólo se muestra si el tipo de usuario
  // activo puede llegar hasta ella: se valida recorriendo su propio camino.
  const accesosVisibles = ACCESOS_RAPIDOS.filter(
    (acceso) =>
      acceso.camino === undefined ||
      recorrer(acceso.camino, contextoInicial).caminoAplicado.length === acceso.camino.length,
  )
  const ultimaRespuesta = recorrido.pasos[recorrido.pasos.length - 1]?.respuesta
  const enElInicio = recorrido.pasos.length === 0

  return (
    <PageContainer>
      <PageHeader title="¿Cómo podemos ayudarte?" />

      <SearchInput
        id="buscar-asistente"
        value={consulta}
        onChange={(valor) => actualizar({ consulta: valor })}
        onClear={() => actualizar({ consulta: '' })}
        placeholder="Contanos con tus palabras qué te pasó"
        className={styles.search}
      />

      {hayBusqueda ? (
        <div className={styles.stack}>
          {buscando ? (
            <p className={styles.cargando}>
              <span className={styles.spinner} aria-hidden="true" />
              Buscando…
            </p>
          ) : (
            <>
              <div className={styles.barraVolver}>
                <button
                  type="button"
                  className={styles.volverGuiada}
                  onClick={() => actualizar({ consulta: '' })}
                >
                  ← Volver
                </button>
              </div>

              {resultados.length === 0 ? (
                <EmptyState
                  title="No encontramos nada con esas palabras"
                  description="Probá con otras palabras."
                />
              ) : (
                <>
                  <p className={styles.sectionNote}>
                    {`${String(resultados.length)} ${resultados.length === 1 ? 'resultado' : 'resultados'}`}
                  </p>
                  <div className={styles.lista}>
                    {resultados.map((resultado) => (
                      <button
                        key={resultado.camino.join('/')}
                        type="button"
                        className={styles.fila}
                        onClick={() => actualizar({ camino: resultado.camino, consulta: '' })}
                      >
                        <span>
                          <span className={styles.filaLabel}>{resultado.titulo}</span>
                          <span className={styles.filaRuta}>{resultado.ruta.join(' › ')}</span>
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
      ) : (
        <div className={styles.stack}>
          {recorrido.pasos.length > 0 && (
            <div className={styles.barraVolver}>
              {/* Misma salida que ofrece la búsqueda, en el mismo lugar: arriba
                  y a la izquierda. Acá deshace un paso; para saltar a un punto
                  intermedio están las migas. */}
              {caminoVigente.length > 0 && (
                <button
                  type="button"
                  className={styles.volverGuiada}
                  onClick={() => actualizar({ camino: caminoVigente.slice(0, -1) })}
                >
                  ← Volver
                </button>
              )}

              <nav className={styles.camino} aria-label="Opciones que ya elegiste">
                {recorrido.pasos.map((paso) =>
                  paso.automatico ? (
                    <span
                      key={`${paso.nodoId}-${paso.respuesta}`}
                      className={styles.crumbAuto}
                      title="Ya lo sabíamos, no hizo falta preguntarlo"
                    >
                      {paso.respuesta}
                    </span>
                  ) : (
                    <button
                      key={`${paso.nodoId}-${paso.respuesta}`}
                      type="button"
                      className={styles.crumb}
                      onClick={() => actualizar({ camino: caminoVigente.slice(0, paso.corteDelCamino) })}
                    >
                      {paso.respuesta}
                    </button>
                  ),
                )}
              </nav>
            </div>
          )}

          {recorrido.caminoTruncado && (
            <Alert tone="info" title="Cambiamos el último paso">
              Una de las opciones que habías elegido no está disponible para este tipo
              de usuario, así que te dejamos en el paso anterior.
            </Alert>
          )}

          {recorrido.nodo === null ? (
            <EmptyState
              title="No pudimos seguir desde acá"
              action={
                <Button variant="secondary" onClick={() => actualizar({ camino: [] })}>
                  Empezar de nuevo
                </Button>
              }
            />
          ) : recorrido.nodo.tipo === 'pregunta' ? (
            <Pregunta
              nodo={recorrido.nodo}
              contexto={recorrido.contexto}
              onElegir={(opcionId) => actualizar({ camino: [...caminoVigente, opcionId] })}
            />
          ) : (
            <ReclamoFormulario
              formularioId={recorrido.nodo.formulario}
              contexto={recorrido.contexto}
              motivoLabel={ultimaRespuesta ?? 'Consulta general'}
              onEnviado={(reclamo) => void navigate(`/v2/reclamos/${reclamo.id}`)}
            />
          )}

          {enElInicio && (
            <section className={styles.accesos}>
              <h2 className={styles.accesosTitulo}>¿Buscás algo puntual?</h2>
              <div className={styles.accesosGrilla}>
                {accesosVisibles.map((acceso) => (
                  <button
                    key={acceso.id}
                    type="button"
                    className={styles.accesoTarjeta}
                    onClick={() => {
                      if (acceso.ruta !== undefined) void navigate(acceso.ruta)
                      else if (acceso.camino !== undefined) actualizar({ camino: acceso.camino })
                    }}
                  >
                    <Icono id={acceso.icono} className={styles.tarjetaIcono} />
                    <span className={styles.accesoLabel}>{acceso.label}</span>
                    {acceso.descripcion !== undefined && (
                      <span className={styles.accesoDesc}>{acceso.descripcion}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  )
}

interface PreguntaProps {
  readonly nodo: NodoPregunta
  readonly contexto: Readonly<Record<string, string>>
  readonly onElegir: (opcionId: string) => void
}

function Pregunta({ nodo, contexto, onElegir }: PreguntaProps) {
  const opciones = opcionesVisibles(nodo, contexto)

  // Con ícono van en grilla de tarjetas; sin ícono, en filas — las preguntas
  // profundas tienen etiquetas largas que no entran en una tarjeta.
  const comoTarjetas = opciones.some((opcion) => opcion.icono !== undefined)

  return (
    <section>
      <p className={styles.preguntaLinea}>{nodo.texto}</p>

      {comoTarjetas ? (
        <div className={styles.grilla}>
          {opciones.map((opcion) => (
            <TarjetaOpcion key={opcion.id} opcion={opcion} onElegir={onElegir} />
          ))}
        </div>
      ) : (
        <div className={styles.lista}>
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              className={styles.fila}
              onClick={() => onElegir(opcion.id)}
            >
              <span>
                <span className={styles.filaLabel}>{opcion.label}</span>
                {opcion.descripcion !== undefined && (
                  <span className={styles.filaRuta}>{opcion.descripcion}</span>
                )}
              </span>
              <span className={styles.filaFlecha} aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

interface TarjetaOpcionProps {
  readonly opcion: OpcionNodo
  readonly onElegir: (opcionId: string) => void
}

function TarjetaOpcion({ opcion, onElegir }: TarjetaOpcionProps) {
  return (
    <button type="button" className={styles.tarjeta} onClick={() => onElegir(opcion.id)}>
      {opcion.icono !== undefined && <Icono id={opcion.icono} className={styles.tarjetaIcono} />}
      <span className={styles.tarjetaLabel}>{opcion.label}</span>
      {opcion.descripcion !== undefined && (
        <span className={styles.tarjetaDesc}>{opcion.descripcion}</span>
      )}
    </button>
  )
}

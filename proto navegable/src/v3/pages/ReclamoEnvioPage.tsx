import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { PageContainer } from '@/shared/layout'
import { Alert, Button, EmptyState } from '@/shared/ui'
import { Textarea } from '@/shared/ui/Input'
import { asuntoDe, datosRemitente, enviarConsulta, findItemVisible } from '../core/ayuda'
import { findEnvio, nombreProducto, seccionesDelEnvio } from '../core/envios'
import { direccionActual, irAtras } from '../core/transicion'
import v3 from './v3.module.css'
import styles from './reclamoEnvio.module.css'

/**
 * Reclamo de un envío (V3) — se llega desde "Reclamo" en el menú de un envío
 * de `/v3/envio`.
 *
 * Toma TODA la información del formulario de producción (Datos del
 * remitente, del destinatario y del servicio; captura del 2026-09-30) pero
 * con el estilo de V3: esos datos no son campos bloqueados sino un panel
 * lateral de sólo lectura, y lo único que el usuario escribe son dos campos
 * amplios, la descripción del contenido y la del reclamo.
 *
 * `?g=` gestión, `?tn=` envío elegido.
 */
/**
 * Largo máximo de los dos campos. No se pudo relevar el de producción (la
 * sesión de dev venció): valores propuestos, a confirmar.
 */
const MAX_CONTENIDO = 250
const MAX_RECLAMO = 1000

/** Datos con valores largos: ocupan las dos columnas del panel lateral. */
const DATOS_ANCHOS: ReadonlySet<string> = new Set([
  'Razón social / nombre completo',
  'Correo electrónico',
  'Domicilio',
  'Domicilio completo',
  'TN',
])

export function ReclamoEnvioPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profileId } = useActiveUseCase()

  const gestion = findItemVisible(searchParams.get('g') ?? undefined, profileId)
  const envio = findEnvio(searchParams.get('tn') ?? undefined)

  const [contenido, setContenido] = useState('')
  const [reclamo, setReclamo] = useState('')
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [caso, setCaso] = useState<string | null>(null)

  const volver = () => {
    irAtras()
    const indice = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (indice > 0) void navigate(-1)
    else void navigate('/v3')
  }

  if (gestion === null || gestion.item.envio !== true || envio === null) {
    return (
      <PageContainer>
        <EmptyState
          title="No encontramos el envío"
          description="Volvé a buscarlo para iniciar el reclamo."
          action={
            <Button variant="secondary" onClick={() => { irAtras(); void navigate('/v3') }}>
              Volver al inicio
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const asunto = `${asuntoDe(gestion.item)} - ${nombreProducto(envio)}`
  const secciones = [{ titulo: 'Datos del remitente', datos: datosRemitente() }, ...seccionesDelEnvio(envio)]
  const faltaContenido = contenido.trim() === ''
  const faltaReclamo = reclamo.trim() === ''

  const enviar = () => {
    setIntentoEnviar(true)
    if (faltaContenido || faltaReclamo) return
    setCaso(enviarConsulta())
  }

  return (
    <PageContainer width="wide">
      <div className={v3[direccionActual()]}>
        <header className={v3.formHeader}>
          <button type="button" className={v3.formBack} onClick={volver} aria-label="Volver">
            <ArrowLeft size={24} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div>
            <h1 className={v3.formTitulo}>Contacto, sugerencias y reclamos aquí</h1>
            <p className={v3.formDescripcion}>
              Completá el siguiente formulario y te responderemos a la brevedad
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <section className={v3.panel} aria-labelledby="info-registrada">
            <h2 id="info-registrada" className={v3.panelTitulo}>
              Información registrada
            </h2>
            <hr className={v3.panelDivisor} />
            {secciones.map((seccion) => (
              <div key={seccion.titulo} className={styles.seccion}>
                <h3 className={styles.seccionTitulo}>{seccion.titulo}</h3>
                <dl className={styles.datos}>
                  {seccion.datos.map((dato) => (
                    <div key={dato.label} className={DATOS_ANCHOS.has(dato.label) ? styles.datoAncho : undefined}>
                      <dt className={v3.datoLabel}>{dato.label}</dt>
                      <dd className={v3.datoValor}>{dato.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>

          <section className={v3.panel} aria-labelledby="detalle-reclamo">
            <h2 id="detalle-reclamo" className={v3.panelTitulo}>
              Detalles del reclamo
            </h2>
            <hr className={v3.panelDivisor} />

            {caso !== null ? (
              <div className={v3.detalle}>
                <Alert tone="success" title={`Tu número de caso es ${caso}`}>
                  Recibimos tu reclamo del envío {envio.tn}. Te vamos a responder al correo
                  registrado en tu cuenta.
                </Alert>
                <div>
                  <Button onClick={() => { irAtras(); void navigate('/v3') }}>Volver al inicio</Button>
                </div>
              </div>
            ) : (
              <div className={v3.detalle}>
                <div className={styles.asunto}>
                  <p className={v3.datoLabel}>Asunto</p>
                  <p className={styles.asuntoValor}>{asunto}</p>
                  <p className={styles.asuntoTn}>Envío {envio.tn}</p>
                </div>

                <Textarea
                  id="descripcion-contenido"
                  label="Descripción del contenido *"
                  placeholder="Contanos qué había dentro del paquete (tipo de artículos, cantidad, estado)…"
                  value={contenido}
                  maxLength={MAX_CONTENIDO}
                  showCounter
                  onChange={(event) => setContenido(event.target.value)}
                  error={intentoEnviar && faltaContenido ? 'Describí el contenido del envío.' : null}
                  className={styles.contenido}
                />

                <Textarea
                  id="descripcion-reclamo"
                  label="Descripción del reclamo *"
                  placeholder="Contanos qué pasó con el envío para que podamos ayudarte…"
                  value={reclamo}
                  maxLength={MAX_RECLAMO}
                  showCounter
                  onChange={(event) => setReclamo(event.target.value)}
                  error={intentoEnviar && faltaReclamo ? 'Contanos qué pasó para poder ayudarte.' : null}
                  className={styles.reclamo}
                />

                <div className={v3.acciones}>
                  <Button variant="secondary" fullWidth onClick={volver}>
                    Atrás
                  </Button>
                  <Button fullWidth onClick={enviar}>
                    Iniciar reclamo
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  )
}

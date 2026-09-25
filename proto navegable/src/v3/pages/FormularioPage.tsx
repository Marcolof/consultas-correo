import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useActiveUseCase } from '@/core/session/activeUseCase'
import { PageContainer } from '@/shared/layout'
import { Alert, Button, Checkbox, EmptyState, Select } from '@/shared/ui'
import { Textarea } from '@/shared/ui/Input'
import { asuntoDe, datosDeCuenta, enviarConsulta, findItemVisible, gruposVisibles } from '../core/ayuda'
import { direccionActual, irAtras } from '../core/transicion'
import styles from './v3.module.css'

/**
 * Formulario de V3.
 *
 * El usuario llega siempre registrado, así que sus datos NO se piden: se
 * muestran de sólo lectura en "Información registrada", tal como vienen de
 * la cuenta. Lo único que escribe es la consulta. Ése es el cambio de fondo
 * respecto del formulario de V2, que seguía pidiendo datos que el sistema ya
 * tiene.
 *
 * Se entra con `?g=<id>` desde una gestión (asunto ya elegido) o sin nada
 * desde el atajo "Ingresar un reclamo" (el asunto se elige acá).
 */
export function FormularioPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profileId } = useActiveUseCase()

  const idPedido = searchParams.get('g') ?? undefined
  const [asuntoId, setAsuntoId] = useState(idPedido ?? '')
  const [consulta, setConsulta] = useState('')
  const [noSoyRobot, setNoSoyRobot] = useState(false)
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [caso, setCaso] = useState<string | null>(null)

  const volver = () => {
    irAtras()
    // Si se llegó navegando dentro del prototipo, volver respeta de dónde se
    // vino (con la búsqueda incluida); si se entró por enlace directo, no hay
    // a dónde volver y se va al inicio de V3.
    const indice = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (indice > 0) void navigate(-1)
    else void navigate('/v3')
  }

  const elegido = findItemVisible(asuntoId === '' ? undefined : asuntoId, profileId)

  // Un enlace a una gestión que este tipo de usuario no ve no debe abrir el
  // formulario igual: es la misma regla que oculta la gestión en el inicio.
  if (idPedido !== undefined && findItemVisible(idPedido, profileId) === null) {
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

  const opcionesAsunto = gruposVisibles(profileId).flatMap((grupo) =>
    grupo.items.map((item) => ({ value: item.id, label: item.label })),
  )

  const faltaAsunto = elegido === null
  const faltaConsulta = consulta.trim() === ''
  const faltaCaptcha = !noSoyRobot

  const enviar = () => {
    setIntentoEnviar(true)
    if (faltaAsunto || faltaConsulta || faltaCaptcha) return
    setCaso(enviarConsulta())
  }

  const datos = [
    ...datosDeCuenta(),
    { label: 'Asunto', valor: elegido === null ? '—' : asuntoDe(elegido.item) },
  ]

  return (
    <PageContainer>
      <div className={styles[direccionActual()]}>
      <header className={styles.formHeader}>
        <button type="button" className={styles.formBack} onClick={volver} aria-label="Volver">
          <ArrowLeft size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div>
          <h1 className={styles.formTitulo}>Contacto, sugerencias y reclamos aquí</h1>
          <p className={styles.formDescripcion}>
            Completá el siguiente formulario y te responderemos a la brevedad
          </p>
        </div>
      </header>

      <div className={styles.formLayout}>
        <section className={styles.panel} aria-labelledby="info-registrada">
          <h2 id="info-registrada" className={styles.panelTitulo}>
            Información registrada
          </h2>
          <hr className={styles.panelDivisor} />
          <dl className={styles.datos}>
            {datos.map((dato) => (
              <div key={dato.label}>
                <dt className={styles.datoLabel}>{dato.label}</dt>
                <dd className={styles.datoValor}>{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.panel} aria-labelledby="detalle-gestion">
          <h2 id="detalle-gestion" className={styles.panelTitulo}>
            Detalles de la gestión
          </h2>
          <hr className={styles.panelDivisor} />

          {caso !== null ? (
            <div className={styles.detalle}>
              <Alert tone="success" title={`Tu número de caso es ${caso}`}>
                Recibimos tu consulta. Te vamos a responder al correo registrado en tu cuenta.
              </Alert>
              <div>
                <Button onClick={() => { irAtras(); void navigate('/v3') }}>Volver al inicio</Button>
              </div>
            </div>
          ) : (
            <div className={styles.detalle}>
              {idPedido === undefined && (
                <Select
                  id="asunto"
                  label="Asunto"
                  options={opcionesAsunto}
                  value={asuntoId === '' ? '-1' : asuntoId}
                  onChange={(event) =>
                    setAsuntoId(event.target.value === '-1' ? '' : event.target.value)
                  }
                  error={intentoEnviar && faltaAsunto ? 'Elegí el motivo de tu consulta.' : null}
                />
              )}

              <Textarea
                id="consulta"
                label="Contanos tu consulta *"
                placeholder="Escribí aquí los detalles de tu consulta o reclamo para que podamos ayudarte…"
                value={consulta}
                onChange={(event) => setConsulta(event.target.value)}
                error={intentoEnviar && faltaConsulta ? 'Contanos qué pasó para poder ayudarte.' : null}
                className={styles.consulta}
              />

              <div>
                <p className={styles.subtitulo}>¿Sos humano?</p>
                {/* Maqueta visual del captcha de producción: no valida nada. */}
                <div className={styles.captcha}>
                  <Checkbox
                    id="no-soy-robot"
                    label="No soy un robot"
                    checked={noSoyRobot}
                    onChange={setNoSoyRobot}
                  />
                  <span className={styles.captchaMarca} aria-hidden="true">
                    <RefreshCw size={26} strokeWidth={2} className={styles.captchaIcono} />
                    <strong>reCAPTCHA</strong>
                    Privacidad - Términos
                  </span>
                </div>
                {intentoEnviar && faltaCaptcha && (
                  <p className={styles.errorTexto} role="alert">
                    Confirmá que no sos un robot.
                  </p>
                )}
              </div>

              <div className={styles.acciones}>
                <Button variant="secondary" fullWidth onClick={volver}>
                  Atrás
                </Button>
                <Button fullWidth onClick={enviar}>
                  Enviar mensaje
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

import { useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/shared/layout'
import { Badge, Button } from '@/shared/ui'
import { ENVIOS, estadoDe, ultimoEvento } from '../core/envios'
import styles from './v2.module.css'

/**
 * Punto de partida de V2: el usuario está mirando SUS envíos, no una
 * sección de reclamos.
 *
 * Los envíos con un estado problemático muestran el acceso al reclamo en la
 * propia tarjeta — esa es la idea de fondo de la propuesta: el reclamo
 * aparece donde el problema se ve, sin que el usuario tenga que ir a
 * buscarlo a otro lado.
 */
export function EnviosListPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageHeader
        title="Mis envíos"
        description="Seguí el estado de tus envíos y resolvé cualquier problema desde acá."
        actions={
          <Button variant="secondary" size="sm" onClick={() => void navigate('/v2')}>
            Necesito ayuda
          </Button>
        }
      />

      <div className={styles.cards}>
        {ENVIOS.map((envio) => {
          const estado = estadoDe(envio)

          return (
            <button
              key={envio.id}
              type="button"
              className={styles.card}
              onClick={() => void navigate(`/v2/envios/${envio.id}`)}
            >
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardNumero}>{envio.numero}</p>
                  <p className={styles.cardDesc}>
                    {envio.descripcion} · {envio.destinatario} · {envio.localidad}
                  </p>
                </div>
                <Badge tone={estado.tono}>{estado.label}</Badge>
              </div>

              <p className={styles.cardEvento}>{ultimoEvento(envio)}</p>

              {estado.esProblema && (
                <p className={styles.cardProblema}>Tengo un problema con este envío →</p>
              )}
            </button>
          )
        })}
      </div>
    </PageContainer>
  )
}

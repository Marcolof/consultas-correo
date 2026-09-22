import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/shared/layout'
import { Badge, Button, EmptyState } from '@/shared/ui'
import { findEnvio, estadoDe } from '../core/envios'
import styles from './v2.module.css'

/**
 * Detalle de un envío. Acá vive el punto de entrada al reclamo: el sistema
 * ya sabe de qué envío se trata, en qué estado está y cuál fue su último
 * movimiento, así que el usuario no tiene que explicar nada de eso.
 */
export function EnvioDetallePage() {
  const { envioId } = useParams()
  const navigate = useNavigate()
  const envio = findEnvio(envioId)

  if (envio === null) {
    return (
      <PageContainer>
        <EmptyState
          title="No encontramos ese envío"
          description="Puede que el enlace esté incompleto."
          action={
            <Button variant="secondary" onClick={() => void navigate('/v2/envios')}>
              Volver a mis envíos
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const estado = estadoDe(envio)

  const datos: readonly { readonly label: string; readonly valor: string }[] = [
    { label: 'Destinatario', valor: envio.destinatario },
    { label: 'Domicilio de entrega', valor: `${envio.direccion} — ${envio.localidad}` },
    { label: 'Fecha de despacho', valor: envio.fechaDespacho },
    { label: 'Entrega estimada', valor: envio.entregaEstimada },
  ]

  return (
    <PageContainer>
      <button type="button" className={styles.backLink} onClick={() => void navigate('/v2/envios')}>
        ← Mis envíos
      </button>

      <PageHeader
        title={envio.numero}
        description={envio.descripcion}
        actions={<Badge tone={estado.tono}>{estado.label}</Badge>}
      />

      <div className={styles.stack}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Datos del envío</h2>
          <div className={styles.dataGrid}>
            {datos.map((dato) => (
              <div key={dato.label} className={styles.dataItem}>
                <p className={styles.dataLabel}>{dato.label}</p>
                <p className={styles.dataValue}>{dato.valor}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Seguimiento</h2>
          <ol className={styles.timeline}>
            {envio.eventos.map((evento) => (
              <li key={`${evento.fecha}-${evento.detalle}`} className={styles.event}>
                <span className={styles.eventFecha}>{evento.fecha}</span>
                <span className={styles.eventDetalle}>{evento.detalle}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>¿Tenés un problema con este envío?</h2>
          <p className={styles.panelNote}>
            Te vamos a mostrar sólo los motivos que aplican a este envío y vamos a
            completar por vos todo lo que ya sabemos.
          </p>
          <Button onClick={() => void navigate(`/v2?envio=${envio.id}`)}>
            Iniciar un reclamo
          </Button>
        </section>
      </div>
    </PageContainer>
  )
}

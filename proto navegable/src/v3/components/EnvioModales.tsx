import { Fragment } from 'react'
import { ZoomIn } from 'lucide-react'
import { Button, Modal } from '@/shared/ui'
import { decimal } from '../core/envios'
import type { Envio } from '../core/envios'
import styles from './EnvioModales.module.css'

/*
 * Modales de la opción "Detalle" y "Seguimientos" del menú de cada envío.
 * Pedido del usuario el 2026-09-30: por ahora se mantienen IGUAL que en
 * producción (capturas de `/reclamosform`), aunque no sigan el estilo de V3.
 */

type Celda = readonly [string, string]

function Grilla({ filas }: { readonly filas: readonly (readonly Celda[])[] }) {
  return (
    <>
      {filas.map((fila, indice) => (
        <Fragment key={indice}>
          {fila.map(([label], columna) => (
            <div key={`l${String(columna)}`} className={styles.label}>
              {label}
            </div>
          ))}
          {fila.map(([, valor], columna) => (
            <div key={`v${String(columna)}`} className={styles.valor}>
              {valor}
            </div>
          ))}
        </Fragment>
      ))}
    </>
  )
}

export interface EnvioModalProps {
  readonly envio: Envio | null
  readonly onClose: () => void
}

export function DetalleEnvioModal({ envio, onClose }: EnvioModalProps) {
  return (
    <Modal
      isOpen={envio !== null}
      onClose={onClose}
      size="wide"
      labelledById="detalle-envio-titulo"
      footer={<Button onClick={onClose}>Cerrar detalle</Button>}
    >
      {envio !== null && (
        <div className={styles.detalle}>
          <h2 id="detalle-envio-titulo" className={styles.titulo}>
            <ZoomIn size={30} strokeWidth={2.25} aria-hidden="true" />
            Detalles del envío
          </h2>
          <p className={styles.tn}>TN:{envio.tn}</p>

          <div className={styles.tabla}>
            <div className={styles.banda}>Origen {envio.origenTipo.toLowerCase()}</div>
            <Grilla filas={[[['Sucursal', envio.origenTipo], ['Mail', envio.origenMail], ['', '-'], ['', '']]]} />

            <div className={styles.banda}>Destino</div>
            <Grilla
              filas={[
                [
                  ['Nombre / Razón social', envio.destinatario],
                  ['Provincia', envio.provinciaDestino],
                  ['Sucursal', envio.destinoLocalidad],
                  ['Calle', envio.destinoCalle],
                ],
                [
                  ['Altura', envio.destinoAltura],
                  ['Piso', ''],
                  ['Dpto', ''],
                  ['Tipo de Entrega', envio.tipoEntrega],
                ],
                [
                  ['Código postal', envio.destinoCodigoPostal],
                  ['Código Área', ''],
                  ['Teléfono', envio.telefono],
                  ['Celular', envio.celular],
                ],
              ]}
            />
            <div className={`${styles.label} ${styles.ancho}`}>Observaciones</div>
            <div className={`${styles.valor} ${styles.ancho}`} />

            <div className={styles.banda}>Datos del paquete</div>
            <Grilla
              filas={[
                [
                  ['Tipo de producto', envio.tipoProducto],
                  ['Peso (kg)', String(envio.pesoKg)],
                  ['Largo (cm)', decimal(envio.largoCm)],
                  ['Ancho (cm)', decimal(envio.anchoCm)],
                ],
                [
                  ['Altura (cm)', decimal(envio.altoCm)],
                  ['Valor del contenido', String(envio.valorContenido)],
                  ['Estado', ''],
                  ['Precio', decimal(envio.precio)],
                ],
              ]}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}

export function SeguimientoEnvioModal({ envio, onClose }: EnvioModalProps) {
  return (
    <Modal
      isOpen={envio !== null}
      onClose={onClose}
      size="wide"
      labelledById="seguimiento-envio-titulo"
      footer={<Button onClick={onClose}>Aceptar</Button>}
    >
      {envio !== null && (
        <div className={styles.seguimiento}>
          <h2 id="seguimiento-envio-titulo" className={styles.tituloMov}>
            Movimientos del envío <span className={styles.tnMarcado}>{envio.tn}</span>
          </h2>
          <table className={styles.movimientos}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Planta</th>
                <th>Historia</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {envio.movimientos.map((movimiento, indice) => (
                <tr key={indice}>
                  <td>{movimiento.fecha}</td>
                  <td>{movimiento.planta}</td>
                  <td>{movimiento.historia}</td>
                  <td>{movimiento.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}

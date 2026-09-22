import { useState } from 'react'
import { Alert, Button, RadioGroup, Select } from '@/shared/ui'
import { Input, Textarea } from '@/shared/ui/Input'
import { camposFaltantes, findFormulario, separarCampos } from '../core/formularios'
import type { CampoFormulario, FormularioId } from '../core/formularios'
import { crearReclamo } from '../core/reclamosStore'
import type { ReclamoV2 } from '../core/reclamosStore'
import styles from '../pages/v2.module.css'

export interface ReclamoFormularioProps {
  readonly formularioId: FormularioId
  /** Lo que el asistente ya averiguó: acorta el formulario. */
  readonly contexto: Readonly<Record<string, string>>
  /** Cómo llamar al reclamo en el seguimiento (la última respuesta elegida). */
  readonly motivoLabel: string
  readonly onEnviado: (reclamo: ReclamoV2) => void
}

/**
 * Último paso del asistente: el FORMULARIO DE REFERENCIA.
 *
 * Los formularios reales ya existen en producción, viven en otras URLs y
 * cambian según el tipo de consulta. Este no los reemplaza ni los propone:
 * muestra qué información llegaría ya resuelta si el asistente entregara el
 * caso, por eso se rotula explícitamente como referencia.
 *
 * Se lee partido en dos a propósito: "Datos que ya tenemos" y "Lo que
 * necesitamos de vos". Cuál campo cae de qué lado no lo decide este
 * componente sino el contexto acumulado — ver `core/formularios.ts`.
 */
export function ReclamoFormulario({
  formularioId,
  contexto,
  motivoLabel,
  onEnviado,
}: ReclamoFormularioProps) {
  const [valores, setValores] = useState<Record<string, string>>({})
  const [faltantes, setFaltantes] = useState<readonly string[]>([])

  const formulario = findFormulario(formularioId)
  if (formulario === null) {
    return (
      <Alert tone="danger" title="Formulario no encontrado">
        No existe un formulario con el id "{formularioId}".
      </Alert>
    )
  }

  const { precargados, pedidos } = separarCampos(formulario, contexto)

  const setValor = (id: string, valor: string) => {
    setValores((previos) => ({ ...previos, [id]: valor }))
  }

  const enviar = () => {
    const pendientes = camposFaltantes(pedidos, valores)
    setFaltantes(pendientes)
    if (pendientes.length > 0) return

    const reclamo = crearReclamo({
      motivoLabel,
      envioNumero: contexto['numero'] ?? valores['numero'],
      valores: { ...contexto, ...valores },
    })
    onEnviado(reclamo)
  }

  const errorDe = (campo: CampoFormulario) =>
    faltantes.includes(campo.id) ? 'Completá este dato para continuar.' : null

  return (
    <div className={styles.stack}>
      <div>
        <h2 className={styles.formularioTitulo}>Formulario de referencia</h2>
        <p className={styles.formularioNota}>
          Los formularios reales tienen otra URL y pueden variar según la consulta.
          Este es un ejemplo para mostrar con qué datos llegaría el caso.
        </p>
      </div>

      {precargados.length > 0 && (
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Datos que ya tenemos</h2>
          <p className={styles.panelNote}>
            Los sacamos de lo que nos fuiste contando. Si algo no es correcto, avisanos
            más abajo.
          </p>
          <div className={styles.dataGrid}>
            {precargados.map((dato) => (
              <div key={dato.label} className={styles.dataItem}>
                <p className={styles.dataLabel}>{dato.label}</p>
                <p className={styles.dataValue}>{dato.valor}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Lo que necesitamos de vos</h2>

        {faltantes.length > 0 && (
          <Alert tone="danger" title="Faltan datos obligatorios">
            Revisá los campos marcados para poder enviar el reclamo.
          </Alert>
        )}

        <div className={styles.form}>
          {pedidos.map((campo) => {
            const valor = valores[campo.id] ?? ''

            if (campo.tipo === 'textarea') {
              return (
                <Textarea
                  key={campo.id}
                  id={campo.id}
                  label={campo.label}
                  hint={campo.hint}
                  error={errorDe(campo)}
                  value={valor}
                  onChange={(event) => setValor(campo.id, event.target.value)}
                />
              )
            }

            if (campo.tipo === 'select') {
              return (
                <Select
                  key={campo.id}
                  id={campo.id}
                  label={campo.label}
                  hint={campo.hint}
                  error={errorDe(campo)}
                  options={campo.opciones ?? []}
                  value={valor === '' ? '-1' : valor}
                  onChange={(event) =>
                    setValor(campo.id, event.target.value === '-1' ? '' : event.target.value)
                  }
                />
              )
            }

            if (campo.tipo === 'radio') {
              return (
                <RadioGroup
                  key={campo.id}
                  name={campo.id}
                  legend={campo.label}
                  options={campo.opciones ?? []}
                  value={valor === '' ? null : valor}
                  onChange={(nuevo) => setValor(campo.id, nuevo)}
                  error={errorDe(campo)}
                />
              )
            }

            return (
              <Input
                key={campo.id}
                id={campo.id}
                label={campo.label}
                hint={campo.hint}
                error={errorDe(campo)}
                value={valor}
                onChange={(event) => setValor(campo.id, event.target.value)}
              />
            )
          })}

          <div className={styles.formActions}>
            <Button onClick={enviar}>Enviar reclamo</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

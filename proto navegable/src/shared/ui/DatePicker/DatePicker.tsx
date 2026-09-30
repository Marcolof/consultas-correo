import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { Field, fieldControlClasses } from '@/shared/ui/Field'
import styles from './DatePicker.module.css'

export interface DatePickerProps {
  readonly id: string
  readonly label: string
  /** `yyyy-mm-dd` o vacío. */
  readonly value: string
  readonly onChange: (value: string) => void
  /** Límites opcionales, `yyyy-mm-dd`. */
  readonly min?: string
  readonly max?: string
  readonly placeholder?: string
  readonly className?: string
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DIAS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

function pad(valor: number): string {
  return String(valor).padStart(2, '0')
}

function aIso(anio: number, mes: number, dia: number): string {
  return `${String(anio)}-${pad(mes + 1)}-${pad(dia)}`
}

function mostrar(iso: string): string {
  if (iso === '') return ''
  const [anio, mes, dia] = iso.split('-')
  return `${dia ?? ''}/${mes ?? ''}/${anio ?? ''}`
}

/** 42 días (6 semanas) que arrancan el domingo anterior al 1 del mes. */
function diasDelMes(anio: number, mes: number): readonly { iso: string; dia: number; delMes: boolean }[] {
  const primero = new Date(anio, mes, 1)
  const inicio = new Date(anio, mes, 1 - primero.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i)
    return {
      iso: aIso(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
      dia: fecha.getDate(),
      delMes: fecha.getMonth() === mes,
    }
  })
}

/**
 * Selector de fecha con el calendario del estilo global de producción
 * (MiCorreo `/reclamosform`, relevado el 2026-09-30): « Mes Año », semana
 * de domingo a sábado y días de los meses vecinos en gris.
 *
 * El calendario se abre en un portal con `position: fixed`, para que ningún
 * contenedor con `overflow: hidden` (p. ej. un panel que se colapsa con
 * animación) lo recorte.
 */
export function DatePicker({
  id,
  label,
  value,
  onChange,
  min,
  max,
  placeholder = 'dd/mm/aaaa',
  className,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [posicion, setPosicion] = useState<{ top: number; left: number } | null>(null)
  const base = value === '' ? new Date() : new Date(`${value}T00:00:00`)
  const [vista, setVista] = useState({ anio: base.getFullYear(), mes: base.getMonth() })

  const abrir = () => {
    const referencia = value === '' ? new Date() : new Date(`${value}T00:00:00`)
    setVista({ anio: referencia.getFullYear(), mes: referencia.getMonth() })
    setAbierto(true)
  }

  const ubicar = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect()
    if (rect === undefined) return
    setPosicion((previa) =>
      previa !== null && previa.top === rect.bottom + 4 && previa.left === rect.left
        ? previa
        : { top: rect.bottom + 4, left: rect.left },
    )
  }, [])

  useLayoutEffect(() => {
    if (abierto) ubicar()
  }, [abierto, ubicar])

  // Sigue al campo en cada frame mientras está abierto: si el campo se mueve
  // sin scroll ni resize (p. ej. un panel que termina de desplegarse con
  // animación), el calendario no queda despegado.
  useEffect(() => {
    if (!abierto) return
    let frame = requestAnimationFrame(function seguir() {
      ubicar()
      frame = requestAnimationFrame(seguir)
    })
    return () => cancelAnimationFrame(frame)
  }, [abierto, ubicar])

  useEffect(() => {
    if (!abierto) return
    const alClic = (event: MouseEvent) => {
      const destino = event.target as Node
      if (popoverRef.current?.contains(destino) === true || inputRef.current?.contains(destino) === true) return
      setAbierto(false)
    }
    const alTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAbierto(false)
        inputRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', alClic)
    document.addEventListener('keydown', alTecla)
    window.addEventListener('resize', ubicar)
    window.addEventListener('scroll', ubicar, true)
    return () => {
      document.removeEventListener('mousedown', alClic)
      document.removeEventListener('keydown', alTecla)
      window.removeEventListener('resize', ubicar)
      window.removeEventListener('scroll', ubicar, true)
    }
  }, [abierto, ubicar])

  const moverMes = (delta: number) => {
    setVista(({ anio, mes }) => {
      const fecha = new Date(anio, mes + delta, 1)
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() }
    })
  }

  const elegir = (iso: string) => {
    onChange(iso)
    setAbierto(false)
    inputRef.current?.focus()
  }

  const fueraDeRango = (iso: string) =>
    (min !== undefined && min !== '' && iso < min) || (max !== undefined && max !== '' && iso > max)

  return (
    <Field id={id} label={label} className={className} floatLabel labelActive={abierto}>
      <input
        ref={inputRef}
        id={id}
        readOnly
        value={mostrar(value)}
        placeholder={placeholder}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        className={cn(fieldControlClasses.control, styles.input)}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
            event.preventDefault()
            abrir()
          }
          if ((event.key === 'Backspace' || event.key === 'Delete') && value !== '') onChange('')
        }}
      />
      {abierto &&
        posicion !== null &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`Elegir ${label.toLowerCase()}`}
            className={styles.popover}
            style={{ top: posicion.top, left: posicion.left }}
          >
            <div className={styles.cabecera}>
              <button type="button" className={styles.nav} onClick={() => moverMes(-1)} aria-label="Mes anterior">
                «
              </button>
              <span className={styles.mes}>
                {MESES[vista.mes]} {vista.anio}
              </span>
              <button type="button" className={styles.nav} onClick={() => moverMes(1)} aria-label="Mes siguiente">
                »
              </button>
            </div>
            <div className={styles.grilla} role="grid">
              {DIAS.map((dia) => (
                <span key={dia} className={styles.diaSemana} role="columnheader">
                  {dia}
                </span>
              ))}
              {diasDelMes(vista.anio, vista.mes).map((celda) => (
                <button
                  key={celda.iso}
                  type="button"
                  role="gridcell"
                  disabled={fueraDeRango(celda.iso)}
                  aria-selected={celda.iso === value}
                  className={cn(
                    styles.dia,
                    !celda.delMes && styles.diaAjeno,
                    celda.iso === value && styles.diaElegido,
                  )}
                  onClick={() => elegir(celda.iso)}
                >
                  {celda.dia}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </Field>
  )
}

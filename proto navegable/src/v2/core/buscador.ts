/**
 * Buscador de V2 — el atajo del árbol.
 *
 * No abre una estructura paralela: busca sobre las hojas del mismo árbol
 * (`indiceDeHojas`) y devuelve el camino completo hasta cada una, así elegir
 * un resultado deja al asistente en el mismo estado que si lo hubieras
 * recorrido pregunta por pregunta.
 *
 * El criterio de match es el mismo que ya usaba V1: sin acentos, se ignoran
 * las palabras de 1-2 letras, alcanza con que UNA palabra significativa
 * coincida, y los resultados se ordenan por cuántas coinciden.
 */
import { indiceDeHojas } from './arbol'
import type { Contexto, EntradaBuscador } from './arbol'

const ACENTOS: Readonly<Record<string, string>> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ñ: 'n',
}

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .split('')
    .map((letra) => ACENTOS[letra] ?? letra)
    .join('')
}

export function buscar(consulta: string, contexto: Contexto = {}): readonly EntradaBuscador[] {
  const todas = normalizar(consulta.trim())
    .split(/\s+/)
    .filter((palabra) => palabra !== '')
  if (todas.length === 0) return []

  const significativas = todas.filter((palabra) => palabra.length >= 3)
  const palabras = significativas.length > 0 ? significativas : todas

  return indiceDeHojas(contexto)
    .map((entrada) => {
      const campos = entrada.indice.map(normalizar)
      const coincidencias = palabras.filter((palabra) =>
        campos.some((campo) => campo.includes(palabra)),
      ).length
      return { entrada, coincidencias }
    })
    .filter(({ coincidencias }) => coincidencias > 0)
    .sort((a, b) => b.coincidencias - a.coincidencias)
    .map(({ entrada }) => entrada)
}

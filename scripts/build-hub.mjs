/**
 * Arma el sitio único que se deploya: el Hub estático con el prototipo ya
 * compilado adentro, en `hub/prototipo/`.
 *
 * Se ejecuta DESPUÉS de `vite build` (ver el script `build` del
 * package.json de la raíz) — acá sólo se copia el resultado.
 *
 * `hub/prototipo/` es salida de build, no fuente: está en .gitignore y se
 * borra y regenera en cada corrida para que no queden assets viejos de un
 * build anterior (los nombres de archivo llevan hash, así que sin el
 * borrado se irían acumulando).
 */
import { cp, rm, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(repoRoot, 'proto navegable', 'dist')
const target = join(repoRoot, 'hub', 'prototipo')

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

if (!(await exists(source))) {
  console.error(
    `[build-hub] No existe "${source}".\n` +
      '            Corré primero el build del prototipo (npm run build en la raíz lo hace por vos).',
  )
  process.exit(1)
}

await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })

console.log(`[build-hub] Prototipo copiado a hub/prototipo/ — listo para deployar hub/ como sitio único.`)

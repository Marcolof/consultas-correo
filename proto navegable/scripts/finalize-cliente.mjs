// Deja la carpeta de `vite build -c vite.client.config.ts` lista para abrir
// con doble clic: renombra el HTML, y pasa el script de módulo a clásico.
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const out = process.env.CLIENT_OUT_DIR ?? 'dist-cliente'
const nombre = 'Abrir propuesta V3.html'
let html = readFileSync(join(out, 'client.html'), 'utf8')
html = html
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>\s*/g, '')
  .replace(/<link rel="stylesheet" crossorigin /g, '<link rel="stylesheet" ')
  .replace('</body>', '    <script defer src="./assets/app.js"></script>\n  </body>')
writeFileSync(join(out, nombre), html)
rmSync(join(out, 'client.html'))
if (existsSync(join(out, 'vite.svg'))) rmSync(join(out, 'vite.svg'))
console.log('Listo:', join(out, nombre))

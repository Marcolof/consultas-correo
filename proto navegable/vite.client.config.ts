import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Build del paquete para cliente: sólo V3, para abrir con doble clic desde
 * una carpeta (`file://`), sin servidor.
 *
 *  - `base: './'`: los assets se piden relativos al HTML.
 *  - `format: 'iife'`: los módulos ES no cargan por `file://` (CORS); un
 *    script clásico sí. `scripts/finalize-cliente.mjs` termina de quitar el
 *    `type="module"` del HTML.
 *
 * Salida: carpeta indicada en la variable CLIENT_OUT_DIR.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    outDir: process.env['CLIENT_OUT_DIR'] ?? 'dist-cliente',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./client.html', import.meta.url)),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})

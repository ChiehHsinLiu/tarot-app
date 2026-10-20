import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { privateReadings } from './vite/private-readings.ts'

// https://vite.dev/config/
export default defineConfig({
  // Served from the GitHub Pages project path; update if the repo is renamed.
  base: '/tarot-app/',
  // privateReadings only runs under `npm run dev` (apply: 'serve').
  plugins: [react(), privateReadings()],
})

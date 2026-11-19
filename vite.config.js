import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //agregando tailwindcss

export default defineConfig({
  plugins: [react(), tailwindcss()], //agregando tailwindcss
})
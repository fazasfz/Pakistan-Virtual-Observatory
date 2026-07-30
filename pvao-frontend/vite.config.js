//This is the control panel for Vite, your build tool. It tells Vite how to compile your React code, what plugins to use, and how to start your local development server.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

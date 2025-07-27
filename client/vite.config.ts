import { defineConfig } from 'vitest/config'
import { loadEnv } from "vite"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode || "development", "../", "");

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: "node",
      env: {
        VITE_API_URL: env.VITE_API_URL
      }
    }
  }
})

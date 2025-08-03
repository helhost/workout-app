import { defineConfig } from 'vitest/config';
import { loadEnv } from "vite";
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || "development", "../", "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    test: {
      globals: true,
      environment: "node",
      setupFiles: ["tests/setup.ts"],
      env: {
        VITE_API_URL: env.VITE_API_URL
      },
      coverage: {
        reporter: ['text', 'html'],
        exclude: [
          'tests/',
          'src/types',
          'vite.config.ts',
          'eslint.config.js',
          'vite-env.d.ts'
        ]
      }
    }
  };
});

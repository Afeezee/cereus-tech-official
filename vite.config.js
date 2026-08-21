import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import apiServer from './vite-plugins/api-server.js';

export default defineConfig(({ mode }) => {
  // Load .env into process.env so /api handlers reading process.env.DATABASE_URL
  // and process.env.CLERK_SECRET_KEY see them in dev.
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  return {
    plugins: [react(), apiServer()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});

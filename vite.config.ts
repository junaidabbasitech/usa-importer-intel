
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Define __dirname for ESM environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Allow setting a non-root base path for deploys like GitHub Pages project sites
    // (e.g. VITE_BASE=/usa-importer-intel/). Defaults to "/" so dev & same-origin
    // deploys keep working unchanged.
    const base = env.VITE_BASE || '/';
    return {
      base,
      server: {
  port: 5173,
  host: '0.0.0.0',
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      changeOrigin: true
    }
  }
},
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

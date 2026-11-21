// Vite build of the admin panel (replaced Create React App on 2026-11-21).
// - The components are .js files with JSX in them (CRA style), so .js is read as JSX.
// - REACT_APP_BASE_API_URL keeps its CRA name (Dockerfile ARG, fly.staging.toml, the tests):
//   it is read at build time and written into the code, like CRA did.
// - The output goes to build/ (the Dockerfile copies it to nginx).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  define: {
    'process.env.REACT_APP_BASE_API_URL': JSON.stringify(process.env.REACT_APP_BASE_API_URL || ''),
  },
  server: { port: 3000 },
  build: { outDir: 'build', chunkSizeWarningLimit: 2000 },
});

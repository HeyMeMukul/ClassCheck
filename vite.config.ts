// @ts-ignore: Node.js built-ins are available in Vite config, but types may be missing. For full type support, run: npm i --save-dev @types/node
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5173, 
    hmr: { overlay: false } 
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  define: {
    // Ensure consistent PDF.js worker loading
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

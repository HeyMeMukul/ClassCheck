import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  }
});

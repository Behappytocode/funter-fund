import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Specifically define process.env to prevent "ReferenceError: process is not defined"
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || "")
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Ensure the build target is compatible with modern browsers
    target: 'esnext'
  }
});
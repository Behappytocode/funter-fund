import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This safely shims process.env for the browser
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || ""),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext'
  }
});
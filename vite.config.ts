import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Shimming process.env for the browser to prevent "process is not defined" errors
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || ""),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
    },
    // Adding a global 'process' object for libraries that expect it
    'process': {
      env: {
        API_KEY: JSON.stringify(process.env.API_KEY || ""),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }
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
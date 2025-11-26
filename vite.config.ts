import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante caminhos relativos para assets (css/js) no deploy
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
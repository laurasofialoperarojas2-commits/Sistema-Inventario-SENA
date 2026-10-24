import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite
export default defineConfig({
  plugins: [react()],
  // La librería de gráficas (recharts) es grande; subimos el límite del aviso
  build: { chunkSizeWarningLimit: 1000 },
});
